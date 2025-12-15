import { handleSubmit } from './api-handler.js';
import {
  handlePhases,
  handlePhaseById,
  handleTools,
  handleToolByName,
  handleSearch,
  handleStats,
  handleSections,
  handleHealth,
} from './api-routes.js';

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
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      // Health check
      if (url.pathname === '/api/health') {
        return handleHealth();
      }

      // Stats
      if (url.pathname === '/api/stats') {
        return handleStats();
      }

      // Search
      if (url.pathname === '/api/search') {
        return handleSearch(request);
      }

      // Sections
      if (url.pathname === '/api/sections') {
        return handleSections(request);
      }

      // Phases routes
      if (url.pathname === '/api/phases') {
        return handlePhases(request);
      }

      const phaseMatch = url.pathname.match(/^\/api\/phases\/(\d+)$/);
      if (phaseMatch) {
        return handlePhaseById(request, phaseMatch[1]);
      }

      // Tools routes
      if (url.pathname === '/api/tools') {
        return handleTools(request);
      }

      const toolMatch = url.pathname.match(/^\/api\/tools\/(.+)$/);
      if (toolMatch) {
        return handleToolByName(request, toolMatch[1]);
      }

      // Tool submission
      if (url.pathname === '/api/submit' && request.method === 'POST') {
        return handleSubmit(request, env);
      }

      return new Response(JSON.stringify({ error: 'Not Found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
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
