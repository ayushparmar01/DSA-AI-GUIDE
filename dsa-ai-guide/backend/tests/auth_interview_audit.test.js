/**
 * Dedicated Audit & Regression Tests for:
 * 1. POST /api/auth/register (successful registration, validation, duplicate email handling)
 * 2. POST /api/auth/login (successful login, incorrect password, email normalization)
 * 3. POST /api/interview/start (unauthenticated 401, authenticated 201, fallback handling without 404, route aliases)
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
const MockInterview = require('../src/models/MockInterview');
const LearningEvent = require('../src/models/LearningEvent');

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
      }

      const res = new http.ServerResponse(req);
      const chunks = [];
      res.write = (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        return true;
      };
      res.end = (chunk) => {
        if (chunk) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const bodyBuffer = Buffer.concat(chunks);
        const bodyString = bodyBuffer.toString('utf8');
        let parsed = null;
        try {
          parsed = JSON.parse(bodyString);
        } catch (e) {
          parsed = bodyString;
        }

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

describe('DSA AI Guide - Auth & Interview Audit Suite', () => {
  const testUserId = '64b1f2e3d4c5b6a7f8907777';
  let validUserToken;

  const mockUser = {
    _id: testUserId,
    name: 'Audit Student',
    email: 'audit.student@dsa.guide',
    role: 'student',
    xp: 150,
    level: 2,
    streakCurrent: 1,
    comparePassword: jest.fn(),
    save: jest.fn().mockResolvedValue(true)
  };

  beforeAll(() => {
    validUserToken = jwt.sign(
      { id: testUserId, email: mockUser.email, role: mockUser.role },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(LearningEvent, 'create').mockResolvedValue({});

    jest.spyOn(User, 'findById').mockImplementation((id) => {
      const resolved = id?.toString() === testUserId ? mockUser : null;
      return {
        select: jest.fn().mockResolvedValue(resolved),
        then: (resolve) => resolve(resolved)
      };
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // ==========================================
  // Task 1 & 2: Registration Tests
  // ==========================================
  describe('Authentication: Registration Endpoint (POST /api/auth/register)', () => {
    test('1. Successful registration with valid data returns 201 and token', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(User, 'create').mockResolvedValue({
        _id: '64b1f2e3d4c5b6a7f8908888',
        name: 'New Registered User',
        email: 'new.learner@dsa.guide',
        role: 'student',
        xp: 0,
        level: 1,
        streakCurrent: 0,
        isAssessmentCompleted: false,
        isOnboardingCompleted: false
      });
      jest.spyOn(Profile, 'create').mockResolvedValue({ userId: '64b1f2e3d4c5b6a7f8908888' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: '  New Registered User  ',
          email: '  New.Learner@DSA.guide  ',
          password: 'Password123!'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('new.learner@dsa.guide');
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    test('2. Duplicate registration returns 400 with "Email is already registered"', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Audit Student',
          email: 'audit.student@dsa.guide',
          password: 'Password123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email is already registered');
    });

    test('3. Duplicate registration catches whitespace/case variation', async () => {
      jest.spyOn(User, 'findOne').mockImplementation(({ email }) => {
        if (email === 'audit.student@dsa.guide') {
          return Promise.resolve(mockUser);
        }
        return Promise.resolve(null);
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Audit Student',
          email: '   AUDIT.STUDENT@dsa.guide   ',
          password: 'Password123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email is already registered');
    });
  });

  // ==========================================
  // Task 1 & 2: Login Tests
  // ==========================================
  describe('Authentication: Login Endpoint (POST /api/auth/login)', () => {
    test('4. Successful login with correct credentials returns 200 and token', async () => {
      const userInstance = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true)
      };
      jest.spyOn(User, 'findOne').mockResolvedValue(userInstance);
      jest.spyOn(Profile, 'findOne').mockResolvedValue({ userId: testUserId });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'audit.student@dsa.guide',
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(mockUser.email);
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    test('5. Login with incorrect password returns 401 "Invalid email or password"', async () => {
      const userInstance = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(false),
        save: jest.fn().mockResolvedValue(true)
      };
      jest.spyOn(User, 'findOne').mockResolvedValue(userInstance);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'audit.student@dsa.guide',
          password: 'WrongPassword999!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });

    test('6. Login normalizes email casing and trimming successfully', async () => {
      const userInstance = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true)
      };
      jest.spyOn(User, 'findOne').mockImplementation(({ email }) => {
        if (email === 'audit.student@dsa.guide') {
          return Promise.resolve(userInstance);
        }
        return Promise.resolve(null);
      });
      jest.spyOn(Profile, 'findOne').mockResolvedValue({ userId: testUserId });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: '   AUDIT.STUDENT@dsa.guide   ',
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });
  });

  // ==========================================
  // Task 3: Mock Interview Endpoint Tests
  // ==========================================
  describe('Interview Endpoint: POST /api/interview/start', () => {
    test('7. Unauthenticated request to /api/interview/start returns 401', async () => {
      const res = await request(app)
        .post('/api/interview/start')
        .send({ topicSlug: 'two-pointers' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Not authorized');
    });

    test('8. Authenticated request to /api/interview/start returns 201 with session', async () => {
      const mockProblem = {
        title: 'Valid Palindrome',
        slug: 'valid-palindrome',
        topicSlug: 'two-pointers',
        difficulty: 'Easy',
        description: 'Check if a string is palindrome considering only alphanumeric characters.',
        constraints: ['1 <= s.length <= 2 * 10^5']
      };
      jest.spyOn(Problem, 'findOne').mockResolvedValue(mockProblem);
      jest.spyOn(MockInterview, 'create').mockResolvedValue({
        _id: '64b1f2e3d4c5b6a7f8909876',
        userId: testUserId,
        topicSlug: 'two-pointers',
        problemSlug: 'valid-palindrome',
        transcript: [
          {
            speaker: 'ai',
            message: 'Hello! Welcome to your technical mock interview.'
          }
        ]
      });

      const res = await request(app)
        .post('/api/interview/start')
        .set('Authorization', `Bearer ${validUserToken}`)
        .send({ topicSlug: 'two-pointers' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.interviewId).toBe('64b1f2e3d4c5b6a7f8909876');
      expect(res.body.data.problem.title).toBe('Valid Palindrome');
      expect(res.body.data.transcript).toHaveLength(1);
    });

    test('9. Authenticated request with non-matching topic gracefully falls back without 404', async () => {
      // Return null for topic lookup, but return a fallback problem on general query
      jest.spyOn(Problem, 'findOne')
        .mockResolvedValueOnce(null) // by topicSlug Easy/Med
        .mockResolvedValueOnce(null) // by topicSlug any
        .mockResolvedValueOnce({    // any Easy/Med
          title: 'Two Sum',
          slug: 'two-sum',
          topicSlug: 'arrays',
          difficulty: 'Easy',
          description: 'Two sum description',
          constraints: ['2 <= nums.length']
        });

      jest.spyOn(MockInterview, 'create').mockResolvedValue({
        _id: '64b1f2e3d4c5b6a7f8909877',
        userId: testUserId,
        topicSlug: 'arrays',
        problemSlug: 'two-sum',
        transcript: [{ speaker: 'ai', message: 'Hello!' }]
      });

      const res = await request(app)
        .post('/api/interview/start')
        .set('Authorization', `Bearer ${validUserToken}`)
        .send({ topicSlug: 'quantum-algorithms-unknown' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.problem.title).toBe('Two Sum');
    });

    test('10. Root alias route POST /api/interview responds identically to /start', async () => {
      jest.spyOn(Problem, 'findOne').mockResolvedValue({
        title: 'Two Sum',
        slug: 'two-sum',
        topicSlug: 'arrays',
        difficulty: 'Easy',
        description: 'Two sum description'
      });
      jest.spyOn(MockInterview, 'create').mockResolvedValue({
        _id: '64b1f2e3d4c5b6a7f8909878',
        userId: testUserId,
        topicSlug: 'arrays',
        problemSlug: 'two-sum',
        transcript: [{ speaker: 'ai', message: 'Hello!' }]
      });

      const res = await request(app)
        .post('/api/interview')
        .set('Authorization', `Bearer ${validUserToken}`)
        .send({});

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.interviewId).toBe('64b1f2e3d4c5b6a7f8909878');
    });

    test('11. Plural alias route POST /api/interviews/start responds identically', async () => {
      jest.spyOn(Problem, 'findOne').mockResolvedValue({
        title: 'Two Sum',
        slug: 'two-sum',
        topicSlug: 'arrays',
        difficulty: 'Easy',
        description: 'Two sum description'
      });
      jest.spyOn(MockInterview, 'create').mockResolvedValue({
        _id: '64b1f2e3d4c5b6a7f8909879',
        userId: testUserId,
        topicSlug: 'arrays',
        problemSlug: 'two-sum',
        transcript: [{ speaker: 'ai', message: 'Hello!' }]
      });

      const res = await request(app)
        .post('/api/interviews/start')
        .set('Authorization', `Bearer ${validUserToken}`)
        .send({});

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.interviewId).toBe('64b1f2e3d4c5b6a7f8909879');
    });
  });
});
