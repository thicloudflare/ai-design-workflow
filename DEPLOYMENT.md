# Cloudflare Workers Deployment Guide

This guide will help you deploy the AI-Enhanced Design Workflow application to Cloudflare Workers.

## Prerequisites

1. A Cloudflare account (sign up at https://dash.cloudflare.com/sign-up)
2. Node.js and npm installed
3. Wrangler CLI installed (already included as dev dependency)

## Setup Steps

### 1. Login to Cloudflare

First, authenticate with your Cloudflare account:

```bash
npx wrangler login
```

This will open a browser window for you to authorize Wrangler.

### 2. Build the Application

Build your Next.js application for Cloudflare Workers:

```bash
npm run build
npm run pages:build
```

This will:
- Create a static export of your Next.js app
- Generate the necessary files for Cloudflare Pages/Workers

### 3. Preview Locally (Optional)

Test your deployment locally before pushing to production:

```bash
npm run preview
```

Or use the Cloudflare-specific dev command:

```bash
npm run cf:dev
```

### 4. Deploy to Cloudflare Workers

Deploy your application to Cloudflare:

```bash
npm run deploy
```

Or use the specific Cloudflare deployment command:

```bash
npm run cf:deploy
```

Follow the prompts to:
- Create a new project (if first time)
- Choose production or preview environment
- Confirm deployment

## Configuration

### Update Project Name

Edit `wrangler.toml` to change the project name:

```toml
name = "your-project-name"
```

Also update the deployment script in `package.json`:

```json
"cf:deploy": "wrangler pages deploy .vercel/output/static --project-name=your-project-name"
```

### Environment Variables

If you need environment variables:

1. For local development, create a `.dev.vars` file:

```
MY_VAR=value
```

2. For production, add them via Cloudflare Dashboard:
   - Go to Workers & Pages
   - Select your project
   - Settings > Environment Variables
   - Add your variables

Or use Wrangler CLI:

```bash
wrangler pages secret put MY_VAR
```

## Custom Domain

To add a custom domain:

1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Select your project
4. Go to "Custom domains"
5. Add your domain

## Useful Commands

- `npm run dev` - Run Next.js development server locally
- `npm run build` - Build Next.js application
- `npm run pages:build` - Build for Cloudflare Pages
- `npm run preview` - Preview deployment locally
- `npm run deploy` - Deploy to Cloudflare
- `npm run cf:dev` - Run Cloudflare Pages dev server
- `npm run cf:deploy` - Deploy to Cloudflare Pages

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run build
   ```

### Runtime Errors

Check Cloudflare Workers logs:

```bash
wrangler pages deployment tail
```

Or view logs in the Cloudflare Dashboard under Workers & Pages > Your Project > Logs.

### Static Export Issues

This project uses Next.js static export (`output: 'export'`). Make sure:
- No dynamic routes with `getServerSideProps`
- No API routes (use Cloudflare Workers functions instead)
- Images are unoptimized or use external image optimization

## Notes

- This setup uses Cloudflare Pages (which runs on Workers) for static hosting
- The `@cloudflare/next-on-pages` package converts Next.js output for Cloudflare
- Static assets are served directly from Cloudflare's edge network
- The app is fully serverless with global edge deployment

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)

## Support

For issues or questions:
- Cloudflare Community: https://community.cloudflare.com/
- Cloudflare Discord: https://discord.gg/cloudflaredev
