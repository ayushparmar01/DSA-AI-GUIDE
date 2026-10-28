const express = require('express');
const router = express.Router();
const {
  chatMentor,
  requestSocraticHint,
  analyzeCodeComplexity,
  getConversations,
  getConversationById
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validate');

// Socratic AI Mentor Chat
router.post('/chat', protect, chatMentor);
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id', protect, getConversationById);

// Leakage-Guarded Hint System (M9)
router.post('/hint/:slug', protect, validate(schemas.hintRequest), requestSocraticHint);

// AST-based Complexity Estimation (M5)
router.post('/complexity', validate(schemas.complexityEstimate), analyzeCodeComplexity);

module.exports = router;
