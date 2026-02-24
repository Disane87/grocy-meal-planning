import { ALLOWED_RECIPE_HOSTS } from '../utils/allowed-hosts';
import { BROWSER_HEADERS } from '../utils/fetch-headers';
import { setCorsHeaders } from '../utils/cors';
import { validateUrl } from '../utils/validate-url';

export default defineEventHandler(async (event) => {
  setCorsHeaders(event);

  const { url } = getQuery<{ url?: string }>(event);
  const validation = validateUrl(url, ALLOWED_RECIPE_HOSTS);

  if (validation) {
    throw createError({
      statusCode: validation.status,
      statusMessage: validation.error,
      data: { error: validation.error },
    });
  }

  try {
    const html = await $fetch<string>(url!, {
      headers: BROWSER_HEADERS,
      responseType: 'text',
      redirect: 'follow',
    });

    setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8');
    setResponseHeader(event, 'Cache-Control', 'public, max-age=300');
    return html;
  } catch (err: any) {
    throw createError({
      statusCode: 502,
      statusMessage: `Fetch error: ${err.message}`,
      data: { error: `Fetch error: ${err.message}` },
    });
  }
});
