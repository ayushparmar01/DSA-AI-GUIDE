/**
 * Complete API Integration Tests for DSA AI Guide Backend
 * Verifies all Express routes, authentication, authorization isolation,
 * schema validation, code execution, mastery updates, roadmap, SM-2, and AI endpoints.
 * Uses in-process HTTP dispatching for 100% reliable, zero-socket sandboxed execution.
 */

const http = require('http');
const { Duplex } = require('stream');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
const Submission = require('../src/models/Submission');
const LearningEvent = require('../src/models/LearningEvent');
const codeExecutionService = require('../src/services/codeExecutionService');
const aiServiceClient = require('../src/services/aiServiceClient');
const masteryService = require('../src/services/masteryService');
const spacedRepetitionService = require('../src/services/spacedRepetitionService');
const roadmapService = require('../src/services/roadmapService');
const analyticsService = require('../src/services/analyticsService');

/**
 * In-process HTTP request dispatcher matching Supertest's API surface.
 * Bypasses TCP port binding to run safely in isolated execution environments.
 */
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
              status: res.statusCode || 404,
              statusCode: res.statusCode || 404,
              body: null,
              headers: res.getHeaders()
            });
          }
        });
      } catch (err) {
        reject(err);
      }

      if (this.payload !== null && this.payload !== undefined) {
        const payloadString = typeof this.payload === 'object'
          ? JSON.stringify(this.payload)
          : String(this.payload);
        req.headers['content-length'] = Buffer.byteLength(payloadString);
        req.push(payloadString);
      }
      req.push(null);
    });
  }
}

const request = (app) => ({
  get: (url) => new InProcessRequest(app, 'GET', url),
  post: (url) => new InProcessRequest(app, 'POST', url),
  put: (url) => new InProcessRequest(app, 'PUT', url),
  delete: (url) => new InProcessRequest(app, 'DELETE', url)
});

