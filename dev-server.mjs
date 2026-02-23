import { createServer, request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

const ALLOWED_HOSTS = ['www.chefkoch.de', 'chefkoch.de', 'picnic.app'];
const ALLOWED_IMAGE_HOSTS = [
  'img.chefkoch-cdn.de',
  'storefront-prod.de.picnicinternational.com',
];
const PORT = 3001;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...corsHeaders() });
  res.end(JSON.stringify(data));
}

function fetchUrl(targetUrl, binary = false) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(targetUrl);
    const requester = parsedUrl.protocol === 'https:' ? httpsRequest : httpRequest;

    const req = requester(targetUrl, { headers: HEADERS, method: 'GET' }, (response) => {
      // Follow redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        fetchUrl(response.headers.location, binary).then(resolve).catch(reject);
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          statusCode: response.statusCode,
          contentType: response.headers['content-type'] || 'application/octet-stream',
          body: binary ? buffer : buffer.toString('utf-8'),
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

function validateUrl(targetUrl, allowedHosts) {
  if (!targetUrl) return { error: 'Missing url parameter', status: 400 };
  let parsedTarget;
  try {
    parsedTarget = new URL(targetUrl);
  } catch {
    return { error: 'Invalid URL', status: 400 };
  }
  if (!allowedHosts.includes(parsedTarget.hostname)) {
    return { error: `Host not allowed: ${parsedTarget.hostname}`, status: 403 };
  }
  return null;
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders());
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/fetch-recipe') {
    const targetUrl = url.searchParams.get('url');
    const validation = validateUrl(targetUrl, ALLOWED_HOSTS);
    if (validation) return jsonResponse(res, validation.status, { error: validation.error });

    try {
      const result = await fetchUrl(targetUrl);
      if (result.statusCode !== 200) {
        return jsonResponse(res, 502, { error: `Upstream returned ${result.statusCode}` });
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders() });
      res.end(result.body);
    } catch (err) {
      return jsonResponse(res, 502, { error: `Fetch error: ${err.message}` });
    }
  } else if (url.pathname === '/api/fetch-image') {
    const targetUrl = url.searchParams.get('url');
    const validation = validateUrl(targetUrl, ALLOWED_IMAGE_HOSTS);
    if (validation) return jsonResponse(res, validation.status, { error: validation.error });

    try {
      const result = await fetchUrl(targetUrl, true);
      if (result.statusCode !== 200) {
        return jsonResponse(res, 502, { error: `Upstream returned ${result.statusCode}` });
      }
      res.writeHead(200, { 'Content-Type': result.contentType, ...corsHeaders() });
      res.end(result.body);
    } catch (err) {
      return jsonResponse(res, 502, { error: `Fetch error: ${err.message}` });
    }
  } else {
    jsonResponse(res, 404, { error: 'Not found' });
  }
});

server.listen(PORT, () => {
  console.log(`[dev-server] API server running on http://localhost:${PORT}`);
});
