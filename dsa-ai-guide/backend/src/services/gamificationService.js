const User = require('../models/User');
const { Achievement, UserAchievement } = require('../models/Achievement');

class GamificationService {
  /**
   * Awards XP to a user and recalculates rank level.
   */
  async awardXP(userId, amount) {
    const user = await User.findById(userId);
    if (!user) return null;

    user.xp = (user.xp || 0) + amount;
    user.level = user.calculateLevel();
    await user.save();

    return { xp: user.xp, level: user.level, awarded: amount };
  }

  /**
   * Checks and awards achievements for a user based on conditions.
   */
  async checkAchievements(userId) {
    const user = await User.findById(userId);
    if (!user) return [];

    const existingUnlocked = await UserAchievement.find({ userId });
    const unlockedSlugs = new Set(existingUnlocked.map(u => u.achievementSlug));

    const allAchievements = await Achievement.find({});
    const newlyUnlocked = [];

    for (const ach of allAchievements) {
      if (unlockedSlugs.has(ach.slug)) continue;

      let isEligible = false;
      if (ach.conditionType === 'xp_earned' && user.xp >= ach.threshold) {
        isEligible = true;
      } else if (ach.conditionType === 'streak_days' && user.streakCurrent >= ach.threshold) {
        isEligible = true;
      }

      if (isEligible) {
        await UserAchievement.create({
          userId,
          achievementSlug: ach.slug
        });
        await this.awardXP(userId, ach.xpReward);
        newlyUnlocked.push(ach);
      }
    }

    return newlyUnlocked;
  }

  async getUserAchievements(userId) {
    const unlocked = await UserAchievement.find({ userId });
    const unlockedSlugs = new Set(unlocked.map(u => u.achievementSlug));
    const all = await Achievement.find({});

    return all.map(ach => ({
      ...ach.toObject(),
      isUnlocked: unlockedSlugs.has(ach.slug),
      unlockedAt: unlocked.find(u => u.achievementSlug === ach.slug)?.unlockedAt || null
    }));
  }
}

module.exports = new GamificationService();