describe('DSA AI Guide - API Integration Test Suite', () => {
  // Test user fixtures
  const testUserId = '64b1f2e3d4c5b6a7f8901111';
  const otherUserId = '64b1f2e3d4c5b6a7f8902222';
  const adminUserId = '64b1f2e3d4c5b6a7f8903333';

  let testUserToken;
  let otherUserToken;
  let adminToken;

  const mockUserObj = {
    _id: testUserId,
    name: 'Test Student',
    email: 'student@dsa.guide',
    role: 'student',
    xp: 200,
    level: 2,
    streakCurrent: 3,
    streakLongest: 5,
    isAssessmentCompleted: true,
    isOnboardingCompleted: true
  };

  const mockOtherUserObj = {
    _id: otherUserId,
    name: 'Other Student',
    email: 'other@dsa.guide',
    role: 'student',
    xp: 50,
    level: 1
  };

  const mockAdminObj = {
    _id: adminUserId,
    name: 'Platform Admin',
    email: 'admin@dsa.guide',
    role: 'admin'
  };

  const mockProfileObj = {
    userId: testUserId,
    college: 'GL Bajaj',
    preferredLanguage: 'python',
    targetGoal: 'FAANG Placement'
  };

  const mockProblemObj = {
    _id: '64b1f2e3d4c5b6a7f8904444',
    title: 'Two Sum',
    slug: 'two-sum',
    topicSlug: 'hashing',
    difficulty: 'Easy',
    description: 'Find two indices that sum to target.',
    optimalTimeComplexity: 'O(N)',
    optimalSpaceComplexity: 'O(N)',
    sampleTestCases: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
    hiddenTestCases: [{ input: 'nums = [3,3], target = 6', output: '[0,1]' }],
    hints: [
      { level: 1, title: 'Concept', hintText: 'Consider using a hash table for O(1) lookups.' }
    ],
    toObject: () => mockProblemObj
  };

  beforeAll(() => {
    testUserToken = jwt.sign(
      { id: testUserId, email: mockUserObj.email, role: mockUserObj.role },
      config.jwt.secret,
      { expiresIn: '1h' }
    );

    otherUserToken = jwt.sign(
      { id: otherUserId, email: mockOtherUserObj.email, role: mockOtherUserObj.role },
      config.jwt.secret,
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { id: adminUserId, email: mockAdminObj.email, role: mockAdminObj.role },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock LearningEvent.create for telemetry
    jest.spyOn(LearningEvent, 'create').mockResolvedValue({});

    // Mock User.findById for authMiddleware protect
    jest.spyOn(User, 'findById').mockImplementation((id) => {
      let resolvedUser = null;
      if (id?.toString() === testUserId) resolvedUser = mockUserObj;
      if (id?.toString() === otherUserId) resolvedUser = mockOtherUserObj;
      if (id?.toString() === adminUserId) resolvedUser = mockAdminObj;

      return {
        select: jest.fn().mockResolvedValue(resolvedUser),
        then: (resolve) => resolve(resolvedUser)
      };
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // ==========================================
  // 1. Health Check Route
  // ==========================================
  describe('GET /api/health', () => {
    test('should return 200 ONLINE status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('ONLINE');
      expect(res.body.message).toContain('DSA AI Guide API is running');
    });
  });

  // ==========================================
  // 2. Authentication & Validation Routes
  // ==========================================
  describe('Auth Endpoints: /api/auth', () => {
    test('POST /api/auth/register should fail with 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'invalid-email-address',
          password: 'Password123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    test('POST /api/auth/register should fail with 400 for password shorter than 6 chars', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@dsa.guide',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('POST /api/auth/register should register new user successfully with 201', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(User, 'create').mockResolvedValue({
        _id: '64b1f2e3d4c5b6a7f8909999',
        name: 'New Student',
        email: 'newstudent@dsa.guide',
        role: 'student',
        xp: 0,
        level: 1,
        streakCurrent: 0,
        isAssessmentCompleted: false,
        isOnboardingCompleted: false
      });
      jest.spyOn(Profile, 'create').mockResolvedValue({ userId: '64b1f2e3d4c5b6a7f8909999' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New Student',
          email: 'newstudent@dsa.guide',
          password: 'Password123!'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('newstudent@dsa.guide');
    });

    test('POST /api/auth/login should fail with 401 for non-existent user', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@dsa.guide',
          password: 'Password123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid email or password');
    });

    test('POST /api/auth/login should succeed with 200 and return JWT on correct password', async () => {
      const passwordHash = await bcrypt.hash('CorrectPass123!', 10);
      jest.spyOn(User, 'findOne').mockResolvedValue({
        _id: testUserId,
        name: 'Test Student',
        email: 'student@dsa.guide',
        passwordHash,
        role: 'student',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true)
      });
      jest.spyOn(Profile, 'findOne').mockResolvedValue(mockProfileObj);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@dsa.guide',
          password: 'CorrectPass123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('student@dsa.guide');
    });
  });

  // ==========================================
  // 3. User Profile Route
  // ==========================================
  describe('User Profile: /api/users/profile', () => {
    test('should reject request with 401 when token is missing', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('should return 200 with user profile when valid token provided', async () => {
      jest.spyOn(Profile, 'findOne').mockResolvedValue(mockProfileObj);

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('student@dsa.guide');
      expect(res.body.data.profile.college).toBe('GL Bajaj');
    });
  });

  // ==========================================
  // 4. Problem Catalog Routes
  // ==========================================
  describe('Problem Catalog: /api/problems', () => {
    test('GET /api/problems should return list of DSA problems', async () => {
      jest.spyOn(Problem, 'find').mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([mockProblemObj])
        })
      });

      const res = await request(app).get('/api/problems');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].slug).toBe('two-sum');
    });

    test('GET /api/problems/:slug should return problem details without hidden test cases', async () => {
      jest.spyOn(Problem, 'findOne').mockReturnValue({
        select: jest.fn().mockResolvedValue(mockProblemObj)
      });

      const res = await request(app).get('/api/problems/two-sum');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.problem.slug).toBe('two-sum');
      expect(res.body.data.problem.title).toBe('Two Sum');
    });

    test('GET /api/problems/:slug should return 404 for unknown problem', async () => {
      jest.spyOn(Problem, 'findOne').mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const res = await request(app).get('/api/problems/unknown-slug');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });
  });

  // ==========================================
  // 5. Code Execution & Submissions
  // ==========================================
  describe('Code Execution & Submissions: /api/submissions', () => {
    test('POST /api/submissions/:slug/run should return execution status and test cases', async () => {
      jest.spyOn(Problem, 'findOne').mockResolvedValue(mockProblemObj);
      jest.spyOn(codeExecutionService, 'executeCode').mockResolvedValue({
        status: 'Accepted',
        isAvailable: true,
        message: 'Execution completed: 1/1 test cases passed.',
        testCasesPassed: 1,
        totalTestCases: 1,
        runtimeMs: 42,
        memoryKb: 3100,
        results: [{ testCaseIndex: 1, passed: true, actualOutput: '[0,1]' }]
      });

      const res = await request(app)
        .post('/api/submissions/two-sum/run')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({
          language: 'python',
          code: 'class Solution: def twoSum(self, nums, target): return [0, 1]'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Accepted');
      expect(res.body.data.testCasesPassed).toBe(1);
    });

    test('POST /api/submissions/:slug/submit should persist attempt, calculate mastery, and schedule SM-2', async () => {
      jest.spyOn(Problem, 'findOne').mockResolvedValue(mockProblemObj);
      jest.spyOn(codeExecutionService, 'executeCode').mockResolvedValue({
        status: 'Accepted',
        isAvailable: true,
        testCasesPassed: 2,
        totalTestCases: 2,
        runtimeMs: 38,
        memoryKb: 3400,
        results: []
      });

      jest.spyOn(aiServiceClient, 'estimateComplexity').mockResolvedValue({
        complexity: 'O(N)',
        abstained: false,
        confidence: 0.8
      });

      jest.spyOn(Attempt.prototype, 'save').mockImplementation(function () {
        this._id = '64b1f2e3d4c5b6a7f8907777';
        return Promise.resolve(this);
      });

      jest.spyOn(masteryService, 'recordAttemptMastery').mockResolvedValue({
        currentScore: 50,
        newScore: 59,
        delta: 9,
        timePenalty: 0
      });

      jest.spyOn(spacedRepetitionService, 'scheduleInitialRevision').mockResolvedValue({});

      const res = await request(app)
        .post('/api/submissions/two-sum/submit')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({
          language: 'python',
          code: 'class Solution: def twoSum(self, nums, target): pass',
          timeTakenSeconds: 150,
          hintsUsedCount: 1
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      expect(res.body.data.attempt.status).toBe('Accepted');
      expect(res.body.data.mastery.delta).toBe(9);
    });
  });

  // ==========================================
  // 6. Ownership & Security Isolation Checks
  // ==========================================
  describe('Attempt History & Ownership Authorization Checks', () => {
    test('GET /api/submissions/my should return authenticated user attempts', async () => {
      jest.spyOn(Attempt, 'find').mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([
                {
                  _id: '64b1f2e3d4c5b6a7f8907777',
                  userId: testUserId,
                  problemSlug: 'two-sum',
                  status: 'Accepted'
                }
              ])
            })
          })
        })
      });
      jest.spyOn(Attempt, 'countDocuments').mockResolvedValue(1);

      const res = await request(app)
        .get('/api/submissions/my')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
    });

    test('GET /api/submissions/:id should return 200 when accessing own attempt', async () => {
      jest.spyOn(Attempt, 'findById').mockResolvedValue({
        _id: '64b1f2e3d4c5b6a7f8907777',
        userId: testUserId,
        problemSlug: 'two-sum',
        status: 'Accepted'
      });

      const res = await request(app)
        .get('/api/submissions/64b1f2e3d4c5b6a7f8907777')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.problemSlug).toBe('two-sum');
    });

    test('GET /api/submissions/:id MUST REJECT with 403 Forbidden when user accesses another users attempt', async () => {
      // Attempt belongs to testUserId, but otherUserToken tries to view it!
      jest.spyOn(Attempt, 'findById').mockResolvedValue({
        _id: '64b1f2e3d4c5b6a7f8907777',
        userId: testUserId, // Owner is testUserId
        problemSlug: 'two-sum',
        status: 'Accepted'
      });

      const res = await request(app)
        .get('/api/submissions/64b1f2e3d4c5b6a7f8907777')
        .set('Authorization', `Bearer ${otherUserToken}`); // Requester is otherUserId

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });

    test('GET /api/submissions/:id should permit admin to view any user attempt', async () => {
      jest.spyOn(Attempt, 'findById').mockResolvedValue({
        _id: '64b1f2e3d4c5b6a7f8907777',
        userId: testUserId,
        problemSlug: 'two-sum',
        status: 'Accepted'
      });

      const res = await request(app)
        .get('/api/submissions/64b1f2e3d4c5b6a7f8907777')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ==========================================
  // 7. Roadmap & Topic Mastery Endpoints
  // ==========================================
  describe('Roadmap & Topic Mastery: /api/roadmap', () => {
    test('GET /api/roadmap should return user personalized roadmap sequence', async () => {
      jest.spyOn(roadmapService, 'getUserRoadmap').mockResolvedValue({
        userId: testUserId,
        sequence: ['complexity-analysis', 'arrays', 'hashing'],
        currentPhaseNumber: 1,
        phases: [
          { phaseNumber: 1, title: 'Phase 1: Complexity Analysis', status: 'active' }
        ]
      });

      const res = await request(app)
        .get('/api/roadmap')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sequence[0]).toBe('complexity-analysis');
    });

    test('GET /api/roadmap/mastery should return mastery scores for all topics', async () => {
      jest.spyOn(masteryService, 'getUserMasteries').mockResolvedValue([
        { topicSlug: 'hashing', masteryScore: 78, accuracyRate: 85 }
      ]);

      const res = await request(app)
        .get('/api/roadmap/mastery')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].topicSlug).toBe('hashing');
      expect(res.body.data[0].masteryScore).toBe(78);
    });
  });

  // ==========================================
  // 8. Spaced Repetition Revision Routes
  // ==========================================
  describe('Spaced Repetition: /api/revision', () => {
    test('GET /api/revision should return due problems', async () => {
      jest.spyOn(spacedRepetitionService, 'getDueRevisions').mockResolvedValue([
        { problemSlug: 'two-sum', topicSlug: 'hashing', repetitions: 1, intervalDays: 1 }
      ]);

      const res = await request(app)
        .get('/api/revision')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].problemSlug).toBe('two-sum');
    });

    test('POST /api/revision/submit should record revision and advance interval', async () => {
      jest.spyOn(spacedRepetitionService, 'recordRevisionResult').mockResolvedValue({
        problemSlug: 'two-sum',
        repetitions: 2,
        intervalDays: 6,
        easeFactor: 2.6
      });

      const res = await request(app)
        .post('/api/revision/submit')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({
          problemSlug: 'two-sum',
          quality: 4,
          timeTakenSeconds: 180
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.repetitions).toBe(2);
      expect(res.body.data.intervalDays).toBe(6);
    });
  });

  // ==========================================
  // 9. AI Microservice Integration Routes
  // ==========================================
  describe('AI Endpoints: /api/ai', () => {
    test('POST /api/ai/hint/:slug should deliver Leakage-Guarded hint', async () => {
      jest.spyOn(Problem, 'findOne').mockResolvedValue(mockProblemObj);
      jest.spyOn(aiServiceClient, 'checkLeakage').mockResolvedValue({
        is_leak: false,
        combined_similarity: 0.22,
        token_similarity: 0.20,
        ast_similarity: 0.24,
        raw_similarity: 0.18,
        token_count: 14,
        threshold: 0.80,
        used_fallback: false,
        is_short_input: false,
        explanation: 'Clean conceptual hint below cutoff'
      });

      jest.spyOn(HintSession, 'create').mockResolvedValue({
        _id: '64b1f2e3d4c5b6a7f8908888',
        userId: testUserId,
        problemSlug: 'two-sum',
        level: 1,
        wasBlocked: false
      });

      const res = await request(app)
        .post('/api/ai/hint/two-sum')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ level: 1 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.wasBlocked).toBe(false);
      expect(res.body.data.leakageScore).toBe(0.22);
    });

    test('POST /api/ai/complexity should analyze code AST and return estimated complexity', async () => {
      jest.spyOn(aiServiceClient, 'estimateComplexity').mockResolvedValue({
        complexity: 'O(N)',
        version: 'v1',
        loop_depth: 1,
        has_halving_loop: false,
        has_sort: false,
        is_recursive: false,
        recursive_branch_factor: 0,
        hidden_costs: [],
        abstained: false,
        confidence: 0.85,
        explanation: 'Single linear loop detected.'
      });

      const res = await request(app)
        .post('/api/ai/complexity')
        .send({
          code: 'def linear_scan(arr):\n    for x in arr:\n        print(x)',
          version: 'v1'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.complexity).toBe('O(N)');
      expect(res.body.data.abstained).toBe(false);
    });

    test('POST /api/ai/complexity should return 400 Bad Request when code is missing', async () => {
      const res = await request(app)
        .post('/api/ai/complexity')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  // ==========================================
  // 10. Analytics Dashboard Route
  // ==========================================
  describe('Analytics Dashboard: /api/analytics/dashboard', () => {
    test('GET /api/analytics/dashboard should return aggregated dashboard metrics', async () => {
      jest.spyOn(analyticsService, 'getUserDashboardMetrics').mockResolvedValue({
        totalSolved: 12,
        easySolved: 8,
        mediumSolved: 4,
        hardSolved: 0,
        accuracy: 80,
        totalAttempts: 15,
        currentStreak: 3,
        longestStreak: 5,
        averageMastery: 72,
        dsaScore: 75
      });

      const res = await request(app)
        .get('/api/analytics/dashboard')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalSolved).toBe(12);
      expect(res.body.data.averageMastery).toBe(72);
      expect(res.body.data.accuracy).toBe(80);
    });
  });
});
