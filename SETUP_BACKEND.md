# Backend Setup for Tool Submission System

This guide will help you set up the email notification system for tool submissions.

## Prerequisites

- Cloudflare account with Workers access
- Resend account (free tier available) for sending emails

## Step 1: Get Resend API Key

1. Go to https://resend.com/
2. Sign up for a free account
3. Verify your domain (or use their test domain for development)
4. Go to **API Keys** section
5. Create a new API key with **Sending access**
6. Copy the API key

## Step 2: Add Resend API Key to Workers

Store your Resend API key as a secret in Cloudflare Workers:

```bash
npx wrangler secret put RESEND_API_KEY
```

When prompted, paste your Resend API key.

## Step 3: Update Email Sender (Optional)

Edit `api-handler.js` and update the `from` address if you have a verified domain:

```javascript
from: 'noreply@yourdomain.com',  // Use your verified domain
```

For development/testing, the default `onboarding@resend.dev` works fine.

## Step 4: Deploy and Test

Build and deploy:

```bash
npm run build
export CLOUDFLARE_API_TOKEN=your-token
npx wrangler deploy
```

Test the submission form:
1. Go to your site: https://ai-design-workflow.thi-s-ent-account.workers.dev/submit
2. Fill out the form with test data
3. Submit the form
4. Verify you're redirected to the success page
5. Check your email at thi@cloudflare.com for the submission notification

## How It Works

When a tool is submitted:
1. User fills out the form on `/submit`
2. Form sends POST request to `/api/submit`
3. Worker sends an email notification to `thi@cloudflare.com` with all submission details
4. User is redirected to `/submit/success` page
5. You receive the email and can manually add the tool to the workflow

## Adding Approved Tools Manually

To add an approved tool to the site:
1. Open `/data/phases.ts`
2. Find the appropriate phase and section
3. Add the tool to the `tools` array:

```javascript
{
  name: "Tool Name",
  icon: "figma", // or "gemini"
  url: "https://tool-url.com",
  description: "Tool description",
  coreOutputFocus: [...],
  instructions: "Usage instructions"
}
```

4. Commit and deploy the changes

## Troubleshooting

### Email not sending
- Check that `RESEND_API_KEY` secret is set correctly: `npx wrangler secret list`
- Verify your sender domain is verified in Resend (or use `onboarding@resend.dev` for testing)
- Check Cloudflare Workers logs: `npx wrangler tail`
- Verify the Worker is deployed: `npx wrangler deployments list`

### Form submission fails
- Check browser console for errors
- Verify the `/api/submit` endpoint is accessible
- Check that all required fields are filled
- Ensure CORS is working (check browser network tab)

### Success page not showing
- Verify the build included the success page: check `out/submit/success/index.html`
- Clear browser cache and try again

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
