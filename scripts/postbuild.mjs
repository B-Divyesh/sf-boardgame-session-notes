import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';

for (const route of ['privacy', 'terms', 'demo', '404']) {
  await mkdir(`dist/${route}`, { recursive: true });
  await cp('dist/index.html', `dist/${route}/index.html`);
}
await cp('dist/index.html', 'dist/404.html');
await cp('staticwebapp.config.json', 'dist/staticwebapp.config.json');

const generatedAssets = (await readdir('dist/assets'))
  .filter((name) => !name.endsWith('.map'))
  .map((name) => `/assets/${name}`);
const swPath = 'dist/sw.js';
const sw = await readFile(swPath, 'utf8');
const core = ['/', '/index.html', '/demo/', '/404/', '/offline.html', '/manifest.webmanifest', '/icons/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-512-maskable.png', ...generatedAssets];
await writeFile(swPath, sw.replace(/const CORE = \[[^;]+;/, `const CORE = ${JSON.stringify(core)};`));
