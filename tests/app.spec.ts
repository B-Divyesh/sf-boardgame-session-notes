import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

async function dbNames(page: import('@playwright/test').Page): Promise<string[]> {
  return page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name || ''));
}

async function storedDemoSession(page: import('@playwright/test').Page, id = 'demo-lantern-harbor'): Promise<Record<string, unknown> | undefined> {
  return page.evaluate(async ({ databaseName, sessionId }) => new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction('sessions');
      const get = transaction.objectStore('sessions').get(sessionId);
      get.onerror = () => reject(get.error);
      get.onsuccess = () => resolve(get.result);
    };
  }), { databaseName: 'demo:boardgame-session-notes', sessionId: id });
}

async function expectAllVisibleTargetsAtLeast44(page: import('@playwright/test').Page): Promise<void> {
  const targets = await page.locator('a[href], button, input, textarea, select, label.file-action').evaluateAll((elements) => elements
    .filter((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && box.width > 0 && box.height > 0;
    })
    .map((element) => {
      const box = element.getBoundingClientRect();
      return { name: element.getAttribute('aria-label') || element.textContent?.trim() || element.getAttribute('placeholder'), width: box.width, height: box.height };
    }));
  expect(targets.every(({ width, height }) => width >= 44 && height >= 44), JSON.stringify(targets)).toBeTruthy();
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
  await page.getByLabel('Game title').fill('Changed title');
  await page.getByLabel('Played at').fill('2026-01-02T03:04');
  await page.getByLabel('Location').fill('Changed location');
  for (let index = 0; index < 3; index += 1) {
    await page.getByRole('textbox', { name: `Player ${index + 1}` }).fill(`Changed player ${index + 1}`);
    await page.getByLabel('Final score').nth(index).fill(String(index));
  }
  await page.getByLabel('Setup notes').fill('Changed only in the demo.');
  await page.getByLabel('Result and next-time notes').fill('Changed outcome.');
  await page.getByRole('button', { name: 'Remove house rule' }).click();
  await page.getByRole('button', { name: 'Remove timeline event 1' }).click();
  await page.getByRole('button', { name: 'Remove timeline event 1' }).click();
  await page.getByRole('button', { name: 'Marked complete' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Lantern Harbor' })).toBeVisible();
  await expect(page.getByLabel('Game title')).toHaveValue('Lantern Harbor');
  await expect(page.getByLabel('Played at')).toHaveValue('2026-08-22T19:30');
  await expect(page.getByLabel('Location')).toHaveValue("Mina's kitchen table");
  await expect(page.getByRole('textbox', { name: 'Player 1' })).toHaveValue('Mina');
  await expect(page.getByRole('textbox', { name: 'Player 2' })).toHaveValue('Jo');
  await expect(page.getByRole('textbox', { name: 'Player 3' })).toHaveValue('Sam');
  for (const [index, score] of ['42', '38', '35'].entries()) await expect(page.getByLabel('Final score').nth(index)).toHaveValue(score);
  await expect(page.getByLabel('Setup notes')).toHaveValue('Mina chose orange and started. We used the harbor-market setup from last month.');
  await expect(page.getByText('Ties go to the player who placed the later marker.')).toBeVisible();
  await expect(page.getByText('We agreed the lighthouse bonus may be scored after a trade.')).toBeVisible();
  await expect(page.getByText('Mina gained 8 points for the completed harbor route.')).toBeVisible();
  await expect(page.getByLabel('Result and next-time notes')).toHaveValue('Mina won by 4 points. Next time, check the lighthouse timing before the first trade.');
  await expect(page.getByRole('button', { name: 'Marked complete' })).toBeVisible();
  await page.getByLabel('Setup notes').fill('Late write that reset must cancel.');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.waitForTimeout(700);
  await expect(page.getByLabel('Setup notes')).toHaveValue('Mina chose orange and started. We used the harbor-market setup from last month.');
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
  await expect(page.getByRole('textbox', { name: /email|password|account/i })).toHaveCount(0);
  await expect(page.locator('#save-status')).toHaveText('Saved in this browser');
});

test('@claim:offline-reload reopens the sample offline after first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.getByLabel('Setup notes').fill('Saved before the offline reload.');
  await expect(page.locator('#save-status')).toHaveText('Saved in this browser');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Lantern Harbor' })).toBeVisible();
  await expect(page.getByLabel('Setup notes')).toHaveValue('Saved before the offline reload.');
  await expect(page.getByText('Offline · saved in this browser')).toBeVisible();
});

