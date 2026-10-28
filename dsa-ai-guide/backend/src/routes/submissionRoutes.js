const express = require('express');
const router = express.Router();
const {
  submitSolution,
  runCode,
  getUserSubmissions,
  getProblemSubmissions,
  getSubmissionById
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validate');

// Attempt History (Protected)
router.get('/my', protect, getUserSubmissions);
router.get('/problem/:slug', protect, getProblemSubmissions);
router.get('/:id', protect, getSubmissionById);

// Execution & Submission (Protected)
router.post('/:slug/run', protect, validate(schemas.submission), runCode);
router.post('/:slug/submit', protect, validate(schemas.submission), submitSolution);

module.exports = router;
