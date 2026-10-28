/**
 * SuperMemo SM-2 Spaced Repetition Service
 * Uses the canonical SM-2 algorithm from the Python AI Service.
 */

const RevisionSchedule = require('../models/RevisionSchedule');
const Problem = require('../models/Problem');
const LearningEvent = require('../models/LearningEvent');
const aiServiceClient = require('./aiServiceClient');

class SpacedRepetitionService {
  /**
   * Schedules initial 1-day revision for a problem upon first accepted solve.
   */
  async scheduleInitialRevision(userId, problemSlug, topicSlug) {
    const existing = await RevisionSchedule.findOne({ userId, problemSlug });
    if (!existing) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1); // 1-day initial review

      await RevisionSchedule.create({
        userId,
        problemSlug,
        topicSlug,
        repetitionNumber: 1,
        easeFactor: 2.5,
        intervalDays: 1,
        dueDate,
        lastRevisedAt: new Date(),
        status: 'pending'
      });
    }
  }

  /**
   * Records a completed revision and calculates next interval via SM-2.
   */
  async recordRevisionResult(userId, problemSlug, { quality = 4, timeTakenSeconds = 300 }) {
    let schedule = await RevisionSchedule.findOne({ userId, problemSlug });
    if (!schedule) {
      const problem = await Problem.findOne({ slug: problemSlug });
      schedule = await RevisionSchedule.create({
        userId,
        problemSlug,
        topicSlug: problem?.topicSlug || 'arrays',
        repetitionNumber: 0,
        easeFactor: 2.5,
        intervalDays: 1,
        dueDate: new Date()
      });
    }

    const q = Math.min(5, Math.max(0, parseInt(quality, 10)));
    let nextRepetitions = schedule.repetitionNumber;
    let nextIntervalDays = 1;
    let nextEaseFactor = schedule.easeFactor;

    try {
      const sm2Res = await aiServiceClient.calculateSM2Schedule({
        quality: q,
        repetitions: schedule.repetitionNumber,
        intervalDays: schedule.intervalDays,
        easeFactor: schedule.easeFactor
      });
      nextRepetitions = sm2Res.repetitions;
      nextIntervalDays = sm2Res.interval_days;
      nextEaseFactor = sm2Res.ease_factor;
    } catch (err) {
      console.warn('SM-2 AI service offline, using standard SM-2 equation:', err.message);
      // Canonical SM-2 fallback calculation:
      if (q >= 3) {
        if (schedule.repetitionNumber === 0) {
          nextIntervalDays = 1;
          nextRepetitions = 1;
        } else if (schedule.repetitionNumber === 1) {
          nextIntervalDays = 6;
          nextRepetitions = 2;
        } else {
          nextIntervalDays = Math.ceil(schedule.intervalDays * schedule.easeFactor);
          nextRepetitions = schedule.repetitionNumber + 1;
        }
        const deltaEF = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
        nextEaseFactor = Math.max(1.3, schedule.easeFactor + deltaEF);
      } else {
        nextRepetitions = 0;
        nextIntervalDays = 1;
      }
    }

    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + nextIntervalDays);

    schedule.repetitionNumber = nextRepetitions;
    schedule.easeFactor = Math.round(nextEaseFactor * 100) / 100;
    schedule.intervalDays = nextIntervalDays;
    schedule.dueDate = nextDueDate;
    schedule.lastRevisedAt = new Date();
    schedule.status = 'pending';
    schedule.recallQualityHistory.push({
      quality: q,
      revisedAt: new Date(),
      timeTakenSeconds,
      intervalDays: nextIntervalDays,
      easeFactor: nextEaseFactor
    });

    await schedule.save();

    await LearningEvent.create({
      userId,
      eventType: 'revision_completed',
      metadata: { problemSlug, quality: q, nextIntervalDays }
    });

    return schedule;
  }

  /**
   * Retrieves all problems due for revision today.
   */
  async getDueRevisions(userId) {
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const schedules = await RevisionSchedule.find({
      userId,
      dueDate: { $lte: todayEnd }
    }).sort({ dueDate: 1 });

    const problemSlugs = schedules.map(s => s.problemSlug);
    const problems = await Problem.find({ slug: { $in: problemSlugs } });
    const problemMap = new Map(problems.map(p => [p.slug, p]));

    return schedules.map(s => ({
      schedule: s,
      problem: problemMap.get(s.problemSlug) || { title: s.problemSlug, slug: s.problemSlug }
    }));
  }
}

module.exports = new SpacedRepetitionService();
