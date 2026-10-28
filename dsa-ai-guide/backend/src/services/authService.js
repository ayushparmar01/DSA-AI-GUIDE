const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const Profile = require('../models/Profile');

class AuthService {
  generateToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );
  }

  async register({ name, email, password, role = 'student' }) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const trimmedName = (name || '').trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const error = new Error('Email is already registered');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
      role
    });

    // Create default profile
    let profile;
    try {
      profile = await Profile.create({
        userId: user._id
      });
    } catch (e) {
      profile = await Profile.findOne({ userId: user._id });
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        streakCurrent: user.streakCurrent,
        isAssessmentCompleted: user.isAssessmentCompleted,
        isOnboardingCompleted: user.isOnboardingCompleted
      },
      profile,
      token
    };
  }

  async login({ email, password }) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    let profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      try {
        profile = await Profile.create({ userId: user._id });
      } catch (e) {
        // Ignored
      }
    }
    const token = this.generateToken(user);

    // Update streak if active
    const today = new Date();
    user.lastActiveDate = today;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        streakCurrent: user.streakCurrent,
        isAssessmentCompleted: user.isAssessmentCompleted,
        isOnboardingCompleted: user.isOnboardingCompleted
      },
      profile,
      token
    };
  }
}

module.exports = new AuthService();
