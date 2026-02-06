/**
 * Cloudflare Pages Functions Middleware
 * This handles all incoming requests and applies middleware logic
 */

interface PagesContext {
  request: Request;
  env: {
    ENVIRONMENT?: string;
    DATABASE_URL?: string;
    SESSION_SECRET?: string;
    ORIGIN_URL?: string;
    [key: string]: any;
  };
  next: (request?: Request) => Promise<Response>;
}

export const onRequest: PagesFunction[] = [
  // CORS middleware
  async (context: PagesContext) => {
    const { request } = context;
    const response = await context.next();

    // Add CORS headers to all responses
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'SAMEORIGIN');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },

  // Request logging middleware
  async (context: PagesContext) => {
    const { request } = context;
    const start = Date.now();

    const response = await context.next();
    const duration = Date.now() - start;

    console.log(`${request.method} ${new URL(request.url).pathname} ${response.status} ${duration}ms`);

    return response;
  },

  // API proxy middleware for paths without a handler
  async (context: PagesContext) => {
    const { request, env } = context;
    const url = new URL(request.url);

    // If path is /api/* and no specific handler exists, proxy to origin
    if (url.pathname.startsWith('/api/')) {
      const originUrl = env.ORIGIN_URL || 'http://localhost:5000';
      const proxyUrl = `${originUrl}${url.pathname}${url.search}`;

      try {
        return await fetch(new Request(proxyUrl, {
          method: request.method,
          headers: request.headers,
          body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
        }));
      } catch (error) {
        console.error('Origin proxy error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to reach origin server' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return await context.next();
  },
];