test('@claim:browser-storage keeps the sample in an isolated browser store', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { name: 'Lantern Harbor' })).toBeVisible();
  await page.getByLabel('Setup notes').fill('Stored only in the demo browser data.');
  await expect(page.locator('#save-status')).toHaveText('Saved in this browser');
  await expect.poll(() => dbNames(page)).toContain('demo:boardgame-session-notes');
  await expect.poll(async () => (await storedDemoSession(page))?.startingState).toBe('Stored only in the demo browser data.');
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('@claim:backup-file downloads and restores every field and saved rule in a fresh context', async ({ page, browser }) => {
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
  expect(backup.snippets).toEqual(['Ties go to the player who placed the later marker.']);

  const origin = new URL(page.url()).origin;
  const freshContext = await browser.newContext({ baseURL: origin });
  const fresh = await freshContext.newPage();
  await fresh.goto('/');
  await expect(fresh.getByText('No session notes yet')).toBeVisible();
  await fresh.getByRole('button', { name: 'Open backup tools' }).click();
  await fresh.locator('#import-backup').setInputFiles({ name: 'session-notes-backup.json', mimeType: 'application/json', buffer: Buffer.from(contents) });
  await expect(fresh.getByText('Restored 1 session notes.')).toBeVisible();
  await fresh.getByLabel('Close backup tools').click();
  await fresh.getByRole('button', { name: /Lantern Harbor/ }).click();
  await expect(fresh.getByLabel('Game title')).toHaveValue('Lantern Harbor');
  await expect(fresh.getByLabel('Played at')).toHaveValue('2026-08-22T19:30');
  await expect(fresh.getByLabel('Location')).toHaveValue("Mina's kitchen table");
  await expect(fresh.getByRole('textbox', { name: 'Player 1' })).toHaveValue('Mina');
  await expect(fresh.getByRole('textbox', { name: 'Player 2' })).toHaveValue('Jo');
  await expect(fresh.getByRole('textbox', { name: 'Player 3' })).toHaveValue('Sam');
  for (const [index, score] of ['42', '38', '35'].entries()) await expect(fresh.getByLabel('Final score').nth(index)).toHaveValue(score);
  await expect(fresh.getByLabel('Setup notes')).toHaveValue(/harbor-market setup/);
  await expect(fresh.getByText('Ties go to the player who placed the later marker.')).toBeVisible();
  await expect(fresh.getByText('We agreed the lighthouse bonus may be scored after a trade.')).toBeVisible();
  await expect(fresh.getByText('Mina gained 8 points for the completed harbor route.')).toBeVisible();
  await expect(fresh.getByLabel('Result and next-time notes')).toHaveValue(/Mina won by 4 points/);
  await expect(fresh.getByRole('button', { name: 'Marked complete' })).toBeVisible();
  await fresh.getByRole('button', { name: 'All session notes' }).click();
  await fresh.getByRole('button', { name: 'Start a blank session note' }).click();
  await expect(fresh.getByLabel('Reuse a saved rule')).toContainText('Ties go to the player who placed the later marker.');
  await freshContext.close();
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
  const download = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export text receipt' }).click()
  ]).then(([file]) => file);
  const receipt = await readFile(await download.path()!, 'utf8');
  for (const value of ['Lantern Harbor', 'Mina', '42', 'Mina chose orange', 'Ties go to the player', 'lighthouse bonus', 'Mina won']) expect(receipt).toContain(value);
});

