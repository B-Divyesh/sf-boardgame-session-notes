import { mkdir, readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const origin = process.argv[2] || 'https://boardgame-session-notes.sociobot.in';
const evidence = '.factory/evidence/polish-3';
await mkdir(evidence, { recursive: true });

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const browser = await chromium.launch({ headless: true });
const errors = [];
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
await context.addInitScript(() => {
  window.print = () => { document.documentElement.dataset.printInvoked = 'true'; };
});
context.on('page', (page) => page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`${page.url()}: ${message.text()}`);
}));
const page = await context.newPage();

const home = await page.goto(origin, { waitUntil: 'networkidle' });
assert(home?.status() === 200, `Home returned ${home?.status()}`);
assert(await page.getByRole('heading', { name: 'Record one boardgame session' }).count() === 1, 'Home job h1 is missing.');
assert(await page.getByRole('link', { name: 'Try it with sample data' }).count() === 1, 'One-click demo action is missing.');
await page.screenshot({ path: `${evidence}/live-home-390.png`, fullPage: true });

await page.getByRole('button', { name: 'Start a blank session note' }).click();
await page.getByLabel('Game title').fill('Live navigation sentinel');
await page.locator('.site-header').getByRole('link', { name: 'Privacy' }).click();
await page.getByRole('heading', { name: 'How your session notes are stored' }).waitFor();
assert(await page.getByRole('heading', { name: 'How your session notes are stored' }).count() === 1, 'Privacy route did not open.');
await page.getByRole('link', { name: 'Back to session notes' }).click();
await page.getByRole('button', { name: /Live navigation sentinel/ }).waitFor();
await page.getByRole('button', { name: /Live navigation sentinel/ }).click();
await page.getByRole('heading', { name: 'Live navigation sentinel' }).waitFor();
const sessionUrl = page.url();
assert(new URL(sessionUrl).pathname.startsWith('/session/'), 'Session note has no direct route.');
assert(await page.getByRole('heading', { name: 'Live navigation sentinel' }).evaluate((heading) => heading === document.activeElement), 'Editor h1 did not receive focus.');
await page.reload({ waitUntil: 'networkidle' });
assert(await page.getByLabel('Game title').inputValue() === 'Live navigation sentinel', 'Direct session reload lost the newest edit.');
await page.screenshot({ path: `${evidence}/live-session-390.png`, fullPage: true });

const demoContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
await demoContext.addInitScript(() => {
  window.print = () => { document.documentElement.dataset.printInvoked = 'true'; };
});
demoContext.on('page', (candidate) => candidate.on('console', (message) => {
  if (message.type() === 'error') errors.push(`${candidate.url()}: ${message.text()}`);
}));
const demo = await demoContext.newPage();
await demo.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
assert(await demo.getByText('Demo — sample data, nothing is saved').count() === 1, 'Demo banner is missing.');
assert(await demo.getByRole('heading', { name: 'Lantern Harbor' }).count() === 1, 'Filled demo did not open from ?demo=1.');
const names = await demo.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
assert(names.includes('demo:boardgame-session-notes') && !names.includes('boardgame-session-notes'), 'Demo storage is not isolated.');
await demo.getByLabel('Game title').fill('Changed demo title');
await demo.getByLabel('Setup notes').fill('Changed demo setup');
await demo.getByLabel('Result and next-time notes').fill('Changed demo result');
await demo.getByRole('button', { name: 'Reset demo' }).click();
await demo.waitForFunction(() => (document.querySelector('#game-title'))?.value === 'Lantern Harbor');
assert(await demo.getByLabel('Game title').inputValue() === 'Lantern Harbor', 'Reset did not restore the title.');
assert(await demo.getByLabel('Played at').inputValue() === '2026-08-22T19:30', 'Reset did not restore the date.');
assert(await demo.getByLabel('Location').inputValue() === "Mina's kitchen table", 'Reset did not restore the location.');
assert((await demo.getByLabel('Setup notes').inputValue()).includes('Mina chose orange'), 'Reset did not restore setup.');
assert(await demo.getByRole('textbox', { name: 'Player 3' }).inputValue() === 'Sam', 'Reset did not restore players.');
assert(await demo.getByLabel('Final score').nth(0).inputValue() === '42' && await demo.getByLabel('Final score').nth(2).inputValue() === '35', 'Reset did not restore scores.');
assert(await demo.getByText('Ties go to the player who placed the later marker.').count() === 1, 'Reset did not restore the saved ruling.');
assert(await demo.getByText('We agreed the lighthouse bonus may be scored after a trade.').count() === 1, 'Reset did not restore the first event.');
assert(await demo.getByText('Mina gained 8 points for the completed harbor route.').count() === 1, 'Reset did not restore the second event.');
assert((await demo.getByLabel('Result and next-time notes').inputValue()).includes('Mina won by 4 points'), 'Reset did not restore the outcome.');
assert(await demo.getByRole('button', { name: 'Marked complete' }).count() === 1, 'Reset did not restore completion.');

