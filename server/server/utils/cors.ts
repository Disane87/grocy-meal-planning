import type { H3Event } from 'h3';

export const CORS_ALLOWED_METHODS = 'GET, POST, PUT, DELETE, OPTIONS';
export const CORS_ALLOWED_HEADERS = 'Content-Type, GROCY-API-KEY, X-Grocy-Url';

export function setCorsHeaders(event: H3Event): void {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': CORS_ALLOWED_METHODS,
    'Access-Control-Allow-Headers': CORS_ALLOWED_HEADERS,
    'Access-Control-Max-Age': '86400',
  });
}
