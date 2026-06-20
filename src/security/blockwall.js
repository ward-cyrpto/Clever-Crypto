// Security Blockwall - Advanced Firewall & Malware Protection
const logger = require('../utils/logger');

class SecurityBlockwall {
  constructor() {
    this.blocklist = new Set();
    this.suspiciousPatterns = [
      /<script[^>]*>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\(/gi,
      /exec\(/gi,
      /Function\(/gi,
      /setTimeout\(/gi,
      /setInterval\(/gi,
      /innerHTML/gi,
      /document\./gi,
      /window\./gi,
      /fetch\(/gi,
      /XMLHttpRequest/gi
    ];
    this.suspiciousIPs = new Set();
    this.requestLog = [];
    this.maxRequestsPerMinute = 100;
  }

  /**
   * Scan input for malicious content
   */
  scanInput(input) {
    if (typeof input !== 'string') {
      return { safe: true, threats: [] };
    }

    const threats = [];

    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(input)) {
        threats.push(`Detected: ${pattern.source}`);
      }
    }

    return {
      safe: threats.length === 0,
      threats: threats
    };
  }

  /**
   * Sanitize input by removing malicious content
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }

    let sanitized = input;

    // Remove script tags
    sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove dangerous functions
    sanitized = sanitized.replace(/eval\(/gi, '');
    sanitized = sanitized.replace(/Function\(/gi, '');
    sanitized = sanitized.replace(/exec\(/gi, '');

    logger.info(`Input sanitized: ${input.length} -> ${sanitized.length} chars`);

    return sanitized;
  }

  /**
   * Check if IP is blocked
   */
  isIPBlocked(ip) {
    return this.blocklist.has(ip) || this.suspiciousIPs.has(ip);
  }

  /**
   * Block an IP address
   */
  blockIP(ip, reason = 'Suspicious activity') {
    this.blocklist.add(ip);
    logger.warn(`IP Blocked: ${ip} - Reason: ${reason}`);
  }

  /**
   * Unblock an IP address
   */
  unblockIP(ip) {
    this.blocklist.delete(ip);
    logger.info(`IP Unblocked: ${ip}`);
  }

  /**
   * Get list of blocked IPs
   */
  getBlockedIPs() {
    return Array.from(this.blocklist);
  }

  /**
   * Validate request origin
   */
  validateOrigin(origin, allowedOrigins) {
    if (!origin) {
      return false;
    }

    return allowedOrigins.some(allowed => {
      if (allowed === '*') return true;
      if (allowed.includes('*')) {
        const pattern = new RegExp(`^${allowed.replace('*', '.*')}$`);
        return pattern.test(origin);
      }
      return origin === allowed;
    });
  }

  /**
   * Check for rate limiting violations
   */
  checkRateLimit(ip) {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Clean old requests
    this.requestLog = this.requestLog.filter(req => req.timestamp > oneMinuteAgo);

    // Count requests from this IP
    const ipRequests = this.requestLog.filter(req => req.ip === ip).length;

    if (ipRequests >= this.maxRequestsPerMinute) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      this.suspiciousIPs.add(ip);
      return false;
    }

    // Log this request
    this.requestLog.push({ ip, timestamp: now });
    return true;
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL
   */
  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check file upload safety
   */
  validateFileUpload(filename, mimetype, maxSize = 5242880) { // 5MB default
    const dangerousExtensions = [
      '.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar',
      '.sh', '.bash', '.py', '.php', '.asp', '.jsp'
    ];

    const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();

    if (dangerousExtensions.includes(extension)) {
      logger.warn(`Dangerous file extension detected: ${extension}`);
      return { safe: false, reason: 'Dangerous file extension' };
    }

    // Add more checks as needed
    return { safe: true, reason: 'File is safe' };
  }

  /**
   * SQL injection prevention - validate database queries
   */
  hasSQLInjectionPatterns(input) {
    const sqlPatterns = [
      /('|(\-\-)|(;)|(\|\|)|(\*))/gi,
      /\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b/gi,
      /\b(OR|AND)\b\s*1\s*=\s*1/gi,
      /xp_/gi,
      /sp_/gi
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        logger.warn(`Potential SQL injection detected: ${input}`);
        return true;
      }
    }

    return false;
  }

  /**
   * XSS prevention
   */
  hasXSSPatterns(input) {
    const xssPatterns = this.suspiciousPatterns;
    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        logger.warn(`Potential XSS detected: ${input}`);
        return true;
      }
    }
    return false;
  }

  /**
   * Generate security report
   */
  getSecurityReport() {
    return {
      timestamp: new Date(),
      blockedIPs: this.getBlockedIPs(),
      suspiciousIPs: Array.from(this.suspiciousIPs),
      totalRequests: this.requestLog.length,
      requestsLastMinute: this.requestLog.filter(
        req => req.timestamp > Date.now() - 60000
      ).length,
      maxRequestsPerMinute: this.maxRequestsPerMinute
    };
  }
}

module.exports = new SecurityBlockwall();