test('@claim:exports downloads a text receipt and opens a styled printable receipt', async ({ page, context }) => {
  await context.addInitScript(() => {
    window.print = () => { document.documentElement.dataset.printInvoked = 'true'; };
  });
  await page.goto('/demo');
  const download = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export text receipt' }).click()
  ]).then(([file]) => file);
  expect(await readFile(await download.path()!, 'utf8')).toContain('Lantern Harbor');
  const popupErrors: string[] = [];
  const popup = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Print or save PDF' }).click()
  ]).then(([window]) => window);
  popup.on('console', (message) => { if (message.type() === 'error') popupErrors.push(message.text()); });
  await expect(popup).toHaveTitle(/Lantern Harbor receipt/);
  await expect(popup.getByRole('heading', { name: 'Lantern Harbor' })).toBeVisible();
  await expect.poll(() => popup.locator('body').evaluate((body) => getComputedStyle(body).maxWidth)).toBe('720px');
  await expect.poll(() => popup.locator('header').evaluate((header) => getComputedStyle(header).borderBottomWidth)).toBe('4px');
  await expect.poll(() => popup.locator('html').getAttribute('data-print-invoked')).toBe('true');
  expect(popupErrors).toEqual([]);
});

test('@claim:setup-photo stores a setup image only in the demo and prints it', async ({ page, context }) => {
  await context.addInitScript(() => {
    window.print = () => { document.documentElement.dataset.printInvoked = 'true'; };
  });
  await page.goto('/demo');
  await page.locator('#setup-photo').setInputFiles('public/icons/icon-192.png');
  await expect(page.getByAltText('Saved pre-play setup')).toBeVisible();
  const stored = await storedDemoSession(page);
  expect(stored?.photo).toMatch(/^data:image\/jpeg;base64,/);
  expect(await dbNames(page)).toContain('demo:boardgame-session-notes');
  expect(await dbNames(page)).not.toContain('boardgame-session-notes');
  await page.reload();
  await expect(page.getByAltText('Saved pre-play setup')).toBeVisible();
  const download = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export text receipt' }).click()
  ]).then(([file]) => file);
  const textReceipt = await readFile(await download.path()!, 'utf8');
  expect(textReceipt).toContain('The pre-play photo remains in the app and is not embedded in this Markdown receipt.');
  expect(textReceipt).not.toContain('data:image');
  const popup = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Print or save PDF' }).click()
  ]).then(([window]) => window);
  await expect(popup.getByAltText('Pre-play setup')).toHaveAttribute('src', /^data:image\/jpeg;base64,/);
});

