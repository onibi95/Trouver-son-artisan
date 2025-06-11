/**
 * Rate Limiting Configuration and Utilities
 */

// Default rate limit configurations
const RATE_LIMIT_CONFIGS = {
    standard: {
        maxRequests: 100,
        windowMs: 60 * 1000, // 1 minute
        tier: 'standard'
    },
    premium: {
        maxRequests: 500,
        windowMs: 60 * 1000, // 1 minute
        tier: 'premium'
    },
    basic: {
        maxRequests: 50,
        windowMs: 60 * 1000, // 1 minute
        tier: 'basic'
    }
};

/**
 * Get rate limit configuration for a tier
 */
const getRateLimitConfig = (tier = 'standard') => {
    return RATE_LIMIT_CONFIGS[tier] || RATE_LIMIT_CONFIGS.standard;
};

/**
 * Create custom rate limit middleware for specific endpoints
 */
const createCustomRateLimit = (tier = 'standard') => {
    const config = getRateLimitConfig(tier);
    
    return (req, res, next) => {
        // This could be extended to use different rate limits based on endpoint
        // For now, it just adds the tier info to the request
        req.rateLimitTier = tier;
        req.rateLimitConfig = config;
        next();
    };
};

/**
 * Format rate limit response headers
 */
const formatRateLimitHeaders = (remaining, resetTime, limit) => {
    return {
        'X-RateLimit-Limit': limit,
        'X-RateLimit-Remaining': remaining,
        'X-RateLimit-Reset': resetTime,
        'X-RateLimit-Reset-Date': new Date(resetTime).toISOString()
    };
};

/**
 * Check if client is approaching rate limit (useful for warnings)
 */
const isApproachingLimit = (remaining, limit, threshold = 0.1) => {
    return remaining <= (limit * threshold);
};

module.exports = {
    RATE_LIMIT_CONFIGS,
    getRateLimitConfig,
    createCustomRateLimit,
    formatRateLimitHeaders,
    isApproachingLimit
}; 