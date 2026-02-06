# Cloudflare Integration Checklist

## ✅ Installation & Setup

- [x] Created `wrangler.toml` - Main Cloudflare configuration
- [x] Created `wrangler.dev.toml` - Development environment config
- [x] Created `worker.ts` - Cloudflare Workers entry point
- [x] Added Cloudflare CLI to package.json
- [x] Created `functions/` directory for Cloudflare Pages Functions
- [x] Added build scripts for Cloudflare deployment

## 📋 Configuration Files Created

1. **wrangler.toml** - Production Cloudflare configuration
2. **wrangler.dev.toml** - Development Cloudflare configuration
3. **worker.ts** - Workers entry point
4. **tsconfig.worker.json** - TypeScript config for Workers
5. **functions/_middleware.ts** - Pages Functions middleware
6. **functions/api/health.ts** - Example Pages Function (health check)
7. **.env.cloudflare** - Example environment variables
8. **shared/cloudflare-utils.ts** - CORS and security utilities
9. **.github/workflows/cloudflare-deploy.yml** - CI/CD workflow

## 🚀 Quick Start

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare
```bash
wrangler login
```

### 3. Configure Your Project
```bash
# Get your Account ID from Cloudflare Dashboard
# Update wrangler.toml with your account_id and zone_name
```

### 4. Setup Environment Variables
```bash
cp .env.cloudflare .env
# Edit .env with your configuration
```

### 5. Test Locally
```bash
# Terminal 1: Run Express server
npm run dev

# Terminal 2: Run Cloudflare development environment
npm run dev:pages
```

### 6. Deploy
```bash
# Deploy Pages (frontend)
npm run deploy:pages

# Deploy Workers (API proxy)
wrangler deploy

# Deploy both
npm run deploy:cloudflare
```

## 🔧 Configuration Details

### Update wrangler.toml

```toml
account_id = "your-account-id-here"

[env.production]
routes = [
  { pattern = "api.yourdomain.com/api/*", zone_name = "yourdomain.com" }
]
```

### Set Secrets in Cloudflare

```bash
wrangler secret put SESSION_SECRET
wrangler secret put DATABASE_URL
wrangler secret put ORIGIN_URL
```

## 📁 Project Structure for Cloudflare

```
H20_classes/
├── client/              # React frontend (Cloudflare Pages)
│   └── public/
│       └── _redirects   # Pages routing rules
├── functions/           # Cloudflare Pages Functions
│   ├── _middleware.ts   # Global middleware
│   └── api/
│       └── health.ts    # Example API endpoint
├── server/              # Express backend (keep running separately)
├── shared/
│   ├── cloudflare-utils.ts
│   └── schema.ts        # Shared types
├── worker.ts            # Workers entry point
├── wrangler.toml        # Production config
├── wrangler.dev.toml    # Dev config
└── tsconfig.worker.json # Worker TypeScript config
```

## 🔄 Deployment Options

### Option 1: Frontend Only (Recommended for Testing)
- Use Cloudflare Pages for React app
- Keep backend on existing infrastructure
- Pages Functions proxy to origin

### Option 2: Full Stack on Cloudflare
- Frontend on Pages
- API on Workers
- Database: PostgreSQL (Tunnel) or D1

### Option 3: Hybrid (Current Setup)
- Fresh deployment of frontend
- Legacy backend as backup
- Gradual migration

## ⚙️ Environment-Specific Configuration

### Development
```bash
npm run dev:pages
# Runs local Express + Cloudflare Pages dev mode
```

### Production
```bash
npm run build
npm run deploy:cloudflare
# Builds and deploys to Cloudflare
```

## 🔀 Routing Setup

### API Routes (Automatic)
- `/api/*` → Cloudflare Pages Functions
- → Falls back to `ORIGIN_URL` if no function defined
- → Returns 503 if origin unreachable

### Static Routes (Automatic)
- `/` → Cloudflare Pages (React SPA)
- `/public/*` → Static assets
- `/*` → Redirects to index.html (SPA routing)

## 🛡️ Security Features

✅ CORS headers configured  
✅ Security headers set (X-Frame-Options, etc.)  
✅ Request logging enabled  
✅ Environment secrets support  
✅ HTTPS enforced  

## 📊 Monitoring & Logs

### View Logs
```bash
# Real-time logs
wrangler tail

# Pages logs
wrangler pages deployment tail
```

### Metrics
- Check Cloudflare Dashboard for:
  - Request rates
  - Error rates
  - Cache hit ratios
  - Response times

## 🐛 Troubleshooting

### Issue: "Account ID not found"
**Solution:** Run `wrangler login` and check your account ID in the dashboard

### Issue: API requests return 503
**Solution:** Check if origin server is running and accessible

### Issue: Database connection fails
**Solution:** Verify DATABASE_URL in wrangler secrets

### Issue: CORS errors
**Solution:** Update allowed origins in `shared/cloudflare-utils.ts`

## 📚 Next Steps

1. **Incremental Migration**: Convert Express routes to Pages Functions as needed
2. **D1 Migration**: Move from PostgreSQL to Cloudflare D1 for better performance
3. **KV Storage**: Add Cloudflare KV for caching and sessions
4. **Durable Objects**: Use for stateful features if needed
5. **Analytics Engine**: Track custom metrics

## 📖 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- [Drizzle ORM with Cloudflare](https://orm.drizzle.team/docs/cloudflare-d1)

## 🤝 Support

For issues or questions:
1. Check Cloudflare Community: https://community.cloudflare.com
2. View Logs: `wrangler tail --follow`
3. Test Locally: `npm run dev:pages`
