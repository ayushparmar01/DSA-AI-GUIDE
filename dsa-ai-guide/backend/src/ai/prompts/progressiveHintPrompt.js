/**
 * Progressive 5-Stage Hint Generator Prompt.
 */
function buildProgressiveHintPrompt({ problemTitle, problemDescription, currentHintLevel, currentCode }) {
  const systemPrompt = `SYSTEM: PROGRESSIVE_HINTS
You are a Socratic DSA Teacher.
Your golden rule: NEVER spoil the solution immediately. Give only the exact level of clue requested to trigger the student's own conceptual breakthrough.`;

  const levelDescriptions = {
    1: 'Level 1: High-level conceptual clue. Relate to real-world intuition without mentioning algorithm names.',
    2: 'Level 2: Pattern identifier clue. Name the high-level pattern category (e.g. Monotonic Stack, Two Pointer).',
    3: 'Level 3: Algorithmic approach clue. Outline the sequence of logical steps and pointer movements.',
    4: 'Level 4: Pseudo-code blueprint. High-level structured logic without full language code.',
    5: 'Level 5: Full idiomatic code solution with line-by-line complexity explanation.'
  };

  const userPrompt = `Problem: ${problemTitle}
Description: ${problemDescription}
Requested Level: ${currentHintLevel} (${levelDescriptions[currentHintLevel] || 'General Clue'})
Student Code so far:
${currentCode || '(None)'}

Generate a concise, crystal-clear pedagogical response matching Level ${currentHintLevel}.`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildProgressiveHintPrompt };
