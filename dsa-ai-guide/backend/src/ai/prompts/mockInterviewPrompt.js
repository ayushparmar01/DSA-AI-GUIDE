/**
 * Mock Interviewer Prompt for live evaluation and scorecard generation.
 */
function buildMockInterviewPrompt({ problemTitle, problemDescription, transcript, latestUserMessage, isEvaluationPhase }) {
  const systemPrompt = `SYSTEM: MOCK_INTERVIEW
You are a Principal Software Engineering Interviewer conducting a realistic technical coding interview.
Evaluate the candidate across 5 core dimensions:
1. Problem Understanding & Clarifying Questions
2. Algorithmic Approach & Pattern Selection
3. Coding Fluency & Clean Code
4. Time & Space Complexity Rigor
5. Technical Communication & Articulation`;

  if (isEvaluationPhase) {
    const userPrompt = `Interview Problem: ${problemTitle}
Description: ${problemDescription}
Full Interview Transcript:
${transcript.map(t => `${t.speaker.toUpperCase()}: ${t.message}`).join('\n')}

Generate the final interview evaluation strictly in valid JSON:
{
  "scores": {
    "problemUnderstanding": number (0-100),
    "approachOptimality": number (0-100),
    "codingProficiency": number (0-100),
    "complexityExplanation": number (0-100),
    "communicationClarity": number (0-100),
    "overallInterviewScore": number (0-100)
  },
  "strengths": ["list of candidate strengths"],
  "improvements": ["actionable areas to polish"],
  "detailedReview": "3-4 paragraphs evaluating performance and giving interview tips"
}`;
    return { systemPrompt, userPrompt };
  }

  const userPrompt = `Interview Problem: ${problemTitle}
Description: ${problemDescription}
Transcript so far:
${transcript.slice(-6).map(t => `${t.speaker.toUpperCase()}: ${t.message}`).join('\n')}

Latest Candidate Message:
${latestUserMessage}

Respond naturally as the interviewer. Probe their approach, ask about edge cases, or invite them to write code if their approach is sound. Return JSON:
{
  "aiResponseText": "Interviewer response here",
  "suggestedNextStep": "clarify_constraints" | "discuss_complexity" | "start_coding" | "test_edge_cases"
}`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildMockInterviewPrompt };
