# API Authentication & Rate Limiting

This API uses token-based authentication for rate limiting without requiring user login.

## Environment Configuration

Add these environment variables to your `.env` file:

```env
# JWT Secret for API Token Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Rate Limiting Configuration (optional)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## Getting an API Token

### Request Token
```http
POST /api/auth/token
Content-Type: application/json
```

### Response
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
  "expiresIn": "30 days",
  "message": "API token generated successfully"
}
```

## Using the Token

Include the token in the Authorization header for all API requests:

```http
GET /api/artisans
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Rate Limiting

- **Standard Tier**: 100 requests per minute
- **Premium Tier**: 500 requests per minute (configurable)
- **Basic Tier**: 50 requests per minute (configurable)

### Rate Limit Headers

All responses include rate limit information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200000
X-RateLimit-Reset-Date: 2021-12-31T23:00:00.000Z
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "retryAfter": 30,
  "rateLimit": {
    "remaining": 0,
    "reset": 1640995200000,
    "limit": 100
  }
}
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/token` | Generate API token | No |
| GET | `/api/auth/status` | Check rate limit status | Yes |
| GET | `/api/auth/validate` | Validate token | Yes |

### Protected Endpoints

All artisan endpoints now require authentication:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/artisans` | Get all artisans |
| GET | `/api/artisans/:id` | Get artisan by ID |
| POST | `/api/artisans` | Create artisan |
| PUT | `/api/artisans/:id` | Update artisan |
| DELETE | `/api/artisans/:id` | Delete artisan |

## Error Codes

| Code | Description |
|------|-------------|
| `TOKEN_EXPIRED` | Token has expired |
| `INVALID_TOKEN` | Token is malformed or invalid |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

## Example Usage

### 1. Get API Token
```bash
curl -X POST http://localhost:5000/api/auth/token
```

### 2. Use Token to Access API
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/artisans
```

### 3. Check Rate Limit Status
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/auth/status
```

## Security Notes

- Tokens expire after 30 days
- Rate limiting is enforced per client ID
- Use HTTPS in production
- Keep JWT_SECRET secure and unique per environment
- Consider using Redis for rate limiting in production (currently uses in-memory storage) 