import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
const portArgument = process.argv.indexOf('--port');
const port = Number(portArgument >= 0 ? process.argv[portArgument + 1] : 4173);
const contentTypes = { '.avif': 'image/avif', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.xml': 'application/xml; charset=utf-8' };
const routes = new Map([['/', 'index.html'], ['/index.html', 'index.html'], ['/demo', 'demo/index.html'], ['/demo/', 'demo/index.html'], ['/privacy', 'privacy/index.html'], ['/privacy/', 'privacy/index.html'], ['/terms', 'terms/index.html'], ['/terms/', 'terms/index.html'], ['/404', '404.html'], ['/404/', '404.html']]);

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
  const mapped = routes.get(pathname);
  const relative = mapped || normalize(pathname).replace(/^[/\\]+/, '');
  const file = join(root, relative);
  const insideRoot = file.startsWith(root);
  if (!mapped && (!insideRoot || !existsSync(file) || (await stat(file)).isDirectory())) {
    response.writeHead(404, { 'Content-Type': contentTypes['.html'], 'Cache-Control': 'no-store' });
    createReadStream(join(root, '404.html')).pipe(response);
    return;
  }
  const extension = extname(file);
  response.writeHead(200, { 'Content-Type': contentTypes[extension] || 'application/octet-stream', 'Cache-Control': relative.startsWith('assets/') ? 'public, max-age=31536000, immutable' : 'no-store' });
  createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1');
