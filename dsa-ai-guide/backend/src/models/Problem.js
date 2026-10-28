const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    topicSlug: {
      type: String,
      required: true
    },
    patternSlug: {
      type: String,
      default: ''
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true
    },
    source: {
      type: String,
      enum: ['Striver A2Z', 'LeetCode Top 150', 'NeetCode 150', 'Curated'],
      default: 'Striver A2Z'
    },
    problemUrl: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    constraints: [
      {
        type: String
      }
    ],
    inputFormat: {
      type: String,
      default: ''
    },
    outputFormat: {
      type: String,
      default: ''
    },
    sampleTestCases: [
      {
        input: String,
        output: String,
        explanation: String
      }
    ],
    hiddenTestCases: [
      {
        input: String,
        output: String
      }
    ],
    hints: [
      {
        level: Number, // 1 to 5
        title: String,
        hintText: String
      }
    ],
    starterCode: {
      cpp: { type: String, default: '' },
      python: { type: String, default: '' },
      java: { type: String, default: '' },
      javascript: { type: String, default: '' }
    },
    solutionCode: {
      cpp: { type: String, default: '' },
      python: { type: String, default: '' },
      java: { type: String, default: '' },
      javascript: { type: String, default: '' }
    },
    optimalTimeComplexity: {
      type: String,
      default: 'O(N)'
    },
    optimalSpaceComplexity: {
      type: String,
      default: 'O(1)'
    },
    companies: [
      {
        type: String
      }
    ],
    tags: [
      {
        type: String
      }
    ],
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Problem', problemSchema);
