import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('creates and reopens a complete local session', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a session note' }).click();
  await page.getByLabel('Game title').fill('River Council');
  await page.getByLabel('Player 1').fill('Ana');
  await page.getByLabel('Setup notes').fill('Ana starts with the orange marker.');
  await page.getByLabel('Add a rule or ruling').fill('Ties favor the later player');
  await page.getByRole('button', { name: 'Add rule' }).click();
  await page.getByLabel('What happened').fill('Agreed the bridge remains open.');
  await page.getByRole('button', { name: 'Add event' }).click();
  await page.getByLabel('Final score').fill('31');
  await page.getByLabel('Result and next-time notes').fill('Ana won.');
  await page.getByRole('button', { name: 'Finish this session' }).click();
  await page.getByRole('button', { name: 'All sessions' }).click();
  await page.getByRole('button', { name: /River Council/ }).click();
  await expect(page.getByLabel('Game title')).toHaveValue('River Council');
  await expect(page.getByRole('button', { name: 'Marked complete' })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test('has no serious accessibility violations, including the desktop editor', async ({ page }) => {
  await page.goto('/');
  for (const action of [async () => {}, async () => page.getByRole('button', { name: 'Start a session note' }).click(), async () => page.goto('/privacy/')]) {
    await action();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
});

test('rejects a structurally incomplete backup and preserves the usable archive', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a session note' }).click();
  await page.getByLabel('Game title').fill('Existing archive note');
  await page.getByRole('button', { name: 'All sessions' }).click();

  await page.getByRole('button', { name: 'Data tools' }).click();
  await page.locator('#import-backup').setInputFiles({
    name: 'malformed-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      version: 1,
      exportedAt: 'now',
      snippets: [],
      sessions: [{ id: 'malformed', title: 'Broken import', participants: [{}], events: [], houseRules: [], updatedAt: 'now' }]
    }))
  });
  await expect(page.getByText('This file is not a valid Session Notes backup.')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.getByRole('button', { name: /Existing archive note/ })).toBeVisible();
  await expect(page.getByText('Local storage unavailable')).toHaveCount(0);
});

test('reopens after the network goes offline', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Session archive' })).toBeVisible();
  await expect(page.getByText('Offline · saving locally')).toBeVisible();
});
