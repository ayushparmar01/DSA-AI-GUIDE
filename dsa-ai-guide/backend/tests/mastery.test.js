const { calculateTopicMastery } = require('../src/algorithms/masteryAlgorithm');

describe('Deterministic Topic Mastery Algorithm Tests', () => {
  test('should return 0 or scaled baseline for brand new user with no attempts', () => {
    const score = calculateTopicMastery({
      solvedCount: 0,
      attemptCount: 0,
      assessmentInitialScore: 50
    });
    expect(score).toBe(30); // 50 * 0.6
  });

  test('should compute high mastery (>80) for high accuracy, hard coverage and fast solve times', () => {
    const score = calculateTopicMastery({
      solvedCount: 10,
      attemptCount: 10,
      easyCount: 4,
      mediumCount: 4,
      hardCount: 2, // 4*1 + 4*2.5 + 2*4 = 4 + 10 + 8 = 22 pts (>15.5 max baseline)
      avgSolveTimeSeconds: 450, // fast < 10 mins -> 100 efficiency
      spacedRecallScore: 90,
      assessmentInitialScore: 85,
      patternComprehensionScore: 90
    });

    expect(score).toBeGreaterThanOrEqual(85);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('should penalize mastery for low accuracy and long solve times', () => {
    const score = calculateTopicMastery({
      solvedCount: 2,
      attemptCount: 10, // 20% accuracy
      easyCount: 2,
      mediumCount: 0,
      hardCount: 0,
      avgSolveTimeSeconds: 3000, // > 40 mins -> 45 efficiency
      spacedRecallScore: 40,
      assessmentInitialScore: 30,
      patternComprehensionScore: 30
    });

    expect(score).toBeLessThan(40);
  });
});
