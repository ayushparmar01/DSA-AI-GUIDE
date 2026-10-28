const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
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
    language: {
      type: String,
      enum: ['cpp', 'python', 'java', 'javascript'],
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
        'Runtime Error'
      ],
      required: true
    },
    runtimeMs: {
      type: Number,
      default: 45
    },
    memoryKb: {
      type: Number,
      default: 2048
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
      default: 300
    },
    hintsUsedCount: {
      type: Number,
      default: 0
    },
    aiReview: {
      isCorrect: { type: Boolean, default: false },
      timeComplexity: { type: String, default: 'O(N)' },
      spaceComplexity: { type: String, default: 'O(1)' },
      patternDetected: { type: String, default: '' },
      qualityScore: { type: Number, default: 8.0 },
      interviewScore: { type: Number, default: 8.0 },
      critique: { type: String, default: '' },
      optimizations: { type: String, default: '' },
      edgeCaseWarnings: { type: String, default: '' },
      alternativeApproaches: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
module.exports.Attempt = require('./Attempt');
