import { setCorsHeaders } from '../../utils/cors';
import {
  isGrocyTargetError,
  resolveGrocyTarget,
} from '../../utils/grocy-target';

const MAX_REDIRECTS = 3;
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Same-origin proxy for the user's Grocy instance.
 *
 * Grocy does not send CORS headers, so a browser cannot call it directly from
 * another origin. The SPA sends the instance URL via `X-Grocy-Url` and the API
 * key via `GROCY-API-KEY`; both are forwarded here and never persisted.
 */
export default defineEventHandler(async (event) => {
  setCorsHeaders(event);
  // Marks every response that actually came from this handler, so the client
  // can tell "proxy replied" apart from "proxy not deployed".
  setResponseHeader(event, 'X-Grocy-Proxy', '1');

  if (event.method === 'OPTIONS') {
    setResponseStatus(event, 204);
    return null;
  }

  const target = await resolveGrocyTarget(getHeader(event, 'x-grocy-url'));
  if (isGrocyTargetError(target)) {
    throw createError({
      statusCode: target.status,
      statusMessage: target.error,
      data: { error: target.error },
    });
  }

  const path = getRouterParam(event, 'path') || '';
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing Grocy API path',
      data: { error: 'Missing Grocy API path' },
    });
  }

  const search = (event.path || '').split('?')[1];
  const upstreamUrl = `${target.base}/api/${path}${search ? `?${search}` : ''}`;

  const headers: Record<string, string> = { Accept: '*/*' };
  const apiKey = getHeader(event, 'grocy-api-key');
  if (apiKey) headers['GROCY-API-KEY'] = apiKey;
  const contentType = getHeader(event, 'content-type');
  if (contentType) headers['Content-Type'] = contentType;

  const body =
    event.method === 'GET' || event.method === 'HEAD'
      ? undefined
      : await readRawBody(event, false);

  try {
    const response = await fetchFollowingRedirects(upstreamUrl, {
      method: event.method,
      headers,
      body: body as BodyInit | undefined,
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    setResponseStatus(event, response.status);
    setResponseHeader(
      event,
      'Content-Type',
      response.headers.get('Content-Type') || 'application/json',
    );
    setResponseHeader(event, 'Cache-Control', 'no-store');

    if (response.status === 204 || response.status === 304) {
      return null;
    }

    return Buffer.from(await response.arrayBuffer());
  } catch (err: any) {
    if (err.statusCode) throw err;
    const message =
      err.name === 'TimeoutError'
        ? 'Grocy did not respond in time'
        : `Grocy request failed: ${err.message}`;
    throw createError({
      statusCode: 502,
      statusMessage: message,
      data: { error: message },
    });
  }
});

/**
 * Follows redirects manually so every hop is re-validated — an upstream
 * redirect must not be able to point the proxy at an internal address.
 */
async function fetchFollowingRedirects(
  url: string,
  init: RequestInit,
): Promise<Response> {
  let currentUrl = url;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await fetch(currentUrl, init);
    const location = response.headers.get('Location');

    if (response.status < 300 || response.status >= 400 || !location) {
      return response;
    }

    const next = new URL(location, currentUrl);
    const validated = await resolveGrocyTarget(next.origin);
    if (isGrocyTargetError(validated)) {
      throw createError({
        statusCode: validated.status,
        statusMessage: `Redirect target not allowed: ${next.host}`,
        data: { error: `Redirect target not allowed: ${next.host}` },
      });
    }

    currentUrl = next.toString();
  }

  throw createError({
    statusCode: 502,
    statusMessage: 'Too many redirects from Grocy',
    data: { error: 'Too many redirects from Grocy' },
  });
}
