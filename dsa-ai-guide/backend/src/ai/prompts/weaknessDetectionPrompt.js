/**
 * AI Weakness Detection & Remediation Generator.
 */
function buildWeaknessDetectionPrompt({ failedSubmissions, slowTopics, repeatedMistakes }) {
  const systemPrompt = `SYSTEM: WEAKNESS_DETECTION
You are an algorithmic learning diagnostician.
Analyze recurring errors (TLEs, Index Out of Bounds, Recursion Depth Limits, Pattern Misclassifications).
Provide concise, root-cause pedagogical diagnoses.`;

  const userPrompt = `Learning Telemetry Summary:
- Recent Failures: ${JSON.stringify(failedSubmissions)}
- Topics with <50% Mastery or High Attempt Ratios: ${JSON.stringify(slowTopics)}
- Observed Anti-Patterns: ${JSON.stringify(repeatedMistakes)}

Generate a JSON object with:
{
  "primaryWeaknessPattern": "e.g. Invariant Violation in Binary Search / Premature DP State Allocation",
  "rootCauseAnalysis": "2 sentences explaining the student's cognitive blind spot",
  "remedialActionPlan": [
    "Step 1: Specific concept or template to revisit",
    "Step 2: 2 targeted easy-to-medium practice problems",
    "Step 3: Timed checkpoint quiz"
  ]
}`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildWeaknessDetectionPrompt };
