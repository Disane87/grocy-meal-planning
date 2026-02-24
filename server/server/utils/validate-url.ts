export function validateUrl(
  url: string | undefined,
  allowedHosts: string[],
): { error: string; status: number } | null {
  if (!url) {
    return { error: 'Missing url parameter', status: 400 };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { error: 'Invalid URL', status: 400 };
  }

  if (!allowedHosts.includes(parsed.hostname)) {
    return {
      error: `Host not allowed: ${parsed.hostname}`,
      status: 403,
    };
  }

  return null;
}
