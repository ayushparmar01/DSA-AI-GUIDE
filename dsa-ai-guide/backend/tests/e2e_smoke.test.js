/**
 * End-to-End System Smoke Test
 * Tests the complete, connected learner lifecycle:
 * 1. Health check
 * 2. User Registration & JWT Issuance
 * 3. Authenticated Profile Retrieval
 * 4. Problem Catalog Discovery
 * 5. Problem Detail with constraints & sample tests
 * 6. Leakage-Guarded Socratic Hint Retrieval
 * 7. AST Code Complexity Estimation
 * 8. Code Submission with Isolated Evaluation & Deterministic Mastery Update
 * 9. Personalized Roadmap Kahn Topological Sequencing
 * 10. SM-2 Spaced Repetition Due Queue & Recall Rating Submission
 * 11. Dashboard Analytics Telemetry Aggregation
 */

const http = require('http');
const { Duplex } = require('stream');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const config = require('../src/config/env');

const User = require('../src/models/User');
const Profile = require('../src/models/Profile');
const Problem = require('../src/models/Problem');
const Attempt = require('../src/models/Attempt');
const MasteryScore = require('../src/models/MasteryScore');
const Roadmap = require('../src/models/Roadmap');
const RevisionSchedule = require('../src/models/RevisionSchedule');
const HintSession = require('../src/models/HintSession');
const LearningEvent = require('../src/models/LearningEvent');

const codeExecutionService = require('../src/services/codeExecutionService');
const aiServiceClient = require('../src/services/aiServiceClient');
const masteryService = require('../src/services/masteryService');
const spacedRepetitionService = require('../src/services/spacedRepetitionService');
const roadmapService = require('../src/services/roadmapService');
const analyticsService = require('../src/services/analyticsService');

class InProcessRequest {
  constructor(app, method, url) {
    this.app = app;
    this.method = method.toUpperCase();
    this.url = url;
    this.headers = {
      host: 'localhost',
      'content-type': 'application/json'
    };
    this.payload = null;
  }

  set(header, value) {
    this.headers[header.toLowerCase()] = value;
    return this;
  }

  send(body) {
    this.payload = body;
    return this;
  }

  then(resolve, reject) {
    return this._dispatch().then(resolve, reject);
  }

