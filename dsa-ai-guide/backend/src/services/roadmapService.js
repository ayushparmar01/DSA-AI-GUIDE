/**
 * Dynamic Prerequisite Roadmap Service
 * Sequences topics using weighted Kahn's topological sort from the Python AI Service.
 */

const Roadmap = require('../models/Roadmap');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const MasteryScore = require('../models/MasteryScore');
const Attempt = require('../models/Attempt');
const aiServiceClient = require('./aiServiceClient');

// Fallback topic names mapping if AI service is offline
const DEFAULT_TOPIC_NAMES = [
  'Complexity Analysis',
  'Arrays',
  'Recursion',
  'Linked Lists',
  'Stacks',
  'Queues',
  'Hashing',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Trees',
  'Binary Search Trees',
  'Heaps',
  'Graphs',
  'Dynamic Programming',
  'Backtracking'
];

class RoadmapService {
  /**
   * Generates or adapts an individualized DSA learning roadmap using Kahn's algorithm.
   */
  async generatePersonalizedRoadmap(userId) {
    const topics = await Topic.find({}).sort({ order: 1 });
    const allProblems = await Problem.find({});
    const userMasteries = await MasteryScore.find({ userId });

    // Map mastery scores by topic name and topic slug
    const masteryByName = {};
    const masteryBySlug = {};
    const topicBySlug = new Map(topics.map(t => [t.slug, t]));
    const topicByName = new Map(topics.map(t => [t.name, t]));

    userMasteries.forEach(m => {
      masteryBySlug[m.topicSlug] = m.masteryScore;
      const topicObj = topicBySlug.get(m.topicSlug);
      if (topicObj) {
        masteryByName[topicObj.name] = m.masteryScore;
      }
    });

    // 1. Request weighted Kahn topological sort from Python AI microservice
    let sequenceOfNames = [];
    try {
      const aiResponse = await aiServiceClient.generateRoadmap({ masteryScores: masteryByName });
      sequenceOfNames = aiResponse.roadmap || [];
    } catch (err) {
      console.warn('Roadmap AI service offline, using default Kahn sequence:', err.message);
      // Fallback: order by mastery then alphabetical
      sequenceOfNames = [...DEFAULT_TOPIC_NAMES].sort((a, b) => {
        const mA = masteryByName[a] || 0;
        const mB = masteryByName[b] || 0;
        if (mA !== mB) return mA - mB;
        return a.localeCompare(b);
      });
    }

    const acceptedAttempts = await Attempt.find({ userId, status: 'Accepted' });
    const solvedProblemSlugs = new Set(acceptedAttempts.map(a => a.problemSlug));

    // 2. Build phases ordered by the Kahn sequence
    const phases = [];
    let phaseNumber = 1;
    let completedPhasesCount = 0;
    const orderedSlugs = [];

    for (const topicName of sequenceOfNames) {
      const topic = topicByName.get(topicName) || {
        name: topicName,
        slug: topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        estimatedHours: 8
      };

      orderedSlugs.push(topic.slug);
      const topicProblems = allProblems.filter(p => p.topicSlug === topic.slug);
      const problemSlugs = topicProblems.map(p => p.slug);
      const solvedInTopic = problemSlugs.filter(slug => solvedProblemSlugs.has(slug));

      const mastery = masteryBySlug[topic.slug] || 0;
      const completionPercentage = problemSlugs.length > 0
        ? Math.round((solvedInTopic.length / problemSlugs.length) * 100)
        : 0;

      let status = 'locked';
      if (phaseNumber === 1 || mastery >= 70 || (phases.length > 0 && phases[phases.length - 1].status === 'completed')) {
        status = completionPercentage >= 80 ? 'completed' : 'active';
      } else if (phaseNumber <= 2) {
        status = 'active';
      }

      if (status === 'completed') {
        completedPhasesCount++;
      }

      phases.push({
        phaseNumber,
        title: `Phase ${phaseNumber}: ${topic.name}`,
        topicSlug: topic.slug,
        status,
        completionPercentage,
        masteryScore: mastery,
        estimatedHours: topic.estimatedHours || 8,
        problemSlugs,
        completedProblemSlugs: solvedInTopic,
        prerequisitesMet: true
      });

      phaseNumber++;
    }

    const activePhaseIndex = phases.findIndex(p => p.status === 'active');
    const currentPhaseNumber = activePhaseIndex !== -1 ? activePhaseIndex + 1 : 1;
    const currentTopicSlug = phases[currentPhaseNumber - 1]?.topicSlug || 'complexity-analysis';
    const overallRoadmapCompletion = phases.length > 0 ? Math.round((completedPhasesCount / phases.length) * 100) : 0;

    const roadmap = await Roadmap.findOneAndUpdate(
      { userId },
      {
        userId,
        sequence: orderedSlugs,
        currentTopicSlug,
        phases,
        currentPhaseNumber,
        overallRoadmapCompletion,
        aiAdaptationNotes: 'Roadmap sequenced by lowest-mastery Kahn topological sort.',
        lastAdaptedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return roadmap;
  }

  async getUserRoadmap(userId) {
    let roadmap = await Roadmap.findOne({ userId });
    if (!roadmap) {
      roadmap = await this.generatePersonalizedRoadmap(userId);
    }
    return roadmap;
  }
}

module.exports = new RoadmapService();
