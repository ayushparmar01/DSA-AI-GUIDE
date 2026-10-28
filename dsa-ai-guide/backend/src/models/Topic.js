const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      default: 'code'
    },
    prerequisites: [
      {
        type: String // Slugs of prerequisite topics
      }
    ],
    estimatedHours: {
      type: Number,
      default: 10
    },
    importanceLevel: {
      type: String,
      enum: ['High', 'Very High', 'Critical', 'Medium'],
      default: 'High'
    },
    totalProblemsCount: {
      type: Number,
      default: 0
    },
    tags: [
      {
        type: String,
        default: 'Demonstration / MVP Seed'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Topic', topicSchema);
