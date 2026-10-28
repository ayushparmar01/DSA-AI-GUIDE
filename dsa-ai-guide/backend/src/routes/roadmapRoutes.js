const express = require('express');
const router = express.Router();
const {
  getRoadmap,
  regenerateRoadmap,
  getUserMasteryScores,
  getTopicMasteryScore
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRoadmap);
router.post('/regenerate', protect, regenerateRoadmap);
router.get('/mastery', protect, getUserMasteryScores);
router.get('/mastery/:topicSlug', protect, getTopicMasteryScore);

module.exports = router;
