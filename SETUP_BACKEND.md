# Backend Setup for Tool Submission System

This guide will help you set up the backend infrastructure for the tool submission and approval system.

## Prerequisites

- Cloudflare account with Workers/KV access
- Resend account (free tier available) for sending emails

## Step 1: Create KV Namespace

Run these commands to create the KV namespace for storing submissions:

```bash
# Create production KV namespace
npx wrangler kv:namespace create "SUBMISSIONS"

# Create preview KV namespace (for local dev)
npx wrangler kv:namespace create "SUBMISSIONS" --preview
```

This will output something like:
```
🌀  Creating namespace with title "ai-design-workflow-SUBMISSIONS"
✨  Success!
Add the following to your wrangler.toml:
[[kv_namespaces]]
binding = "SUBMISSIONS"
id = "abc123..."
```

**Copy the IDs** and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "SUBMISSIONS"
id = "your-production-id-here"
preview_id = "your-preview-id-here"
```

## Step 2: Get Resend API Key

1. Go to https://resend.com/
2. Sign up for a free account
3. Verify your domain (or use their test domain for development)
4. Go to **API Keys** section
5. Create a new API key with **Sending access**
6. Copy the API key

## Step 3: Add Resend API Key to Workers

Store your Resend API key as a secret in Cloudflare Workers:

```bash
npx wrangler secret put RESEND_API_KEY
```

When prompted, paste your Resend API key.

## Step 4: Update Email Sender in API Handler

Edit `api-handler.js` and update the `from` address:

```javascript
from: 'noreply@yourdomain.com',  // Use your verified domain
```

If using Resend's test domain:
```javascript
from: 'onboarding@resend.dev',
```

## Step 5: Test the Setup

Build and deploy:

```bash
npm run build
export CLOUDFLARE_API_TOKEN=your-token
npx wrangler deploy
```

Test the submission form:
1. Go to your site: https://ai-design-workflow.thi-s-ent-account.workers.dev/submit
2. Fill out the form
3. Check that email is sent to thi@cloudflare.com
4. Click the approval link in the email
5. Verify the tool is approved

## Approval Workflow

When a tool is submitted:
1. Form sends POST request to `/api/submit`
2. Worker stores submission in KV with unique token
3. Email is sent to thi@cloudflare.com with approval link
4. Clicking approval link:
   - Moves submission from "pending" to "approved" in KV
   - Shows success page
   - Tool becomes available via `/api/tools` endpoint

## Retrieving Approved Tools (Optional)

To display approved tools dynamically on the site, you can fetch them:

```javascript
const response = await fetch('/api/tools');
const approvedTools = await response.json();
```

## Troubleshooting

### Email not sending
- Check that RESEND_API_KEY secret is set correctly
- Verify your sender domain is verified in Resend
- Check Cloudflare Workers logs: `npx wrangler tail`

### KV errors
- Ensure KV namespace IDs are correct in wrangler.toml
- Check that SUBMISSIONS binding exists
- View KV data: `npx wrangler kv:key list --namespace-id=your-id`

### Approval link not working
- Check that the token hasn't expired (30 days)
- Verify KV has the pending submission
- Check Worker logs for errors

## Alternative: Use Mailgun Instead of Resend

If you prefer Mailgun, update `api-handler.js`:

```javascript
const response = await fetch('https://api.mailgun.net/v3/yourdomain.com/messages', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
  },
  body: new URLSearchParams({
    from: 'noreply@yourdomain.com',
    to: 'thi@cloudflare.com',
    subject: `Tool Submission: ${submission.toolName}`,
    html: emailHtml,
  }),
});
```

Then set the Mailgun API key:
```bash
npx wrangler secret put MAILGUN_API_KEY
```
