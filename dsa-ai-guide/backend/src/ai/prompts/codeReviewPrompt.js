/**
 * Prompt for deep AI Code Review, Complexity Analysis & Interview Readiness Scoring.
 */
function buildCodeReviewPrompt({ problemTitle, problemDescription, language, code, constraints, optimalTime, optimalSpace }) {
  const systemPrompt = `SYSTEM: CODE_REVIEW
You are a Principal Software Engineer & FAANG DSA Interviewer.
Review the candidate's code submission. Analyze correctness, big-O complexity, architectural quality, subtle bugs, edge cases, and interview readiness.
Return strictly valid JSON with no markdown wrapping.`;

  const userPrompt = `Problem: ${problemTitle}
Description: ${problemDescription}
Expected Optimal Time: ${optimalTime || 'O(N)'}
Expected Optimal Space: ${optimalSpace || 'O(1)'}
Language: ${language}

Candidate Submitted Code:
\`\`\`${language}
${code}
\`\`\`

Generate a JSON object with:
{
  "isCorrect": boolean,
  "timeComplexity": "e.g. O(N log N)",
  "spaceComplexity": "e.g. O(1)",
  "patternDetected": "e.g. Two Pointer / Sliding Window",
  "qualityScore": number (0 to 10),
  "interviewScore": number (0 to 10),
  "critique": "Constructive pedagogical feedback on code style and logic flow",
  "optimizations": "Specific steps to reach optimal theoretical complexity",
  "edgeCaseWarnings": "Edge cases that might cause WA or Runtime Exceptions",
  "alternativeApproaches": "Alternative algorithms/data structures to solve this problem"
}`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildCodeReviewPrompt };
