const mongoose = require('mongoose');

const participantScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  problemsSolvedCount: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  finishTimeSeconds: { type: Number, default: 0 },
  penaltySeconds: { type: Number, default: 0 },
  submissions: [
    {
      problemSlug: String,
      status: String,
      timeSeconds: Number,
      attempts: Number
    }
  ]
});

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      default: ''
    },
    durationMinutes: {
      type: Number,
      default: 90
    },
    problemSlugs: [
      {
        type: String
      }
    ],
    difficultyProgression: [
      {
        type: String // e.g. ['Easy', 'Easy', 'Medium', 'Medium', 'Hard']
      }
    ],
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    leaderboard: [participantScoreSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contest', contestSchema);
