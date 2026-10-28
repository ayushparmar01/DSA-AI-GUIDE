const mongoose = require('mongoose');

const roadmapPhaseSchema = new mongoose.Schema({
  phaseNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  topicSlug: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['locked', 'active', 'completed'],
    default: 'locked'
  },
  completionPercentage: {
    type: Number,
    default: 0
  },
  masteryScore: {
    type: Number,
    default: 0
  },
  estimatedHours: {
    type: Number,
    default: 8
  },
  problemSlugs: [
    {
      type: String
    }
  ],
  completedProblemSlugs: [
    {
      type: String
    }
  ],
  prerequisitesMet: {
    type: Boolean,
    default: false
  }
});

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    sequence: [
      {
        type: String // Ordered topic slugs from weighted Kahn topological sort
      }
    ],
    currentTopicSlug: {
      type: String,
      default: 'complexity-analysis'
    },
    phases: [roadmapPhaseSchema],
    currentPhaseNumber: {
      type: Number,
      default: 1
    },
    overallRoadmapCompletion: {
      type: Number,
      default: 0
    },
    aiAdaptationNotes: {
      type: String,
      default: ''
    },
    lastAdaptedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
