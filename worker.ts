/**
 * Cloudflare Workers Entry Point
 * This file handles incoming requests and routes them appropriately
 */

// Create a simple request handler
export default {
  fetch: async (request: Request, env: any): Promise<Response> => {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // API Routes Handler
    if (pathname.startsWith('/api/')) {
      const originUrl = env.ORIGIN_URL || 'http://localhost:5000';
      const proxyUrl = `${originUrl}${pathname}${url.search}`;

      try {
        const response = await fetch(new Request(proxyUrl, {
          method: request.method,
          headers: request.headers,
          body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
        }));

        return response;
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to reach origin server' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // For non-API routes, Pages will handle them
    return new Response('Not Found', { status: 404 });
  },
};
