const Attempt = require('../models/Attempt');
const Problem = require('../models/Problem');
const codeExecutionService = require('../services/codeExecutionService');
const masteryService = require('../services/masteryService');
const spacedRepetitionService = require('../services/spacedRepetitionService');
const aiServiceClient = require('../services/aiServiceClient');
const LearningEvent = require('../models/LearningEvent');

/**
 * Submit solution for full evaluation against test cases.
 * Updates deterministic mastery score and SM-2 revision schedule.
 */
const submitSolution = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { code, language, timeTakenSeconds = 300, hintsUsedCount = 0 } = req.body;

    const problem = await Problem.findOne({ slug });
    if (!problem) {
      return res.status(404).json({ success: false, message: `Problem '${slug}' not found` });
    }

    // 1. Combine test cases
    const allTestCases = [
      ...(problem.sampleTestCases || []),
      ...(problem.hiddenTestCases || [])
    ];

    // 2. Execute via Judge0 Sandbox (or report honest sandbox offline status)
    const execResult = await codeExecutionService.executeCode({
      language,
      code,
      testCases: allTestCases
    });

    // 3. Static complexity analysis if language is python
    let complexityAnalysis = {
      complexity: 'O(N)',
      abstained: false,
      confidence: 0.8,
      explanation: 'Default baseline complexity'
    };

    let isEfficient = false;
    if (language === 'python') {
      try {
        const compRes = await aiServiceClient.estimateComplexity({ code, version: 'v1' });
        complexityAnalysis = {
          complexity: compRes.complexity,
          abstained: compRes.abstained,
          confidence: compRes.confidence,
          explanation: compRes.explanation
        };
        // Check if detected complexity meets or beats optimal
        if (compRes.complexity === problem.optimalTimeComplexity || compRes.complexity === 'O(1)') {
          isEfficient = true;
        } else if (problem.optimalTimeComplexity === 'O(N)' && compRes.complexity === 'O(log N)') {
          isEfficient = true;
        }
      } catch (err) {
        console.warn('Complexity analysis service error:', err.message);
      }
    } else {
      // For non-python, efficiency is accepted when status is Accepted
      isEfficient = execResult.status === 'Accepted';
    }

    // 4. Create and persist Attempt document
    const attempt = new Attempt({
      userId: req.user._id,
      problemSlug: slug,
      topicSlug: problem.topicSlug,
      language,
      code,
      status: execResult.status,
      result: execResult.status === 'Accepted' ? (isEfficient ? 1.0 : 0.5) : -1.0,
      runtimeMs: execResult.runtimeMs,
      memoryKb: execResult.memoryKb,
      testCasesPassed: execResult.testCasesPassed,
      totalTestCases: execResult.totalTestCases,
      timeTakenSeconds,
      hintsUsedCount,
      isEfficient,
      testCaseResults: execResult.results || [],
      complexityAnalysis
    });

    await attempt.save();

    // 5. Update deterministic topic mastery via M' = clamp(M + 8R - 2H + 3E - T, 0, 100)
    let masteryUpdate = null;
    try {
      masteryUpdate = await masteryService.recordAttemptMastery({
        userId: req.user._id,
        topicSlug: problem.topicSlug,
        problemSlug: slug,
        attemptId: attempt._id,
        status: execResult.status,
        isEfficient,
        timeTakenSeconds,
        expectedTimeSeconds: problem.expectedTimeSeconds || 600,
        hintsUsedCount
      });

      attempt.masteryDelta = masteryUpdate.delta;
      attempt.timePenalty = masteryUpdate.timePenalty;
      await attempt.save();
    } catch (mErr) {
      console.warn('Mastery calculation error:', mErr.message);
    }

    // 6. If Accepted, schedule SM-2 spaced repetition
    if (execResult.status === 'Accepted') {
      try {
        await spacedRepetitionService.scheduleInitialRevision(req.user._id, slug, problem.topicSlug);
      } catch (smErr) {
        console.warn('SM-2 schedule error:', smErr.message);
      }
    }

    // 7. Telemetry log
    try {
      await LearningEvent.create({
        userId: req.user._id,
        eventType: execResult.status === 'Accepted' ? 'code_accepted' : 'code_failed',
        metadata: {
          problemSlug: slug,
          topicSlug: problem.topicSlug,
          status: execResult.status,
          runtimeMs: execResult.runtimeMs,
          hintsUsedCount,
          timeTakenSeconds
        }
      });
    } catch (e) {
      // Telemetry non-blocking
    }

    res.status(201).json({
      success: true,
      data: {
        attempt,
        execution: execResult,
        mastery: masteryUpdate ? {
          newScore: masteryUpdate.newScore,
          delta: masteryUpdate.delta,
          timePenalty: masteryUpdate.timePenalty
        } : null
      },
      message: execResult.status === 'Accepted' ? 'Solution Accepted! 🎉' : 'Submission evaluated.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Run code against sample test cases (interactive practice test runner).
 */
const runCode = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { code, language } = req.body;

    const problem = await Problem.findOne({ slug });
    if (!problem) {
      return res.status(404).json({ success: false, message: `Problem '${slug}' not found` });
    }

    const execResult = await codeExecutionService.executeCode({
      language,
      code,
      testCases: problem.sampleTestCases || []
    });

    res.status(200).json({
      success: true,
      data: execResult
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get authenticated user's attempt history.
 */
const getUserSubmissions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const attempts = await Attempt.find({ userId: req.user._id })
      .select('-code -testCaseResults')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Attempt.countDocuments({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: attempts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get authenticated user's attempts for a specific problem.
 */
const getProblemSubmissions = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const attempts = await Attempt.find({
      userId: req.user._id,
      problemSlug: slug
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: attempts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single attempt details (with ownership enforcement).
 */
const getSubmissionById = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt record not found' });
    }

    // Security check: User cannot view another user's attempt
    if (attempt.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this attempt record'
      });
    }

    res.status(200).json({
      success: true,
      data: attempt
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitSolution,
  runCode,
  getUserSubmissions,
  getProblemSubmissions,
  getSubmissionById
};
