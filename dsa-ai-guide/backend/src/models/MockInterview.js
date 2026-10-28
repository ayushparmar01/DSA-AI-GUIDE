const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    topicSlug: {
      type: String,
      required: true
    },
    problemSlug: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress'
    },
    transcript: [
      {
        speaker: { type: String, enum: ['ai', 'user'], required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    scores: {
      problemUnderstanding: { type: Number, default: 0 },
      approachOptimality: { type: Number, default: 0 },
      codingProficiency: { type: Number, default: 0 },
      complexityExplanation: { type: Number, default: 0 },
      communicationClarity: { type: Number, default: 0 },
      overallInterviewScore: { type: Number, default: 0 } // out of 100
    },
    interviewerFeedback: {
      strengths: [String],
      improvements: [String],
      detailedReview: String
    },
    durationMinutes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
