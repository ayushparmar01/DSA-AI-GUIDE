const Problem = require('../models/Problem');
const MasteryScore = require('../models/MasteryScore');
const TopicMastery = require('../models/TopicMastery');
const Attempt = require('../models/Attempt');
const Submission = require('../models/Submission');
const RevisionSchedule = require('../models/RevisionSchedule');
const AssessmentResult = require('../models/AssessmentResult');
const Profile = require('../models/Profile');
const { calculateProblemRecommendationScore } = require('../algorithms/recommendationAlgorithm');

class RecommendationService {
  /**
   * Generates next best candidate problems with explainable AI reasoning.
   */
  async getRecommendations(userId, limit = 5) {
    const allProblems = await Problem.find({});
    let masteries = await MasteryScore.find({ userId });
    if (!masteries || masteries.length === 0) {
      masteries = await TopicMastery.find({ userId });
    }
    let submissions = await Attempt.find({ userId });
    if (!submissions || submissions.length === 0) {
      submissions = await Submission.find({ userId });
    }
    const revisionsDue = await RevisionSchedule.find({
      userId,
      dueDate: { $lte: new Date() },
      status: 'pending'
    });
    const assessmentResult = await AssessmentResult.findOne({ userId });
    const profile = await Profile.findOne({ userId });

    const topicMasteryMap = {};
    masteries.forEach(m => {
      topicMasteryMap[m.topicSlug] = m.masteryScore;
    });

    const solvedSlugs = new Set(submissions.filter(s => s.status === 'Accepted').map(s => s.problemSlug));
    const attemptedSlugs = new Set(submissions.map(s => s.problemSlug));
    const revisionSlugs = new Set(revisionsDue.map(r => r.problemSlug));

    const userContext = {
      topicMastery: topicMasteryMap,
      userLevel: profile?.currentDsaLevel || 'Intermediate',
      userOverallScore: assessmentResult?.overallScore || 60,
      solvedProblemSlugs: solvedSlugs,
      attemptedProblemSlugs: attemptedSlugs,
      unpracticedPatterns: new Set(['two-pointer', 'sliding-window', 'binary-search-space']),
      daysSinceLastTopicPractice: 3
    };

    const scoredProblems = allProblems.map(p => {
      const isDue = revisionSlugs.has(p.slug);
      const score = calculateProblemRecommendationScore(p, { ...userContext, isRevisionDue: isDue });

      // Generate explainable rationale
      let rationale = 'Selected to advance your conceptual trajectory.';
      const mastery = topicMasteryMap[p.topicSlug] || 50;
      if (isDue) {
        rationale = 'Due for Spaced Repetition revision to prevent pattern forgetting.';
      } else if (attemptedSlugs.has(p.slug) && !solvedSlugs.has(p.slug)) {
        rationale = 'Re-attempt recommended to master edge cases identified in your previous submission.';
      } else if (mastery < 50) {
        rationale = `Targeted for weakness remediation in ${p.topicSlug.replace('-', ' ')} (Current mastery: ${mastery}%).`;
      } else if (p.difficulty === 'Medium' && mastery >= 65) {
        rationale = 'Optimal difficulty challenge to elevate your interview readiness.';
      }

      return {
        problem: p,
        recommendationScore: score,
        rationale,
        isRevisionDue: isDue
      };
    });

    scoredProblems.sort((a, b) => b.recommendationScore - a.recommendationScore);
    return scoredProblems.slice(0, limit);
  }

  /**
   * Generates Daily Action Plan tailored to student's allocated time (30/60/90/120/180 mins).
   */
  async getDailyPlan(userId) {
    const profile = await Profile.findOne({ userId });
    const studyMinutes = profile?.dailyStudyMinutes || 90;
    const recommendations = await this.getRecommendations(userId, 3);
    const revisions = await RevisionSchedule.find({
      userId,
      dueDate: { $lte: new Date() }
    }).limit(2);

    const planItems = [];
    let remainingMinutes = studyMinutes;

    // 1. Spaced Repetition Revision
    if (revisions.length > 0) {
      const time = Math.min(20, remainingMinutes);
      planItems.push({
        type: 'revision',
        title: `Spaced Repetition: ${revisions[0].problemSlug.replace(/-/g, ' ')}`,
        durationMinutes: time,
        completed: false
      });
      remainingMinutes -= time;
    }

    // 2. Primary Recommended Practice Problem
    if (recommendations.length > 0 && remainingMinutes >= 25) {
      const p = recommendations[0].problem;
      const duration = p.difficulty === 'Hard' ? 45 : p.difficulty === 'Medium' ? 30 : 20;
      planItems.push({
        type: 'problem',
        title: `Solve: ${p.title} (${p.difficulty})`,
        slug: p.slug,
        topicSlug: p.topicSlug,
        durationMinutes: Math.min(duration, remainingMinutes),
        completed: false
      });
      remainingMinutes -= duration;
    }

    // 3. Secondary Problem or Pattern Concept
    if (recommendations.length > 1 && remainingMinutes >= 20) {
      const p2 = recommendations[1].problem;
      planItems.push({
        type: 'problem',
        title: `Solve: ${p2.title} (${p2.difficulty})`,
        slug: p2.slug,
        topicSlug: p2.topicSlug,
        durationMinutes: Math.min(25, remainingMinutes),
        completed: false
      });
      remainingMinutes -= 25;
    }

    // 4. Wrap-up Quiz or Concept Reflection
    if (remainingMinutes > 0) {
      planItems.push({
        type: 'quiz',
        title: 'Daily AI Algorithmic Reflection Quiz',
        durationMinutes: remainingMinutes,
        completed: false
      });
    }

    return {
      dailyTimeBudgetMinutes: studyMinutes,
      totalPlanMinutes: studyMinutes,
      items: planItems
    };
  }
}

module.exports = new RecommendationService();
