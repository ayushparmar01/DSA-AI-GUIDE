const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    college: {
      type: String,
      default: ''
    },
    degree: {
      type: String,
      default: 'B.Tech / B.E.'
    },
    branch: {
      type: String,
      default: 'Computer Science'
    },
    graduationYear: {
      type: Number,
      default: new Date().getFullYear() + 1
    },
    currentDsaLevel: {
      type: String,
      enum: ['Beginner', 'Early Intermediate', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner'
    },
    targetGoal: {
      type: String,
      enum: [
        'Placement preparation',
        'Competitive programming',
        'FAANG / Product Companies',
        'DSA Fundamentals',
        'Interview Refresher'
      ],
      default: 'Placement preparation'
    },
    preferredLanguage: {
      type: String,
      enum: ['cpp', 'python', 'java', 'javascript'],
      default: 'cpp'
    },
    dailyStudyMinutes: {
      type: Number,
      enum: [30, 60, 90, 120, 180],
      default: 90
    },
    targetCompanies: [
      {
        type: String
      }
    ],
    codingExperience: {
      type: String,
      enum: ['< 6 months', '6-12 months', '1-2 years', '2+ years'],
      default: '6-12 months'
    },
    leetcodeUsername: {
      type: String,
      default: ''
    },
    leetcodeSolvedCount: {
      type: Number,
      default: 0
    },
    striverProgressCount: {
      type: Number,
      default: 0
    },
    weeklyAvailabilityDays: {
      type: Number,
      default: 6
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
