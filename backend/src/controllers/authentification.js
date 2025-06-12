const router = require('express').Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Configuration
const tokenUsage = new Map(); // ⚠️ Use Redis in production
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // Per client

/**
 * Generate new API token with rate limiting setup
 */

router.post('/token', (req, res) => {
    try {
        const clientId = crypto.randomUUID();
        
        const payload = {
            clientId: clientId,
            type: 'api_access',
            generatedAt: new Date().toISOString(),
            rateLimitTier: 'standard'
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key', // ⚠️ Set JWT_SECRET in production
            { expiresIn: '30d' }
        );

        // Initialize rate limiting tracking
        tokenUsage.set(clientId, {
            requests: [],
            lastReset: Date.now()
        });

        res.status(200).json({
            success: true,
            token: token,
            clientId: clientId,
            rateLimit: {
                maxRequests: RATE_LIMIT_MAX_REQUESTS,
                windowMs: RATE_LIMIT_WINDOW,
                tier: payload.rateLimitTier
            },
            expiresIn: '30 days',
            message: 'API token generated successfully'
        });

    } catch (error) {
        console.error('Error generating API token:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate API token'
        });
    }
});

/**
 * Validate JWT token and apply rate limiting
 */
const validateToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'API token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        if (decoded.type !== 'api_access') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token type'
            });
        }

        // Check rate limit
        const rateLimitResult = checkRateLimit(decoded.clientId);
        
        if (!rateLimitResult.allowed) {
            return res.status(429).json({
                success: false,
                message: 'Rate limit exceeded',
                retryAfter: rateLimitResult.retryAfter,
                rateLimit: {
                    remaining: 0,
                    reset: rateLimitResult.resetTime,
                    limit: RATE_LIMIT_MAX_REQUESTS
                }
            });
        }

        // Add client info to request
        req.client = {
            id: decoded.clientId,
            rateLimitTier: decoded.rateLimitTier,
            remaining: rateLimitResult.remaining
        };

        // Add rate limiting headers
        res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS);
        res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
        res.setHeader('X-RateLimit-Reset', rateLimitResult.resetTime);

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        }

        console.error('Token validation error:', error);
        res.status(500).json({
            success: false,
            message: 'Token validation failed'
        });
    }
};

/**
 * Check rate limit using sliding window algorithm
 */
const checkRateLimit = (clientId) => {
    const now = Date.now();
    let clientData = tokenUsage.get(clientId);

    if (!clientData) {
        clientData = {
            requests: [],
            lastReset: now
        };
        tokenUsage.set(clientId, clientData);
    }

    // Clean up old requests
    clientData.requests = clientData.requests.filter(
        timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );

    // Check if limit exceeded
    if (clientData.requests.length >= RATE_LIMIT_MAX_REQUESTS) {
        const oldestRequest = Math.min(...clientData.requests);
        const retryAfter = Math.ceil((oldestRequest + RATE_LIMIT_WINDOW - now) / 1000);
        
        return {
            allowed: false,
            remaining: 0,
            retryAfter: retryAfter,
            resetTime: oldestRequest + RATE_LIMIT_WINDOW
        };
    }

    // Record current request
    clientData.requests.push(now);
    
    return {
        allowed: true,
        remaining: RATE_LIMIT_MAX_REQUESTS - clientData.requests.length,
        resetTime: now + RATE_LIMIT_WINDOW
    };
};

/**
 * Get current rate limit status for client
 */
router.get('/status', validateToken, (req, res) => {
  try {
      const clientId = req.client.id;
      const clientData = tokenUsage.get(clientId);
      const now = Date.now();

      if (!clientData) {
          return res.status(404).json({
              success: false,
              message: 'Client not found'
          });
      }

      // Clean up for accurate calculation
      clientData.requests = clientData.requests.filter(
          timestamp => now - timestamp < RATE_LIMIT_WINDOW
      );

      const remaining = RATE_LIMIT_MAX_REQUESTS - clientData.requests.length;
      const resetTime = clientData.requests.length > 0 
          ? Math.min(...clientData.requests) + RATE_LIMIT_WINDOW 
          : now + RATE_LIMIT_WINDOW;

      res.status(200).json({
          success: true,
          rateLimit: {
              limit: RATE_LIMIT_MAX_REQUESTS,
              remaining: remaining,
              reset: resetTime,
              window: RATE_LIMIT_WINDOW,
              tier: req.client.rateLimitTier
          },
          clientId: clientId
      });

  } catch (error) {
      console.error('Error getting rate limit status:', error);
      res.status(500).json({
          success: false,
          message: 'Failed to get rate limit status'
      });
  }
});


router.get('/validate', validateToken, (req, res) => {
  res.status(200).json({
      success: true,
      message: 'Token is valid',
      client: {
          id: req.client.id,
          rateLimitTier: req.client.rateLimitTier,
          remaining: req.client.remaining
      }
  });
});

module.exports = {
    validateToken,
    authRouter: router
};
