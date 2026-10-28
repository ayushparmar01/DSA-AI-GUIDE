const express = require('express');
const router = express.Router();
const { getDashboardMetrics, getWeeklyReport } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardMetrics);
router.get('/weekly-report', protect, getWeeklyReport);

module.exports = router;
