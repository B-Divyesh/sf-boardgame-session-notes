# Polish 2 — finding closure map

**Repair commit:** `9f7b233f6b609b1479b8c2365bf82b4a79e3d35d`  
**Live deployment:** `4d7f5a5a-418c-4b51-b2c8-f66ad0b9ef16`  
**Live URL:** <https://boardgame-session-notes.sociobot.in>

| Finding id | Change made | Evidence |
|---|---|---|
| F-1-01, F-1-19, F-1-20, F-1-21 | Kept the plain job h1 and one-click demo; normalized `/demo`, `/demo/`, and `?demo=1` into the isolated sample. | `@claim:demo-isolated`; route/a11y browser test; live `/demo/`; `live-demo-390.png` |
| F-1-02, F-1-04, F-1-09, F-1-10, F-1-12, F-1-14 | Kept account/storage copy limited to listed observable claims; privacy page now uses the same wording. | `@claim:no-account`, `@claim:browser-storage`, `@claim:privacy-network` |
| F-1-03, F-1-17 | Preserved service-worker demo reload coverage. | `@claim:offline-reload` in both browser projects |
| F-1-05, F-1-06, F-2-03, F-2-06 | Removed the unavailable free-tier limit, restoration control, license runtime, and all paid assertions until a real purchasable Sociobot state exists. | Live home and `/terms/` cold check; no license endpoint remains in source |
| F-1-07, F-1-08, F-1-15 | Kept backup export/restore/merge and receipt outcomes with named controls. | `@claim:backup-file`, `@claim:backup-merge`, `@claim:exports` |
| F-1-11, F-2-09 | Narrowed the public art statement to recorded generation provenance; added prompt/source/derivative SHA-256 manifest. | `@claim:art-provenance`; `assets/src/session-map.provenance.json` |
| F-1-13, F-2-08 | Rewrote the boundary consistently and test manual scores, absence of lookup/automation controls, no campaign route, and same-origin traffic. | `@claim:no-rule-lookup` |
| F-1-16 | Kept filled sample fields and receipt coverage. | `@claim:session-template` |
| F-1-18, F-2-11 | Added 44×44 minimum header/footer/demo/receipt targets and cross-route bounding-box assertions. | `supports real routes, metadata, responsive layout, accessibility, and touch targets` |
| F-1-23 | Checkout link remains absent while purchase is unavailable. | Live link crawl in `scripts/live-check.mjs` route smoke |
| F-1-24, F-2-02 | Moved offline fallback CSS to same-origin `offline.css`; the fallback has plain wording and no inline-CSP violation. | Browser route/a11y test; live `/offline.html` cold check |
| F-1-25, F-1-26 | Retained immutable asset policy, manifest MIME configuration, and correct icon assets. | `staticwebapp.config.json`; production deployment check |
| F-1-27, F-2-14 | Replaced the stale literal with a post-build injected git id. | Built/live footer: `build 9f7b233f6b60` |
| F-1-28, F-1-29, F-1-30, F-1-31, F-2-13 | Re-audited all visitor copy; removed archive/table/database/caching metaphors and jargon, renamed the backup button, and updated README/offline/404 wording. | `.factory/copy-audit.md`; live home, demo, 404, and offline checks |
| F-2-01 | Added slash-aware client routing, canonical `/demo` sitemap entry, both worker cache keys, and direct route tests. | Browser route/a11y test; live `/demo/` |
| F-2-04 | Added a separate reset claim that edits the demo, restores every seed, and preserves a real-data sentinel. | `@claim:demo-reset`; `live-demo-390.png` |
| F-2-05 | Removed unprovable retention/tracking/update wording; retained one precise session-content network claim and test. | `@claim:privacy-network`; live `/privacy/` |
| F-2-07 | Removed overstated operational promises; production preview now intentionally serves explicit product routes and a real missing-page status. | Clean-clone `npm run build`; browser route/status test |
| F-2-10 | Added a product-specific three-step “How it works” section and “Privacy and limits” section; removed the incomplete paid-state panel. | `live-home-390.png` |
| F-2-12 | Removed SPA navigation fallback, configured explicit known routes, and use the 404 response override for unknown URLs. | Browser response-status test; live `/does-not-exist` returned HTTP 404; `live-404-1440.png` |
| `verification.md` import blocker | Existing strict whole-document validation remains intact. | `npm test` includes malformed nested import tests |
| `verification.md` desktop contrast blocker | Existing desktop axe coverage remains in the cross-route browser test. | Desktop browser project: 13 passed |
| `verification-2.md` free-tier/cache/MIME/icon notes | Removed the mismatched free tier; retained config/asset corrections. | Live footer/home check; deployment configuration and manifest assets |

## Exact verification

From clean clone `/tmp/boardgame-session-notes-clean.A1UjkS` at `9f7b233`:

- `npm ci`, `npm test` — 7 passed; `npm run build` — passed and produced `dist/`.
- Every command in `.factory/claims.json` ran separately. All 12 claims passed in desktop and mobile Chromium (24 executions).
- `npx playwright test --project=desktop-chromium --workers=1` — 13 passed.
- `npx playwright test --project=mobile-chromium --workers=1` — 13 passed.

Production cold check: `node scripts/live-check.mjs` passed with no ordinary console errors. Screenshots are [home mobile](evidence/polish-2/live-home-390.png), [demo mobile](evidence/polish-2/live-demo-390.png), and [404 desktop](evidence/polish-2/live-404-1440.png).
