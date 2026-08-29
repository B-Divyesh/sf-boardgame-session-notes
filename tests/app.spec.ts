import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

async function dbNames(page: import('@playwright/test').Page): Promise<string[]> {
  return page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name || ''));
}

test('@claim:demo-isolated opens a filled sample in an isolated database', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lantern Harbor' })).toBeVisible();
  await expect.poll(() => dbNames(page)).toContain('demo:boardgame-session-notes');
  expect(await dbNames(page)).not.toContain('boardgame-session-notes');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Record one boardgame session' })).toBeVisible();
  expect(await dbNames(page)).not.toContain('demo:boardgame-session-notes');
});

test('@claim:demo-reset restores the sample without changing saved session notes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a blank session note' }).click();
  await page.getByLabel('Game title').fill('Real sentinel');
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'All session notes' }).click();
  await page.goto('/demo/');
  await page.getByLabel('Setup notes').fill('Changed only in the demo.');
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Lantern Harbor' })).toBeVisible();
  await expect(page.getByLabel('Setup notes')).toHaveValue(/Mina chose orange/);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByRole('button', { name: /Real sentinel/ })).toBeVisible();
});

test('@claim:no-account saves a sample note without account traffic', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByLabel('Setup notes').fill('Changed in the isolated sample.');
  await page.waitForTimeout(600);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
  await expect(page.locator('#save-status')).toHaveText('Saved in this browser');
});

test('@claim:offline-reload reopens the sample offline after first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Lantern Harbor' })).toBeVisible();
  await expect(page.getByText('Offline · saved in this browser')).toBeVisible();
});

test('@claim:browser-storage keeps the sample in an isolated browser store', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { name: 'Lantern Harbor' })).toBeVisible();
  await expect.poll(() => dbNames(page)).toContain('demo:boardgame-session-notes');
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('@claim:backup-file downloads and restores the sample backup', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open backup tools' }).click();
  const download = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download backup file' }).click()
  ]).then(([file]) => file);
  const contents = await readFile(await download.path()!, 'utf8');
  const backup = JSON.parse(contents);
  expect(backup.sessions[0].title).toBe('Lantern Harbor');
  expect(backup.sessions[0].events).toHaveLength(2);
  await page.getByLabel('Close backup tools').click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByRole('button', { name: 'Open backup tools' }).click();
  await page.locator('#import-backup').setInputFiles({ name: 'session-notes-backup.json', mimeType: 'application/json', buffer: Buffer.from(contents) });
  await expect(page.getByText('Restored 1 session notes.')).toBeVisible();
});

test('@claim:backup-merge updates matching session notes and keeps a new note', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open backup tools' }).click();
  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    snippets: ['Ties go to the player who placed the later marker.'],
    sessions: [
      { id: 'demo-lantern-harbor', title: 'Lantern Harbor, updated', playedAt: '2026-08-22T19:30', location: 'Kitchen', participants: [{ id: 'a', name: 'Mina', score: '42' }], startingState: 'Updated', houseRules: [], events: [], outcome: 'Updated', complete: true, createdAt: '2026-08-22T19:25:00.000Z', updatedAt: '2026-08-22T21:31:00.000Z' },
      { id: 'demo-new-note', title: 'New imported session note', playedAt: '2026-08-23T19:30', location: 'Club', participants: [{ id: 'b', name: 'Jo', score: '31' }], startingState: 'New', houseRules: [], events: [], outcome: 'New', complete: false, createdAt: '2026-08-23T19:25:00.000Z', updatedAt: '2026-08-23T21:31:00.000Z' }
    ]
  };
  await page.locator('#import-backup').setInputFiles({ name: 'merge-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
  await expect(page.getByText('Restored 2 session notes.')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.reload();
  await page.getByRole('button', { name: 'All session notes' }).click();
  await expect(page.getByRole('button', { name: /Lantern Harbor, updated/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /New imported session note/ })).toBeVisible();
});

test('@claim:session-template shows every core field in the sample', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('textbox', { name: 'Player 1' })).toHaveValue('Mina');
  await expect(page.getByLabel('Setup notes')).toHaveValue(/orange/);
  await expect(page.getByText('Ties go to the player who placed the later marker.')).toBeVisible();
  await expect(page.getByText('We agreed the lighthouse bonus may be scored after a trade.')).toBeVisible();
  await expect(page.getByLabel('Final score').first()).toHaveValue('42');
  await expect(page.getByLabel('Result and next-time notes')).toHaveValue(/Mina won/);
});

