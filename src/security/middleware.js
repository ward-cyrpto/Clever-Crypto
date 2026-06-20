// Security Middleware
const blockwall = require('./blockwall');
const logger = require('../utils/logger');

/**
 * Middleware to check IP blocklist
 */
function ipBlocklistMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;

  if (blockwall.isIPBlocked(ip)) {
    logger.error(`Blocked request from IP: ${ip}`);
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Your IP has been blocked due to suspicious activity'
    });
  }

  next();
}

/**
 * Middleware to check rate limiting
 */
function rateLimitMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;

  if (!blockwall.checkRateLimit(ip)) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.'
    });
  }

  next();
}

/**
 * Middleware to validate content type
 */
function validateContentTypeMiddleware(req, res, next) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      logger.warn('Invalid content-type header');
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Content-Type must be application/json'
      });
    }
  }
  next();
}

/**
 * Middleware to sanitize input
 */
function sanitizeInputMiddleware(req, res, next) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  next();
}

/**
 * Helper function to sanitize object
 */
function sanitizeObject(obj) {
  if (typeof obj === 'string') {
    return blockwall.sanitizeInput(obj);
  }
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = blockwall.sanitizeInput(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
  return obj;
}

/**
 * Middleware to prevent XXS
 */
function preventXSSMiddleware(req, res, next) {
  for (const [key, value] of Object.entries(req.body || {})) {
    if (typeof value === 'string' && blockwall.hasXSSPatterns(value)) {
      logger.error(`XSS attempt detected in field: ${key}`);
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid input detected'
      });
    }
  }
  next();
}

/**
 * Middleware to prevent SQL injection
 */
function preventSQLInjectionMiddleware(req, res, next) {
  for (const [key, value] of Object.entries(req.body || {})) {
    if (typeof value === 'string' && blockwall.hasSQLInjectionPatterns(value)) {
      logger.error(`SQL injection attempt detected in field: ${key}`);
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid input detected'
      });
    }
  }
  next();
}

module.exports = {
  ipBlocklistMiddleware,
  rateLimitMiddleware,
  validateContentTypeMiddleware,
  sanitizeInputMiddleware,
  preventXSSMiddleware,
  preventSQLInjectionMiddleware,
  blockwall
};
