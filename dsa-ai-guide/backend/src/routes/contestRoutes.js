const express = require('express');
const router = express.Router();
const { getContests, getContestBySlug, submitContestProblem } = require('../controllers/contestController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getContests);
router.get('/:slug', getContestBySlug);
router.post('/:slug/submit', protect, submitContestProblem);

module.exports = router;
