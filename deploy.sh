#!/bin/bash
set -e

# Check if out directory exists
if [ ! -d "out" ]; then
    echo "Building Next.js app..."
    npm run build
fi

# Check if token is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ Error: CLOUDFLARE_API_TOKEN environment variable is not set"
    echo "Please set it with: export CLOUDFLARE_API_TOKEN=your-token"
    exit 1
fi

echo "Deploying to Cloudflare Workers..."
npx wrangler deploy

echo "✅ Deployment complete!"
echo "Your site: https://ai-design-workflow.thi-s-ent-account.workers.dev/"
