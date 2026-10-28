/**
 * DSA AI Guide — Complete Demo Data Seeder
 * Populates realistic, internally consistent synthetic demo data for academic demonstration:
 * 1. 16 Core Topics (Prerequisite DAG compliant)
 * 2. Algorithmic Patterns
 * 3. 47 Comprehensive Problems across all 14 requested topic areas
 * 4. 145 Assessment questions (5 quizzes, 3 mixed, 2 timed mocks, 1 diagnostic)
 * 5. 18 Demo Users (1 Admin, 2 Instructors, 15 Students across 3 tiers, plus default demo users)
 * 6. Historical attempts, deterministic topic masteries (M'), SM-2 revision schedules,
 *    Socratic hint sessions with Leakage Guard telemetry, and personalized roadmaps.
 */

const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/db');

// Models
const Topic = require('../models/Topic');
const Pattern = require('../models/Pattern');
const Problem = require('../models/Problem');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Contest = require('../models/Contest');
const { Achievement } = require('../models/Achievement');
const Attempt = require('../models/Attempt');
const MasteryScore = require('../models/MasteryScore');
const TopicMastery = require('../models/TopicMastery');
const Roadmap = require('../models/Roadmap');
const RevisionSchedule = require('../models/RevisionSchedule');
const HintSession = require('../models/HintSession');
const AssessmentResult = require('../models/AssessmentResult');

// Seed sources
const topicsSeed = require('./topicsSeed');
const patternsSeed = require('./patternsSeed');
const problemsSeed = require('./problemsSeed');
const assessmentsSeed = require('./assessmentsSeed');
const demoUsers = require('./usersSeed');
const { generateUserActivity } = require('./activityGenerator');

const defaultAchievements = [
  {
    slug: 'first-problem-solved',
    title: 'First Step',
    description: 'Solve your very first DSA problem on the platform',
    icon: 'award',
    category: 'ProblemCount',
    xpReward: 50,
    conditionType: 'problems_solved',
    threshold: 1
  },
  {
    slug: 'ten-problems-solved',
    title: 'Algorithmic Apprentice',
    description: 'Solve 10 problems across any DSA topic',
    icon: 'target',
    category: 'ProblemCount',
    xpReward: 150,
    conditionType: 'problems_solved',
    threshold: 10
  },
  {
    slug: 'streak-7-days',
    title: '7-Day Consistency King',
    description: 'Maintain an uninterrupted 7-day coding streak',
    icon: 'flame',
    category: 'Streak',
    xpReward: 250,
    conditionType: 'streak_days',
    threshold: 7
  },
  {
    slug: 'binary-search-master',
    title: 'Binary Search Master',
    description: 'Achieve >85% topic mastery in Binary Search',
    icon: 'crosshair',
    category: 'Mastery',
    xpReward: 300,
    conditionType: 'topic_mastery',
    threshold: 85
  },
  {
    slug: 'first-interview-completed',
    title: 'Mock Interview Ready',
    description: 'Complete your first full AI Mock Technical Interview',
    icon: 'briefcase',
    category: 'Interview',
    xpReward: 200,
    conditionType: 'interview_completed',
    threshold: 1
  }
];

