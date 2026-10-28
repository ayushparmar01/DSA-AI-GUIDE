const { calculateProblemRecommendationScore } = require('../src/algorithms/recommendationAlgorithm');

describe('Hybrid Recommendation Engine Formula Tests', () => {
  const candidateProblem = {
    slug: 'binary-search-medium',
    topicSlug: 'binary-search',
    patternSlug: 'binary-search-space',
    difficulty: 'Medium'
  };

  test('should score highest for weak topic with unpracticed pattern', () => {
    const userContext = {
      topicMastery: { 'binary-search': 20 }, // weak topic (80% weakness)
      userLevel: 'Intermediate',
      userOverallScore: 65,
      prerequisitesMet: true,
      solvedProblemSlugs: new Set(),
      attemptedProblemSlugs: new Set(),
      unpracticedPatterns: new Set(['binary-search-space']),
      isRevisionDue: false,
      daysSinceLastTopicPractice: 5
    };

    const score = calculateProblemRecommendationScore(candidateProblem, userContext);
    expect(score).toBeGreaterThan(0.65);
  });

  test('should strongly penalize already solved problems not due for revision', () => {
    const userContext = {
      topicMastery: { 'binary-search': 95 },
      userLevel: 'Advanced',
      userOverallScore: 90,
      prerequisitesMet: true,
      solvedProblemSlugs: new Set(['binary-search-medium']),
      attemptedProblemSlugs: new Set(['binary-search-medium']),
      unpracticedPatterns: new Set(),
      isRevisionDue: false
    };

    const score = calculateProblemRecommendationScore(candidateProblem, userContext);
    expect(score).toBeLessThanOrEqual(0.1);
  });

  test('should prioritize problems due for spaced repetition', () => {
    const userContext = {
      topicMastery: { 'binary-search': 70 },
      userLevel: 'Intermediate',
      userOverallScore: 70,
      prerequisitesMet: true,
      solvedProblemSlugs: new Set(['binary-search-medium']),
      attemptedProblemSlugs: new Set(['binary-search-medium']),
      unpracticedPatterns: new Set(),
      isRevisionDue: true
    };

    const score = calculateProblemRecommendationScore(candidateProblem, userContext);
    expect(score).toBeGreaterThan(0.4);
  });
});
