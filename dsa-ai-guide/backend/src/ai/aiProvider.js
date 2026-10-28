const config = require('../config/env');

/**
 * Universal AI Multi-Provider Interface.
 * Supports:
 * - 'gemini' (Google Gemini 1.5 Flash / Pro)
 * - 'openai' (OpenAI GPT-4o / GPT-3.5-turbo)
 * - 'mock' (Deterministic intelligent offline pedagogical engine)
 */
class AIProvider {
  constructor() {
    this.provider = config.ai.provider || 'mock';
    this.apiKey = config.ai.apiKey;
    this.model = config.ai.model || 'gemini-1.5-flash';
  }

  /**
   * Generates a text response from the configured LLM provider.
   * 
   * @param {string} systemPrompt - System instruction
   * @param {string} userPrompt - User prompt / question
   * @param {Object} options - Temperature, jsonResponse boolean, etc.
   * @returns {Promise<string|Object>}
   */
  async generateCompletion(systemPrompt, userPrompt, options = {}) {
    // If provider is 'mock' or API key is not configured, use offline mock provider
    if (this.provider === 'mock' || !this.apiKey) {
      return this._mockGenerate(systemPrompt, userPrompt, options);
    }

    try {
      if (this.provider === 'gemini') {
        return await this._callGeminiAPI(systemPrompt, userPrompt, options);
      } else if (this.provider === 'openai') {
        return await this._callOpenAIAPI(systemPrompt, userPrompt, options);
      } else {
        return this._mockGenerate(systemPrompt, userPrompt, options);
      }
    } catch (error) {
      console.warn(`[AI Provider Error] ${this.provider} call failed (${error.message}). Falling back to offline pedagogical response.`);
      return this._mockGenerate(systemPrompt, userPrompt, options);
    }
  }

  async _callGeminiAPI(systemPrompt, userPrompt, options) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nTask:\n${userPrompt}` }]
        }
      ],
      generationConfig: {
        temperature: options.temperature || 0.3,
        maxOutputTokens: options.maxTokens || 1500,
        responseMimeType: options.jsonResponse ? 'application/json' : 'text/plain'
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Gemini API HTTP ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (options.jsonResponse) {
      try {
        const cleanJson = candidateText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleanJson);
      } catch (parseErr) {
        return { rawText: candidateText };
      }
    }

    return candidateText;
  }

  async _callOpenAIAPI(systemPrompt, userPrompt, options) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const payload = {
      model: this.model.includes('gemini') ? 'gpt-3.5-turbo' : this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: options.temperature || 0.3,
      max_tokens: options.maxTokens || 1500
    };

    if (options.jsonResponse) {
      payload.response_format = { type: 'json_object' };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`OpenAI API HTTP ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';

    if (options.jsonResponse) {
      try {
        return JSON.parse(content);
      } catch (parseErr) {
        return { rawText: content };
      }
    }

    return content;
  }

  /**
   * High-fidelity simulated pedagogical AI response engine for development & offline environments.
   */
  _mockGenerate(systemPrompt, userPrompt, options) {
    const isJson = options.jsonResponse || false;

    // Code Review Request
    if (systemPrompt.includes('CODE_REVIEW') || userPrompt.includes('Code Review')) {
      const isEfficient = userPrompt.includes('for') && !userPrompt.includes('for (let j');
      const mockReview = {
        isCorrect: true,
        timeComplexity: isEfficient ? 'O(N)' : 'O(N^2)',
        spaceComplexity: 'O(1)',
        patternDetected: userPrompt.includes('left') && userPrompt.includes('right') ? 'Two Pointer' : 'Sliding Window',
        qualityScore: 8.5,
        interviewScore: 8.2,
        critique: 'Clean and structured algorithmic approach. Variable naming adheres to standard clean-code practices.',
        optimizations: isEfficient
          ? 'Solution already operates in optimal linear time. Consider adding edge-case validations for empty arrays.'
          : 'Nested iteration results in quadratic O(N^2) complexity. You can optimize this to O(N) using a Hash Map or Two-Pointer technique.',
        edgeCaseWarnings: 'Ensure bounds checking for null inputs and single-element inputs.',
        alternativeApproaches: 'Consider in-place two-pointer traversal to guarantee O(1) auxiliary space.'
      };
      return isJson ? mockReview : JSON.stringify(mockReview, null, 2);
    }

    // Assessment Analysis Request
    if (systemPrompt.includes('ASSESSMENT_ANALYSIS') || userPrompt.includes('Diagnostic Assessment')) {
      const mockAssessment = {
        determinedLevel: 'Early Intermediate',
        strengths: ['Arrays', 'Strings', 'Basic Hashing', 'Two Pointers'],
        weaknesses: ['Dynamic Programming', 'Graphs', 'Backtracking'],
        priorityTopicSlugs: ['binary-search', 'linked-list', 'trees', 'dynamic-programming'],
        aiSummary: 'You have solid fundamentals in linear array operations and hash lookup, but encounter cognitive overhead in non-linear data structures (Trees/Graphs) and recursive optimal substructure formulation.',
        aiRecommendationRationale: 'We recommend advancing next through Binary Search pattern mastering to bridge linear logic toward divide-and-conquer before tackling Tree traversals.',
        estimatedCompletionWeeks: 10
      };
      return isJson ? mockAssessment : JSON.stringify(mockAssessment, null, 2);
    }

    // Progressive Hint Request
    if (systemPrompt.includes('PROGRESSIVE_HINTS') || userPrompt.includes('Hint')) {
      const mockHints = {
        level1: 'Focus on the sorted invariant of the input. Can we eliminate half the search space in each iteration?',
        level2: 'This problem maps to the Binary Search on Answer Space pattern.',
        level3: 'Initialize left = 0 and right = n - 1. Calculate mid = left + (right - left) / 2 to prevent integer overflow.',
        level4: 'While left <= right: if arr[mid] == target return mid; if arr[mid] < target left = mid + 1; else right = mid - 1;',
        level5: 'Full solution: In binary search, maintain invariant range [left, right] to achieve O(log N) time and O(1) space.'
      };
      return isJson ? mockHints : JSON.stringify(mockHints, null, 2);
    }

    // Mock Interview Response
    if (systemPrompt.includes('MOCK_INTERVIEW')) {
      const mockInterview = {
        feedback: 'Good problem formulation and edge case consideration. Your explanation of the two-pointer invariant was clear.',
        scores: {
          problemUnderstanding: 85,
          approachOptimality: 80,
          codingProficiency: 82,
          complexityExplanation: 88,
          communicationClarity: 85,
          overallInterviewScore: 84
        },
        strengths: ['Identified O(N) linear scan approach promptly', 'Explicitly stated space complexity constraints'],
        improvements: ['Remember to clarify integer boundary constraints (overflows) with the interviewer early'],
        aiResponseText: 'Great explanation! How would your approach handle duplicate elements in the array?'
      };
      return isJson ? mockInterview : JSON.stringify(mockInterview, null, 2);
    }

    // Default conversational AI Mentor response
    if (isJson) {
      return {
        message: 'I am your personal AI DSA Mentor. Let us dissect the underlying pattern and step through the solution systematically.',
        suggestedNextAction: 'Review Binary Search templates'
      };
    }

    return `Hello! As your AI DSA Mentor, I analyzed your progress. Mastering patterns (like Two Pointer, Sliding Window, and Binary Search) will unlock 80% of LeetCode Medium problems. Let me know what topic you would like to explore or debug today!`;
  }
}

module.exports = new AIProvider();
