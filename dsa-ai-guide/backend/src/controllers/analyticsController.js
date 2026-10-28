const analyticsService = require('../services/analyticsService');

const getDashboardMetrics = async (req, res, next) => {
  try {
    const metrics = await analyticsService.getUserDashboardMetrics(req.user._id);
    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
};

const getWeeklyReport = async (req, res, next) => {
  try {
    const report = await analyticsService.getWeeklyReport(req.user._id);
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardMetrics, getWeeklyReport };
