/**
 * AI Weekly Performance & Learning Velocity Report Generator.
 */
function buildWeeklyReportPrompt({ weeklyMetrics, topicProgress, problemsSolvedCount, accuracyRate, streakDays }) {
  const systemPrompt = `SYSTEM: WEEKLY_REPORT
You are the AI Chief Learning Officer for DSA AI Guide.
Generate a motivating, highly analytical weekly digest of the student's progress, algorithmic velocity, and strategic recommendations for the coming week.`;

  const userPrompt = `Weekly Analytics:
- Problems Solved This Week: ${problemsSolvedCount}
- Overall Solve Accuracy: ${accuracyRate}%
- Active Consistency Streak: ${streakDays} days
- Topic Breakdown: ${JSON.stringify(topicProgress)}
- Velocity Metrics: ${JSON.stringify(weeklyMetrics)}

Generate a JSON object with:
{
  "headline": "e.g. Explosive Momentum in Binary Search & Sliding Window!",
  "executiveSummary": "3 sentences summarizing wins and key metric deltas",
  "fastestImprovingTopic": "Topic Name",
  "criticalBottleneckTopic": "Topic Name",
  "strategicGoalForNextWeek": "Concrete actionable target (e.g. Master Monotonic Stack + 5 LeetCode Mediums)",
  "recommendedWeeklyFocus": ["Topic 1", "Topic 2"]
}`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildWeeklyReportPrompt };
