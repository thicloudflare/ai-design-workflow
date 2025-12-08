# Deploy to Cloudflare Workers Now

## Step 1: Get Your Cloudflare API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template
4. Or create a custom token with these permissions:
   - Account > Workers Scripts > Edit
   - Account > Workers KV Storage > Edit
5. Click "Continue to summary" then "Create Token"
6. **Copy the token** (you won't see it again!)

## Step 2: Set Your API Token

Run this command and paste your token when prompted:

```bash
npx wrangler login
```

Or set it as an environment variable:

```bash
export CLOUDFLARE_API_TOKEN=your-token-here
```

Or create a `.env` file in your project root:

```
CLOUDFLARE_API_TOKEN=your-token-here
```

## Step 3: Deploy

```bash
npm run deploy
```

This will:
1. Build your Next.js site (`npm run build`)
2. Upload static assets to Workers KV
3. Deploy the Worker script
4. Give you a live URL!

## Troubleshooting

### If you get "Account ID not found":

Add your account ID to `wrangler.toml`:

```toml
account_id = "your-account-id"
```

You can find your Account ID at: https://dash.cloudflare.com/ (right sidebar)

### If login still fails:

Try setting the token in wrangler config:

```bash
npx wrangler config set account_id YOUR_ACCOUNT_ID
```

## Alternative: Manual Deploy via Dashboard

If all else fails, you can deploy manually:

1. Run: `npm run build`
2. Go to: https://dash.cloudflare.com/
3. Navigate to Workers & Pages
4. Create a new Worker
5. Upload the `worker.js` file
6. Configure KV namespace for assets
7. Upload files from `out/` directory to KV

But using Wrangler CLI is much easier!
