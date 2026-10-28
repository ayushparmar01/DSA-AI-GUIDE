const express = require('express');
const router = express.Router();
const { getDueRevisions, submitRevision } = require('../controllers/revisionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDueRevisions);
router.post('/submit', protect, submitRevision);

module.exports = router;
