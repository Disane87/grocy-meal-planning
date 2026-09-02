import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export interface GrocyTarget {
  /** Origin + optional base path of the Grocy instance, without trailing slash. */
  base: string;
}

export interface GrocyTargetError {
  error: string;
  status: number;
}

function envList(name: string): string[] {
  return (process.env[name] || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

function envFlag(name: string): boolean {
  const value = (process.env[name] || '').trim().toLowerCase();
  return value === '1' || value === 'true' || value === 'yes';
}

/**
 * Blocks addresses that only exist inside the network the server runs in.
 * Without this the proxy could be abused to reach internal services (SSRF).
 */
export function isPrivateAddress(address: string): boolean {
  const family = isIP(address);

  if (family === 4) {
    const [a, b] = address.split('.').map(Number);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a >= 224) return true;
    return false;
  }

  if (family === 6) {
    const normalized = address.toLowerCase();
    if (normalized === '::' || normalized === '::1') return true;
    // IPv4-mapped addresses (::ffff:10.0.0.1) carry the v4 rules.
    const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateAddress(mapped[1]);
    if (/^f[cd]/.test(normalized)) return true; // unique local fc00::/7
    if (/^fe[89ab]/.test(normalized)) return true; // link local fe80::/10
    if (normalized.startsWith('ff')) return true; // multicast
    return false;
  }

  return false;
}

/**
 * Validates a user supplied Grocy base URL before the proxy talks to it.
 *
 * Configuration (all optional):
 * - `GROCY_PROXY_ALLOWED_HOSTS`: comma separated hostname allowlist. When set,
 *   only these hosts may be proxied.
 * - `GROCY_PROXY_ALLOW_PRIVATE`: set to `true` when the Grocy instance lives on
 *   the same private network as this server (typical self-hosted setup).
 */
export async function resolveGrocyTarget(
  rawUrl: string | undefined,
): Promise<GrocyTarget | GrocyTargetError> {
  if (!rawUrl) {
    return { error: 'Missing X-Grocy-Url header', status: 400 };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { error: 'Invalid Grocy URL', status: 400 };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { error: `Protocol not allowed: ${parsed.protocol}`, status: 400 };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  const allowedHosts = envList('GROCY_PROXY_ALLOWED_HOSTS');

  if (allowedHosts.length > 0) {
    if (!allowedHosts.includes(hostname)) {
      return { error: `Host not allowed: ${hostname}`, status: 403 };
    }
  } else if (!envFlag('GROCY_PROXY_ALLOW_PRIVATE')) {
    const blocked = await resolvesToPrivateAddress(hostname);
    if (blocked) {
      return {
        error:
          `Host not allowed: ${hostname} resolves to a private address. ` +
          'Set GROCY_PROXY_ALLOW_PRIVATE=true or GROCY_PROXY_ALLOWED_HOSTS to permit it.',
        status: 403,
      };
    }
  }

  // Strip a trailing `/api` (and slashes) so callers may configure either form.
  const base = `${parsed.origin}${parsed.pathname}`
    .replace(/\/+$/, '')
    .replace(/\/api$/i, '');

  return { base };
}

async function resolvesToPrivateAddress(hostname: string): Promise<boolean> {
  if (isIP(hostname)) {
    return isPrivateAddress(hostname);
  }

  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    return true;
  }

  try {
    const addresses = await lookup(hostname, { all: true });
    return addresses.some((entry) => isPrivateAddress(entry.address));
  } catch {
    // Unresolvable hosts are rejected by the fetch below anyway.
    return false;
  }
}

export function isGrocyTargetError(
  value: GrocyTarget | GrocyTargetError,
): value is GrocyTargetError {
  return (value as GrocyTargetError).error !== undefined;
}
