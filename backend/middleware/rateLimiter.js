const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for the quote API endpoint.
 * Prevents abuse: max N requests per IP per time window.
 */
const quoteLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min default
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 5,
  standardHeaders: true,  // Return RateLimit-* headers
  legacyHeaders: false,   // Disable X-RateLimit-* headers
  message: {
    success: false,
    errors: [{
      field: 'general',
      message: 'Too many submissions. Please wait a few minutes before trying again, or contact us directly by email.',
    }],
  },
  keyGenerator: (req) => {
    // Use X-Forwarded-For behind proxies, fallback to connection remote address
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
});

const rfqLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    errors: [{
      field: 'general',
      message: 'Too many submissions. Please wait a few minutes before trying again, or contact us directly by email.',
    }],
  },
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
});

const quickMsgLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 10, // lighter: 10 per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    errors: [{
      field: 'general',
      message: 'Too many messages. Please wait a few minutes before trying again.',
    }],
  },
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
});

module.exports = { quoteLimiter, rfqLimiter, quickMsgLimiter };
