import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';

for (const route of ['privacy', 'terms']) {
  await mkdir(`dist/${route}`, { recursive: true });
  await cp('dist/index.html', `dist/${route}/index.html`);
}

const generatedAssets = (await readdir('dist/assets'))
  .filter((name) => !name.endsWith('.map'))
  .map((name) => `/assets/${name}`);
const swPath = 'dist/sw.js';
const sw = await readFile(swPath, 'utf8');
const core = ['/', '/index.html', '/offline.html', '/manifest.webmanifest', '/icons/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png', ...generatedAssets];
await writeFile(swPath, sw.replace(/const CORE = \[[^;]+;/, `const CORE = ${JSON.stringify(core)};`));
