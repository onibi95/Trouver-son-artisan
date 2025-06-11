ssh# Documentation des Règles de Sécurité API

## Vue d'ensemble

Ce document détaille toutes les mesures de sécurité implémentées dans l'API Artisans, notamment l'authentification par tokens JWT et le système de rate limiting.

## 🔐 Système d'Authentification

### Tokens JWT

#### Structure et Sécurité
- **Type de signature** : HMAC SHA256
- **Clé secrète** : Variable d'environnement `JWT_SECRET` (obligatoire en production)
- **Expiration** : 30 jours automatiques
- **Payload sécurisé** :
  ```json
  {
    "clientId": "uuid-v4-unique",
    "type": "api_access",
    "generatedAt": "2024-01-01T00:00:00.000Z",
    "rateLimitTier": "standard",
    "iat": 1704067200,
    "exp": 1706659200
  }
  ```

#### Validation Stricte
- ✅ Vérification de la signature JWT
- ✅ Validation de l'expiration
- ✅ Contrôle du type de token (`api_access` uniquement)
- ✅ Format Bearer Token requis dans l'header Authorization

#### Gestion des Erreurs
| Code | Erreur | Description |
|------|--------|-------------|
| 401 | `TOKEN_EXPIRED` | Token expiré, regénération nécessaire |
| 401 | `INVALID_TOKEN` | Token malformé ou signature invalide |
| 401 | `TOKEN_REQUIRED` | Header Authorization manquant |
| 401 | `INVALID_TOKEN_TYPE` | Type de token non autorisé |

## 🚦 Système de Rate Limiting

### Paramètres de Base

```javascript
const SECURITY_CONFIG = {
  RATE_LIMIT_WINDOW: 60000,        // 1 minute (60 secondes)
  RATE_LIMIT_MAX_REQUESTS: 100,    // 100 requêtes par minute
  TOKEN_EXPIRY: '30d',             // Expiration des tokens
  STORAGE: 'in-memory'             // ⚠️ Redis recommandé en production
};
```

### Algorithme de Fenêtre Glissante

#### Fonctionnement
1. **Tracking individuel** : Chaque `clientId` a son propre compteur
2. **Fenêtre glissante** : Les requêtes sont comptées sur les 60 dernières secondes
3. **Nettoyage automatique** : Les anciennes requêtes sont supprimées automatiquement
4. **Isolation** : Un client ne peut pas affecter les limites des autres

#### Calcul du Rate Limit
```javascript
// Exemple de calcul
const currentTime = Date.now();
const validRequests = clientRequests.filter(
  timestamp => currentTime - timestamp < RATE_LIMIT_WINDOW
);

if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
  // Rate limit dépassé
  const oldestRequest = Math.min(...validRequests);
  const retryAfter = Math.ceil(
    (oldestRequest + RATE_LIMIT_WINDOW - currentTime) / 1000
  );
}
```

### Headers de Rate Limiting

Chaque réponse inclut des headers informatifs :

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1704067860000
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Limite maximale de requêtes par fenêtre |
| `X-RateLimit-Remaining` | Nombre de requêtes restantes |
| `X-RateLimit-Reset` | Timestamp de réinitialisation (epoch) |

### Tiers de Service

| Tier | Limite | Usage Recommandé |
|------|--------|------------------|
| **Basic** | 50 req/min | Tests, développement |
| **Standard** | 100 req/min | Usage normal (par défaut) |
| **Premium** | 500 req/min | Applications critiques |

## 🛡️ Mesures de Protection

### Protection contre les Attaques

