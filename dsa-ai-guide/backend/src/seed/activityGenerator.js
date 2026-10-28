/**
 * Synthetic Activity and Telemetry Generator
 * Deterministically generates:
 * 1. Historical problem attempts (Attempt) with telemetry and exact formula masteryDelta
 * 2. Deterministic topic mastery scores (MasteryScore and TopicMastery) following:
 *    M' = clamp(M + 8R - 2H + 3E - T, 0, 100)
 * 3. Spaced repetition review schedules (RevisionSchedule) via SM-2
 * 4. Socratic hint sessions (HintSession) with Leakage Guard telemetry
 * 5. Assessment results (AssessmentResult)
 * 6. Topological roadmaps (Roadmap) via weighted Kahn topological sort
 */

const mongoose = require('mongoose');
const Attempt = require('../models/Attempt');
const MasteryScore = require('../models/MasteryScore');
const TopicMastery = require('../models/TopicMastery');
const RevisionSchedule = require('../models/RevisionSchedule');
const HintSession = require('../models/HintSession');
const AssessmentResult = require('../models/AssessmentResult');
const Roadmap = require('../models/Roadmap');
const topicsSeed = require('./topicsSeed');
const problemsSeed = require('./problemsSeed');

/**
 * Computes deterministic time penalty T = clamp((t / t_exp - 1) / (c - 1), 0, 1) with c = 3.
 */
function calculateTimePenalty(actualTime, expectedTime = 600, c = 3.0) {
  const ratio = actualTime / expectedTime;
  const raw = (ratio - 1.0) / (c - 1.0);
  return Math.max(0.0, Math.min(1.0, raw));
}

/**
 * Computes deterministic delta: Delta M = 8*R - 2*H + 3*E - T
 */
function calculateDelta(result, hintsUsed, isEfficient, timePenalty) {
  const rComp = 8.0 * result;
  const hComp = 2.0 * hintsUsed;
  const eComp = 3.0 * (isEfficient ? 1 : 0);
  const tComp = 1.0 * timePenalty;
  return rComp - hComp + eComp - tComp;
}

/**
 * Weighted Kahn Topological Sort over the 16 core topics.
 * Priority = (1 - M / 100). Higher priority (lower mastery) is scheduled first.
 * Ties broken alphabetically.
 */
function generateRoadmapSequence(masteryByTopic) {
  const graph = {};
  const inDegree = {};
  for (const t of topicsSeed) {
    graph[t.slug] = [];
    inDegree[t.slug] = 0;
  }
  for (const t of topicsSeed) {
    for (const prereq of t.prerequisites || []) {
      if (graph[prereq]) {
        graph[prereq].push(t.slug);
        inDegree[t.slug] = (inDegree[t.slug] || 0) + 1;
      }
    }
  }

  // Available nodes with inDegree == 0
  const available = [];
  for (const [slug, deg] of Object.entries(inDegree)) {
    if (deg === 0) available.push(slug);
  }

  const sequence = [];
  while (available.length > 0) {
    // Sort available by priority = (1 - M/100) descending, ties broken alphabetically ascending
    available.sort((a, b) => {
      const scoreA = masteryByTopic[a] || 0;
      const scoreB = masteryByTopic[b] || 0;
      const prioA = 1 - scoreA / 100;
      const prioB = 1 - scoreB / 100;
      if (Math.abs(prioA - prioB) > 0.001) {
        return prioB - prioA; // Higher priority (lower mastery) first
      }
      return a.localeCompare(b);
    });

    const curr = available.shift();
    sequence.push(curr);

    for (const neighbor of graph[curr] || []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        available.push(neighbor);
      }
    }
  }

  // Fallback if disconnected
  for (const t of topicsSeed) {
    if (!sequence.includes(t.slug)) sequence.push(t.slug);
  }

  return sequence;
}

/**
 * Master generator for user historical activity
 */
