const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student'
    },
    xp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    streakCurrent: {
      type: Number,
      default: 0
    },
    streakLongest: {
      type: Number,
      default: 0
    },
    streakFreezeCount: {
      type: Number,
      default: 1
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    },
    isAssessmentCompleted: {
      type: Boolean,
      default: false
    },
    isOnboardingCompleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.methods.calculateLevel = function () {
  // 100 XP per level with exponential scale factor
  return Math.floor(Math.sqrt(this.xp / 50)) + 1;
};

module.exports = mongoose.model('User', userSchema);
