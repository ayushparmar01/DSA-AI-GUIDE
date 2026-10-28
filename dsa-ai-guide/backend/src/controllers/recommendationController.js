const recommendationService = require('../services/recommendationService');

const getRecommendations = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '5', 10);
    const recommendations = await recommendationService.getRecommendations(req.user._id, limit);
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

const getDailyPlan = async (req, res, next) => {
  try {
    const plan = await recommendationService.getDailyPlan(req.user._id);
    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations, getDailyPlan };
