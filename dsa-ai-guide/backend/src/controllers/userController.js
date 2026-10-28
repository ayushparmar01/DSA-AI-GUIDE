const User = require('../models/User');
const Profile = require('../models/Profile');
const gamificationService = require('../services/gamificationService');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    const profile = await Profile.findOne({ userId: req.user._id });
    res.status(200).json({
      success: true,
      data: { user, profile }
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const {
      college,
      degree,
      branch,
      graduationYear,
      targetGoal,
      preferredLanguage,
      dailyStudyMinutes,
      targetCompanies,
      codingExperience,
      leetcodeUsername,
      weeklyAvailabilityDays
    } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        college,
        degree,
        branch,
        graduationYear,
        targetGoal,
        preferredLanguage,
        dailyStudyMinutes,
        targetCompanies,
        codingExperience,
        leetcodeUsername,
        weeklyAvailabilityDays
      },
      { new: true, upsert: true }
    );

    await User.findByIdAndUpdate(req.user._id, { isOnboardingCompleted: true });

    res.status(200).json({
      success: true,
      data: profile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAchievements = async (req, res, next) => {
  try {
    const achievements = await gamificationService.getUserAchievements(req.user._id);
    res.status(200).json({
      success: true,
      data: achievements
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getAchievements };
