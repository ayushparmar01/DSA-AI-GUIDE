const express = require('express');
const router = express.Router();
const { startInterview, respondInterview, getInterviewById } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/', protect, aiLimiter, startInterview);
router.post('/start', protect, aiLimiter, startInterview);
router.post('/:id/respond', protect, aiLimiter, respondInterview);
router.get('/:id', protect, getInterviewById);

module.exports = router;
