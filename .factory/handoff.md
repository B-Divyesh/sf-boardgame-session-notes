# Review 2 handoff

## Delivered

- Added `.factory/review-2.md` with the required adversarial cold-read, full landing/README copy audit, one-click demo and storage-isolation exercise, all-claims run, historical finding audit, structure/accessibility checks, missed-leverage assessment, and FAIL verdict.
- No product code, deployment configuration, assets, tests, or runtime documentation were changed.

## Verification performed

- Clean worktree at `2f673bf7bd31c249c5046e00e2658f170b7269ec`; `npm ci` completed with 0 vulnerabilities.
- `npm test`: 7 passed.
- `npm run build`: passed and produced `dist/`.
- `npm run test:e2e`: 24 passed across desktop and 390px mobile projects.
- Every one of the 11 commands in `.factory/claims.json` was run separately: 22/22 browser executions passed mechanically.
- Live cold loads at 390 × 844 and 1440 × 900, demo reset/exit with a real-data sentinel, offline reload, request logging, route metadata, back/focus, link crawl, headers, touch sizes, live axe, and the worker URL verifier were checked.
- Local build and production hashes match for HTML, JS, CSS, service worker, manifest, robots, and sitemap.

## Verdict and known gaps

**FAIL.** The review records 14 findings. Blocking issues include `/demo/` rendering the 404, `/offline.html` violating CSP, incomplete historical claim tests and license proof, regressed plain wording, and a stale build id. High findings cover other unlisted privacy/reset/README claims, incomplete landing structure and paid-state explanation, undersized mobile targets, and soft-404 response status.

## How to reproduce the main blockers

1. Open `https://boardgame-session-notes.sociobot.in/demo/`; it renders the page-not-found view instead of the sample.
2. Open `https://boardgame-session-notes.sociobot.in/offline.html` with the console visible; CSP blocks its inline style.
3. At a 390px viewport, inspect the Demo/Privacy/Terms links and demo-banner/receipt controls; their hit boxes are below 44px.
4. Request `https://boardgame-session-notes.sociobot.in/does-not-exist`; the response status is 200 despite the missing-page UI.

## Next step

Repair every finding in `.factory/review-2.md`, add the specified claim and route/accessibility coverage, deploy the resulting candidate, and run a new full adversarial review rather than a diff-only check.
