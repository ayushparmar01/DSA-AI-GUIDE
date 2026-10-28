const rateLimit = require('express-rate-limit');
const config = require('../config/env');

// Standard API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// AI Endpoints Rate Limiter (Protects LLM tokens and API quotas)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.ai.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI request limit reached for this session. Please wait before asking more AI queries.'
  }
});

module.exports = { apiLimiter, aiLimiter };
