const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'award'
    },
    category: {
      type: String,
      enum: ['Mastery', 'Streak', 'ProblemCount', 'Pattern', 'Interview', 'Contest'],
      default: 'ProblemCount'
    },
    xpReward: {
      type: Number,
      default: 50
    },
    conditionType: {
      type: String,
      required: true // 'problems_solved', 'streak_days', 'topic_mastery', 'interview_completed'
    },
    threshold: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    achievementSlug: {
      type: String,
      required: true
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

userAchievementSchema.index({ userId: 1, achievementSlug: 1 }, { unique: true });

module.exports = {
  Achievement: mongoose.model('Achievement', achievementSchema),
  UserAchievement: mongoose.model('UserAchievement', userAchievementSchema)
};