async function generateUserActivity(user, tier) {
  const userId = user._id;

  // Problem subsets based on tier
  let targetProblems = [];
  let solveProbability = 0.6;
  let hintProbability = 0.5;
  let efficiencyProbability = 0.4;
  let avgSolveTime = 500;

  if (tier === 'beginner') {
    targetProblems = problemsSeed.filter(p => p.difficulty === 'Easy').slice(0, 7);
    solveProbability = 0.65;
    hintProbability = 0.6;
    efficiencyProbability = 0.35;
    avgSolveTime = 700;
  } else if (tier === 'intermediate') {
    const easy = problemsSeed.filter(p => p.difficulty === 'Easy').slice(0, 10);
    const med = problemsSeed.filter(p => p.difficulty === 'Medium').slice(0, 12);
    targetProblems = [...easy, ...med];
    solveProbability = 0.82;
    hintProbability = 0.25;
    efficiencyProbability = 0.70;
    avgSolveTime = 420;
  } else { // advanced
    const easy = problemsSeed.filter(p => p.difficulty === 'Easy').slice(0, 10);
    const med = problemsSeed.filter(p => p.difficulty === 'Medium').slice(0, 18);
    const hard = problemsSeed.filter(p => p.difficulty === 'Hard').slice(0, 8);
    targetProblems = [...easy, ...med, ...hard];
    solveProbability = 0.95;
    hintProbability = 0.05;
    efficiencyProbability = 0.92;
    avgSolveTime = 260;
  }

  const topicMasteryMap = {};
  const topicStats = {};

  // Initialize all topics at 0
  for (const t of topicsSeed) {
    topicMasteryMap[t.slug] = 0.0;
    topicStats[t.slug] = {
      solvedSlugs: new Set(),
      attemptCount: 0,
      totalTime: 0,
      easyCount: 0,
      mediumCount: 0,
      hardCount: 0,
      history: []
    };
  }

  // Iterate through problems and generate attempts
  let daysAgo = targetProblems.length + 3;

  for (let i = 0; i < targetProblems.length; i++) {
    const prob = targetProblems[i];
    const isSuccess = Math.random() < solveProbability;
    const isEfficient = isSuccess && Math.random() < efficiencyProbability;
    const hintsUsed = !isSuccess ? Math.floor(Math.random() * 3) + 1 : (Math.random() < hintProbability ? 1 : 0);
    
    // Result code
    let result = -1.0;
    let status = 'Wrong Answer';
    if (isSuccess) {
      status = 'Accepted';
      result = isEfficient ? 1.0 : 0.5;
    } else if (Math.random() < 0.2) {
      status = 'Time Limit Exceeded';
    }

    const expectedTime = 600;
    const actualTime = Math.max(60, Math.round(avgSolveTime * (0.7 + Math.random() * 0.6)));
    const timePenalty = calculateTimePenalty(actualTime, expectedTime, 3.0);
    const delta = calculateDelta(result, hintsUsed, isEfficient, timePenalty);

    const prevScore = topicMasteryMap[prob.topicSlug] || 0.0;
    const newScore = Math.max(0.0, Math.min(100.0, Math.round((prevScore + delta) * 100) / 100));
    topicMasteryMap[prob.topicSlug] = newScore;

    const attemptTime = new Date();
    attemptTime.setDate(attemptTime.getDate() - daysAgo);
    daysAgo = Math.max(0, daysAgo - 1);

    // Create Attempt record
    const attempt = await Attempt.create({
      userId,
      problemSlug: prob.slug,
      topicSlug: prob.topicSlug,
      language: user.profile?.preferredLanguage || 'cpp',
      code: prob.solutionCode?.cpp || prob.solutionCode?.python || '// Solution implementation',
      status,
      result,
      runtimeMs: isSuccess ? Math.floor(Math.random() * 50) + 10 : 0,
      memoryKb: isSuccess ? Math.floor(Math.random() * 2000) + 8000 : 0,
      testCasesPassed: isSuccess ? prob.sampleTestCases.length + prob.hiddenTestCases.length : 1,
      totalTestCases: prob.sampleTestCases.length + prob.hiddenTestCases.length,
      timeTakenSeconds: actualTime,
      hintsUsedCount: hintsUsed,
      isEfficient,
      timePenalty,
      masteryDelta: delta,
      testCaseResults: prob.sampleTestCases.map((tc, idx) => ({
        testCaseIndex: idx + 1,
        passed: isSuccess,
        input: tc.input,
        expectedOutput: tc.output,
        actualOutput: isSuccess ? tc.output : 'null'
      })),
      complexityAnalysis: {
        complexity: prob.optimalTimeComplexity || 'O(N)',
        abstained: false,
        confidence: 0.95,
        explanation: `Optimal solution for ${prob.title} operates in ${prob.optimalTimeComplexity} asymptotic time.`
      },
      createdAt: attemptTime,
      updatedAt: attemptTime
    });

    // Update topic stats
    const stats = topicStats[prob.topicSlug];
    stats.attemptCount++;
    stats.totalTime += actualTime;
    if (isSuccess) {
      stats.solvedSlugs.add(prob.slug);
      if (prob.difficulty === 'Easy') stats.easyCount++;
      else if (prob.difficulty === 'Medium') stats.mediumCount++;
      else stats.hardCount++;
    }
    stats.history.push({
      score: newScore,
      change: delta,
      result,
      hintsUsed,
      isEfficient,
      timePenalty,
      attemptId: attempt._id,
      timestamp: attemptTime
    });

    // Schedule SM-2 Spaced Repetition if Accepted
    if (isSuccess) {
      const rep = tier === 'advanced' ? 3 : (tier === 'intermediate' ? 2 : 1);
      const interval = rep === 3 ? 17 : (rep === 2 ? 6 : 1);
      const ef = tier === 'advanced' ? 2.65 : 2.50;
      
      const dueDate = new Date(attemptTime);
      dueDate.setDate(dueDate.getDate() + interval);

      await RevisionSchedule.create({
        userId,
        problemSlug: prob.slug,
        topicSlug: prob.topicSlug,
        repetitionNumber: rep,
        easeFactor: ef,
        intervalDays: interval,
        dueDate,
        lastRevisedAt: attemptTime,
        status: dueDate <= new Date() ? 'pending' : 'completed',
        recallQualityHistory: [
          { quality: 4, revisedAt: attemptTime, timeTakenSeconds: actualTime }
        ]
      });
    }

    // Record HintSession if hints were used
    if (hintsUsed > 0 && prob.hints && prob.hints.length > 0) {
      const hintObj = prob.hints[0];
      await HintSession.create({
        userId,
        problemSlug: prob.slug,
        attemptId: attempt._id,
        level: 1,
        candidateHint: hintObj.hintText,
        leakageCheck: {
          isLeak: false,
          combinedSimilarity: 0.22,
          tokenSimilarity: 0.20,
          astSimilarity: 0.25,
          rawSimilarity: 0.18,
          tokenCount: 24,
          threshold: 0.80,
          isShortInput: false,
          usedFallback: false,
          explanation: 'Candidate hint provides conceptual guidance without code leakage.'
        },
        wasBlocked: false,
        deliveredHint: hintObj.hintText,
        requestedAt: attemptTime
      });
    }
  }

  // Add 1 synthetic blocked hint fixture for demo & leakage audit verification
  const demoProb = problemsSeed[0];
  await HintSession.create({
    userId,
    problemSlug: demoProb.slug,
    level: 5,
    candidateHint: demoProb.solutionCode?.cpp || 'int maxSubArray(vector<int>& nums) { ... }',
    leakageCheck: {
      isLeak: true,
      combinedSimilarity: 0.94,
      tokenSimilarity: 0.92,
      astSimilarity: 0.96,
      rawSimilarity: 0.95,
      tokenCount: 45,
      threshold: 0.80,
      isShortInput: false,
      usedFallback: false,
      explanation: 'Blocked: candidate hint exhibits 94% syntactic and token overlap with reference solution.'
    },
    wasBlocked: true,
    deliveredHint: '[Leakage Guard: Full reference solution withheld to protect pedagogical inquiry. Try breaking the problem into subproblems.]',
    requestedAt: new Date()
  });

  // Save MasteryScore and TopicMastery for each topic
  for (const t of topicsSeed) {
    const stats = topicStats[t.slug];
    const finalScore = topicMasteryMap[t.slug] || 0.0;
    const solvedCount = stats.solvedSlugs.size;
    const attemptCount = stats.attemptCount;
    const accuracy = attemptCount > 0 ? Math.round((solvedCount / attemptCount) * 100) : 0;
    const avgTime = attemptCount > 0 ? Math.round(stats.totalTime / attemptCount) : 0;

    await MasteryScore.create({
      userId,
      topicSlug: t.slug,
      masteryScore: finalScore,
      solvedCount,
      attemptCount,
      accuracyPercentage: accuracy,
      easyCount: stats.easyCount,
      mediumCount: stats.mediumCount,
      hardCount: stats.hardCount,
      avgSolveTimeSeconds: avgTime,
      lastCalculatedAt: new Date(),
      history: stats.history
    });

    await TopicMastery.create({
      userId,
      topicSlug: t.slug,
      masteryScore: finalScore,
      solvedCount,
      attemptCount,
      accuracyPercentage: accuracy,
      easyCount: stats.easyCount,
      mediumCount: stats.mediumCount,
      hardCount: stats.hardCount,
      avgSolveTimeSeconds: avgTime,
      assessmentInitialScore: tier === 'advanced' ? 90 : (tier === 'intermediate' ? 70 : 50),
      spacedRecallScore: 75,
      patternComprehensionScore: 65
    });
  }

  // Create AssessmentResult
  const overallDiagnosticScore = tier === 'advanced' ? 92 : (tier === 'intermediate' ? 74 : 58);
  const determinedLevel = tier === 'advanced' ? 'Advanced' : (tier === 'intermediate' ? 'Intermediate' : 'Beginner');

  await AssessmentResult.create({
    userId,
    overallScore: overallDiagnosticScore,
    determinedLevel,
    topicScores: topicMasteryMap,
    conceptScore: tier === 'advanced' ? 95 : (tier === 'intermediate' ? 78 : 60),
    codingScore: tier === 'advanced' ? 90 : (tier === 'intermediate' ? 72 : 55),
    complexityScore: tier === 'advanced' ? 92 : (tier === 'intermediate' ? 75 : 58),
    patternScore: tier === 'advanced' ? 91 : (tier === 'intermediate' ? 71 : 59),
    strengths: tier === 'advanced' ? ['Dynamic Programming', 'Graph Theory', 'Binary Search'] : ['Arrays', 'Two Pointers'],
    weaknesses: tier === 'beginner' ? ['Recursion', 'Binary Trees', 'Heaps'] : ['Advanced Graph Algorithms'],
    priorityTopicSlugs: tier === 'beginner' ? ['recursion', 'linked-lists', 'stacks'] : ['dynamic-programming', 'graphs'],
    aiSummary: `${user.name} demonstrated solid foundational competency across linear data structures with ${overallDiagnosticScore}% baseline diagnostic accuracy.`
  });

  // Generate Personalized Learning Roadmap via Weighted Kahn Sort
  const sequence = generateRoadmapSequence(topicMasteryMap);
  const phases = sequence.map((topicSlug, index) => {
    const topic = topicsSeed.find(t => t.slug === topicSlug) || { name: topicSlug, estimatedHours: 10 };
    const score = topicMasteryMap[topicSlug] || 0.0;
    const isCompleted = score >= 75;
    const isActive = !isCompleted && index === 0;

    return {
      phaseNumber: index + 1,
      title: topic.name || topicSlug,
      topicSlug,
      status: isCompleted ? 'completed' : (isActive ? 'active' : 'locked'),
      completionPercentage: isCompleted ? 100 : (score > 0 ? Math.round(score) : 0),
      masteryScore: score,
      estimatedHours: topic.estimatedHours || 10,
      problemSlugs: problemsSeed.filter(p => p.topicSlug === topicSlug).map(p => p.slug),
      completedProblemSlugs: Array.from(topicStats[topicSlug]?.solvedSlugs || []),
      prerequisitesMet: true
    };
  });

  await Roadmap.create({
    userId,
    sequence,
    phases,
    currentPhase: 1,
    overallCompletionPercentage: tier === 'advanced' ? 82 : (tier === 'intermediate' ? 52 : 22),
    lastGeneratedAt: new Date()
  });
}

module.exports = {
  calculateTimePenalty,
  calculateDelta,
  generateRoadmapSequence,
  generateUserActivity
};
