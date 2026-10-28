const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5001', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_ai_guide',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret_key_dsa_guide_2026',
    expire: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key_2026',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d'
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'mock', // 'gemini' | 'openai' | 'mock'
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'gemini-1.5-flash',
    rateLimitMax: parseInt(process.env.AI_RATE_LIMIT_MAX || '100', 10)
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '500', 10)
  },
  codeExec: {
    timeoutMs: parseInt(process.env.CODE_EXEC_TIMEOUT_MS || '3000', 10)
  }
};

module.exports = config;
