/**
 * Cloudflare Workers Entry Point
 * This file handles incoming requests and routes them appropriately
 */

import { Router } from 'itty-router';

// Create a new Router
const router = Router();

// API Routes Handler
router.all('/api/*', async (request) => {
  // Extract the path without /api prefix
  const pathWithoutApi = new URL(request.url).pathname.replace('/api', '');
  
  // Forward to your origin server
  const originUrl = `${process.env.ORIGIN_URL || 'http://localhost:5000'}/api${pathWithoutApi}`;
  
  try {
    const response = await fetch(new Request(originUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' ? await request.text() : undefined,
    }));
    
    return response;
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to reach origin server' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// Serve static assets from Cloudflare Pages
router.all('*', ({ request }) => {
  return fetch(new Request(request.url.replace(/^https?:\/\/[^\/]+/, ''), {
    method: request.method,
    headers: request.headers,
  }));
});

// 404 handler
router.all('*', () => {
  return new Response('Not Found', { status: 404 });
});

export default {
  fetch: router.handle,
};
