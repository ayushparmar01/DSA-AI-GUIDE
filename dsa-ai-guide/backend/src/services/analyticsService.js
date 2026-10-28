const Submission = require('../models/Submission');
const TopicMastery = require('../models/TopicMastery');
const User = require('../models/User');
const AssessmentResult = require('../models/AssessmentResult');
const promptManager = require('../ai/promptManager');

class AnalyticsService {
  /**
   * Aggregates full user analytics dashboard metrics.
   */
  async getUserDashboardMetrics(userId) {
    const user = await User.findById(userId);
    const masteries = await TopicMastery.find({ userId });
    const submissions = await Submission.find({ userId });
    const assessmentResult = await AssessmentResult.findOne({ userId });

    const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
    const uniqueSolvedSlugs = new Set(acceptedSubmissions.map(s => s.problemSlug));

    let easySolved = 0, mediumSolved = 0, hardSolved = 0;
    masteries.forEach(m => {
      easySolved += m.easyCount || 0;
      mediumSolved += m.mediumCount || 0;
      hardSolved += m.hardCount || 0;
    });

    const totalAttempts = submissions.length;
    const accuracy = totalAttempts > 0 ? Math.round((acceptedSubmissions.length / totalAttempts) * 100) : 0;

    let totalMasteryScore = 0;
    masteries.forEach(m => { totalMasteryScore += m.masteryScore; });
    const averageMastery = masteries.length > 0 ? Math.round(totalMasteryScore / masteries.length) : (assessmentResult?.overallScore || 50);

    // Topic strengths vs weaknesses
    const sortedTopics = [...masteries].sort((a, b) => b.masteryScore - a.masteryScore);
    const topStrengths = sortedTopics.slice(0, 3).map(t => ({ topicSlug: t.topicSlug, score: t.masteryScore }));
    const topWeaknesses = sortedTopics.slice(-3).reverse().map(t => ({ topicSlug: t.topicSlug, score: t.masteryScore }));

    // 1. Outcome breakdown from real submissions
    const outcomeBreakdown = {
      Accepted: 0,
      'Wrong Answer': 0,
      'Time Limit Exceeded': 0,
      'Compilation Error': 0,
      'Runtime Error': 0
    };

    let totalHintsUsed = 0;
    const complexityCounts = {};

    submissions.forEach(sub => {
      if (outcomeBreakdown[sub.status] !== undefined) {
        outcomeBreakdown[sub.status]++;
      } else {
        outcomeBreakdown[sub.status] = 1;
      }
      totalHintsUsed += (sub.hintsUsedCount || 0);

      const comp = sub.complexityAnalysis?.complexity || sub.aiReview?.timeComplexity;
      if (comp) {
        complexityCounts[comp] = (complexityCounts[comp] || 0) + 1;
      }
    });

    // 2. Real weekly activity aggregation (past 7 calendar days)
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const past7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStr = days[d.getDay()];
      const datePrefix = d.toISOString().split('T')[0];
      past7Days.push({ day: dayStr, date: datePrefix, solved: 0, attempts: 0 });
    }

    submissions.forEach(sub => {
      if (sub.createdAt) {
        const subDate = new Date(sub.createdAt).toISOString().split('T')[0];
        const dayBucket = past7Days.find(d => d.date === subDate);
        if (dayBucket) {
          dayBucket.attempts++;
          if (sub.status === 'Accepted') {
            dayBucket.solved++;
          }
        }
      }
    });

    const weeklyActivity = past7Days.map(({ day, solved, attempts }) => ({ day, solved, attempts }));

    // 3. Recent 6 attempts
    const recentAttempts = submissions
      .slice(-6)
      .reverse()
      .map(s => ({
        id: s._id,
        problemSlug: s.problemSlug,
        status: s.status,
        language: s.language,
        runtimeMs: s.runtimeMs,
        hintsUsedCount: s.hintsUsedCount || 0,
        createdAt: s.createdAt,
        complexity: s.complexityAnalysis?.complexity || 'O(N)'
      }));

    return {
      totalSolved: uniqueSolvedSlugs.size,
      easySolved,
      mediumSolved,
      hardSolved,
      accuracy,
      totalAttempts,
      currentStreak: user?.streakCurrent || 0,
      longestStreak: user?.streakLongest || 0,
      averageMastery: masteries.length > 0 ? averageMastery : 0,
      dsaScore: assessmentResult?.overallScore || 0,
      xp: user?.xp || 0,
      level: user?.level || 1,
      topStrengths,
      topWeaknesses,
      weeklyActivity,
      outcomeBreakdown,
      totalHintsUsed,
      avgHintsPerAttempt: totalAttempts > 0 ? parseFloat((totalHintsUsed / totalAttempts).toFixed(1)) : 0,
      complexityCounts,
      recentAttempts,
      masteryBreakdown: masteries.map(m => ({
        topicSlug: m.topicSlug,
        masteryScore: m.masteryScore,
        accuracyPercentage: m.accuracyPercentage || 0,
        solvedCount: m.solvedCount || 0
      }))
    };
  }

  /**
   * Generates AI Weekly Performance Report.
   */
  async getWeeklyReport(userId) {
    const metrics = await this.getUserDashboardMetrics(userId);
    const user = await User.findById(userId);

    const report = await promptManager.generateWeeklyReport({
      weeklyMetrics: metrics.weeklyActivity,
      topicProgress: metrics.masteryBreakdown,
      problemsSolvedCount: metrics.totalSolved,
      accuracyRate: metrics.accuracy,
      streakDays: user?.streakCurrent || 1
    });

    return report;
  }
}

module.exports = new AnalyticsService();
