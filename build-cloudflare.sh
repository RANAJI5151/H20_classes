#!/bin/bash

# Build script for Cloudflare deployment
# This script builds the project for deployment to Cloudflare Pages and Workers

set -e

echo "🔨 Building for Cloudflare..."

# Check if Node.js version is compatible
NODE_VERSION=$(node --version)
echo "✅ Using Node.js $NODE_VERSION"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm ci
fi

# Build frontend for Cloudflare Pages
echo "🏗️  Building frontend (Cloudflare Pages)..."
npm run build

# Build worker for Cloudflare Workers
echo "🏗️  Building worker (Cloudflare Workers)..."
npm run build:worker

# create /dist if it doesn't exist
mkdir -p dist

echo "✅ Build complete!"
echo ""
echo "📍 Frontend output: dist/public/"
echo "📍 Worker output: dist/worker.js"
echo ""
echo "🚀 Ready for deployment:"
echo "   - Pages: npm run deploy:pages"
echo "   - Workers: wrangler deploy"
echo "   - Full Stack: npm run deploy:cloudflare"
