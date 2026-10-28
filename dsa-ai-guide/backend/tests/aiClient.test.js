/**
 * Unit Tests for AI Microservice Client (Node.js -> FastAPI)
 * Verifies payload schemas, endpoint dispatching, and timeout/error resilience.
 */

const { AIServiceClient } = require('../src/services/aiServiceClient');

describe('AI Microservice Client Tests', () => {
  let mockFetch;
  let client;

  beforeEach(() => {
    mockFetch = jest.fn();
    client = new AIServiceClient({
      baseUrl: 'http://localhost:8000',
      timeoutMs: 2000,
      fetchClient: mockFetch
    });
  });

  describe('Mastery Calculation Endpoint', () => {
    test('should dispatch Equation (1) payload and parse result', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          new_mastery: 59,
          delta: 9,
          clamped: false,
          components: { R: 1.0, H: 1, E: 1, T: 0 }
        })
      });

      const res = await client.calculateMastery({
        currentMastery: 50,
        result: 1.0,
        hintsUsed: 1,
        isEfficient: 1,
        actualTime: 120,
        expectedTime: 300
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/mastery/calculate',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_mastery: 50,
            result: 1.0,
            hints_used: 1,
            is_efficient: 1,
            actual_time: 120,
            expected_time: 300,
            gated_efficiency: false
          })
        })
      );
      expect(res.new_mastery).toBe(59);
      expect(res.delta).toBe(9);
    });
  });

  describe('Roadmap Generation Endpoint', () => {
    test('should dispatch topic masteries and receive Kahn topological sort sequence', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          roadmap: ['Complexity Analysis', 'Arrays', 'Recursion'],
          total_topics: 3
        })
      });

      const res = await client.generateRoadmap({
        masteryScores: { Arrays: 40, 'Complexity Analysis': 80 }
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/roadmap/generate',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            mastery_scores: { Arrays: 40, 'Complexity Analysis': 80 },
            custom_graph: null
          })
        })
      );
      expect(res.roadmap).toEqual(['Complexity Analysis', 'Arrays', 'Recursion']);
    });
  });

  describe('SM-2 Spaced Repetition Endpoint', () => {
    test('should dispatch quality grade and receive repetition interval', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          repetitions: 1,
          interval_days: 1,
          ease_factor: 2.5
        })
      });

      const res = await client.calculateSM2Schedule({
        quality: 4,
        repetitions: 0,
        intervalDays: 1,
        easeFactor: 2.5
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/sm2/next-schedule',
        expect.any(Object)
      );
      expect(res.repetitions).toBe(1);
      expect(res.ease_factor).toBe(2.5);
    });
  });

  describe('Solution Leakage Guard Endpoint', () => {
    test('should dispatch candidate hint and reference solution', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          is_leak: false,
          combined_similarity: 0.32,
          token_similarity: 0.30,
          ast_similarity: 0.34,
          threshold: 0.80,
          reason: 'Safe hint below threshold'
        })
      });

      const res = await client.checkLeakage({
        candidateHint: 'Consider using a hash map to look up complements in O(1)',
        referenceSolution: 'def twoSum(nums, target): return {}'
      });

      expect(res.is_leak).toBe(false);
      expect(res.combined_similarity).toBe(0.32);
    });
  });

  describe('Complexity Estimation Endpoint', () => {
    test('should dispatch AST complexity request and return classified complexity', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          complexity: 'O(N)',
          abstained: false,
          confidence: 0.85
        })
      });

      const res = await client.estimateComplexity({
        code: 'def f(n):\n    for i in range(n):\n        pass'
      });

      expect(res.complexity).toBe('O(N)');
      expect(res.abstained).toBe(false);
    });
  });

  describe('Error & Timeout Handling', () => {
    test('should throw descriptive error on HTTP non-200 response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        text: async () => 'Unprocessable Entity'
      });

      await expect(client.calculateMastery({ currentMastery: 50, result: 1.0 }))
        .rejects.toThrow('AI service responded with HTTP 422: Unprocessable Entity');
    });

    test('should throw descriptive error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      await expect(client.generateRoadmap())
        .rejects.toThrow('Failed to communicate with AI microservice at http://localhost:8000/api/v1/roadmap/generate: Connection refused');
    });

    test('should throw timeout error on AbortError', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValueOnce(abortError);

      await expect(client.generateRoadmap())
        .rejects.toThrow("AI microservice request to '/roadmap/generate' timed out after 2000ms");
    });
  });
});
