const assessmentService = require('../services/assessmentService');
const AssessmentResult = require('../models/AssessmentResult');
const roadmapService = require('../services/roadmapService');

const getQuestions = async (req, res, next) => {
  try {
    const questions = await assessmentService.getDiagnosticQuestions();
    res.status(200).json({
      success: true,
      data: questions,
      count: questions.length
    });
  } catch (error) {
    next(error);
  }
};

const submitAssessment = async (req, res, next) => {
  try {
    const { responses } = req.body;
    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        message: 'Responses array is required'
      });
    }

    const result = await assessmentService.evaluateAssessment(req.user._id, responses);
    // Generate initial personalized roadmap immediately
    await roadmapService.generatePersonalizedRoadmap(req.user._id);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Assessment evaluated and AI profile synthesized successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAssessmentResult = async (req, res, next) => {
  try {
    const result = await AssessmentResult.findOne({ userId: req.user._id });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Assessment has not been completed yet'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuestions, submitAssessment, getAssessmentResult };
