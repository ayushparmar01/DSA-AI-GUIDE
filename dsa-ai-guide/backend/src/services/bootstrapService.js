/**
 * Bootstrap Service
 * Ensures default demonstration credentials exist in the database without modifying,
 * resetting, or deleting any existing user accounts or custom data.
 */

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Profile = require('../models/Profile');

const defaultDemoAccounts = [
  {
    email: 'student@dsa-ai.guide',
    name: 'Demo Student (Default)',
    password: 'Password123!',
    role: 'student',
    xp: 850,
    level: 4,
    streakCurrent: 7,
    streakLongest: 14,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2026,
      currentDsaLevel: 'Intermediate',
      targetGoal: 'Placement preparation',
      preferredLanguage: 'cpp',
      dailyStudyMinutes: 90,
      targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Uber'],
      codingExperience: '1-2 years'
    }
  },
  {
    email: 'admin@dsa-ai.guide',
    name: 'DSA Platform Admin (Default)',
    password: 'AdminSecret123!',
    role: 'admin',
    xp: 2000,
    level: 6,
    streakCurrent: 21,
    streakLongest: 35,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true,
    profile: {
      college: 'GL Bajaj Group of Institutions',
      degree: 'M.Tech',
      branch: 'Computer Science',
      graduationYear: 2018,
      currentDsaLevel: 'Expert',
      targetGoal: 'FAANG / Product Companies',
      preferredLanguage: 'python',
      dailyStudyMinutes: 60,
      targetCompanies: ['Google', 'Meta'],
      codingExperience: '2+ years'
    }
  }
];

const ensureDefaultDemoAccounts = async () => {
  try {
    for (const demo of defaultDemoAccounts) {
      const normalizedEmail = demo.email.toLowerCase().trim();
      let user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(demo.password, salt);

        user = await User.create({
          name: demo.name,
          email: normalizedEmail,
          passwordHash,
          role: demo.role,
          xp: demo.xp,
          level: demo.level,
          streakCurrent: demo.streakCurrent,
          streakLongest: demo.streakLongest,
          isAssessmentCompleted: demo.isAssessmentCompleted,
          isOnboardingCompleted: demo.isOnboardingCompleted
        });
        console.log(`[Bootstrap] Ensured demo account exists: ${normalizedEmail}`);
      }

      if (user && demo.profile) {
        const existingProfile = await Profile.findOne({ userId: user._id });
        if (!existingProfile) {
          try {
            await Profile.create({
              userId: user._id,
              ...demo.profile
            });
          } catch (pe) {
            await Profile.create({ userId: user._id });
          }
        }
      }
    }
  } catch (err) {
    console.error('[Bootstrap] Error ensuring default demo accounts:', err.message);
  }
};

module.exports = {
  ensureDefaultDemoAccounts,
  defaultDemoAccounts
};
