# Email Setup Guide

This application uses [Resend](https://resend.com) to send tool submission emails.

## Setup Instructions

### 1. Sign up for Resend

1. Go to [resend.com](https://resend.com)
2. Create a free account
3. Verify your email address

### 2. Get Your API Key

1. Navigate to [API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "AI Design Workflow")
4. Copy the API key (starts with `re_`)

### 3. Configure Environment Variables

1. Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Resend API key:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

### 4. Update Sender Email (Optional)

In `/app/api/submit/route.ts`, update the `from` email address:

```typescript
from: 'AI Design Workflow <your-domain@example.com>',
```

**Note:** With the free tier, you can only send from `onboarding@resend.dev` to your verified email. To use a custom domain, follow [Resend's domain verification guide](https://resend.com/docs/dashboard/domains/introduction).

### 5. Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/submit`
3. Fill out and submit the form
4. Check `thi@cloudflare.com` for the email

## Troubleshooting

### Email not sending

- Verify your API key is correct in `.env.local`
- Check the browser console and terminal for errors
- Ensure your Resend account is verified

### Custom domain not working

- Follow [Resend's domain verification guide](https://resend.com/docs/dashboard/domains/introduction)
- Update DNS records as instructed
- Wait for DNS propagation (can take up to 48 hours)

## Free Tier Limits

- 100 emails per day
- 3,000 emails per month
- Perfect for testing and small-scale deployments

For production use with higher volume, consider upgrading to a paid plan.
