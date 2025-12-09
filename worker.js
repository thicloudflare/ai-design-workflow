import { handleSubmit } from './api-handler.js';

/**
 * Cloudflare Workers script to serve static Next.js site
 * With [assets] configuration, Cloudflare automatically serves static files
 * This worker handles API routes and adds custom headers
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      // CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      // Handle tool submission
      if (url.pathname === '/api/submit' && request.method === 'POST') {
        return handleSubmit(request, env);
      }

      return new Response('Not Found', { status: 404 });
    }
    
    // Serve static assets for non-API routes
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
