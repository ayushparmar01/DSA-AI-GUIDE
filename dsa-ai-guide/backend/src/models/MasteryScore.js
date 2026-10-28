const mongoose = require('mongoose');

/**
 * MASTERY_SCORE Collection Schema
 * Stores auditable, deterministic mastery score M in [0, 100] per topic for each user.
 * Evaluated via M' = clamp(M + 8R - 2H + 3E - T, 0, 100).
 */
const masteryScoreSchema = new mongoose.Schema(
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
      required: true,
      default: 0.0,
      min: 0.0,
      max: 100.0
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
    lastCalculatedAt: {
      type: Date,
      default: Date.now
    },
    history: [
      {
        score: Number,
        change: Number,
        result: Number,
        hintsUsed: Number,
        isEfficient: Boolean,
        timePenalty: Number,
        attemptId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Attempt'
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

// Enforce unique compound index per user and topic
masteryScoreSchema.index({ userId: 1, topicSlug: 1 }, { unique: true });

const MasteryScore = mongoose.model('MasteryScore', masteryScoreSchema);

module.exports = MasteryScore;
