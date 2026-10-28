/**
 * Prompt for synthesizing deep student skill profile from diagnostic assessment.
 */
function buildAssessmentAnalysisPrompt({ scores, topicScores, answeredCount, totalQuestions, userProfile }) {
  const systemPrompt = `SYSTEM: ASSESSMENT_ANALYSIS
You are an expert Senior DSA Architect & EdTech Pedagogy Mentor.
Your role is to evaluate diagnostic test responses and construct an accurate, personalized skill profile.
Always return response strictly formatted as a valid JSON object matching the requested schema.`;

  const userPrompt = `Diagnostic Assessment Data:
- Overall Score: ${scores.overallScore}/100
- Concept Score: ${scores.conceptScore}/100
- Coding Score: ${scores.codingScore}/100
- Complexity Score: ${scores.complexityScore}/100
- Pattern Score: ${scores.patternScore}/100
- Target Goal: ${userProfile.targetGoal || 'Placement Preparation'}
- Preferred Language: ${userProfile.preferredLanguage || 'C++'}
- Topic Breakdown: ${JSON.stringify(topicScores)}

Generate a JSON object with:
{
  "determinedLevel": "Beginner" | "Early Intermediate" | "Intermediate" | "Advanced" | "Expert",
  "strengths": ["Top 3-4 strong topics/patterns"],
  "weaknesses": ["Top 3-4 weak topics/patterns requiring urgent focus"],
  "priorityTopicSlugs": ["slug1", "slug2", "slug3", "slug4"],
  "aiSummary": "2-3 concise sentences analyzing the student's cognitive model and algorithmic baseline.",
  "aiRecommendationRationale": "Clear explanation of why the next recommended topic was chosen.",
  "estimatedCompletionWeeks": number (e.g. 8 - 16)
}`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildAssessmentAnalysisPrompt };
