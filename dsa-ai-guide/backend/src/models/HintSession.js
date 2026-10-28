const mongoose = require('mongoose');

/**
 * HINT_SESSION Collection Schema
 * Stores graduated 5-tier Socratic hint requests and Leakage Guard decisions.
 */
const hintSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    problemSlug: {
      type: String,
      required: true,
      index: true
    },
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attempt'
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 5 // Level 1 (Concept) to Level 5 (Full Analysis)
    },
    candidateHint: {
      type: String,
      required: true
    },
    leakageCheck: {
      isLeak: { type: Boolean, default: false },
      combinedSimilarity: { type: Number, default: 0 },
      tokenSimilarity: { type: Number, default: 0 },
      astSimilarity: { type: Number, default: 0 },
      rawSimilarity: { type: Number, default: 0 },
      tokenCount: { type: Number, default: 0 },
      threshold: { type: Number, default: 0.80 },
      isShortInput: { type: Boolean, default: false },
      usedFallback: { type: Boolean, default: false },
      explanation: { type: String, default: '' }
    },
    wasBlocked: {
      type: Boolean,
      default: false
    },
    deliveredHint: {
      type: String,
      required: true
    },
    requestedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

hintSessionSchema.index({ userId: 1, problemSlug: 1, requestedAt: -1 });

const HintSession = mongoose.model('HintSession', hintSessionSchema);

module.exports = HintSession;
