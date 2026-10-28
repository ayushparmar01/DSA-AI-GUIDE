const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    overallScore: {
      type: Number,
      required: true // 0 - 100
    },
    determinedLevel: {
      type: String,
      enum: ['Beginner', 'Early Intermediate', 'Intermediate', 'Advanced', 'Expert'],
      required: true
    },
    topicScores: {
      type: Map,
      of: Number // slug -> score (0-100)
    },
    conceptScore: {
      type: Number,
      default: 0
    },
    codingScore: {
      type: Number,
      default: 0
    },
    complexityScore: {
      type: Number,
      default: 0
    },
    patternScore: {
      type: Number,
      default: 0
    },
    strengths: [
      {
        type: String
      }
    ],
    weaknesses: [
      {
        type: String
      }
    ],
    priorityTopicSlugs: [
      {
        type: String
      }
    ],
    aiSummary: {
      type: String,
      default: ''
    },
    aiRecommendationRationale: {
      type: String,
      default: ''
    },
    estimatedCompletionWeeks: {
      type: Number,
      default: 12
    },
    questionResponses: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOptionIndex: Number,
        isCorrect: Boolean,
        timeTakenSeconds: Number
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);
