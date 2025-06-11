const express = require('express');
const router = express.Router();
const authController = require('../controllers/authentification');

/**
 * @route   POST /api/auth/token
 * @desc    Generate API token for rate limiting
 * @access  Public
 */
router.post('/token', authController.generateApiToken);

/**
 * @route   GET /api/auth/status
 * @desc    Get current rate limit status
 * @access  Private (requires token)
 */
router.get('/status', authController.validateToken, authController.getRateLimitStatus);

/**
 * @route   GET /api/auth/validate
 * @desc    Validate token (useful for testing)
 * @access  Private (requires token)
 */
router.get('/validate', authController.validateToken, (req, res) => {
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

module.exports = (app) => {
    app.use('/api/auth', router);
}; 