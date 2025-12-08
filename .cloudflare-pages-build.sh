#!/bin/bash
set -e

# Build Next.js static export
echo "Building Next.js application..."
npm run build

# Deploy with Wrangler
echo "Deploying to Cloudflare Workers..."
npx wrangler deploy
