# Cloudflare Pages Build Configuration

## Important: This is a Cloudflare PAGES project, not Workers

When setting up your Cloudflare Pages project, use these build settings:

### Build Configuration

**Framework preset:** `Next.js (Static HTML Export)`

**Build command:**
```
npm run build
```

**Build output directory:**
```
out
```

**Root directory:**
```
/
```

### Environment Variables (if needed)
You can add environment variables in the Cloudflare Pages dashboard under:
Settings > Environment variables

### Node.js Version
The build will automatically use Node.js 22.x (detected from environment)

### DO NOT use these commands:
- ❌ `npx wrangler deploy` (this is for Workers, not Pages)
- ❌ `npm run pages:build` (not needed for Pages)
- ❌ `wrangler pages deploy` (Pages auto-deploys from git)

### How it works:
1. Cloudflare Pages detects your git push
2. Runs `npm clean-install` (with legacy-peer-deps from .npmrc)
3. Runs `npm run build` to create static export
4. Automatically deploys the `out` directory
5. Your site goes live!

### Deployment Process:
1. Push to GitHub: `git push`
2. Cloudflare Pages automatically builds and deploys
3. Your site is live at: `https://your-project.pages.dev`

### Custom Domains:
Add custom domains in the Cloudflare Pages dashboard under:
Custom domains > Set up a custom domain
