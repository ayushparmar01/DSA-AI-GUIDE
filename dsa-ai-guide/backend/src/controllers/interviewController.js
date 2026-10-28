const MockInterview = require('../models/MockInterview');
const Problem = require('../models/Problem');
const promptManager = require('../ai/promptManager');
const gamificationService = require('../services/gamificationService');

const startInterview = async (req, res, next) => {
  try {
    const { topicSlug, problemSlug } = req.body || {};

    let problem = null;

    // 1. Try finding problem by explicit problemSlug if provided
    if (problemSlug) {
      problem = await Problem.findOne({ slug: problemSlug });
    }

    // 2. Try finding problem by topicSlug with Easy or Medium difficulty
    if (!problem && topicSlug) {
      problem = await Problem.findOne({
        topicSlug,
        difficulty: { $in: ['Easy', 'Medium'] }
      });
    }

    // 3. Try finding problem by topicSlug with any difficulty
    if (!problem && topicSlug) {
      problem = await Problem.findOne({ topicSlug });
    }

    // 4. Try finding any Easy or Medium problem in the database
    if (!problem) {
      problem = await Problem.findOne({ difficulty: { $in: ['Easy', 'Medium'] } });
    }

    // 5. Try finding any problem in the database
    if (!problem) {
      problem = await Problem.findOne({});
    }

    // 6. Graceful in-memory fallback problem if DB has 0 problems
    if (!problem) {
      problem = {
        title: 'Two Sum',
        slug: 'two-sum',
        topicSlug: topicSlug || 'arrays',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.']
      };
    }

    const interview = await MockInterview.create({
      userId: req.user._id,
      topicSlug: problem.topicSlug || 'arrays',
      problemSlug: problem.slug || 'two-sum',
      transcript: [
        {
          speaker: 'ai',
          message: `Hello! Welcome to your technical mock interview. Today's problem is "${problem.title}": ${problem.description}. To begin, please explain your initial thoughts, clarify any constraints, or describe your high-level approach.`
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: {
        interviewId: interview._id,
        problem: {
          title: problem.title,
          slug: problem.slug,
          description: problem.description,
          constraints: problem.constraints || []
        },
        transcript: interview.transcript
      }
    });
  } catch (error) {
    next(error);
  }
};

const respondInterview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, isFinishRequest = false } = req.body;

    const interview = await MockInterview.findOne({ _id: id, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    const problem = await Problem.findOne({ slug: interview.problemSlug });

    // Append user turn
    interview.transcript.push({
      speaker: 'user',
      message
    });

    if (isFinishRequest) {
      // Final Evaluation
      const evalResult = await promptManager.handleMockInterview({
        problemTitle: problem?.title || '',
        problemDescription: problem?.description || '',
        transcript: interview.transcript,
        isEvaluationPhase: true
      });

      interview.status = 'completed';
      interview.scores = evalResult.scores || {
        problemUnderstanding: 80,
        approachOptimality: 75,
        codingProficiency: 80,
        complexityExplanation: 85,
        communicationClarity: 80,
        overallInterviewScore: 80
      };
      interview.interviewerFeedback = {
        strengths: evalResult.strengths || [],
        improvements: evalResult.improvements || [],
        detailedReview: evalResult.detailedReview || 'Interview concluded.'
      };

      await interview.save();
      await gamificationService.awardXP(req.user._id, 100);

      return res.status(200).json({
        success: true,
        data: interview,
        message: 'Interview completed and scorecard generated!'
      });
    }

    // Next Interviewer turn
    const nextTurn = await promptManager.handleMockInterview({
      problemTitle: problem?.title || '',
      problemDescription: problem?.description || '',
      transcript: interview.transcript,
      latestUserMessage: message,
      isEvaluationPhase: false
    });

    interview.transcript.push({
      speaker: 'ai',
      message: nextTurn.aiResponseText || 'Could you explain the space and time complexity of that approach?'
    });

    await interview.save();

    res.status(200).json({
      success: true,
      data: {
        transcript: interview.transcript,
        suggestedNextStep: nextTurn.suggestedNextStep || 'discuss_complexity'
      }
    });
  } catch (error) {
    next(error);
  }
};

const getInterviewById = async (req, res, next) => {
  try {
    const interview = await MockInterview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }
    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

module.exports = { startInterview, respondInterview, getInterviewById };
