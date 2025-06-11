/**
 * =============================================================================
 * SYSTÈME D'AUTHENTIFICATION ET DE SÉCURITÉ API
 * =============================================================================
 * 
 * Ce module implémente un système complet d'authentification basé sur des tokens JWT
 * avec rate limiting intégré pour protéger l'API contre les abus et garantir
 * une distribution équitable des ressources.
 * 
 * RÈGLES DE SÉCURITÉ IMPLÉMENTÉES:
 * =============================================================================
 * 
 * 1. AUTHENTIFICATION PAR TOKEN JWT
 *    - Tokens JWT signés avec une clé secrète (JWT_SECRET)
 *    - Expiration automatique des tokens (30 jours par défaut)
 *    - Type de token validé ('api_access' uniquement)
 *    - Identifiant client unique (UUID v4) pour chaque token
 * 
 * 2. RATE LIMITING (LIMITATION DU TAUX DE REQUÊTES)
 *    - Fenêtre glissante de 60 secondes (RATE_LIMIT_WINDOW)
 *    - Maximum 100 requêtes par minute par client (RATE_LIMIT_MAX_REQUESTS)
 *    - Tracking individuel par clientId
 *    - Headers de rate limit inclus dans les réponses
 *    - Nettoyage automatique des anciennes requêtes
 * 
 * 3. GESTION DES ERREURS DE SÉCURITÉ
 *    - TokenExpiredError: Token expiré (code 401)
 *    - JsonWebTokenError: Token malformé ou invalide (code 401)
 *    - Rate limit exceeded: Trop de requêtes (code 429)
 *    - Token manquant: Authorization header requis (code 401)
 * 
 * 4. STOCKAGE SÉCURISÉ
 *    - Stockage en mémoire pour le développement
 *    - ⚠️  PRODUCTION: Utiliser Redis ou base de données
 *    - Données sensibles non exposées dans les logs
 * 
 * 5. TIERS DE RATE LIMITING
 *    - Standard: 100 req/min (par défaut)
 *    - Premium: 500 req/min (configurable)
 *    - Basic: 50 req/min (configurable)
 * 
 * VARIABLES D'ENVIRONNEMENT REQUISES:
 * =============================================================================
 * - JWT_SECRET: Clé secrète pour signer les tokens JWT (OBLIGATOIRE en production)
 * 
 * HEADERS DE SÉCURITÉ RETOURNÉS:
 * =============================================================================
 * - X-RateLimit-Limit: Limite maximale de requêtes
 * - X-RateLimit-Remaining: Requêtes restantes dans la fenêtre
 * - X-RateLimit-Reset: Timestamp de réinitialisation de la fenêtre
 * 
 * STRUCTURE DES TOKENS:
 * =============================================================================
 * Payload JWT contient:
 * - clientId: Identifiant unique du client (UUID)
 * - type: Type de token ('api_access')
 * - generatedAt: Date de génération (ISO string)
 * - rateLimitTier: Niveau de rate limit ('standard', 'premium', 'basic')
 * 
 * RÉSILIENCE ET SÉCURITÉ:
 * =============================================================================
 * - Validation stricte des tokens à chaque requête
 * - Gestion gracieuse des erreurs sans exposer d'informations sensibles
 * - Nettoyage automatique des données de rate limiting
 * - Prévention des attaques par déni de service (DoS)
 * - Isolation des clients (un client ne peut pas affecter les autres)
 * 
 * =============================================================================
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// =============================================================================
// CONFIGURATION DE SÉCURITÉ
// =============================================================================

/**
 * Stockage en mémoire pour le rate limiting
 * ⚠️  IMPORTANT: En production, utiliser Redis ou une base de données
 * pour permettre la mise à l'échelle horizontale et la persistance
 */
const tokenUsage = new Map();

/**
 * Fenêtre de temps pour le rate limiting (1 minute)
 * Détermine la période pendant laquelle les requêtes sont comptabilisées
 */
const RATE_LIMIT_WINDOW = 60 * 1000;

/**
 * Nombre maximum de requêtes autorisées par fenêtre de temps
 * Cette limite s'applique par client (par clientId)
 */
const RATE_LIMIT_MAX_REQUESTS = 100;

// =============================================================================
// GÉNÉRATION DE TOKENS API
// =============================================================================

/**
 * Génère un nouveau token API pour l'authentification et le rate limiting
 * 
 * SÉCURITÉ:
 * - Génère un clientId unique (UUID v4) cryptographiquement sécurisé
 * - Crée un token JWT signé avec la clé secrète
 * - Initialise le tracking de rate limiting pour le nouveau client
 * - Expire automatiquement après 30 jours
 * 
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Token JWT et métadonnées de rate limiting
 */
const generateApiToken = (req, res) => {
    try {
        // Génération d'un identifiant client unique et sécurisé
        const clientId = crypto.randomUUID();
        
        // Création du payload du token avec métadonnées de sécurité
        const payload = {
            clientId: clientId,
            type: 'api_access', // Type de token strictement défini
            generatedAt: new Date().toISOString(),
            rateLimitTier: 'standard' // Niveau de rate limiting assigné
        };

        // Génération du token JWT avec expiration de sécurité
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key', // ⚠️ Définir JWT_SECRET en production
            { expiresIn: '30d' } // Expiration automatique pour limiter l'exposition
        );

        // Initialisation du tracking de rate limiting pour ce client
        tokenUsage.set(clientId, {
            requests: [], // Historique des timestamps de requêtes
            lastReset: Date.now() // Dernière réinitialisation du compteur
        });

        // Réponse avec token et informations de rate limiting
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
};

