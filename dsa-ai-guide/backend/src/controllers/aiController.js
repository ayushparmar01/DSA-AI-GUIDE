const promptManager = require('../ai/promptManager');
const AIConversation = require('../models/AIConversation');
const Profile = require('../models/Profile');
const MasteryScore = require('../models/MasteryScore');
const LearningEvent = require('../models/LearningEvent');
const Problem = require('../models/Problem');
const HintSession = require('../models/HintSession');
const aiServiceClient = require('../services/aiServiceClient');

/**
 * Conversational Socratic AI Mentor
 */
const chatMentor = async (req, res, next) => {
  try {
    const { message, topicSlug = '', problemSlug = '', conversationId } = req.body;

    let conversation;
    if (conversationId) {
      conversation = await AIConversation.findOne({ _id: conversationId, userId: req.user._id });
    }

    if (!conversation) {
      conversation = await AIConversation.create({
        userId: req.user._id,
        topicSlug,
        problemSlug,
        title: message.substring(0, 30) + '...',
        messages: []
      });
    }

    const profile = await Profile.findOne({ userId: req.user._id });
    const masteries = await MasteryScore.find({ userId: req.user._id });

    // Append user message
    conversation.messages.push({
      sender: 'user',
      text: message,
      contextMetadata: { topicSlug, problemSlug }
    });

    // Call Socratic Mentor
    const aiResponse = await promptManager.chatWithMentor({
      userProfile: profile,
      userMastery: masteries,
      activeTopic: topicSlug,
      activeProblem: problemSlug,
      conversationHistory: conversation.messages,
      userMessage: message
    });

    conversation.messages.push({
      sender: 'assistant',
      text: typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse)
    });

    await conversation.save();

    await LearningEvent.create({
      userId: req.user._id,
      eventType: 'ai_chat_used',
      metadata: { topicSlug, problemSlug }
    });

    res.status(200).json({
      success: true,
      data: {
        conversationId: conversation._id,
        reply: conversation.messages[conversation.messages.length - 1]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Socratic Hint Request Endpoint with Syntax Leakage Guard
 * Validates candidate hints through the Python Leakage Guard before serving.
 */
const requestSocraticHint = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { level = 1, attemptId } = req.body;
    const requestedLevel = Math.min(5, Math.max(1, parseInt(level, 10)));

    const problem = await Problem.findOne({ slug });
    if (!problem) {
      return res.status(404).json({ success: false, message: `Problem '${slug}' not found` });
    }

    // 1. Retrieve or generate candidate hint matching cognitive tier
    let candidateHint = '';
    const curatedHint = problem.hints?.find(h => h.level === requestedLevel);
    if (curatedHint) {
      candidateHint = curatedHint.hintText;
    } else {
      // Default tier templates
      const templates = {
        1: `[Level 1 - Concept Clue] Think about how elements relate to each other. Can you reduce redundant checks?`,
        2: `[Level 2 - Pattern Hint] This problem relates to the '${problem.patternSlug || 'algorithmic'}' pattern.`,
        3: `[Level 3 - Approach Invariant] Consider maintaining two pointers or tracking unseen values in a lookup table.`,
        4: `[Level 4 - Pseudo-code Outline] Initialize a data structure. Iterate through each element and check if the complement exists.`,
        5: `[Level 5 - Detailed Analysis] Optimal time is ${problem.optimalTimeComplexity || 'O(N)'} with space ${problem.optimalSpaceComplexity || 'O(1)'}.`
      };
      candidateHint = templates[requestedLevel] || templates[1];
    }

    // 2. Reference solution for leakage checking
    const referenceCode = problem.referenceSolution ||
      problem.solutionCode?.python ||
      (problem.sampleTestCases?.[0] ? `# Reference for ${problem.title}\ndef solve(): pass` : '');

    // 3. Screen candidate hint with Python Leakage Guard
    let leakageResult = {
      is_leak: false,
      combined_similarity: 0.0,
      token_similarity: 0.0,
      ast_similarity: 0.0,
      raw_similarity: 0.0,
      token_count: 0,
      threshold: 0.80,
      is_short_input: true,
      used_fallback: false,
      explanation: 'Clean conceptual hint'
    };

    if (referenceCode && candidateHint) {
      try {
        leakageResult = await aiServiceClient.checkLeakage({
          candidateHint,
          referenceSolution: referenceCode,
          threshold: 0.80,
          minTokens: 12
        });
      } catch (err) {
        console.warn('Leakage Guard microservice error, fallback check:', err.message);
      }
    }

    // 4. If leak detected, replace with safe Socratic guidance
    let deliveredHint = candidateHint;
    const wasBlocked = Boolean(leakageResult.is_leak);

    if (wasBlocked) {
      deliveredHint = `[Socratic Guard Active] The direct code hint was blocked to protect independent learning. Guiding question: What invariant must hold true at every iteration step?`;
    }

    // 5. Persist interaction in HINT_SESSION collection
    const hintSession = await HintSession.create({
      userId: req.user._id,
      problemSlug: slug,
      attemptId: attemptId || null,
      level: requestedLevel,
      candidateHint,
      referenceSolutionSnippet: referenceCode.substring(0, 200),
      leakageCheck: {
        isLeak: wasBlocked,
        combinedSimilarity: leakageResult.combined_similarity,
        tokenSimilarity: leakageResult.token_similarity,
        astSimilarity: leakageResult.ast_similarity,
        rawSimilarity: leakageResult.raw_similarity,
        tokenCount: leakageResult.token_count,
        threshold: leakageResult.threshold,
        isShortInput: leakageResult.is_short_input,
        usedFallback: leakageResult.used_fallback,
        explanation: leakageResult.explanation
      },
      wasBlocked,
      deliveredHint
    });

    res.status(200).json({
      success: true,
      data: {
        sessionId: hintSession._id,
        level: requestedLevel,
        hint: deliveredHint,
        wasBlocked,
        leakageScore: leakageResult.combined_similarity,
        explanation: leakageResult.explanation
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Complexity Analysis Endpoint
 * Analyzes code AST through the Python Complexity Heuristic.
 */
const analyzeCodeComplexity = async (req, res, next) => {
  try {
    const { code, version = 'v1' } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Source code is required for complexity analysis.' });
    }

    const result = await aiServiceClient.estimateComplexity({
      code,
      version,
      abstainOnHiddenCosts: true
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const conversations = await AIConversation.find({ userId: req.user._id })
      .select('-messages')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
};

const getConversationById = async (req, res, next) => {
  try {
    const conversation = await AIConversation.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.status(200).json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatMentor,
  requestSocraticHint,
  analyzeCodeComplexity,
  getConversations,
  getConversationById
};
