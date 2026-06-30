import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function resolveRequestPath(url) {
  const parsed = new URL(url, `http://127.0.0.1:${port}`);
  let pathname = decodeURIComponent(parsed.pathname);

  if (pathname === '/') return join(root, 'index.html');
  if (pathname === '/evidence' || pathname === '/sources') return join(root, 'evidence.html');
  if (pathname === '/contact' || pathname === '/join') return join(root, 'contact.html');
  if (pathname === '/crisis' || pathname === '/help') return join(root, 'crisis.html');
  if (pathname === '/suicide-prevention') return join(root, 'suicide-prevention.html');
  if (pathname === '/favicon.ico') return join(root, 'favicon.svg');

  const normalized = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  return join(root, normalized);
}

const server = createServer(async (req, res) => {
  let filePath = resolveRequestPath(req.url || '/');
  let statusCode = 200;

  if (!filePath.startsWith(root)) {
    filePath = join(root, '404.html');
    statusCode = 404;
  }

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = join(filePath, 'index.html');
  } catch {
    filePath = join(root, '404.html');
    statusCode = 404;
  }

  if (!existsSync(filePath)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  res.writeHead(statusCode, {
    'content-type': types[extname(filePath)] || 'application/octet-stream',
    'cache-control': 'no-store'
  });
  createReadStream(filePath).pipe(res);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`State Not Fate public test server running at http://127.0.0.1:${port}`);
});