const seedDatabase = async () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[Safety Guard] Seeding is disabled in production environment.');
  }

  try {
    console.log('========================================================================');
    console.log('🌱 [Seeder] DSA AI GUIDE — COMPREHENSIVE DEMO DATA SEEDING INITIALIZING');
    console.log('========================================================================');

    console.log('[Seeder] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seeder] Cleaning existing development database collections...');
    await Topic.deleteMany({});
    await Pattern.deleteMany({});
    await Problem.deleteMany({});
    await Assessment.deleteMany({});
    await Achievement.deleteMany({});
    await Contest.deleteMany({});
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Attempt.deleteMany({});
    await MasteryScore.deleteMany({});
    await TopicMastery.deleteMany({});
    await Roadmap.deleteMany({});
    await RevisionSchedule.deleteMany({});
    await HintSession.deleteMany({});
    await AssessmentResult.deleteMany({});

    console.log(`[Seeder] Seeding 16 Core Prerequisite DAG Topics...`);
    await Topic.insertMany(topicsSeed);

    console.log(`[Seeder] Seeding Algorithmic Patterns...`);
    await Pattern.insertMany(patternsSeed);

    console.log(`[Seeder] Seeding ${problemsSeed.length} Curated Problems across 14 Topic Areas...`);
    await Problem.insertMany(problemsSeed);

    console.log(`[Seeder] Seeding ${assessmentsSeed.length} Assessment Questions across 11 Evaluations...`);
    await Assessment.insertMany(assessmentsSeed);

    console.log(`[Seeder] Seeding Achievement Badges...`);
    await Achievement.insertMany(defaultAchievements);

    console.log(`[Seeder] Seeding Competitive Programming Sprint Contest...`);
    const contestStartTime = new Date();
    const contestEndTime = new Date();
    contestEndTime.setDate(contestEndTime.getDate() + 7);

    await Contest.create({
      title: 'Weekly DSA Sprint #1: Linear Data Structures & Pointers',
      slug: 'weekly-dsa-sprint-1',
      description: 'Test your speed and pattern recognition across Two Sum, Binary Search, and Two Pointers in 90 minutes.',
      durationMinutes: 90,
      problemSlugs: ['two-sum', 'binary-search', 'container-with-most-water', 'reverse-linked-list', 'valid-parentheses'],
      difficultyProgression: ['Easy', 'Easy', 'Medium', 'Easy', 'Easy'],
      startTime: contestStartTime,
      endTime: contestEndTime,
      isActive: true,
      leaderboard: []
    });

    console.log(`[Seeder] Generating ${demoUsers.length} Demo Users and Authenticated Profiles...`);
    for (const u of demoUsers) {
      const passwordHash = await bcrypt.hash(u.rawPassword, 10);
      const userDoc = await User.create({
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        xp: u.xp,
        level: u.level,
        streakCurrent: u.streakCurrent,
        streakLongest: u.streakLongest,
        isAssessmentCompleted: u.isAssessmentCompleted,
        isOnboardingCompleted: u.isOnboardingCompleted
      });

      if (u.profile) {
        await Profile.create({
          userId: userDoc._id,
          ...u.profile
        });
      }

      // If user is a student, generate realistic attempts, mastery scores, SM-2 schedules, and roadmap
      if (u.role === 'student') {
        process.stdout.write(`  -> Generating activity telemetry for ${u.name} (${u.tier || 'intermediate'})...\n`);
        await generateUserActivity(userDoc, u.tier || 'intermediate');
      }
    }

    const totalAttempts = await Attempt.countDocuments();
    const totalMasteries = await MasteryScore.countDocuments();
    const totalRevisions = await RevisionSchedule.countDocuments();
    const totalHints = await HintSession.countDocuments();
    const totalRoadmaps = await Roadmap.countDocuments();

    console.log('========================================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('========================================================================');
    console.log(`📊 SEEDED SUMMARY RECORD COUNTS:`);
    console.log(`  - DSA Core Topics:           ${topicsSeed.length}`);
    console.log(`  - Curated DSA Problems:       ${problemsSeed.length}`);
    console.log(`  - Assessment Questions:      ${assessmentsSeed.length}`);
    console.log(`  - Demo Accounts Created:     ${demoUsers.length}`);
    console.log(`  - Solved/Logged Attempts:    ${totalAttempts}`);
    console.log(`  - Deterministic Masteries:   ${totalMasteries}`);
    console.log(`  - Spaced Repetition Tasks:   ${totalRevisions}`);
    console.log(`  - Hint Sessions & Telemetry: ${totalHints}`);
    console.log(`  - Topological Roadmaps:      ${totalRoadmaps}`);
    console.log('------------------------------------------------------------------------');
    console.log('🔑 DEMO CREDENTIALS CHEAT SHEET:');
    console.log('  Role        Email                            Password');
    console.log('  Admin:      admin@dsa-ai-guide.edu           AdminPass123!');
    console.log('  Admin (Alt):admin@dsa-ai.guide               AdminSecret123!');
    console.log('  Instructor: dr.sharma@dsa-ai-guide.edu       InstructorPass123!');
    console.log('  Instructor: prof.verma@dsa-ai-guide.edu      InstructorPass123!');
    console.log('  Beginner:   aarav.sharma@student.dsa.edu     StudentPass123!');
    console.log('  Interm:     vikram.malhotra@student.dsa.edu  StudentPass123!');
    console.log('  Advanced:   priya.venkatesh@student.dsa.edu  StudentPass123!');
    console.log('  Student:    student@dsa-ai.guide             Password123!');
    console.log('========================================================================');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error] Database seeding encountered an unhandled exception:', error);
    try { await disconnectDB(); } catch (e) {}
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
