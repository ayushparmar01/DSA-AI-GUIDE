const jwt = require('jsonwebtoken');
const config = require('../src/config/env');

describe('JWT Token Generation & Verification Tests', () => {
  test('should generate valid verifiable token with payload', () => {
    const payload = { id: '64b1f2e3d4c5b6a7f8901234', email: 'test@dsa.guide', role: 'student' };
    const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });

    expect(typeof token).toBe('string');
    const decoded = jwt.verify(token, config.jwt.secret);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  test('should throw error when verifying with wrong secret', () => {
    const token = jwt.sign({ id: '123' }, config.jwt.secret);
    expect(() => {
      jwt.verify(token, 'wrong_secret_key');
    }).toThrow();
  });
});
