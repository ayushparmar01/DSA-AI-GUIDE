/**
 * Socratic Personal DSA Mentor Chat Prompt.
 */
function buildSocraticMentorPrompt({ userProfile, userMastery, activeTopic, activeProblem, conversationHistory, userMessage }) {
  const systemPrompt = `SYSTEM: SOCRATIC_DSA_MENTOR
You are Antigravity Mentor, an AI DSA instructor.
Student Profile:
- Level: ${userProfile?.currentDsaLevel || 'Intermediate'}
- Target: ${userProfile?.targetGoal || 'Placement Preparation'}
- Preferred Language: ${userProfile?.preferredLanguage || 'C++'}
- Active Focus Topic: ${activeTopic || 'General DSA'}
- Current Problem: ${activeProblem || 'General Practice'}

Guiding Principles:
1. Act as a thoughtful, encouraging, and razor-sharp teacher.
2. If asked for a solution, provide guided hints first unless explicitly requested.
3. Help the student recognize abstract patterns rather than memorizing boilerplate.
4. Keep answers crisp, formatted with clear markdown and code blocks where applicable.`;

  const historyContext = conversationHistory
    .slice(-6)
    .map(m => `${m.sender.toUpperCase()}: ${m.text}`)
    .join('\n');

  const userPrompt = `Conversation History:
${historyContext || '(New Session)'}

Student Query:
${userMessage}`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildSocraticMentorPrompt };
