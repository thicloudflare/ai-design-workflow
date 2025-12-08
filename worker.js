import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

/**
 * Cloudflare Workers script to serve static Next.js site
 */
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const url = new URL(event.request.url);
  
  try {
    // Serve static assets from KV
    const response = await getAssetFromKV(event, {
      mapRequestToAsset: (request) => {
        // Handle trailing slashes for Next.js static export
        const url = new URL(request.url);
        
        // If path ends with /, serve index.html
        if (url.pathname.endsWith('/')) {
          url.pathname += 'index.html';
        }
        // If no extension, try adding .html for Next.js pages
        else if (!url.pathname.includes('.')) {
          url.pathname += '.html';
        }
        
        return new Request(url.toString(), request);
      },
    });

    // Add custom headers
    const headers = new Headers(response.headers);
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    // Handle 404s
    if (error.status === 404) {
      try {
        // Try to serve 404 page
        const notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: (request) => {
            const url = new URL(request.url);
            url.pathname = '/404.html';
            return new Request(url.toString(), request);
          },
        });
        return new Response(notFoundResponse.body, {
          status: 404,
          headers: notFoundResponse.headers,
        });
      } catch (e) {
        return new Response('404 Not Found', { status: 404 });
      }
    }

    // Handle other errors
    return new Response(`Error: ${error.message || 'Unknown error'}`, {
      status: error.status || 500,
    });
  }
}
