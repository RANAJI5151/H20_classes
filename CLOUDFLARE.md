# Cloudflare Deployment & Configuration Guide

## Prerequisites
1. Cloudflare account (free or paid)
2. Wrangler CLI: `npm install -g wrangler`
3. Your domain added to Cloudflare

## Setup Steps

### 1. Configure Wrangler
```bash
wrangler init
```

### 2. Update wrangler.toml
- Add your `account_id` (found in Cloudflare dashboard)
- Set your domain and zone settings
- Configure environment variables

### 3. Configure Environment Variables
```bash
# Create .env file based on .env.cloudflare
cp .env.cloudflare .env
```

### 4. Deployment Options

#### Option A: Deploy Frontend Only (Cloudflare Pages)
```bash
npm run deploy:pages
```

#### Option B: Deploy Full Stack (Pages + Workers)
```bash
npm run deploy:cloudflare
```

#### Option C: Deploy to Custom Domain
```bash
wrangler pages publish dist/public --project-name=h20-classes
```

### 5. Database Configuration

#### Option 1: Keep PostgreSQL (Recommended for Now)
- Ensure your PostgreSQL database is accessible
- Update DATABASE_URL in environment variables
- Cloudflare Workers can connect to external databases with Cloudflare Tunnel

#### Option 2: Migrate to Cloudflare D1 (SQLite)
- Requires converting Drizzle ORM configuration
- Run: `wrangler d1 create h20-classes`
- Uncomment D1 binding in wrangler.toml

### 6. Session Management

For Cloudflare Workers, session options:
- Use Durable Objects (uncomment in wrangler.toml)
- Use external session store (Redis or PostgreSQL)
- Use JWT tokens instead of sessions

### 7. API Routing

Two approaches:

#### Approach 1: Proxy Pattern (Current Setup)
- Frontend: Cloudflare Pages
- Backend: Keep Express running separately
- Worker: Proxies /api/* requests to backend

#### Approach 2: Full Migration to Workers
- Requires converting Express endpoints to Cloudflare Pages Functions or Hono
- See functions/ directory for examples

### 8. Verify Deployment
```bash
# Test Pages deployment
curl https://your-project.pages.dev

# Test Worker deployment
curl https://your-project.workers.dev/api/health
```

## Environment Variables in Cloudflare

### For Cloudflare Pages
Use `wrangler.toml` [env] sections or Pages dashboard

### For Cloudflare Workers
```bash
wrangler secret put SESSION_SECRET
wrangler secret put DATABASE_URL
```

## Performance Optimization

1. **Enable Caching**: Configure cache rules in wrangler.toml
2. **Minify**: Already handled by Vite
3. **Enable Brotli**: Automatic with Cloudflare
4. **Edge Locations**: Enabled automatically

## Troubleshooting

### API requests failing
- Check CORS settings in Worker
- Verify backend is accessible from Cloudflare
- Check firewall rules

### Database connection issues
- Ensure database URL is correct
- Check Cloudflare network settings
- Consider using Cloudflare Tunnel for secure connection

### Static files not serving
- Verify dist/public exists
- Check _redirects file
- Clear Cloudflare cache

## Related Documentation
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
