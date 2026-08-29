# Polish 2 handoff

## Delivered

Repair commit [`9f7b233`](https://github.com/B-Divyesh/sf-boardgame-session-notes/commit/9f7b233f6b609b1479b8c2365bf82b4a79e3d35d) closes every item in `.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`, `verification.md`, and `verification-2.md`.

- Demo accepts `/demo`, `/demo/`, and `?demo=1`, seeds a separate IndexedDB namespace, shows Reset demo and Start for real, and preserves saved session notes.
- The landing now has a plain first screen, a three-step explanation, and a privacy/limits section. The incomplete paid/license interface was removed because no purchasable Sociobot state is available.
- Every public reliance statement has a named observable claim test. The provenance claim now verifies recorded source/prompt/derivative hashes.
- The offline page uses external same-origin CSS under CSP. Unknown URLs return HTTP 404 with the product-styled missing-page view.
- Mobile navigation, demo controls, footer links, and receipt controls have 44px targets. Build IDs are injected from the actual git revision at build time.

## Exact evidence

Clean clone: `/tmp/boardgame-session-notes-clean.A1UjkS` at `9f7b233f6b609b1479b8c2365bf82b4a79e3d35d`.

- `npm ci` completed with 0 vulnerabilities.
- `npm test` — 7 passed.
- `npm run build` — passed; `dist/` contains the static PWA and emitted build id `9f7b233f6b60`.
- All 12 exact commands in `.factory/claims.json` ran separately from the clean clone. Each passed in desktop and mobile Chromium: 24 claim executions.
- `npx playwright test --project=desktop-chromium --workers=1` — 13 passed.
- `npx playwright test --project=mobile-chromium --workers=1` — 13 passed.
- Axe WCAG 2 A/AA is part of the cross-route desktop and mobile Playwright check; both projects had zero serious/critical violations. The shell `@axe-core/cli` could not launch its Selenium Chrome binary in this container, so the repository’s installed Playwright axe integration is the recorded accessibility runner.
- `VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh https://boardgame-session-notes.sociobot.in .factory/evidence/verify-url` — passed: HTTP 200, load 840 ms, no console errors, one h1, `lang=en`, `<main>`, no missing image alt text, and no unlabeled buttons.
- Privacy, offline reload, malformed import, route/status, focus, metadata, console, and 44px target checks are included in the browser and claim suites above.

## Deployment and live re-check

Deployed through `/opt/fleet/lib/deploy-static.sh boardgame-session-notes dist` as Azure Static Web Apps deployment `4d7f5a5a-418c-4b51-b2c8-f66ad0b9ef16`.

`node scripts/live-check.mjs` cold-checked <https://boardgame-session-notes.sociobot.in> after deployment:

- home returned 200 with the required h1 and demo action;
- `/demo/` rendered Lantern Harbor with the demo banner; reset restored the seed and Start for real preserved a saved sentinel;
- `/does-not-exist` returned 404 and showed “Page not found”;
- `/offline.html`, `/privacy/`, `/terms/`, and `?demo=1` loaded with one h1 and no ordinary console errors;
- live footer build id is `9f7b233f6b60`.

Live screenshots: [home, 390px](evidence/polish-2/live-home-390.png), [demo, 390px](evidence/polish-2/live-demo-390.png), and [404, 1440px](evidence/polish-2/live-404-1440.png).

## Known gaps and next steps

None for the released local-first product. Paid purchase is deliberately not shown until the factory registers a working Sociobot checkout and a fixture-backed billing test can cover it.
