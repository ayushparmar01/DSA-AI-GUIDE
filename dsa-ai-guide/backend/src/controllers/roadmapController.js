const roadmapService = require('../services/roadmapService');
const masteryService = require('../services/masteryService');

const getRoadmap = async (req, res, next) => {
  try {
    const roadmap = await roadmapService.getUserRoadmap(req.user._id);
    res.status(200).json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    next(error);
  }
};

const regenerateRoadmap = async (req, res, next) => {
  try {
    const roadmap = await roadmapService.generatePersonalizedRoadmap(req.user._id);
    res.status(200).json({
      success: true,
      data: roadmap,
      message: 'Roadmap regenerated and adapted to latest mastery telemetry'
    });
  } catch (error) {
    next(error);
  }
};

const getUserMasteryScores = async (req, res, next) => {
  try {
    const masteries = await masteryService.getUserMasteries(req.user._id);
    res.status(200).json({
      success: true,
      data: masteries,
      count: masteries.length
    });
  } catch (error) {
    next(error);
  }
};

const getTopicMasteryScore = async (req, res, next) => {
  try {
    const { topicSlug } = req.params;
    const score = await masteryService.getTopicMastery(req.user._id, topicSlug);
    res.status(200).json({
      success: true,
      data: score
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoadmap,
  regenerateRoadmap,
  getUserMasteryScores,
  getTopicMasteryScore
};
