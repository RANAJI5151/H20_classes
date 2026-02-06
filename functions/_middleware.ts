/**
 * Functions directory for Cloudflare Pages
 * This directory maps to /api routes
 * 
 * For Cloudflare Pages Functions, create files like:
 * - functions/api/health.ts -> GET /api/health
 * - functions/api/auth/login.ts -> ALL /api/auth/login
 */

// This is a placeholder. For production, you'll need to convert your Express routes
// to individual Cloudflare Pages Function files.

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  // Health check endpoint
  if (url.pathname === '/api/health') {
    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Not Found', { status: 404 });
};
