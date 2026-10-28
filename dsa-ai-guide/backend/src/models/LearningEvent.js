const mongoose = require('mongoose');

const learningEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    eventType: {
      type: String,
      enum: [
        'problem_viewed',
        'problem_started',
        'code_submitted',
        'code_failed',
        'code_accepted',
        'hint_requested',
        'solution_viewed',
        'topic_completed',
        'assessment_started',
        'assessment_completed',
        'revision_completed',
        'ai_chat_used',
        'interview_completed',
        'contest_submitted'
      ],
      required: true,
      index: true
    },
    metadata: {
      topicSlug: String,
      problemSlug: String,
      difficulty: String,
      language: String,
      timeSpentSeconds: Number,
      hintLevel: Number,
      score: Number,
      passRate: Number
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningEvent', learningEventSchema);
