const express = require('express');
const router = express.Router();
const { getQuestions, submitAssessment, getAssessmentResult } = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/questions', getQuestions);
router.post('/submit', protect, submitAssessment);
router.get('/result', protect, getAssessmentResult);

module.exports = router;