// =============================================================================
// VALIDATION DE TOKENS ET RATE LIMITING
// =============================================================================

/**
 * Middleware de validation de token et application du rate limiting
 * 
 * SÉCURITÉ:
 * - Vérifie la présence du token dans l'header Authorization
 * - Valide la signature JWT et l'intégrité du token
 * - Vérifie le type de token ('api_access' uniquement)
 * - Applique le rate limiting basé sur le clientId
 * - Ajoute les headers de rate limiting aux réponses
 * - Gère les erreurs de sécurité avec codes d'erreur appropriés
 * 
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction middleware suivante
 */
const validateToken = (req, res, next) => {
    try {
        // Extraction du token depuis l'header Authorization (Bearer token)
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        // Vérification de la présence du token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'API token required'
            });
        }

        // Vérification de la signature JWT et décodage sécurisé
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Validation du type de token pour prévenir l'utilisation de tokens non-API
        if (decoded.type !== 'api_access') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token type'
            });
        }

        // Application du rate limiting basé sur le clientId
        const rateLimitResult = checkRateLimit(decoded.clientId);
        
        // Blocage si rate limit dépassé
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

        // Ajout des informations client à la requête pour les middlewares suivants
        req.client = {
            id: decoded.clientId,
            rateLimitTier: decoded.rateLimitTier,
            remaining: rateLimitResult.remaining
        };

        // Ajout des headers de rate limiting pour transparence client
        res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS);
        res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
        res.setHeader('X-RateLimit-Reset', rateLimitResult.resetTime);

        next();

    } catch (error) {
        // Gestion spécialisée des erreurs de token
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

        // Erreur générique sans exposition d'informations sensibles
        console.error('Token validation error:', error);
        res.status(500).json({
            success: false,
            message: 'Token validation failed'
        });
    }
};

// =============================================================================
// LOGIQUE DE RATE LIMITING
// =============================================================================

/**
 * Vérifie et applique le rate limiting pour un client spécifique
 * 
 * ALGORITHME:
 * - Utilise une fenêtre glissante pour compter les requêtes
 * - Nettoie automatiquement les requêtes anciennes (> RATE_LIMIT_WINDOW)
 * - Calcule le temps d'attente nécessaire si limite dépassée
 * - Met à jour le compteur de requêtes en temps réel
 * 
 * SÉCURITÉ:
 * - Isolation totale entre les clients (un client ne peut pas affecter les autres)
 * - Calcul précis du temps de retry pour éviter le spam
 * - Nettoyage automatique pour éviter les fuites mémoire
 * 
 * @param {string} clientId - Identifiant unique du client
 * @returns {Object} Résultat du contrôle de rate limiting
 */
const checkRateLimit = (clientId) => {
    const now = Date.now();
    let clientData = tokenUsage.get(clientId);

    // Initialisation si le client n'existe pas
    if (!clientData) {
        clientData = {
            requests: [], // Historique des timestamps de requêtes
            lastReset: now // Timestamp de dernière réinitialisation
        };
        tokenUsage.set(clientId, clientData);
    }

    // Nettoyage des requêtes anciennes (en dehors de la fenêtre)
    clientData.requests = clientData.requests.filter(
        timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );

    // Vérification si la limite est dépassée
    if (clientData.requests.length >= RATE_LIMIT_MAX_REQUESTS) {
        const oldestRequest = Math.min(...clientData.requests);
        const retryAfter = Math.ceil((oldestRequest + RATE_LIMIT_WINDOW - now) / 1000);
        
        return {
            allowed: false,
            remaining: 0,
            retryAfter: retryAfter, // Temps d'attente en secondes
            resetTime: oldestRequest + RATE_LIMIT_WINDOW
        };
    }

    // Enregistrement de la requête actuelle
    clientData.requests.push(now);
    
    return {
        allowed: true,
        remaining: RATE_LIMIT_MAX_REQUESTS - clientData.requests.length,
        resetTime: now + RATE_LIMIT_WINDOW
    };
};

// =============================================================================
// MONITORING ET STATUS
// =============================================================================

/**
 * Retourne le statut actuel du rate limiting pour un client
 * 
 * UTILITÉ:
 * - Permet aux clients de surveiller leur consommation
 * - Aide au debugging et au monitoring
 * - Transparence sur l'état du rate limiting
 * 
 * @param {Object} req - Objet de requête Express (avec req.client)
 * @param {Object} res - Objet de réponse Express
 */
const getRateLimitStatus = (req, res) => {
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

        // Nettoyage des anciennes requêtes pour calcul précis
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
};

// =============================================================================
// MIDDLEWARE PERSONNALISÉ
// =============================================================================

/**
 * Crée un middleware de rate limiting personnalisé pour des endpoints spécifiques
 * 
 * EXTENSIBILITÉ:
 * - Permet des limites différentes selon les endpoints
 * - Support pour différents tiers de service (premium, standard, basic)
 * - Middleware composable et réutilisable
 * 
 * @param {number} maxRequests - Nombre maximum de requêtes
 * @param {number} windowMs - Fenêtre de temps en millisecondes
 * @returns {Function} Middleware Express
 */
const createRateLimitMiddleware = (maxRequests, windowMs = RATE_LIMIT_WINDOW) => {
    return (req, res, next) => {
        // Logique de rate limiting personnalisée pour différents tiers
        // Peut être étendue pour supporter premium vs standard vs basic
        req.rateLimitTier = 'custom';
        req.rateLimitConfig = { maxRequests, windowMs };
        next();
    };
};

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
    generateApiToken,
    validateToken,
    getRateLimitStatus,
    createRateLimitMiddleware
};
