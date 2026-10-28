const express = require('express');
const router = express.Router();
const { getProblems, getProblemBySlug, getTopics, getPatterns } = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

router.get('/topics', getTopics);
router.get('/patterns', getPatterns);
router.get('/', (req, res, next) => {
  // Optional auth
  if (req.headers.authorization) {
    return protect(req, res, () => getProblems(req, res, next));
  }
  getProblems(req, res, next);
});
router.get('/:slug', (req, res, next) => {
  // Optional auth
  if (req.headers.authorization) {
    return protect(req, res, () => getProblemBySlug(req, res, next));
  }
  getProblemBySlug(req, res, next);
});

module.exports = router;
