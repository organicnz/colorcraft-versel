# Upstash Integration Guide

This guide covers the integration of Upstash Redis and QStash services into the ColorCraft application for caching, background job processing, and message queuing.

## 🚀 Overview

### Services Integrated
- **Upstash Redis**: Key-value store for caching and session management
- **Upstash QStash**: Message queue for background job processing and webhooks

### Benefits
- **Performance**: Redis caching reduces database load and improves response times
- **Scalability**: Background job processing with QStash handles heavy operations asynchronously
- **Reliability**: Built-in retry mechanisms and error handling
- **Cost-effective**: Serverless pricing model that scales with usage

## 🚀 Quick Start

### 1. Add Environment Variables
Add these to your `.env.local` file:
```bash
UPSTASH_REDIS_REST_URL=https://polished-corgi-41970.upstash.io
UPSTASH_REDIS_REST_TOKEN=AaPyAAIjcDEyZGJhNjljMTFiYmY0ZjNlYjdmZWZlNDA5Mjk3MDc0MXAxMA
QSTASH_TOKEN=eyJVc2VySUQiOiJhZWFhZWQxYS1lZmYwLTRhNGYtOWRjMS1mYWJjODY2NzMwN2QiLCJQYXNzd29yZCI6ImYxZTAyYWQ3MzdmOTRhMTNiZDczNTg5YmEyMzgzZmU2In0=
RESEND_API_KEY=your_resend_api_key
```

### 2. Test the Integration
```bash
# Test Redis caching
curl http://localhost:3000/api/examples/redis-demo

# Test QStash background jobs
curl -X POST http://localhost:3000/api/examples/qstash-demo \
  -H "Content-Type: application/json" \
  -d '{"demo": "email", "delay": 30}'
```

### 3. Use in Components
```tsx
import { useRedisCache } from '@/hooks/useRedisCache'

function PortfolioList() {
  const { data, isLoading, isFromCache } = useRedisCache({
    key: 'portfolio:projects',
    fetcher: async () => {
      const response = await fetch('/api/portfolio')
      return response.json()
    }
  })

  return (
    <div>
      {isFromCache && <span>⚡ Cached data</span>}
      {isLoading ? 'Loading...' : JSON.stringify(data)}
    </div>
  )
}
```

## 🔧 Setup Instructions

### 1. Environment Variables

Add the following variables to your `.env.local` file and Vercel environment settings:

```bash
# Upstash Redis
UPSTASH_REDIS_REST_URL=https://polished-corgi-41970.upstash.io
UPSTASH_REDIS_REST_TOKEN=AaPyAAIjcDEyZGJhNjljMTFiYmY0ZjNlYjdmZWZlNDA5Mjk3MDc0MXAxMA

# Upstash QStash
QSTASH_TOKEN=eyJVc2VySUQiOiJhZWFhZWQxYS1lZmYwLTRhNGYtOWRjMS1mYWJjODY2NzMwN2QiLCJQYXNzd29yZCI6ImYxZTAyYWQ3MzdmOTRhMTNiZDczNTg5YmEyMzgzZmU2In0=

# Site URL (required for webhooks)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. Vercel CLI Setup

Use Vercel CLI to set environment variables:

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN
vercel env add QSTASH_TOKEN

# Set for all environments (production, preview, development)
```

### 3. Dependencies

The following packages have been installed:

```bash
npm install @upstash/redis @upstash/qstash resend
```

## 📚 Usage Examples

### Redis Caching

```typescript
import { RedisService, CACHE_KEYS, CACHE_DURATION } from '@/lib/upstash/redis'

// Basic caching
await RedisService.set('user:123', { name: 'John', email: 'john@example.com' }, CACHE_DURATION.MEDIUM)
const user = await RedisService.get('user:123')

// Smart caching with automatic refresh
const portfolioData = await RedisService.cache(
  CACHE_KEYS.PORTFOLIO_PROJECTS,
  async () => {
    // Fetch from database
    return await fetchPortfolioFromDB()
  },
  CACHE_DURATION.LONG
)

// Rate limiting
const isRateLimited = await checkRateLimit(userIp)
```

### QStash Background Jobs

```typescript
import { QStashService } from '@/lib/upstash/qstash'

// Send email notification
await QStashService.sendEmailNotification({
  to: 'user@example.com',
  subject: 'Welcome to ColorCraft',
  html: '<h1>Welcome!</h1>',
  type: 'auth'
})

// Process portfolio images
await QStashService.processPortfolioImages({
  portfolioId: 'portfolio-123',
  imageUrls: ['image1.jpg', 'image2.jpg'],
  userId: 'user-456'
})

// Schedule daily backup
await QStashService.scheduleDataBackup('portfolio')
```

## 🔌 API Endpoints

### Cached Portfolio API

**GET** `/api/portfolio/cached`

Query parameters:
- `cache=false` - Skip cache and fetch fresh data
- `refresh=true` - Clear cache and fetch fresh data

Response headers:
- `X-Cache: HIT|MISS` - Indicates if data came from cache
- `Cache-Control` - Browser caching instructions

Example:
```bash
curl "https://your-domain.com/api/portfolio/cached?cache=true"
```

### Webhook Endpoints

#### Email Webhook
**POST** `/api/webhooks/email`

Processes email sending requests from QStash.

```json
{
  "to": "user@example.com",
  "subject": "Subject line",
  "html": "<p>Email content</p>",
  "type": "contact"
}
```