test('@claim:exports downloads a text receipt and opens a printable receipt', async ({ page }) => {
  await page.goto('/demo');
  const download = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export text receipt' }).click()
  ]).then(([file]) => file);
  expect(await readFile(await download.path()!, 'utf8')).toContain('Lantern Harbor');
  const popup = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Print or save PDF' }).click()
  ]).then(([window]) => window);
  await expect(popup).toHaveTitle(/Lantern Harbor receipt/);
});

test('@claim:no-rule-lookup uses no lookup or campaign service', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByLabel('Game title').fill('A title typed at the table');
  await page.waitForTimeout(600);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
  await expect(page.getByText('The app does not look up game titles.')).toBeVisible();
  await expect(page.getByRole('button', { name: /calculate|auto.?score|score this/i })).toHaveCount(0);
  const score = page.getByLabel('Final score').first();
  await score.fill('99');
  await page.waitForTimeout(600);
  await expect(score).toHaveValue('99');
  const campaign = await page.goto('/campaign');
  expect(campaign?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('@claim:privacy-network keeps session-note content out of network requests', async ({ page }) => {
  const marker = 'private network marker 491';
  const requests: Array<{ url: string; postData: string | null }> = [];
  page.on('request', (request) => requests.push({ url: request.url(), postData: request.postData() }));
  await page.goto('/demo');
  await page.getByLabel('Setup notes').fill(marker);
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Export text receipt' }).click();
  await expect(page.getByText('Text receipt downloaded.')).toBeVisible();
  expect(requests.every(({ url }) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
  expect(requests.some(({ url, postData }) => url.includes(marker) || postData?.includes(marker))).toBeFalsy();
});

test('@claim:art-provenance ships the recorded original illustration', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Generated illustration; source details in the design notes/)).toBeVisible();
  const provenance = JSON.parse(await readFile('assets/src/session-map.provenance.json', 'utf8')) as { model: string; source: { path: string; sha256: string }; derivatives: Record<string, string>; promptSource: string };
  expect(provenance.model).toContain('factory-image');
  const hash = async (path: string) => createHash('sha256').update(await readFile(path)).digest('hex');
  expect(await hash(provenance.source.path)).toBe(provenance.source.sha256);
  for (const [path, expected] of Object.entries(provenance.derivatives)) expect(await hash(path)).toBe(expected);
  const prompt = JSON.parse(await readFile(provenance.promptSource, 'utf8')) as { prompt: string };
  expect(prompt.prompt).toContain('No text');
  expect(prompt.prompt).toContain('no recognizable branded game');
  await expect(page.locator('img[alt="Abstract paper game path connecting setup, events, and a final result"]')).toBeVisible();
});

test('supports real routes, metadata, responsive layout, accessibility, and touch targets', async ({ page }) => {
  for (const route of ['/', '/demo', '/demo/', '/privacy/', '/terms/', '/does-not-exist']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Boardgame Session Notes');
  await page.goto('/demo/');
  await expect(page.getByRole('heading', { name: 'Lantern Harbor' })).toBeVisible();
  await page.goto('/privacy/');
  await expect(page).toHaveTitle('Privacy — Boardgame Session Notes');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/privacy$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const missing = await page.goto('/does-not-exist');
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/offline.html');
  await expect(page.getByRole('heading', { name: 'Reconnect once to finish offline setup.' })).toBeVisible();
  expect(errors).toEqual([]);
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  const targets = await page.locator('.site-header a, .site-footer a, .site-footer button').evaluateAll((elements) => elements.map((element) => { const box = element.getBoundingClientRect(); return { text: element.textContent, width: box.width, height: box.height }; }));
  expect(targets.every((target) => target.width >= 44 && target.height >= 44), JSON.stringify(targets)).toBeTruthy();
  await page.goto('/demo');
  const demoTargets = await page.locator('#demo-banner button, #export-markdown, #print-receipt').evaluateAll((elements) => elements.map((element) => { const box = element.getBoundingClientRect(); return { width: box.width, height: box.height }; }));
  expect(demoTargets.every((target) => target.width >= 44 && target.height >= 44)).toBeTruthy();
});
