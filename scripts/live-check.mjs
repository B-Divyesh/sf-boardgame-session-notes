import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const origin = process.argv[2] || 'https://boardgame-session-notes.sociobot.in';
const evidence = '.factory/evidence/polish-2';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
const home = await page.goto(origin, { waitUntil: 'networkidle' });
if (home?.status() !== 200) throw new Error(`Home returned ${home?.status()}`);
if (await page.getByRole('heading', { name: 'Record one boardgame session' }).count() !== 1) throw new Error('Home h1 is missing.');
if (await page.getByRole('link', { name: 'Try it with sample data' }).count() !== 1) throw new Error('Demo action is missing.');
await page.screenshot({ path: `${evidence}/live-home-390.png`, fullPage: true });

await page.getByRole('button', { name: 'Start a blank session note' }).click();
await page.getByLabel('Game title').fill('Live sentinel');
await page.waitForTimeout(700);
await page.goto(`${origin}/demo/`, { waitUntil: 'networkidle' });
if (await page.getByRole('heading', { name: 'Lantern Harbor' }).count() !== 1) throw new Error('Trailing-slash demo did not load.');
if (await page.getByText('Demo — sample data, nothing is saved').count() !== 1) throw new Error('Demo banner is missing.');
if (!(await page.evaluate(async () => (await indexedDB.databases()).some((item) => item.name === 'demo:boardgame-session-notes')))) throw new Error('Demo namespace is missing.');
await page.getByLabel('Setup notes').fill('Changed live demo');
await page.waitForTimeout(700);
await page.getByRole('button', { name: 'Reset demo' }).click();
await page.waitForFunction(() => (document.querySelector('[data-session-field="startingState"]') instanceof HTMLTextAreaElement) && document.querySelector('[data-session-field="startingState"]')?.value.includes('Mina chose orange'));
await page.screenshot({ path: `${evidence}/live-demo-390.png`, fullPage: true });
await page.getByRole('button', { name: 'Start for real' }).click();
await page.waitForURL(`${origin}/`);
await page.waitForTimeout(300);
if (await page.getByRole('button', { name: /Live sentinel/ }).count() !== 1) throw new Error('Demo changed saved session notes.');

const missing = await page.goto(`${origin}/does-not-exist`, { waitUntil: 'networkidle' });
if (missing?.status() !== 404 || await page.getByRole('heading', { name: 'Page not found' }).count() !== 1) throw new Error('Missing-page response is not a real 404.');
await page.setViewportSize({ width: 1440, height: 900 });
await page.screenshot({ path: `${evidence}/live-404-1440.png`, fullPage: true });
errors.length = 0;
const offline = await page.goto(`${origin}/offline.html`, { waitUntil: 'networkidle' });
if (offline?.status() !== 200 || await page.getByRole('heading', { name: 'Reconnect once to finish offline setup.' }).count() !== 1) throw new Error('Offline page did not load.');
for (const path of ['/privacy/', '/terms/', '/demo?demo=1']) {
  const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
  if (response?.status() !== 200 || await page.locator('h1').count() !== 1) throw new Error(`Route failed: ${path}`);
}
if (errors.length) throw new Error(`Console errors: ${errors.join(' | ')}`);
await browser.close();
console.log(JSON.stringify({ origin, errors, evidence }));
