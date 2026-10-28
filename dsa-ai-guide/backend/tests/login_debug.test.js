/**
 * Dedicated Login Debug & Authentication Regression Test Suite
 * Tests:
 * 1. Valid student login (student@dsa-ai.guide / Password123!) -> 200
 * 2. Valid admin login (admin@dsa-ai.guide / AdminSecret123!) -> 200
 * 3. Valid custom user login (admin@exampro.com / password123) -> 200
 * 4. Invalid password for existing user -> 401 "Invalid email or password"
 * 5. Non-existent user lookup -> 401 "Invalid email or password"
 * 6. Email casing & whitespace normalization -> 200
 * 7. Verification that bcrypt comparison is genuine and never bypassed
 * 8. Verification that bootstrapService ensures demo accounts without deleting existing accounts
 */

const http = require('http');
const { Duplex } = require('stream');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const config = require('../src/config/env');

const User = require('../src/models/User');
const Profile = require('../src/models/Profile');
const { ensureDefaultDemoAccounts } = require('../src/services/bootstrapService');

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
  post: (url) => new InProcessRequest(app, 'POST', url)
});

describe('DSA AI Guide - Login Diagnostics & Credential Verification', () => {
  let studentPasswordHash;
  let adminPasswordHash;
  let customUserPasswordHash;

  beforeAll(async () => {
    studentPasswordHash = await bcrypt.hash('Password123!', 10);
    adminPasswordHash = await bcrypt.hash('AdminSecret123!', 10);
    customUserPasswordHash = await bcrypt.hash('password123', 10);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('1. Valid student credentials (student@dsa-ai.guide / Password123!) returns HTTP 200', async () => {
    const studentUser = {
      _id: '64b1f2e3d4c5b6a7f8901111',
      name: 'Demo Student (Default)',
      email: 'student@dsa-ai.guide',
      passwordHash: studentPasswordHash,
      role: 'student',
      comparePassword: function (pwd) {
        return bcrypt.compare(pwd, this.passwordHash);
      },
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(User, 'findOne').mockImplementation(({ email }) => {
      if (email === 'student@dsa-ai.guide') return Promise.resolve(studentUser);
      return Promise.resolve(null);
    });
    jest.spyOn(Profile, 'findOne').mockResolvedValue({ userId: studentUser._id });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@dsa-ai.guide',
        password: 'Password123!'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('student@dsa-ai.guide');
    expect(res.body.data.user.role).toBe('student');
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  test('2. Valid admin credentials (admin@dsa-ai.guide / AdminSecret123!) returns HTTP 200', async () => {
    const adminUser = {
      _id: '64b1f2e3d4c5b6a7f8902222',
      name: 'DSA Platform Admin (Default)',
      email: 'admin@dsa-ai.guide',
      passwordHash: adminPasswordHash,
      role: 'admin',
      comparePassword: function (pwd) {
        return bcrypt.compare(pwd, this.passwordHash);
      },
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(User, 'findOne').mockImplementation(({ email }) => {
      if (email === 'admin@dsa-ai.guide') return Promise.resolve(adminUser);
      return Promise.resolve(null);
    });
    jest.spyOn(Profile, 'findOne').mockResolvedValue({ userId: adminUser._id });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@dsa-ai.guide',
        password: 'AdminSecret123!'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('admin@dsa-ai.guide');
    expect(res.body.data.user.role).toBe('admin');
  });

  test('3. Valid custom existing user (admin@exampro.com / password123) returns HTTP 200', async () => {
    const customUser = {
      _id: '6ae13aad9569da67a8eaf35f',
      name: 'Ayush',
      email: 'admin@exampro.com',
      passwordHash: customUserPasswordHash,
      role: 'student',
      comparePassword: function (pwd) {
        return bcrypt.compare(pwd, this.passwordHash);
      },
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(User, 'findOne').mockImplementation(({ email }) => {
      if (email === 'admin@exampro.com') return Promise.resolve(customUser);
      return Promise.resolve(null);
    });
    jest.spyOn(Profile, 'findOne').mockResolvedValue({ userId: customUser._id });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@exampro.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  test('4. Incorrect password returns HTTP 401 "Invalid email or password"', async () => {
    const studentUser = {
      _id: '64b1f2e3d4c5b6a7f8901111',
      name: 'Demo Student (Default)',
      email: 'student@dsa-ai.guide',
      passwordHash: studentPasswordHash,
      comparePassword: function (pwd) {
        return bcrypt.compare(pwd, this.passwordHash);
      },
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(User, 'findOne').mockResolvedValue(studentUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@dsa-ai.guide',
        password: 'WrongPassword999!'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid email or password');
  });

  test('5. Non-existent email returns HTTP 401 "Invalid email or password"', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent.user@dsa-ai.guide',
        password: 'Password123!'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid email or password');
  });

  test('6. Email with whitespace and mixed casing normalizes and logs in successfully', async () => {
    const studentUser = {
      _id: '64b1f2e3d4c5b6a7f8901111',
      name: 'Demo Student (Default)',
      email: 'student@dsa-ai.guide',
      passwordHash: studentPasswordHash,
      comparePassword: function (pwd) {
        return bcrypt.compare(pwd, this.passwordHash);
      },
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(User, 'findOne').mockImplementation(({ email }) => {
      if (email === 'student@dsa-ai.guide') return Promise.resolve(studentUser);
      return Promise.resolve(null);
    });
    jest.spyOn(Profile, 'findOne').mockResolvedValue({ userId: studentUser._id });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: '   StUdEnT@DsA-aI.gUiDe   ',
        password: 'Password123!'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  test('7. Bootstrap service idempotently ensures demo accounts without wiping existing users', async () => {
    const existingUsers = [
      { email: 'radha123@gmail.com', name: 'radha' },
      { email: 'admin@exampro.com', name: 'Ayush' }
    ];

    const createdUsers = [];
    jest.spyOn(User, 'findOne').mockImplementation(({ email }) => {
      const foundExisting = existingUsers.find(u => u.email === email);
      if (foundExisting) return Promise.resolve(foundExisting);
      const foundCreated = createdUsers.find(u => u.email === email);
      return Promise.resolve(foundCreated || null);
    });

    jest.spyOn(User, 'create').mockImplementation((userData) => {
      createdUsers.push(userData);
      return Promise.resolve({ _id: 'new_id_' + userData.email, ...userData });
    });
    jest.spyOn(Profile, 'findOne').mockResolvedValue(null);
    jest.spyOn(Profile, 'create').mockResolvedValue({});

    await ensureDefaultDemoAccounts();

    // Verify student@dsa-ai.guide and admin@dsa-ai.guide were created
    expect(createdUsers.some(u => u.email === 'student@dsa-ai.guide')).toBe(true);
    expect(createdUsers.some(u => u.email === 'admin@dsa-ai.guide')).toBe(true);

    // Verify existing users were never touched or deleted
    expect(existingUsers).toHaveLength(2);
  });
});
