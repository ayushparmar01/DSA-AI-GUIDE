const Problem = require('../models/Problem');
const Topic = require('../models/Topic');
const Pattern = require('../models/Pattern');
const Attempt = require('../models/Attempt');
const Submission = require('../models/Submission');

const getProblems = async (req, res, next) => {
  try {
    const { topic, pattern, difficulty, source, search } = req.query;
    const filter = {};

    if (topic) filter.topicSlug = topic;
    if (pattern) filter.patternSlug = pattern;
    if (difficulty) filter.difficulty = difficulty;
    if (source) filter.source = source;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const problems = await Problem.find(filter)
      .select('-hiddenTestCases -solutionCode')
      .sort({ order: 1 });

    // Fetch user attempt/submission status if authenticated
    let userSolvedMap = {};
    if (req.user) {
      const attempts = await Attempt.find({ userId: req.user._id });
      attempts.forEach(s => {
        if (s.status === 'Accepted') {
          userSolvedMap[s.problemSlug] = 'Solved';
        } else if (!userSolvedMap[s.problemSlug]) {
          userSolvedMap[s.problemSlug] = 'Attempted';
        }
      });
    }

    const enhancedProblems = problems.map(p => ({
      ...(p.toObject ? p.toObject() : p),
      userStatus: userSolvedMap[p.slug] || 'Not Started'
    }));

    res.status(200).json({
      success: true,
      data: enhancedProblems,
      count: enhancedProblems.length
    });
  } catch (error) {
    next(error);
  }
};

const getProblemBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const problem = await Problem.findOne({ slug }).select('-hiddenTestCases');

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem with slug '${slug}' not found`
      });
    }

    let userStatus = 'Not Started';
    let userSubmissions = [];

    if (req.user) {
      userSubmissions = await Attempt.find({
        userId: req.user._id,
        problemSlug: slug
      }).sort({ createdAt: -1 });

      if (userSubmissions.some(s => s.status === 'Accepted')) {
        userStatus = 'Solved';
      } else if (userSubmissions.length > 0) {
        userStatus = 'Attempted';
      }
    }

    res.status(200).json({
      success: true,
      data: {
        problem,
        userStatus,
        submissions: userSubmissions
      }
    });
  } catch (error) {
    next(error);
  }
};

const getTopics = async (req, res, next) => {
  try {
    const topics = await Topic.find({}).sort({ order: 1 });
    res.status(200).json({ success: true, data: topics });
  } catch (error) {
    next(error);
  }
};

const getPatterns = async (req, res, next) => {
  try {
    const patterns = await Pattern.find({});
    res.status(200).json({ success: true, data: patterns });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProblems, getProblemBySlug, getTopics, getPatterns };
