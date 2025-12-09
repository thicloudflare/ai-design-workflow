/**
 * Cloudflare Workers script to serve static Next.js site
 * With [assets] configuration, Cloudflare automatically serves static files
 * This worker just adds custom headers and handles special cases
 */
export default {
  async fetch(request, env, ctx) {
    // Get the asset response from Cloudflare's asset handler
    const response = await env.ASSETS.fetch(request);
    
    // Add custom security headers
    const headers = new Headers(response.headers);
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
