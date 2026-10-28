const { calculateSM2NextSchedule } = require('../src/algorithms/sm2Algorithm');

describe('SuperMemo SM-2 Spaced Repetition Algorithm Tests', () => {
  test('should schedule interval 1 for initial successful revision (q=4)', () => {
    const next = calculateSM2NextSchedule({
      repetitionNumber: 0,
      easeFactor: 2.5,
      previousIntervalDays: 1,
      quality: 4
    });

    expect(next.repetitionNumber).toBe(1);
    expect(next.intervalDays).toBe(1);
    expect(next.easeFactor).toBeGreaterThanOrEqual(2.5);
  });

  test('should schedule interval 3 for 2nd successful revision (q=5)', () => {
    const next = calculateSM2NextSchedule({
      repetitionNumber: 1,
      easeFactor: 2.5,
      previousIntervalDays: 1,
      quality: 5
    });

    expect(next.repetitionNumber).toBe(2);
    expect(next.intervalDays).toBe(3);
    expect(next.easeFactor).toBe(2.6); // 2.5 + 0.1
  });

  test('should reset repetition number to 0 on recall failure (q=1)', () => {
    const next = calculateSM2NextSchedule({
      repetitionNumber: 4,
      easeFactor: 2.4,
      previousIntervalDays: 14,
      quality: 1
    });

    expect(next.repetitionNumber).toBe(0);
    expect(next.intervalDays).toBe(1);
    expect(next.easeFactor).toBe(2.2);
  });
});
