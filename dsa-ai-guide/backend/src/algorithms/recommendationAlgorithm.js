const { RECOMMENDATION_WEIGHTS } = require('../config/constants');

/**
 * Calculates recommendation score for a candidate problem given the user profile & learning state.
 * 
 * Score(p) = 0.30 * WeaknessScore
 *          + 0.20 * PrerequisiteScore
 *          + 0.15 * DifficultyFit
 *          + 0.15 * RecencyFactor
 *          + 0.10 * PatternGap
 *          + 0.10 * RevisionNeed
 * 
 * @param {Object} candidate - Problem candidate
 * @param {Object} userContext - Aggregated user state
 * @returns {number} Score between 0 and 1.0 (higher = more strongly recommended)
 */
function calculateProblemRecommendationScore(candidate, userContext) {
  const {
    topicMastery = {}, // topicSlug -> mastery (0-100)
    userLevel = 'Intermediate',
    prerequisitesMet = true,
    solvedProblemSlugs = new Set(),
    attemptedProblemSlugs = new Set(),
    unpracticedPatterns = new Set(),
    isRevisionDue = false,
    daysSinceLastTopicPractice = 0
  } = userContext;

  // 1. Weakness Score (0.0 to 1.0): Lower mastery -> higher recommendation need
  const topicMasteryValue = topicMastery[candidate.topicSlug] || 50;
  const weaknessScore = Math.max(0, (100 - topicMasteryValue) / 100);

  // 2. Prerequisite Score (0.0 or 1.0)
  const prerequisiteScore = prerequisitesMet ? 1.0 : 0.1;

  // 3. Difficulty Fit (0.0 to 1.0)
  let difficultyFit = 0.5;
  const userScore = userContext.userOverallScore || 60;
  if (candidate.difficulty === 'Easy') {
    difficultyFit = userScore < 50 ? 1.0 : userScore < 75 ? 0.7 : 0.3;
  } else if (candidate.difficulty === 'Medium') {
    difficultyFit = userScore >= 40 && userScore <= 80 ? 1.0 : 0.6;
  } else if (candidate.difficulty === 'Hard') {
    difficultyFit = userScore > 75 ? 1.0 : userScore >= 60 ? 0.6 : 0.2;
  }

  // 4. Recency Factor (0.0 to 1.0): If topic hasn't been practiced for days, boost it
  let recencyFactor = 0.5;
  if (daysSinceLastTopicPractice >= 7) {
    recencyFactor = 1.0;
  } else if (daysSinceLastTopicPractice >= 3) {
    recencyFactor = 0.8;
  } else if (daysSinceLastTopicPractice >= 1) {
    recencyFactor = 0.6;
  } else {
    recencyFactor = 0.4; // Practiced today
  }

  // 5. Pattern Gap (0.0 to 1.0): If problem teaches a pattern user hasn't tried
  const patternGap = candidate.patternSlug && unpracticedPatterns.has(candidate.patternSlug) ? 1.0 : 0.4;

  // 6. Revision Need (0.0 to 1.0)
  const revisionNeed = isRevisionDue ? 1.0 : 0.2;

  // Already solved penalty (unless due for revision)
  if (solvedProblemSlugs.has(candidate.slug) && !isRevisionDue) {
    return 0.05; // Strongly deprioritize already mastered problems not due for revision
  }

  // Attempted but failed boost (learning opportunity)
  const failedBoost = attemptedProblemSlugs.has(candidate.slug) && !solvedProblemSlugs.has(candidate.slug) ? 0.15 : 0.0;

  const rawScore =
    weaknessScore * RECOMMENDATION_WEIGHTS.WEAKNESS_SCORE +
    prerequisiteScore * RECOMMENDATION_WEIGHTS.PREREQUISITE_SCORE +
    difficultyFit * RECOMMENDATION_WEIGHTS.DIFFICULTY_FIT +
    recencyFactor * RECOMMENDATION_WEIGHTS.RECENCY +
    patternGap * RECOMMENDATION_WEIGHTS.PATTERN_GAP +
    revisionNeed * RECOMMENDATION_WEIGHTS.REVISION_NEED +
    failedBoost;

  return Math.min(1.0, Math.max(0.0, Number(rawScore.toFixed(4))));
}

module.exports = {
  calculateProblemRecommendationScore
};
