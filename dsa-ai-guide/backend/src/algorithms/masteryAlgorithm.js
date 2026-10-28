const { MASTERY_WEIGHTS } = require('../config/constants');

/**
 * Calculates deterministic Topic Mastery (0 - 100) based on multiple pedagogical metrics.
 * 
 * @param {Object} params
 * @param {number} params.solvedCount - Total accepted problems in this topic
 * @param {number} params.attemptCount - Total attempts made in this topic
 * @param {number} params.easyCount - Easy problems solved
 * @param {number} params.mediumCount - Medium problems solved
 * @param {number} params.hardCount - Hard problems solved
 * @param {number} params.avgSolveTimeSeconds - Average time taken to solve problems
 * @param {number} params.spacedRecallScore - Score from spaced repetition sessions (0-100)
 * @param {number} params.assessmentInitialScore - Baseline diagnostic score (0-100)
 * @param {number} params.patternComprehensionScore - Pattern quiz/code score (0-100)
 * @returns {number} Mastery score between 0 and 100
 */
function calculateTopicMastery({
  solvedCount = 0,
  attemptCount = 0,
  easyCount = 0,
  mediumCount = 0,
  hardCount = 0,
  avgSolveTimeSeconds = 0,
  spacedRecallScore = 70,
  assessmentInitialScore = 50,
  patternComprehensionScore = 50
}) {
  if (solvedCount === 0 && attemptCount === 0) {
    return Math.min(100, Math.max(0, Math.round(assessmentInitialScore * 0.6)));
  }

  // 1. Accuracy Component (0 - 100)
  const rawAccuracy = attemptCount > 0 ? (solvedCount / attemptCount) * 100 : 0;
  const accuracyScore = Math.min(100, rawAccuracy);

  // 2. Difficulty Weighted Coverage (0 - 100)
  // Target baseline: 4 Easy, 3 Medium, 1 Hard = 4*1 + 3*2.5 + 1*4 = 4 + 7.5 + 4 = 15.5 points for 100%
  const difficultyPoints = easyCount * 1.0 + mediumCount * 2.5 + hardCount * 4.0;
  const difficultyCoverageScore = Math.min(100, (difficultyPoints / 15.0) * 100);

  // 3. Time Efficiency Score (0 - 100)
  // Ideal average solve time for mixed problems is ~20 mins (1200 secs)
  let timeEfficiencyScore = 75;
  if (avgSolveTimeSeconds > 0) {
    if (avgSolveTimeSeconds <= 600) timeEfficiencyScore = 100; // < 10 mins
    else if (avgSolveTimeSeconds <= 1200) timeEfficiencyScore = 85; // 10-20 mins
    else if (avgSolveTimeSeconds <= 2400) timeEfficiencyScore = 65; // 20-40 mins
    else timeEfficiencyScore = 45; // > 40 mins
  }

  // 4. Spaced Recall Component (0 - 100)
  const recallScore = Math.min(100, Math.max(0, spacedRecallScore));

  // 5. Initial Diagnostic Baseline (0 - 100)
  const diagnosticScore = Math.min(100, Math.max(0, assessmentInitialScore));

  // 6. Pattern Comprehension (0 - 100)
  const patternScore = Math.min(100, Math.max(0, patternComprehensionScore));

  // Weighted sum
  const compositeMastery =
    accuracyScore * MASTERY_WEIGHTS.ACCURACY +
    difficultyCoverageScore * MASTERY_WEIGHTS.DIFFICULTY_COVERAGE +
    timeEfficiencyScore * MASTERY_WEIGHTS.TIME_EFFICIENCY +
    recallScore * MASTERY_WEIGHTS.SPACED_RECALL +
    diagnosticScore * MASTERY_WEIGHTS.DIAGNOSTIC_ASSESSMENT +
    patternScore * MASTERY_WEIGHTS.PATTERN_COMPREHENSION;

  return Math.min(100, Math.max(0, Math.round(compositeMastery)));
}

module.exports = {
  calculateTopicMastery
};