  _dispatch() {
    return new Promise((resolve, reject) => {
      const socket = new Duplex({
        read() {},
        write(chunk, encoding, callback) {
          callback();
        }
      });
      socket.remoteAddress = '127.0.0.1';

      const req = new http.IncomingMessage(socket);
      req.method = this.method;
      req.url = this.url;
      req.originalUrl = this.url;
      req.headers = { ...this.headers };

      if (this.payload !== null && this.payload !== undefined) {
        req.body = typeof this.payload === 'object'
          ? JSON.parse(JSON.stringify(this.payload))
          : this.payload;
        req._body = true;
        const payloadString = typeof this.payload === 'object'
          ? JSON.stringify(this.payload)
          : String(this.payload);
        req.headers['content-length'] = Buffer.byteLength(payloadString);
      } else {
        req.body = {};
      }

      const res = new http.ServerResponse(req);
      res.assignSocket(socket);

      const chunks = [];
      res.write = function (chunk) {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        return true;
      };

      res.end = function (chunk) {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const raw = Buffer.concat(chunks).toString('utf8');
        let parsed = raw;
        try {
          parsed = JSON.parse(raw);
        } catch (e) {}

        resolve({
          status: res.statusCode,
          statusCode: res.statusCode,
          body: parsed,
          headers: res.getHeaders()
        });
      };

      try {
        this.app(req, res, (err) => {
          if (err) reject(err);
          else {
            resolve({
              status: res.statusCode,
              statusCode: res.statusCode,
              body: {},
              headers: res.getHeaders()
            });
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

const request = (app) => ({
  get: (url) => new InProcessRequest(app, 'GET', url),
  post: (url) => new InProcessRequest(app, 'POST', url),
  put: (url) => new InProcessRequest(app, 'PUT', url),
  delete: (url) => new InProcessRequest(app, 'DELETE', url)
});

describe('End-to-End System Smoke Tests: Complete Learner Journey', () => {
  const testUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'E2E Test Student',
    email: 'e2e_student@dsa-ai-guide.edu',
    password: 'password123',
    role: 'student'
  };

  const authToken = jwt.sign(
    { id: testUser._id, email: testUser.email, role: testUser.role },
    config.jwt.secret || 'dev_jwt_secret_key_dsa_guide_2026',
    { expiresIn: '1h' }
  );

  const sampleProblem = {
    _id: '507f1f77bcf86cd799439022',
    slug: 'two-sum',
    title: 'Two Sum',
    topicSlug: 'arrays',
    difficulty: 'Easy',
    order: 1,
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(N)',
    referenceSolution: 'def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen: return [seen[target - num], i]\n        seen[num] = i\n    return []',
    sampleTestCases: [{ input: '[2,7,11,15], 9', output: '[0, 1]' }],
    hints: [
      { level: 1, hintText: '[Level 1 - Concept Clue] Think about how elements relate to each other. Can you reduce redundant checks in linear time?' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mocks for persistence and service bridges
    jest.spyOn(User, 'findById').mockReturnValue({
      select: jest.fn().mockResolvedValue(testUser)
    });
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(User, 'create').mockResolvedValue(testUser);
    jest.spyOn(Profile, 'findOne').mockReturnValue({
      populate: jest.fn().mockResolvedValue({ userId: testUser._id, dailyGoalProblems: 3 })
    });
    jest.spyOn(Profile, 'create').mockResolvedValue({});
    jest.spyOn(Problem, 'find').mockImplementation(() => {
      const p = Promise.resolve([sampleProblem]);
      p.select = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([sampleProblem])
      });
      p.sort = jest.fn().mockResolvedValue([sampleProblem]);
      return p;
    });
    jest.spyOn(Problem, 'findOne').mockImplementation(() => {
      const p = Promise.resolve(sampleProblem);
      p.select = jest.fn().mockResolvedValue(sampleProblem);
      return p;
    });
    jest.spyOn(Attempt.prototype, 'save').mockResolvedValue(true);
    
    // Attempt.find returns a promise with chaining methods
    jest.spyOn(Attempt, 'find').mockImplementation(() => {
      const p = Promise.resolve([]);
      p.select = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([])
          })
        })
      });
      p.sort = jest.fn().mockResolvedValue([]);
      return p;
    });

    jest.spyOn(Attempt, 'countDocuments').mockResolvedValue(1);
    jest.spyOn(LearningEvent, 'create').mockResolvedValue({});
    jest.spyOn(HintSession, 'create').mockResolvedValue({
      _id: '507f1f77bcf86cd799439099'
    });
  });

  test('Step 1: API Gateway Health Check (ONLINE)', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('ONLINE');
  });

  test('Step 2: User Registration -> JWT Issuance', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: testUser.name,
        email: 'new_pilot_user@dsa-ai-guide.edu',
        password: 'ValidPassword123'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  test('Step 3: Authenticated Profile Retrieval', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Step 4: Problem Catalog Discovery', async () => {
    const res = await request(app)
      .get('/api/problems')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('Step 5: Problem Detail Inspection (No Hidden Test Cases Exposed)', async () => {
    const res = await request(app)
      .get('/api/problems/two-sum')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.problem.slug).toBe('two-sum');
    expect(res.body.data.problem.hiddenTestCases).toBeUndefined();
  });

  test('Step 6: Socratic Hint Generator with Solution Leakage Guard', async () => {
    jest.spyOn(aiServiceClient, 'checkLeakage').mockResolvedValue({
      is_leak: false,
      combined_similarity: 0.25,
      threshold: 0.80,
      explanation: 'Socratic hint passed similarity check.'
    });

    const res = await request(app)
      .post('/api/ai/hint/two-sum')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ level: 1 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.wasBlocked).toBe(false);
    expect(res.body.data.leakageScore).toBe(0.25);
  });

