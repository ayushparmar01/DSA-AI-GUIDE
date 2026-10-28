const mongoose = require('mongoose');

/**
 * ATTEMPT Collection Schema
 * Stores problem solve attempts with test results, telemetry, and mastery delta.
 */
const attemptSchema = new mongoose.Schema(
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
    topicSlug: {
      type: String,
      required: true,
      index: true
    },
    language: {
      type: String,
      enum: ['python', 'cpp', 'java', 'javascript'],
      required: true
    },
    code: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: [
        'Accepted',
        'Wrong Answer',
        'Time Limit Exceeded',
        'Compilation Error',
        'Runtime Error',
        'Queued',
        'Processing'
      ],
      required: true
    },
    result: {
      type: Number,
      enum: [1.0, 0.5, -1.0],
      default: -1.0 // 1.0 (optimal), 0.5 (suboptimal), -1.0 (failed)
    },
    runtimeMs: {
      type: Number,
      default: 0
    },
    memoryKb: {
      type: Number,
      default: 0
    },
    testCasesPassed: {
      type: Number,
      default: 0
    },
    totalTestCases: {
      type: Number,
      default: 0
    },
    timeTakenSeconds: {
      type: Number,
      required: true,
      default: 300
    },
    hintsUsedCount: {
      type: Number,
      required: true,
      default: 0
    },
    isEfficient: {
      type: Boolean,
      default: false
    },
    timePenalty: {
      type: Number,
      default: 0
    },
    masteryDelta: {
      type: Number,
      default: 0
    },
    judge0Token: {
      type: String,
      default: ''
    },
    testCaseResults: [
      {
        testCaseIndex: Number,
        passed: Boolean,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        error: String
      }
    ],
    complexityAnalysis: {
      complexity: String,
      abstained: Boolean,
      confidence: Number,
      explanation: String
    }
  },
  { timestamps: true }
);

// Compound indexes for user history queries
attemptSchema.index({ userId: 1, problemSlug: 1 });
attemptSchema.index({ userId: 1, createdAt: -1 });

const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = Attempt;
