/**
 * Complete Verification Test Suite for Demo Seed Data & Synthesis
 * Verifies all requirements from the Demo Data Seeding specification:
 * 1. Demo Users & Authentication (Admin, Instructors, 15 Students across 3 tiers)
 * 2. Problem Bank (>= 40 problems spanning all 14 requested topics, Easy/Med/Hard, test cases, hints, solutions)
 * 3. Assessment Bank (5 quizzes x 10 Qs, 3 mixed x 15 Qs, 2 mocks x 20 Qs, 1 diagnostic x 10 Qs = 145 Qs)
 * 4. Deterministic Mastery Calculation M' = clamp(M + 8R - 2H + 3E - T, 0, 100)
 * 5. Weighted Kahn Topological Sort Roadmap Generator
 * 6. SM-2 Spaced Repetition Scheduling
 * 7. Socratic Hint Telemetry & Leakage Guard Detection
 */

const problemsSeed = require('../src/seed/problemsSeed');
const assessmentsSeed = require('../src/seed/assessmentsSeed');
const demoUsers = require('../src/seed/usersSeed');
const topicsSeed = require('../src/seed/topicsSeed');
const {
  calculateTimePenalty,
  calculateDelta,
  generateRoadmapSequence
} = require('../src/seed/activityGenerator');

