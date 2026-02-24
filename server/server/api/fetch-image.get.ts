import { ALLOWED_IMAGE_HOSTS } from '../utils/allowed-hosts';
import { IMAGE_HEADERS } from '../utils/fetch-headers';
import { setCorsHeaders } from '../utils/cors';
import { validateUrl } from '../utils/validate-url';

export default defineEventHandler(async (event) => {
  setCorsHeaders(event);

  const { url } = getQuery<{ url?: string }>(event);
  const validation = validateUrl(url, ALLOWED_IMAGE_HOSTS);

  if (validation) {
    throw createError({
      statusCode: validation.status,
      statusMessage: validation.error,
      data: { error: validation.error },
    });
  }

  try {
    const response = await fetch(url!, {
      headers: IMAGE_HEADERS,
      redirect: 'follow',
    });

    if (!response.ok) {
      throw createError({
        statusCode: 502,
        statusMessage: `Upstream returned ${response.status}`,
        data: { error: `Failed to fetch image: ${response.status}` },
      });
    }

    const contentType = response.headers.get('Content-Type') || 'image/jpeg';
    const imageData = await response.arrayBuffer();

    setResponseHeader(event, 'Content-Type', contentType);
    setResponseHeader(event, 'Cache-Control', 'public, max-age=3600');
    return Buffer.from(imageData);
  } catch (err: any) {
    if (err.statusCode) throw err;
    throw createError({
      statusCode: 502,
      statusMessage: `Fetch error: ${err.message}`,
      data: { error: `Fetch error: ${err.message}` },
    });
  }
});
