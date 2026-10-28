/**
 * SuperMemo SM-2 Spaced Repetition Algorithm Implementation.
 * 
 * Computes next repetition interval, updated ease factor, and due date based on recall quality.
 * 
 * Quality Rating (q):
 * 5 - Perfect recall, optimal solve, no hints
 * 4 - Correct solution after slight hesitation or 1 minor hint
 * 3 - Correct solution with significant effort or multiple hints
 * 2 - Incorrect solution, but remember concept when shown
 * 1 - Incorrect solution, vague familiarity
 * 0 - Complete blackout / forgot pattern entirely
 */

/**
 * Calculates updated SM-2 parameters after a revision session.
 * 
 * @param {Object} params
 * @param {number} params.repetitionNumber - Current repetition count (n)
 * @param {number} params.easeFactor - Current ease factor (EF, initial 2.5)
 * @param {number} params.previousIntervalDays - Last interval in days (I)
 * @param {number} params.quality - Performance rating (0 to 5)
 * @returns {Object} Updated { repetitionNumber, easeFactor, intervalDays, nextDueDate }
 */
function calculateSM2NextSchedule({
  repetitionNumber = 0,
  easeFactor = 2.5,
  previousIntervalDays = 1,
  quality = 4
}) {
  const q = Math.min(5, Math.max(0, Math.round(quality)));

  let newRepetition = repetitionNumber;
  let newEaseFactor = easeFactor;
  let newIntervalDays = 1;

  if (q >= 3) {
    // Correct recall
    if (repetitionNumber === 0) {
      newIntervalDays = 1;
      newRepetition = 1;
    } else if (repetitionNumber === 1) {
      newIntervalDays = 3;
      newRepetition = 2;
    } else if (repetitionNumber === 2) {
      newIntervalDays = 7;
      newRepetition = 3;
    } else {
      newIntervalDays = Math.round(previousIntervalDays * easeFactor);
      newRepetition = repetitionNumber + 1;
    }

    // Update Ease Factor (EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))
    newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (newEaseFactor < 1.3) {
      newEaseFactor = 1.3;
    }
  } else {
    // Failed recall: reset repetition chain
    newRepetition = 0;
    newIntervalDays = 1; // Revise again tomorrow
    newEaseFactor = Math.max(1.3, easeFactor - 0.2);
  }

  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + newIntervalDays);

  return {
    repetitionNumber: newRepetition,
    easeFactor: Number(newEaseFactor.toFixed(2)),
    intervalDays: newIntervalDays,
    dueDate: nextDueDate
  };
}

module.exports = {
  calculateSM2NextSchedule
};