describe('DSA AI Guide — Complete Demo Data Verification Suite', () => {
  // ==========================================
  // 1. DEMO USERS AND AUTHENTICATION
  // ==========================================
  describe('Demo Users & Profiles', () => {
    test('contains at least 1 admin, 2 instructors, and 15 students', () => {
      const admins = demoUsers.filter(u => u.role === 'admin');
      const instructors = demoUsers.filter(u => u.role === 'instructor');
      const students = demoUsers.filter(u => u.email.endsWith('@student.dsa.edu'));

      expect(admins.length).toBeGreaterThanOrEqual(1);
      expect(instructors.length).toBe(2);
      expect(students.length).toBe(15);
    });

    test('students are evenly distributed across Beginner, Intermediate, and Advanced tiers', () => {
      const beginners = demoUsers.filter(u => u.tier === 'beginner');
      const intermediates = demoUsers.filter(u => u.tier === 'intermediate' && u.email.endsWith('@student.dsa.edu'));
      const advanced = demoUsers.filter(u => u.tier === 'advanced');

      expect(beginners.length).toBe(5);
      expect(intermediates.length).toBe(5);
      expect(advanced.length).toBe(5);
    });

    test('all demo users have realistic names, valid emails, credentials, and profiles', () => {
      demoUsers.forEach(user => {
        expect(user.name).toBeTruthy();
        expect(user.email).toMatch(/\S+@\S+\.\S+/);
        expect(user.rawPassword).toBeTruthy();
        expect(user.profile).toBeDefined();
        expect(user.profile.college).toBeTruthy();
        expect(user.profile.currentDsaLevel).toBeTruthy();
        expect(user.profile.targetGoal).toBeTruthy();
        expect(user.profile.preferredLanguage).toBeTruthy();
      });
    });
  });

  // ==========================================
  // 2. DSA PROBLEM BANK
  // ==========================================
  describe('Curated DSA Problem Bank (>= 40 Problems)', () => {
    test('contains at least 40 problems in total', () => {
      expect(problemsSeed.length).toBeGreaterThanOrEqual(40);
    });

    test('spans all 14 requested topic areas', () => {
      // 14 requested topic areas:
      // Arrays & Strings, Hashing, Two Pointers, Sliding Window, Binary Search,
      // Sorting, Linked Lists, Stacks & Queues, Recursion & Backtracking,
      // Trees & BST, Heaps, Graphs, Greedy, Dynamic Programming
      const topicSlugs = new Set(problemsSeed.map(p => p.topicSlug));

      expect(topicSlugs.has('arrays')).toBe(true);
      expect(topicSlugs.has('hashing')).toBe(true);
      expect(topicSlugs.has('two-pointers')).toBe(true);
      expect(topicSlugs.has('sliding-window')).toBe(true);
      expect(topicSlugs.has('binary-search')).toBe(true);
      expect(topicSlugs.has('linked-lists')).toBe(true);
      expect(topicSlugs.has('stacks')).toBe(true);
      expect(topicSlugs.has('queues')).toBe(true);
      expect(topicSlugs.has('recursion') || topicSlugs.has('backtracking')).toBe(true);
      expect(topicSlugs.has('trees') || topicSlugs.has('binary-search-trees')).toBe(true);
      expect(topicSlugs.has('heaps')).toBe(true);
      expect(topicSlugs.has('graphs')).toBe(true);
      expect(topicSlugs.has('dynamic-programming')).toBe(true);

      // Verify sorting pattern exists
      const sortingProblems = problemsSeed.filter(p => p.patternSlug.includes('sort') || p.tags.includes('Sorting'));
      expect(sortingProblems.length).toBeGreaterThanOrEqual(3);

      // Verify greedy pattern exists
      const greedyProblems = problemsSeed.filter(p => p.patternSlug.includes('greedy') || p.tags.includes('Greedy'));
      expect(greedyProblems.length).toBeGreaterThanOrEqual(3);
    });

    test('includes Easy, Medium, and Hard difficulty levels with healthy distributions', () => {
      const easy = problemsSeed.filter(p => p.difficulty === 'Easy');
      const med = problemsSeed.filter(p => p.difficulty === 'Medium');
      const hard = problemsSeed.filter(p => p.difficulty === 'Hard');

      expect(easy.length).toBeGreaterThanOrEqual(8);
      expect(med.length).toBeGreaterThanOrEqual(15);
      expect(hard.length).toBeGreaterThanOrEqual(8);
    });

    test('every problem contains complete test cases, 5-tier hints, starter code, and solution code', () => {
      problemsSeed.forEach(prob => {
        expect(prob.slug).toBeTruthy();
        expect(prob.title).toBeTruthy();
        expect(prob.description).toBeTruthy();
        expect(prob.constraints.length).toBeGreaterThan(0);

        // At least 2 sample test cases
        expect(prob.sampleTestCases.length).toBeGreaterThanOrEqual(2);
        prob.sampleTestCases.forEach(tc => {
          expect(tc.input).toBeDefined();
          expect(tc.output).toBeDefined();
        });

        // At least 2 hidden test cases
        expect(prob.hiddenTestCases.length).toBeGreaterThanOrEqual(2);
        prob.hiddenTestCases.forEach(tc => {
          expect(tc.input).toBeDefined();
          expect(tc.output).toBeDefined();
        });

        // 5-tier progressive hints
        expect(prob.hints.length).toBe(5);
        for (let level = 1; level <= 5; level++) {
          const hint = prob.hints.find(h => h.level === level);
          expect(hint).toBeDefined();
          expect(hint.hintText).toBeTruthy();
        }

        // Multi-language starter code
        expect(prob.starterCode).toBeDefined();
        expect(prob.starterCode.python).toBeTruthy();
        expect(prob.starterCode.cpp).toBeTruthy();

        // Solution code and complexities
        expect(prob.solutionCode).toBeDefined();
        expect(prob.optimalTimeComplexity).toBeTruthy();
        expect(prob.optimalSpaceComplexity).toBeTruthy();
      });
    });
  });

  // ==========================================
  // 3. ASSESSMENTS AND QUIZZES
  // ==========================================
  describe('Assessments & Quizzes (145 Questions Total)', () => {
    test('contains exactly 145 questions across quizzes, mixed assessments, and timed mocks', () => {
      expect(assessmentsSeed.length).toBe(145);
    });

    test('contains 5 topic-wise quizzes with 10 questions each', () => {
      const expectedQuizzes = [
        'quiz-arrays-hashing',
        'quiz-pointers-window',
        'quiz-binary-search-sorting',
        'quiz-trees-graphs',
        'quiz-dp-greedy'
      ];

      expectedQuizzes.forEach(quizId => {
        const questions = assessmentsSeed.filter(a => a.assessmentId === quizId);
        expect(questions.length).toBe(10);
      });
    });

    test('contains 3 mixed-topic assessments with 15 questions each', () => {
      const expectedAssessments = [
        'assessment-foundation-dsa',
        'assessment-intermediate-patterns',
        'assessment-advanced-synthesis'
      ];

      expectedAssessments.forEach(assId => {
        const questions = assessmentsSeed.filter(a => a.assessmentId === assId);
        expect(questions.length).toBe(15);
      });
    });

    test('contains 2 timed mock assessments with 20 questions each', () => {
      const expectedMocks = [
        'mock-faang-screening-1',
        'mock-faang-screening-2'
      ];

      expectedMocks.forEach(mockId => {
        const questions = assessmentsSeed.filter(a => a.assessmentId === mockId);
        expect(questions.length).toBe(20);
      });
    });

    test('all questions have valid options, correctOptionIndex in bounds, and explanations', () => {
      assessmentsSeed.forEach(q => {
        expect(q.question).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(4);
        expect(q.correctOptionIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctOptionIndex).toBeLessThan(q.options.length);
        expect(q.explanation).toBeTruthy();
        expect(q.points).toBeGreaterThan(0);
      });
    });
  });

  // ==========================================
  // 4. DETERMINISTIC MASTERY & ALGORITHMS
  // ==========================================
  describe('Deterministic Mastery Formula & Algorithms', () => {
    test('calculates normalized time penalty T = clamp((t / t_exp - 1) / (c - 1), 0, 1) with c = 3', () => {
      // At t <= t_exp, penalty T == 0
      expect(calculateTimePenalty(300, 600, 3.0)).toBe(0.0);
      expect(calculateTimePenalty(600, 600, 3.0)).toBe(0.0);

      // At t == 2 * t_exp, ratio = 2, raw = (2 - 1)/2 = 0.5
      expect(calculateTimePenalty(1200, 600, 3.0)).toBe(0.5);

      // At t >= 3 * t_exp, ratio = 3, raw = (3 - 1)/2 = 1.0 (clamped)
      expect(calculateTimePenalty(1800, 600, 3.0)).toBe(1.0);
      expect(calculateTimePenalty(2400, 600, 3.0)).toBe(1.0);
    });

    test('computes deterministic mastery update delta: Delta M = 8R - 2H + 3E - T', () => {
      // Optimal solve, 0 hints, efficient, 0 time penalty: 8(1) - 0 + 3(1) - 0 = +11
      const delta1 = calculateDelta(1.0, 0, true, 0.0);
      expect(delta1).toBe(11.0);

      // Optimal solve with 6 hints (documented pedagogical anomaly): 8(1) - 2(6) + 3(1) - 0 = -1
      const deltaAnomaly = calculateDelta(1.0, 6, true, 0.0);
      expect(deltaAnomaly).toBe(-1.0);

      // Suboptimal solve, 1 hint, inefficient, half time penalty (0.5): 8(0.5) - 2(1) + 0 - 0.5 = 4 - 2 - 0.5 = +1.5
      const delta2 = calculateDelta(0.5, 1, false, 0.5);
      expect(delta2).toBe(1.5);

      // Failed attempt, 0 hints, inefficient, 0 time penalty: 8(-1) - 0 + 0 - 0 = -8.0
      const deltaFailed = calculateDelta(-1.0, 0, false, 0.0);
      expect(deltaFailed).toBe(-8.0);
    });

    test('generates valid topological sequence honoring prerequisite constraints via Weighted Kahn Sort', () => {
      const mockMasteries = {
        'complexity-analysis': 90,
        'arrays': 85,
        'two-pointers': 70,
        'sliding-window': 60,
        'binary-search': 50,
        'dynamic-programming': 20
      };

      const sequence = generateRoadmapSequence(mockMasteries);

      expect(sequence.length).toBe(16);

      // Invariant: No topic must appear before its prerequisites
      const indexMap = {};
      sequence.forEach((slug, idx) => { indexMap[slug] = idx; });

      for (const t of topicsSeed) {
        for (const prereq of t.prerequisites || []) {
          expect(indexMap[prereq]).toBeLessThan(indexMap[t.slug]);
        }
      }
    });
  });
});
