const express = require('express');
const router = express.Router();
const { getRecommendations, getDailyPlan } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRecommendations);
router.get('/daily-plan', protect, getDailyPlan);

module.exports = router;