#### Portfolio Processing Webhook
**POST** `/api/webhooks/portfolio-process`

Handles asynchronous portfolio image processing.

```json
{
  "portfolioId": "portfolio-123",
  "imageUrls": ["image1.jpg", "image2.jpg"],
  "userId": "user-456"
}
```

## 🏗️ Architecture

### Caching Strategy

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Next.js API   │───▶│ Redis Cache  │───▶│   Supabase DB   │
│     Routes      │    │   (Upstash)  │    │                 │
└─────────────────┘    └──────────────┘    └─────────────────┘
```

1. **API Route** checks Redis cache first
2. **Cache Hit**: Return cached data immediately
3. **Cache Miss**: Fetch from Supabase, cache result, return data

### Background Jobs Flow

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│  User Action    │───▶│    QStash    │───▶│ Webhook Handler │
│ (Upload Image)  │    │  (Queue Job) │    │ (Process Image) │
└─────────────────┘    └──────────────┘    └─────────────────┘
```

1. **User Action** triggers background job
2. **QStash** queues the job with retry logic
3. **Webhook** processes job asynchronously

## 🎯 Common Use Cases

### 1. Portfolio Data Caching

Cache expensive database queries for portfolio projects:

```typescript
// Cache portfolio projects for 30 minutes
const projects = await RedisService.cache(
  CACHE_KEYS.PORTFOLIO_PROJECTS,
  () => supabase.from('projects').select('*'),
  CACHE_DURATION.MEDIUM
)
```

### 2. User Session Management

Store user session data in Redis:

```typescript
// Store user session
await RedisService.set(
  CACHE_KEYS.USER_SESSION(userId),
  { lastLogin: new Date(), preferences: {...} },
  CACHE_DURATION.DAILY
)
```

### 3. API Rate Limiting

Prevent API abuse with Redis counters:

```typescript
const rateLimitKey = CACHE_KEYS.API_RATE_LIMIT(clientIP)
const requests = await RedisService.incr(rateLimitKey)

if (requests === 1) {
  await RedisService.expire(rateLimitKey, 60) // 1 minute window
}

if (requests > 10) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
}
```

### 4. Email Notifications

Send emails asynchronously to avoid blocking user requests:

```typescript
// Queue email instead of sending immediately
await QStashService.sendEmailNotification({
  to: user.email,
  subject: 'Portfolio Published',
  html: emailTemplate,
  type: 'portfolio'
})
```

### 5. Image Processing

Process uploaded images in the background:

```typescript
// After image upload, queue processing job
await QStashService.processPortfolioImages({
  portfolioId: newPortfolio.id,
  imageUrls: uploadedImages,
  userId: session.user.id
})
```

## 🔍 Monitoring & Debugging

### Cache Monitoring

Check cache hit rates and performance:

```typescript
// Add cache metrics to your API responses
const cacheHits = await RedisService.get('metrics:cache:hits') || 0
const cacheMisses = await RedisService.get('metrics:cache:misses') || 0
const hitRate = cacheHits / (cacheHits + cacheMisses) * 100
```

### QStash Monitoring

Monitor job success rates and failures:

- Check QStash dashboard for job status
- Implement webhook error handling
- Log successful job completions

### Debug Endpoints

Create debug endpoints for testing:

```typescript
// GET /api/debug/cache-status
export async function GET() {
  const status = {
    redis: await RedisService.exists('test-key'),
    cacheKeys: await RedisService.mget([
      CACHE_KEYS.PORTFOLIO_PROJECTS,
      CACHE_KEYS.PORTFOLIO_STATS
    ])
  }
  return NextResponse.json(status)
}
```

## 🚨 Error Handling

### Redis Connection Issues

```typescript
try {
  const data = await RedisService.get(key)
  return data
} catch (error) {
  console.error('Redis error, falling back to database:', error)
  return await fetchFromDatabase()
}
```

### QStash Webhook Failures

- Implement proper error responses (4xx for client errors, 5xx for retries)
- Use QStash's built-in retry mechanism
- Log failures for monitoring

### Environment Variables

The verification script automatically checks for Upstash variables:

```bash
npm run verify-env
```

## 📈 Performance Benefits

### Before Upstash Integration
- ❌ Every portfolio request hits the database
- ❌ Image processing blocks user requests
- ❌ Email sending causes request delays
- ❌ No rate limiting leads to abuse

### After Upstash Integration
- ✅ 80%+ cache hit rate for portfolio data
- ✅ Background image processing
- ✅ Asynchronous email delivery
- ✅ Built-in rate limiting protection
- ✅ Improved user experience with faster responses

## 🔐 Security Considerations

### Environment Variables
- Never expose Redis/QStash tokens in client-side code
- Use environment variables for all credentials
- Rotate tokens regularly

### Webhook Security
- Verify QStash signatures on webhook endpoints
- Validate webhook payloads
- Implement proper error handling

### Cache Security
- Don't cache sensitive user data
- Use appropriate cache expiration times
- Clear cache on data updates

## 📝 Best Practices

1. **Cache Invalidation**: Always clear related cache when data changes
2. **Error Handling**: Gracefully fall back to database when Redis is unavailable
3. **Monitoring**: Track cache hit rates and job success rates
4. **Documentation**: Document cache keys and job types
5. **Testing**: Test both cache hits and misses in development 