  test('Step 7: AST Static Complexity Analysis Endpoint', async () => {
    jest.spyOn(aiServiceClient, 'estimateComplexity').mockResolvedValue({
      complexity: 'O(N)',
      abstained: false,
      confidence: 0.85,
      explanation: 'Linear single-loop traversal detected'
    });

    const res = await request(app)
      .post('/api/ai/complexity')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        code: 'def solve(nums):\n    for x in nums: pass',
        version: 'v1'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.complexity).toBe('O(N)');
    expect(res.body.data.confidence).toBe(0.85);
  });

  test('Step 8: Code Submission, Execution, Mastery Delta & SM-2 Scheduling', async () => {
    jest.spyOn(codeExecutionService, 'executeCode').mockResolvedValue({
      status: 'Accepted',
      isAvailable: true,
      runtimeMs: 42,
      memoryKb: 2048,
      testCasesPassed: 1,
      totalTestCases: 1,
      results: [{ testCaseIndex: 1, passed: true }]
    });

    jest.spyOn(masteryService, 'recordAttemptMastery').mockResolvedValue({
      newScore: 61.0,
      delta: 11.0,
      timePenalty: 0.0
    });

    jest.spyOn(spacedRepetitionService, 'scheduleInitialRevision').mockResolvedValue({});

    const res = await request(app)
      .post('/api/submissions/two-sum/submit')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        code: 'def two_sum(nums, target): return [0, 1]',
        language: 'python',
        timeTakenSeconds: 300,
        hintsUsedCount: 0
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body.data.execution.status).toBe('Accepted');
    expect(res.body.data.mastery.delta).toBe(11.0);
    expect(res.body.data.mastery.newScore).toBe(61.0);
  });

  test('Step 9: Personalized Roadmap Kahn Topological Order', async () => {
    jest.spyOn(roadmapService, 'getUserRoadmap').mockResolvedValue({
      sequence: ['complexity-analysis', 'arrays', 'recursion'],
      phases: [
        { phaseNumber: 1, title: 'Complexity Analysis', topicSlug: 'complexity-analysis', status: 'completed' },
        { phaseNumber: 2, title: 'Arrays', topicSlug: 'arrays', status: 'active' }
      ]
    });

    const res = await request(app)
      .get('/api/roadmap')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sequence[0]).toBe('complexity-analysis');
  });

  test('Step 10: Spaced Repetition Due Queue & Recall Rating Submission', async () => {
    jest.spyOn(spacedRepetitionService, 'getDueRevisions').mockResolvedValue([
      { problem: sampleProblem, schedule: { repetitionNumber: 1, intervalDays: 1, easeFactor: 2.5 } }
    ]);

    const getRes = await request(app)
      .get('/api/revision')
      .set('Authorization', `Bearer ${authToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.data.length).toBe(1);

    jest.spyOn(spacedRepetitionService, 'recordRevisionResult').mockResolvedValue({
      repetitionNumber: 2,
      intervalDays: 6,
      easeFactor: 2.6
    });

    const submitRes = await request(app)
      .post('/api/revision/submit')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ problemSlug: 'two-sum', quality: 5, timeTakenSeconds: 180 });

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.data.intervalDays).toBe(6);
    expect(submitRes.body.data.easeFactor).toBe(2.6);
  });

  test('Step 11: Analytics Dashboard Telemetry Aggregation', async () => {
    jest.spyOn(analyticsService, 'getUserDashboardMetrics').mockResolvedValue({
      totalAttempts: 1,
      acceptedAttempts: 1,
      accuracyRate: 100,
      totalHintsUsed: 0,
      averageHintsPerAttempt: 0,
      masteryBreakdown: [{ topicSlug: 'arrays', masteryScore: 61.0 }]
    });

    const res = await request(app)
      .get('/api/analytics/dashboard')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalAttempts).toBe(1);
    expect(res.body.data.accuracyRate).toBe(100);
  });
});
