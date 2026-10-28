/**
 * Python AI Microservice HTTP Client
 * Bridges the Node.js Express backend with the Python FastAPI AI service.
 * Connects to: http://localhost:8000/api/v1
 */

class AIServiceClient {
  constructor(options = {}) {
    this.baseUrl = (options.baseUrl || process.env.AI_SERVICE_URL || 'http://localhost:8000').replace(/\/+$/, '');
    this.timeoutMs = parseInt(options.timeoutMs || process.env.AI_SERVICE_TIMEOUT_MS || '5000', 10);
    this.fetchClient = options.fetchClient || global.fetch;
  }

  async _request(endpoint, payload) {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchClient(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI service responded with HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error(`AI microservice request to '${endpoint}' timed out after ${this.timeoutMs}ms`);
      }
      throw new Error(`Failed to communicate with AI microservice at ${url}: ${err.message}`);
    }
  }

  /**
   * Evaluates deterministic mastery update via Equation (1).
   */
  async calculateMastery({
    currentMastery,
    result,
    hintsUsed = 0,
    isEfficient = 1,
    actualTime = 0,
    expectedTime = 100,
    gatedEfficiency = false
  }) {
    return this._request('/mastery/calculate', {
      current_mastery: currentMastery,
      result,
      hints_used: hintsUsed,
      is_efficient: isEfficient,
      actual_time: actualTime,
      expected_time: expectedTime,
      gated_efficiency: gatedEfficiency
    });
  }

  /**
   * Generates dynamic roadmap via weighted Kahn topological sorting.
   */
  async generateRoadmap({ masteryScores = {}, customGraph = null } = {}) {
    return this._request('/roadmap/generate', {
      mastery_scores: masteryScores,
      custom_graph: customGraph
    });
  }

  /**
   * Validates DAG for cycles, self-loops, and unknown prerequisites.
   */
  async validateDAG(graph) {
    return this._request('/roadmap/validate', { graph });
  }

  /**
   * Calculates next SM-2 spaced repetition schedule.
   */
  async calculateSM2Schedule({
    quality,
    repetitions = 0,
    intervalDays = 1,
    easeFactor = 2.5,
    updateEfOnFailure = false,
    efBeforeInterval = false
  }) {
    return this._request('/sm2/next-schedule', {
      quality,
      repetitions,
      interval_days: intervalDays,
      ease_factor: easeFactor,
      update_ef_on_failure: updateEfOnFailure,
      ef_before_interval: efBeforeInterval
    });
  }

  /**
   * Evaluates candidate hint for syntactic solution leakage at tau = 0.80.
   */
  async checkLeakage({
    candidateHint,
    referenceSolution,
    threshold = 0.80,
    minTokens = 12
  }) {
    return this._request('/leakage/check', {
      candidate_hint: candidateHint,
      reference_solution: referenceSolution,
      threshold,
      min_tokens: minTokens
    });
  }

  /**
   * Analyzes code AST to estimate time complexity with explicit abstention.
   */
  async estimateComplexity({
    code,
    version = 'v1',
    abstainOnHiddenCosts = true
  }) {
    return this._request('/complexity/estimate', {
      code,
      version,
      abstain_on_hidden_costs: abstainOnHiddenCosts
    });
  }

  /**
   * Obtains P(Solve Success) prediction via model loader or cold-start fallback.
   */
  async predictSolveProbability(telemetry) {
    return this._request('/predict/solve-probability', {
      user_overall_score: telemetry.userOverallScore,
      topic_mastery: telemetry.topicMastery,
      problem_difficulty: telemetry.problemDifficulty,
      past_attempts: telemetry.pastAttempts || 0,
      avg_solve_time_sec: telemetry.avgSolveTimeSec,
      hint_count: telemetry.hintCount || 0,
      pattern_familiarity: telemetry.patternFamiliarity || 0.5,
      days_since_last_practice: telemetry.daysSinceLastPractice || 0.0
    });
  }
}

module.exports = new AIServiceClient();
module.exports.AIServiceClient = AIServiceClient;
