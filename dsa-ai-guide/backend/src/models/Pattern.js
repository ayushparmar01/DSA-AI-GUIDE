const mongoose = require('mongoose');

const patternSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    conceptGuide: {
      type: String,
      default: ''
    },
    visualType: {
      type: String,
      default: 'array'
    },
    topicSlug: {
      type: String,
      required: true
    },
    sampleProblemSlugs: [
      {
        type: String
      }
    ],
    timeComplexity: {
      type: String,
      default: 'O(N)'
    },
    spaceComplexity: {
      type: String,
      default: 'O(1)'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pattern', patternSchema);
