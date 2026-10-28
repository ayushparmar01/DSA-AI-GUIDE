const mongoose = require('mongoose');

const topicMasterySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    topicSlug: {
      type: String,
      required: true,
      index: true
    },
    masteryScore: {
      type: Number,
      default: 0, // 0 - 100
      min: 0,
      max: 100
    },
    solvedCount: {
      type: Number,
      default: 0
    },
    attemptCount: {
      type: Number,
      default: 0
    },
    accuracyPercentage: {
      type: Number,
      default: 0
    },
    easyCount: {
      type: Number,
      default: 0
    },
    mediumCount: {
      type: Number,
      default: 0
    },
    hardCount: {
      type: Number,
      default: 0
    },
    avgSolveTimeSeconds: {
      type: Number,
      default: 0
    },
    assessmentInitialScore: {
      type: Number,
      default: 0
    },
    spacedRecallScore: {
      type: Number,
      default: 70
    },
    patternComprehensionScore: {
      type: Number,
      default: 50
    },
    lastSolvedAt: {
      type: Date,
      default: null
    },
    lastRevisedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

topicMasterySchema.index({ userId: 1, topicSlug: 1 }, { unique: true });

const TopicMastery = mongoose.model('TopicMastery', topicMasterySchema);

module.exports = TopicMastery;
module.exports.MasteryScore = require('./MasteryScore');
