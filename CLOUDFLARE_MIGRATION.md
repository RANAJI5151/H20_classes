# Cloudflare Migration Guide

## Overview

This guide helps you gradually migrate your Express.js application to Cloudflare infrastructure.

## Migration Checklist

### Phase 1: Frontend (Immediate - 1-2 hours)
- [ ] Update `wrangler.toml` with your account ID
- [ ] Test locally: `npm run dev:pages`
- [ ] Deploy frontend: `npm run deploy:pages`
- [ ] Verify static assets load correctly
- [ ] Test API proxying to local backend

### Phase 2: API Layer (Next - 2-4 hours)
- [ ] Migrate one endpoint to `functions/api/` pattern
- [ ] Test locally with `npm run dev:pages`
- [ ] Verify request/response format matches
- [ ] Deploy worker: `wrangler deploy`
- [ ] Repeat for other endpoints

### Phase 3: Environment Configuration (Ongoing)
- [ ] Set up secrets: `wrangler secret put KEY`
- [ ] Configure D1 database (optional)
- [ ] Setup KV for caching (optional)
- [ ] Configure Durable Objects for state (optional)

### Phase 4: Full Migration (Advanced)
- [ ] Convert all Express routes to Pages Functions
- [ ] Migrate to Cloudflare D1 or Atlas
- [ ] Setup analytics and monitoring
- [ ] Sunset Express backend

## Step-by-Step Migration

### Step 1: Verify Cloudflare Account Setup

```bash
# Authenticate with Cloudflare
wrangler login

# View account information
wrangler whoami

# Copy your Account ID and update wrangler.toml
```

### Step 2: Test Local Development

```bash
# Terminal 1: Start Express backend
npm run dev

# Terminal 2: Start Cloudflare Pages dev
npm run dev:pages

# Visit http://localhost:8788 (or shown URL)
```

### Step 3: Migrate First Endpoint (Example: Health Check)

**Before (Express):**
```typescript
// server/routes.ts
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
```

**After (Pages Function):**
```typescript
// functions/api/health.ts
export const onRequest: PagesFunction = (context) => {
  return new Response(
    JSON.stringify({ status: 'ok' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
```

### Step 4: Migrate Authentication Endpoint (Example)

```typescript
// functions/api/auth/login.ts
import { handleCorsPreFlight } from '../../../shared/cloudflare-utils';

export const onRequest: PagesFunction = async (context) => {
  // Handle CORS preflight
  const preflight = handleCorsPreFlight(context.request);
  if (preflight) return preflight;

  if (context.request.method === 'POST') {
    const body = await context.request.json();
    
    // Your authentication logic here
    const response = {
      success: true,
      user: { id: '123' }
    };

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  return new Response('Method not allowed', { status: 405 });
};
```

### Step 5: Deploy Changes

```bash
# Build for production
npm run build

# Deploy frontend
npm run deploy:pages

# Deploy worker
wrangler deploy

# Or deploy both
npm run deploy:cloudflare
```

## Express to Cloudflare Endpoint Mapping

### 1. Simple GET Endpoint

**Express:**
```typescript
app.get('/api/users', (req, res) => {
  const users = [{ id: 1, name: 'John' }];
  res.json(users);
});
```

