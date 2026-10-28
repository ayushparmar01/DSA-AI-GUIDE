const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const assessmentRoutes = require('./assessmentRoutes');
const roadmapRoutes = require('./roadmapRoutes');
const problemRoutes = require('./problemRoutes');
const submissionRoutes = require('./submissionRoutes');
const aiRoutes = require('./aiRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const revisionRoutes = require('./revisionRoutes');
const interviewRoutes = require('./interviewRoutes');
const contestRoutes = require('./contestRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/roadmap', roadmapRoutes);
router.use('/problems', problemRoutes);
router.use('/submissions', submissionRoutes);
router.use('/ai', aiRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/revision', revisionRoutes);
router.use('/interview', interviewRoutes);
router.use('/interviews', interviewRoutes);
router.use('/contest', contestRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ONLINE',
    message: 'DSA AI Guide API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
