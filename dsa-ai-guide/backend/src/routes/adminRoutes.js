const express = require('express');
const router = express.Router();
const { getAdminStats, createProblem, updateProblem, deleteProblem, getUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.post('/problems', createProblem);
router.put('/problems/:slug', updateProblem);
router.delete('/problems/:slug', deleteProblem);

module.exports = router;