**Cloudflare Pages Function:**
```typescript
// functions/api/users.ts
export const onRequest: PagesFunction = () => {
  const users = [{ id: 1, name: 'John' }];
  return new Response(JSON.stringify(users), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### 2. POST with Validation

**Express:**
```typescript
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  // Create user...
  res.json({ id: 1, name, email });
});
```

**Cloudflare Pages Function:**
```typescript
// functions/api/users.ts
export const onRequest: PagesFunction = async (context) => {
  if (context.request.method === 'POST') {
    const { name, email } = await context.request.json();
    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // Create user...
    return new Response(JSON.stringify({ id: 1, name, email }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

### 3. Database Query

**Express:**
```typescript
app.get('/api/courses', async (req, res) => {
  const courses = await db.select().from(coursesTable);
  res.json(courses);
});
```

**Cloudflare Pages Function:**
```typescript
// functions/api/courses.ts
import { db } from '../shared/database';
import { coursesTable } from '../shared/schema';

export const onRequest: PagesFunction = async (context) => {
  try {
    const courses = await db.select().from(coursesTable);
    return new Response(JSON.stringify(courses), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

## Handling Common Patterns

### Middleware

**Express:**
```typescript
app.use(authenticateUser);
app.post('/api/admin/users', (req, res) => { ... });
```

**Cloudflare:**
Use middleware in `functions/_middleware.ts`:
```typescript
export const onRequest: PagesFunction[] = [
  authenticateUser,
  handleRequest,
];

async function authenticateUser(context) {
  const token = context.request.headers.get('Authorization');
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  return context.next();
}
```

### Error Handling

**Express:**
```typescript
try {
  const data = await fetchData();
  res.json(data);
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

**Cloudflare:**
```typescript
try {
  const data = await fetchData();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
} catch (error) {
  return new Response(
    JSON.stringify({ error: (error as Error).message }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}
```

## Database Migration

### Option 1: Keep PostgreSQL (Current Setup)

✅ **Pros:**
- No code changes required
- Full PostgreSQL features available
- Familiar tooling

❌ **Cons:**
- Need database tunnel to Cloudflare
- Higher latency
- Cost for external database

**Setup:**
```bash
# Install tunnel client on database server
# Or use connection string through Cloudflare Tunnel

# Set secret
wrangler secret put DATABASE_URL
```

### Option 2: Migrate to D1 (Cloudflare SQLite)

✅ **Pros:**
- Built into Cloudflare
- Zero latency
- Serverless

❌ **Cons:**
- Schema conversion needed
- Limited PostgreSQL-specific features
- Different migration workflow

**Setup:**
```bash
# Create D1 database
wrangler d1 create h20-classes

# Import existing data
wrangler d1 execute h20-classes --file=backup.sql

# Install D1 adapter
npm install drizzle-orm @cloudflare/workers-types

# Update schema configuration
```

## Testing Before Deployment

### Local Testing

```bash
# Run both servers
npm run dev:pages

# Test endpoints
curl http://localhost:8788/api/health
curl http://localhost:8788/api/courses
```

### Staging Deployment

```bash
# Deploy to staging branch
wrangler pages publish --branch=staging

# Test at staging URL
curl https://staging.yoursite.com/api/health
```

### Production Checklist

- [ ] All endpoints tested locally
- [ ] Environment variables set
- [ ] Database connections verified
- [ ] CORS configuration correct
- [ ] Security headers in place
- [ ] Rate limiting configured
- [ ] Logging enabled
- [ ] Rollback plan ready

## Rollback Plan

If issues occur during migration:

```bash
# Revert to previous deployment
wrangler rollback

# Or use git to reset
git revert <commit>
npm run deploy:cloudflare
```

## Performance Optimization

### Caching

**Cloudflare KV:**
```typescript
export const onRequest: PagesFunction = async (context) => {
  const cache = context.env.CACHE;
  const cached = await cache.get('key');
  
  if (cached) return new Response(cached);
  
  const data = await fetchData();
  await cache.put('key', JSON.stringify(data), { expirationTtl: 3600 });
  
  return new Response(JSON.stringify(data));
};
```

### Code Splitting

- Move large dependencies to Web Workers
- Use dynamic imports in Pages Functions
- Minimize bundle size

## Monitoring & Debugging

### Enable Logging

```typescript
console.log('Message'); // Appears in `wrangler tail`
```

### View Logs

```bash
wrangler tail --follow
```

### Metrics

- Check Cloudflare dashboard
- Use Workers Analytics
- Setup custom metrics with Analytics Engine

## Troubleshooting

### Routes Not Found

Check `functions/` directory structure:
```
functions/
├── _middleware.ts
├── api/
│   ├── health.ts      → /api/health
│   └── courses.ts     → /api/courses
└── index.ts           → /
```

### Database Connection Timeout

- Verify DATABASE_URL is correct
- Check network connectivity
- Increase timeout in connection pool
- Consider using Cloudflare Tunnel

### CORS Errors

Update `shared/cloudflare-utils.ts`:
```typescript
headers.set('Access-Control-Allow-Origin', 'https://yourdomain.com');
```

### Performance Issues

- Check function execution time in logs
- Optimize database queries
- Use caching with KV
- Enable compression

## Resources

- [Cloudflare Pages Migration Guide](https://developers.cloudflare.com/pages/migrations/)
- [Workers Troubleshooting](https://developers.cloudflare.com/workers/troubleshooting/)
- [Drizzle ORM Cloudflare Docs](https://orm.drizzle.team/docs/get-started-sqlite#cloudflare-d1)
