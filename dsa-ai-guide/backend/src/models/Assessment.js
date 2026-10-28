const mongoose = require('mongoose');

const assessmentQuestionSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: String,
      default: 'diagnostic-dsa',
      index: true
    },
    assessmentTitle: {
      type: String,
      default: 'Comprehensive Diagnostic Assessment'
    },
    assessmentType: {
      type: String,
      enum: ['topic_quiz', 'mixed_assessment', 'timed_mock', 'diagnostic'],
      default: 'diagnostic'
    },
    timeLimitMinutes: {
      type: Number,
      default: 20
    },
    passingScore: {
      type: Number,
      default: 70
    },
    topicSlug: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    },
    type: {
      type: String,
      enum: [
        'mcq',
        'output_prediction',
        'complexity',
        'debugging',
        'code_completion',
        'pattern_id'
      ],
      required: true
    },
    question: {
      type: String,
      required: true
    },
    codeSnippet: {
      type: String,
      default: ''
    },
    options: [
      {
        text: String
      }
    ],
    correctOptionIndex: {
      type: Number,
      required: true
    },
    explanation: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      default: 10
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', assessmentQuestionSchema);