#### Déni de Service (DoS)
- **Rate limiting strict** par client
- **Isolation des clients** (pas d'impact croisé)
- **Expiration automatique** des tokens
- **Nettoyage mémoire** automatique

#### Attaques par Token
- **Validation signature** à chaque requête
- **Vérification type** de token
- **Gestion d'expiration** stricte
- **Pas d'informations sensibles** dans les logs d'erreur

#### Fuites d'Informations
- **Messages d'erreur génériques** sans détails internes
- **Logs sécurisés** sans exposition de tokens
- **Headers informatifs** mais non sensibles

### Codes de Réponse de Sécurité

| Code HTTP | Signification | Action Client |
|-----------|---------------|---------------|
| 200 | Authentifié et autorisé | Continuer |
| 401 | Token invalide/expiré | Regénérer token |
| 429 | Rate limit dépassé | Attendre `retryAfter` secondes |
| 500 | Erreur serveur | Réessayer plus tard |

## 🔧 Configuration et Déploiement

### Variables d'Environnement Critiques

```bash
# OBLIGATOIRE en production
JWT_SECRET=your-super-secure-jwt-secret-key-256-bits-minimum

# OPTIONNEL - Configuration rate limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Recommandations de Production

#### Stockage du Rate Limiting
```javascript
// ⚠️ Développement uniquement
const tokenUsage = new Map();

// ✅ Production recommandée
const redis = require('redis');
const client = redis.createClient();
```

#### Sécurité JWT
- **Clé secrète** : Minimum 256 bits, générée cryptographiquement
- **Rotation** : Rotation périodique de la clé secrète
- **HTTPS** : Transport sécurisé obligatoire
- **Same-Origin** : Politique CORS restrictive

#### Monitoring
```javascript
// Métriques recommandées
const metrics = {
  totalTokensGenerated: 0,
  rateLimitViolations: 0,
  expiredTokenAttempts: 0,
  invalidTokenAttempts: 0
};
```

## 📊 Utilisation et Exemples

### Génération de Token

```bash
curl -X POST http://localhost:5000/api/auth/token \
  -H "Content-Type: application/json"
```

**Réponse :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "clientId": "550e8400-e29b-41d4-a716-446655440000",
  "rateLimit": {
    "maxRequests": 100,
    "windowMs": 60000,
    "tier": "standard"
  },
  "expiresIn": "30 days"
}
```

### Utilisation du Token

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:5000/api/artisans
```

### Vérification du Status

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5000/api/auth/status
```

**Réponse :**
```json
{
  "success": true,
  "rateLimit": {
    "limit": 100,
    "remaining": 87,
    "reset": 1704067860000,
    "window": 60000,
    "tier": "standard"
  },
  "clientId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Gestion d'Erreurs Rate Limit

```bash
# Réponse quand rate limit dépassé
HTTP/1.1 429 Too Many Requests
{
  "success": false,
  "message": "Rate limit exceeded",
  "retryAfter": 30,
  "rateLimit": {
    "remaining": 0,
    "reset": 1704067860000,
    "limit": 100
  }
}
```

## 🔍 Debugging et Monitoring

### Logs de Sécurité

Les événements suivants sont loggés :
- ✅ Génération de nouveaux tokens
- ✅ Violations de rate limiting
- ✅ Tentatives d'utilisation de tokens expirés
- ✅ Tokens invalides ou malformés
- ❌ **Jamais** : Contenu des tokens ou clés secrètes

### Métriques Recommandées

```javascript
const securityMetrics = {
  // Authentification
  tokensGenerated: 0,
  tokenValidations: 0,
  expiredTokenAttempts: 0,
  invalidTokenAttempts: 0,
  
  // Rate Limiting
  rateLimitViolations: 0,
  averageRequestsPerClient: 0,
  peakRequestsPerMinute: 0,
  
  // Performance
  averageValidationTime: 0,
  cacheMissRate: 0
};
```

## ⚠️ Considérations de Sécurité

### Limites Actuelles

1. **Stockage en mémoire** : Ne scale pas horizontalement
2. **Pas de persistance** : Redémarrage = perte des compteurs
3. **Pas d'audit trail** : Logs limités des événements de sécurité

### Améliorations Recommandées

1. **Migration vers Redis** pour le stockage du rate limiting
2. **Audit logging** complet des événements de sécurité
3. **Métriques temps réel** avec alerting
4. **Rate limiting géographique** (par IP/région)
5. **Détection d'anomalies** automatisée

### Threat Model

| Menace | Mitigation Actuelle | Risque Résiduel |
|--------|-------------------|-----------------|
| DoS par volume | Rate limiting | Moyen (mémoire limitée) |
| Token theft | Expiration + HTTPS | Faible |
| Brute force | Rate limiting | Faible |
| Token forgery | Signature JWT | Très faible |
| Memory exhaustion | Nettoyage auto | Moyen |

## 📞 Support et Maintenance

### Alertes Recommandées

- Rate limit violations > 100/minute
- Tokens expirés > 50% des tentatives
- Erreurs de validation > 10% des requêtes
- Utilisation mémoire > 80%

### Procédures d'Urgence

1. **Compromission suspectée** : Rotation immédiate de `JWT_SECRET`
2. **Attaque DoS** : Réduction temporaire des limites
3. **Fuite de token** : Blacklist manuelle (à implémenter)
4. **Surcharge système** : Passage en mode maintenance

---

*Cette documentation doit être mise à jour à chaque modification du système de sécurité.* 