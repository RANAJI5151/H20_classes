/**
 * Example Cloudflare Pages Function
 * Location: /api/health → functions/api/health.ts
 * 
 * For more complex routes, this approach allows incremental migration
 * from Express to Cloudflare Pages Functions
 */

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;

  // Add CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS requests for CORS
  if (request.method === 'OPTIONS') {
    return new Response('OK', { headers, status: 200 });
  }

  // Handle GET /api/health
  if (request.method === 'GET') {
    return new Response(
      JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: env.ENVIRONMENT || 'production',
      }),
      { headers, status: 200 }
    );
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    headers,
    status: 405,
  });
};
