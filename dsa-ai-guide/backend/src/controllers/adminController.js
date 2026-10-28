const Problem = require('../models/Problem');
const Topic = require('../models/Topic');
const User = require('../models/User');
const Submission = require('../models/Submission');
const LearningEvent = require('../models/LearningEvent');

const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const totalEvents = await LearningEvent.countDocuments();

    const recentSubmissions = await Submission.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProblems,
        totalSubmissions,
        totalEvents,
        recentSubmissions
      }
    });
  } catch (error) {
    next(error);
  }
};

const createProblem = async (req, res, next) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json({
      success: true,
      data: problem,
      message: 'Problem created successfully'
    });
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }
    res.status(200).json({
      success: true,
      data: problem,
      message: 'Problem updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findOneAndDelete({ slug: req.params.slug });
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminStats, createProblem, updateProblem, deleteProblem, getUsers };
