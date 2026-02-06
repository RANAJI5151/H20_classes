/**
 * Cloudflare utilities for CORS and security headers
 */

export interface CorsOptions {
  origins?: string | string[];
  methods?: string[];
  allowCredentials?: boolean;
  maxAge?: number;
}

export const defaultCorsOptions: CorsOptions = {
  origins: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowCredentials: false,
  maxAge: 86400, // 24 hours
};

export function setCorsHeaders(
  response: Response,
  options: CorsOptions = defaultCorsOptions
): Response {
  const headers = new Headers(response.headers);

  // Set CORS headers
  headers.set(
    'Access-Control-Allow-Origin',
    Array.isArray(options.origins) ? options.origins[0] : options.origins || '*'
  );
  headers.set(
    'Access-Control-Allow-Methods',
    options.methods?.join(', ') || defaultCorsOptions.methods?.join(', ') || ''
  );
  headers.set(
    'Access-Control-Allow-Credentials',
    options.allowCredentials ? 'true' : 'false'
  );
  headers.set(
    'Access-Control-Max-Age',
    (options.maxAge || defaultCorsOptions.maxAge || 86400).toString()
  );

  // Set security headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function handleCorsPreFlight(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response('OK', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      },
    });
  }
  return null;
}