test('@claim:rule-reuse reuses one saved ruling in a later demo note', async ({ page }) => {
  const reusableRule = 'The last marker wins tied harbor spaces.';
  await page.goto('/demo');
  await page.getByLabel('Add a rule or ruling').fill(reusableRule);
  await page.getByRole('button', { name: 'Add rule' }).click();
  await expect(page.getByText(reusableRule)).toBeVisible();
  await page.getByRole('button', { name: 'All session notes' }).click();
  await page.getByRole('button', { name: 'Create a sample session note' }).click();
  await page.getByLabel('Game title').fill('Second sample note');
  await page.getByLabel('Reuse a saved rule').selectOption({ label: reusableRule });
  await expect(page.getByText(reusableRule)).toBeVisible();
  const secondUrl = page.url();
  await page.reload();
  await expect(page).toHaveURL(secondUrl);
  await expect(page.getByText(reusableRule)).toBeVisible();
  await page.getByRole('button', { name: 'All session notes' }).click();
  await page.getByRole('button', { name: /Lantern Harbor/ }).click();
  await expect(page.getByText(reusableRule)).toBeVisible();
  expect(await dbNames(page)).toContain('demo:boardgame-session-notes');
  expect(await dbNames(page)).not.toContain('boardgame-session-notes');
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

test('@claim:privacy-network keeps session-note content out of network requests', async ({ page, context }) => {
  const marker = 'private network marker 491';
  const requests: Array<{ url: string; postData: string | null }> = [];
  context.on('request', (request) => requests.push({ url: request.url(), postData: request.postData() }));
  await context.addInitScript(() => {
    window.print = () => { document.documentElement.dataset.printInvoked = 'true'; };
  });
  await page.goto('/demo');
  await page.getByLabel('Setup notes').fill(marker);
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Export text receipt' }).click();
  await expect(page.getByText('Text receipt downloaded.')).toBeVisible();
  const popup = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Print or save PDF' }).click()
  ]).then(([window]) => window);
  await expect(popup.getByText(marker)).toBeVisible();
  expect(requests.every(({ url }) => url.startsWith('blob:') || new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
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

test('@claim:navigation-save flushes the newest edit before every navigation path and after an immediate reload or close', async ({ page, context }) => {
  const createDraft = async (title: string): Promise<string> => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start a blank session note' }).click();
    await page.getByLabel('Game title').fill(title);
    return page.url();
  };

  await createDraft('Wordmark navigation sentinel');
  await page.locator('.wordmark').click();
  await expect(page.getByRole('button', { name: /Wordmark navigation sentinel/ })).toBeVisible();

  await createDraft('Privacy navigation sentinel');
  await page.locator('.site-header').getByRole('link', { name: 'Privacy' }).click();
  await expect(page.getByRole('heading', { name: 'How your session notes are stored' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to session notes' }).click();
  await expect(page.getByRole('button', { name: /Privacy navigation sentinel/ })).toBeVisible();

  await createDraft('Terms navigation sentinel');
  await page.locator('.site-footer').getByRole('link', { name: 'Terms' }).click();
  await expect(page.getByRole('heading', { name: 'Terms of use' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to session notes' }).click();
  await expect(page.getByRole('button', { name: /Terms navigation sentinel/ })).toBeVisible();

  await createDraft('Demo navigation sentinel');
  await page.locator('.site-header').getByRole('link', { name: 'Demo' }).click();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByRole('button', { name: /Demo navigation sentinel/ })).toBeVisible();

  await createDraft('Browser back sentinel');
  await page.goBack();
  await expect(page.getByRole('button', { name: /Browser back sentinel/ })).toBeVisible();

  const reloadUrl = await createDraft('Immediate reload sentinel');
  await page.reload();
  await expect(page).toHaveURL(reloadUrl);
  await expect(page.getByLabel('Game title')).toHaveValue('Immediate reload sentinel');

  const closeUrl = await createDraft('Immediate close sentinel');
  await page.close();
  const reopened = await context.newPage();
  await reopened.goto(closeUrl);
  await expect(reopened.getByLabel('Game title')).toHaveValue('Immediate close sentinel');
});

test('gives session notes direct routes, history state, route focus, and route metadata', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a blank session note' }).click();
  await expect(page).toHaveURL(/\/session\/[^/]+$/);
  await expect(page.getByRole('heading', { level: 1, name: 'New session note' })).toBeFocused();
  await page.getByLabel('Game title').fill('Route focus sentinel');
  await page.getByRole('button', { name: 'All session notes' }).click();
  await page.getByRole('button', { name: /Route focus sentinel/ }).click();
  const sessionUrl = page.url();
  await expect(page).toHaveURL(/\/session\/[^/]+$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Route focus sentinel' })).toBeFocused();
  await expect(page).toHaveTitle('Route focus sentinel — Boardgame Session Notes');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://boardgame-session-notes.sociobot.in${new URL(sessionUrl).pathname}`);
  await page.reload();
  await expect(page.getByLabel('Game title')).toHaveValue('Route focus sentinel');
  await expect(page.getByRole('heading', { level: 1, name: 'Route focus sentinel' })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Record one boardgame session' })).toBeFocused();
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Route focus sentinel' })).toBeFocused();
  await expect(page.locator('#route-announcement')).toContainText('Route focus sentinel');
});

test('supports real routes, metadata, responsive layout, accessibility, and touch targets', async ({ page }) => {
  for (const route of ['/', '/demo', '/demo/', '/privacy', '/terms', '/does-not-exist']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
    await expectAllVisibleTargetsAtLeast44(page);
    expect((await page.title()).length).toBeLessThanOrEqual(60);
    await expect(page.locator('h1')).toHaveCount(1);
  }
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Boardgame Session Notes');
  await page.goto('/demo/');
  await expect(page.getByRole('heading', { name: 'Lantern Harbor' })).toBeVisible();
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Boardgame Session Notes');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://boardgame-session-notes.sociobot.in/privacy');
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
  await expectAllVisibleTargetsAtLeast44(page);

  const sitemap = await (await page.request.get('/sitemap.xml')).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(urls).toEqual([
    'https://boardgame-session-notes.sociobot.in/',
    'https://boardgame-session-notes.sociobot.in/demo',
    'https://boardgame-session-notes.sociobot.in/privacy',
    'https://boardgame-session-notes.sociobot.in/terms'
  ]);
  for (const url of urls) {
    await page.goto(new URL(url).pathname);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url);
  }
});
