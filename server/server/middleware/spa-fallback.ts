import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const publicDir = join(process.cwd(), 'public');
let cachedIndex: string | null = null;

export default defineEventHandler((event) => {
  const path = (event.path || '').split('?')[0];

  if (path.startsWith('/api/')) return;
  if (path.startsWith('/_')) return;
  if (/\.[a-z0-9]+$/i.test(path)) return;
  if (path === '/') return;

  if (!cachedIndex) {
    const indexPath = join(publicDir, 'index.html');
    if (!existsSync(indexPath)) return;
    cachedIndex = readFileSync(indexPath, 'utf-8');
  }

  setHeader(event, 'content-type', 'text/html; charset=utf-8');
  return cachedIndex;
});
