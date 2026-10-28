/**
 * Deterministic Topic Mastery Service
 * Implements M' = clamp(M + 8R - 2H + 3E - T, 0, 100)
 * Delegates calculation to Python AI Microservice (or local fallback if offline).
 */

const MasteryScore = require('../models/MasteryScore');
const Attempt = require('../models/Attempt');
const Problem = require('../models/Problem');
const aiServiceClient = require('./aiServiceClient');

class MasteryService {
  /**
   * Recalculates and persists deterministic topic mastery after an attempt.
   */
  async recordAttemptMastery({
    userId,
    topicSlug,
    problemSlug,
    attemptId,
    status,
    isEfficient = false,
    timeTakenSeconds = 300,
    expectedTimeSeconds = 600,
    hintsUsedCount = 0
  }) {
    // 1. Fetch current mastery record
    let masteryDoc = await MasteryScore.findOne({ userId, topicSlug });
    const currentScore = masteryDoc ? masteryDoc.masteryScore : 0.0;

    // 2. Determine R, E, H, T parameters
    const isAccepted = status === 'Accepted';
    let result = -1.0;
    if (isAccepted) {
      result = isEfficient ? 1.0 : 0.5;
    }
    const eVal = isEfficient ? 1 : 0;
    const hVal = Math.max(0, parseInt(hintsUsedCount || 0, 10));
    const tActual = Math.max(0, parseFloat(timeTakenSeconds || 0));
    const tExp = Math.max(1, parseFloat(expectedTimeSeconds || 600));

    // 3. Delegate to Python AI microservice (with local fallback if offline)
    let newScore = currentScore;
    let delta = 0;
    let timePenalty = 0;

    try {
      const aiResult = await aiServiceClient.calculateMastery({
        currentMastery: currentScore,
        result,
        hintsUsed: hVal,
        isEfficient: eVal,
        actualTime: tActual,
        expectedTime: tExp,
        gatedEfficiency: false
      });
      newScore = aiResult.new_mastery;
      delta = aiResult.mastery_change;
      timePenalty = aiResult.t_penalty;
    } catch (err) {
      // Offline local calculation fallback using the identical published equation:
      // M' = clamp(M + 8R - 2H + 3E - T, 0, 100)
      const ratio = tActual / tExp;
      timePenalty = Math.max(0.0, Math.min(1.0, (ratio - 1.0) / 2.0));
      delta = (8.0 * result) - (2.0 * hVal) + (3.0 * eVal) - (1.0 * timePenalty);
      newScore = Math.max(0.0, Math.min(100.0, Math.round((currentScore + delta) * 100) / 100));
    }

    // 4. Update stats
    const allAttempts = await Attempt.find({ userId, topicSlug });
    const acceptedAttempts = allAttempts.filter(a => a.status === 'Accepted');
    const uniqueSolvedSlugs = new Set(acceptedAttempts.map(a => a.problemSlug));

    if (!masteryDoc) {
      masteryDoc = new MasteryScore({
        userId,
        topicSlug,
        masteryScore: newScore,
        solvedCount: uniqueSolvedSlugs.size,
        attemptCount: allAttempts.length,
        accuracyPercentage: allAttempts.length > 0 ? Math.round((acceptedAttempts.length / allAttempts.length) * 100) : 0,
        history: []
      });
    } else {
      masteryDoc.masteryScore = newScore;
      masteryDoc.solvedCount = uniqueSolvedSlugs.size;
      masteryDoc.attemptCount = allAttempts.length;
      masteryDoc.accuracyPercentage = allAttempts.length > 0 ? Math.round((acceptedAttempts.length / allAttempts.length) * 100) : 0;
      masteryDoc.lastCalculatedAt = new Date();
    }

    masteryDoc.history.push({
      score: newScore,
      change: delta,
      result,
      hintsUsed: hVal,
      isEfficient: Boolean(eVal),
      timePenalty,
      attemptId,
      timestamp: new Date()
    });

    await masteryDoc.save();

    return {
      masteryDoc,
      newScore,
      delta,
      timePenalty
    };
  }

  async getUserMasteries(userId) {
    return MasteryScore.find({ userId }).sort({ topicSlug: 1 });
  }

  async getTopicMastery(userId, topicSlug) {
    let score = await MasteryScore.findOne({ userId, topicSlug });
    if (!score) {
      score = {
        userId,
        topicSlug,
        masteryScore: 0.0,
        solvedCount: 0,
        attemptCount: 0,
        accuracyPercentage: 0,
        history: []
      };
    }
    return score;
  }
}

module.exports = new MasteryService();