await demo.getByRole('button', { name: 'Open backup tools' }).click();
const backupDownload = await Promise.all([
  demo.waitForEvent('download'),
  demo.getByRole('button', { name: 'Download backup file' }).click()
]).then(([download]) => download);
const backupContents = await readFile(await backupDownload.path(), 'utf8');
const restoreContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const restore = await restoreContext.newPage();
await restore.goto(origin, { waitUntil: 'networkidle' });
await restore.getByRole('button', { name: 'Open backup tools' }).click();
await restore.locator('#import-backup').setInputFiles({ name: 'live-backup.json', mimeType: 'application/json', buffer: Buffer.from(backupContents) });
await restore.getByText('Restored 1 session notes.').waitFor();
assert(await restore.getByText('Restored 1 session notes.').count() === 1, 'Fresh-context backup restore failed.');
await restore.getByLabel('Close backup tools').click();
await restore.getByRole('button', { name: /Lantern Harbor/ }).waitFor();
await restore.getByRole('button', { name: /Lantern Harbor/ }).click();
await restore.getByLabel('Setup notes').waitFor();
assert((await restore.getByLabel('Setup notes').inputValue()).includes('Mina chose orange'), 'Restored fields are missing.');
await restore.getByRole('button', { name: 'All session notes' }).click();
await restore.getByRole('button', { name: 'Start a blank session note' }).click();
assert((await restore.getByLabel('Reuse a saved rule').textContent()).includes('Ties go to the player'), 'Restored saved ruling is missing.');
await restoreContext.close();

await demo.getByLabel('Close backup tools').click();
await demo.getByRole('button', { name: /Lantern Harbor/ }).waitFor();
await demo.getByRole('button', { name: /Lantern Harbor/ }).click();

await demo.locator('#setup-photo').setInputFiles('public/icons/icon-192.png');
await demo.getByAltText('Saved pre-play setup').waitFor();
assert(await demo.getByAltText('Saved pre-play setup').count() === 1, 'Setup photo was not stored.');
const popup = await Promise.all([
  demo.waitForEvent('popup'),
  demo.getByRole('button', { name: 'Print or save PDF' }).click()
]).then(([receipt]) => receipt);
await popup.waitForLoadState('load');
assert(await popup.locator('body').evaluate((body) => getComputedStyle(body).maxWidth) === '720px', 'Print stylesheet did not load.');
assert(await popup.locator('header').evaluate((header) => getComputedStyle(header).borderBottomWidth) === '4px', 'Print receipt border styling is missing.');
assert(await popup.getByAltText('Pre-play setup').count() === 1, 'Print receipt omitted the setup photo.');
assert(await popup.locator('html').getAttribute('data-print-invoked') === 'true', 'Print was not invoked.');

const reusableRule = 'Live reusable harbor ruling.';
await demo.getByLabel('Add a rule or ruling').fill(reusableRule);
await demo.getByRole('button', { name: 'Add rule' }).click();
await demo.getByText(reusableRule, { exact: true }).waitFor();
await demo.getByRole('button', { name: 'All session notes' }).click();
await demo.getByRole('button', { name: 'Create a sample session note' }).click();
await demo.getByLabel('Game title').fill('Live second sample');
await demo.getByLabel('Reuse a saved rule').selectOption({ label: reusableRule });
await demo.getByText(reusableRule, { exact: true }).waitFor();
await demo.reload({ waitUntil: 'networkidle' });
assert(await demo.getByText(reusableRule).count() >= 1, 'Reusable rule did not survive the second-note reload.');
assert(!(await demo.locator('body').innerText()).includes('decisions'), 'Vague decisions wording remains.');
await demo.screenshot({ path: `${evidence}/live-demo-390.png`, fullPage: true });

const interactiveTargets = await demo.locator('a[href], button, input, textarea, select, label.file-action').evaluateAll((elements) => elements
  .filter((element) => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return box.width > 0 && box.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  })
  .map((element) => {
    const box = element.getBoundingClientRect();
    return { label: element.getAttribute('aria-label') || element.textContent?.trim(), width: box.width, height: box.height };
  }));
assert(interactiveTargets.every(({ width, height }) => width >= 44 && height >= 44), `Small live target: ${JSON.stringify(interactiveTargets)}`);

const sitemap = await (await demoContext.request.get(`${origin}/sitemap.xml`)).text();
for (const url of [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])) {
  await demo.goto(url, { waitUntil: 'networkidle' });
  assert(await demo.locator('link[rel="canonical"]').getAttribute('href') === url, `Canonical disagrees with sitemap: ${url}`);
}
assert(errors.length === 0, `Console errors before the expected missing-page response: ${errors.join(' | ')}`);
errors.length = 0;
const missing = await demo.goto(`${origin}/does-not-exist`, { waitUntil: 'networkidle' });
assert(missing?.status() === 404, `Unknown route returned ${missing?.status()}`);
assert(await demo.getByRole('heading', { name: 'Page not found' }).count() === 1, 'Designed 404 is missing.');
await demo.screenshot({ path: `${evidence}/live-404-390.png`, fullPage: true });
const unexpected404Errors = errors.filter((message) => !message.includes('Failed to load resource: the server responded with a status of 404'));

const builtHtml = await readFile('dist/index.html', 'utf8');
const buildMatch = builtHtml.match(/\/assets\/index-[^"']+\.js/);
assert(Boolean(buildMatch), 'Could not resolve the built JavaScript asset.');
const liveScript = await (await demoContext.request.get(`${origin}${buildMatch[0]}`)).text();
const localScript = await readFile(`dist${buildMatch[0]}`, 'utf8');
assert(liveScript === localScript, 'Live JavaScript does not match dist.');
assert(unexpected404Errors.length === 0, `Unexpected 404 console errors: ${unexpected404Errors.join(' | ')}`);

await browser.close();
console.log(JSON.stringify({ origin, sessionUrl, screenshots: evidence, consoleErrorsBefore404: 0, expected404ResourceMessages: errors.length, status: 'pass' }));
