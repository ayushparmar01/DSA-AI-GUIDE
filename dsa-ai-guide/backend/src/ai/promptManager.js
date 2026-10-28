const aiProvider = require('./aiProvider');
const { buildAssessmentAnalysisPrompt } = require('./prompts/assessmentAnalysisPrompt');
const { buildCodeReviewPrompt } = require('./prompts/codeReviewPrompt');
const { buildProgressiveHintPrompt } = require('./prompts/progressiveHintPrompt');
const { buildSocraticMentorPrompt } = require('./prompts/socraticMentorPrompt');
const { buildMockInterviewPrompt } = require('./prompts/mockInterviewPrompt');
const { buildWeaknessDetectionPrompt } = require('./prompts/weaknessDetectionPrompt');
const { buildWeeklyReportPrompt } = require('./prompts/weeklyReportPrompt');

/**
 * Centralized AI Prompt Orchestrator.
 */
class PromptManager {
  async analyzeAssessment(data) {
    const { systemPrompt, userPrompt } = buildAssessmentAnalysisPrompt(data);
    return aiProvider.generateCompletion(systemPrompt, userPrompt, { jsonResponse: true });
  }

  async reviewCode(data) {
    const { systemPrompt, userPrompt } = buildCodeReviewPrompt(data);
    return aiProvider.generateCompletion(systemPrompt, userPrompt, { jsonResponse: true });
  }

  async getProgressiveHint(data) {
    const { systemPrompt, userPrompt } = buildProgressiveHintPrompt(data);
    return aiProvider.generateCompletion(systemPrompt, userPrompt, { jsonResponse: false });
  }

  async chatWithMentor(data) {
    const { systemPrompt, userPrompt } = buildSocraticMentorPrompt(data);
    return aiProvider.generateCompletion(systemPrompt, userPrompt, { jsonResponse: false });
  }

  async handleMockInterview(data) {
    const { systemPrompt, userPrompt } = buildMockInterviewPrompt(data);
    return aiProvider.generateCompletion(systemPrompt, userPrompt, { jsonResponse: true });
  }

  async detectWeakness(data) {
    const { systemPrompt, userPrompt } = buildWeaknessDetectionPrompt(data);
    return aiProvider.generateCompletion(systemPrompt, userPrompt, { jsonResponse: true });
  }

  async generateWeeklyReport(data) {
    const { systemPrompt, userPrompt } = buildWeeklyReportPrompt(data);
    return aiProvider.generateCompletion(systemPrompt, userPrompt, { jsonResponse: true });
  }
}

module.exports = new PromptManager();
