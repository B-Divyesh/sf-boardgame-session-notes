# Polish 4 — cumulative finding closure map

**Repair commit:** `d2d5159bf97a12ae16f639751263bdf19bb9205c`

**Production:** <https://boardgame-session-notes.sociobot.in>

## Evidence key

- `claims`: every literal command in `.factory/claims.json`; 15 commands and 30 desktop/mobile executions passed from `/tmp/boardgame-session-notes-polish4.een7tV`.
- `browser`: `npm run test:e2e`; 36/36 passed, including axe, route, touch-target, privacy, offline, and focus checks.
- `focus`: Playwright test `keeps logical keyboard focus after every editor rerender`, desktop and mobile.
- `routes`: Playwright test `supports real routes, metadata, responsive layout, accessibility, and touch targets`, desktop and mobile.
- `live`: `node scripts/live-check.mjs https://boardgame-session-notes.sociobot.in` after deployment.
- Screenshots: `.factory/evidence/polish-4/local-home-390.png`, `local-demo-390.png`, `local-offline-390.png`, and the corresponding `live-*.png` files.

## Review 1

| Finding id | Change retained or made | Evidence |
|---|---|---|
| F-1-01 | Kept `/demo` and `?demo=1`, filled sample, exact banner, reset/start controls, and separate demo storage. | `@claim:demo-isolated`, `@claim:demo-reset`; demo screenshots; live `/demo` and `/?demo=1`. |
| F-1-02 | Kept account-free save behavior. | `@claim:no-account`; live demo request log. |
| F-1-03 | Kept the first-visit offline behavior and wording. | `@claim:offline-reload`; live offline reload. |
| F-1-04 | Kept session-note and browser-storage wording. | `@claim:no-account`; `.factory/copy-audit.md`; live home. |
| F-1-05 | Kept the false three-complete limit and limit UI removed. | `routes`; live home/README crawl. |
| F-1-06 | Kept unregistered price, device, license, and checkout claims removed. | `live` rendered-link crawl; live home/terms. |
| F-1-07 | Kept fresh-context backup restoration of every field and saved ruling. | `@claim:backup-file`; live fresh-context restore. |
| F-1-08 | Kept matching-note update and unrelated-note preservation. | `@claim:backup-merge`. |
| F-1-09 | Kept precise privacy wording with storage and request proof. | `@claim:browser-storage`, `@claim:privacy-network`; live request log. |
| F-1-10 | Kept browser/device storage wording consistent. | `@claim:browser-storage`; live IndexedDB inspection. |
| F-1-11 | Kept prompt, source, and derivative hashes as the art proof. | `@claim:art-provenance`; home screenshots. |
| F-1-12 | Kept the README lead short and tied to tested behavior. | `.factory/copy-audit.md`; `@claim:session-template`, `@claim:offline-reload`. |
| F-1-13 | Kept all rule-lookup, score-calculation, and campaign exclusions observable. | `@claim:no-rule-lookup`. |
| F-1-14 | Kept note and photo data in demo-only browser storage. | `@claim:browser-storage`, `@claim:setup-photo`. |
| F-1-15 | Kept text and styled print/PDF receipt proof. | `@claim:exports`; live popup console/style check. |
| F-1-16 | Kept every template field and cross-note ruling reuse exercised. | `@claim:session-template`, `@claim:rule-reuse`; demo screenshots. |
| F-1-17 | Kept offline reopen and immediate-navigation save protection. | `@claim:offline-reload`, `@claim:navigation-save`. |
| F-1-18 | Added logical focus after editor mutations; retained axe, mobile, reduced-motion, and target checks. | `focus`, `routes`; local/live demo screenshots. |
| F-1-19 | Kept the visible job h1, audience, sample action, outcome, and three facts. | `routes`; home screenshots; live `/`. |
| F-1-20 | Kept demo, legal, 404, and session routes with history/focus; added mutation focus continuity. | `focus`; `gives session notes direct routes…`; live route crawl. |
| F-1-21 | Kept build entries and explicit dynamic-session rewrites. | Clean `npm run build`; live `/session/<id>` and unknown-route status. |
| F-1-23 | Kept the dead checkout absent. | `live` rendered-link crawl. |
| F-1-24 | Extended metadata and CSP-safe styling to the standalone offline route. | `routes`; offline screenshots; live `/offline.html` metadata check. |
| F-1-25 | Kept immutable hashed assets and the manifest MIME rule. | `staticwebapp.config.json`; live header check. |
| F-1-26 | Kept the maskable icon at its declared 512 × 512 size. | Build asset inspection; manifest check. |
| F-1-27 | Extended the shared header/footer, legal links, credit, and injected build id to offline. | `routes`; offline screenshots; live `/offline.html`. |
| F-1-28 | Kept `session note` as the saved-record term. | `.factory/copy-audit.md`; live body crawl. |
| F-1-29 | Kept mood slogans and vague `decisions` wording absent. | `.factory/copy-audit.md`; `live` text scan. |
| F-1-30 | Kept first-screen and README sentences within 22 words. | `.factory/copy-audit.md`. |
| F-1-31 | Kept flagged implementation jargon out of visitor copy. | `.factory/copy-audit.md`; live page crawl. |

There was no F-1-22 in the source review.

## Review 2

| Finding id | Change retained or made | Evidence |
|---|---|---|
| F-2-01 | Kept `/demo`, `/demo/`, and `?demo=1` on the same isolated sample. | `@claim:demo-isolated`; `routes`; live URL checks. |
| F-2-02 | Kept print/offline styles same-origin and CSP-safe; expanded offline route coverage. | `@claim:exports`, `routes`; zero console errors live. |
| F-2-03 | Kept dormant license restoration and unlock claims absent. | Source/copy crawl; live home. |
| F-2-04 | Kept Reset demo coverage for every field, completion, pending writes, and real sentinel. | `@claim:demo-reset`; `live`. |
| F-2-05 | Kept privacy copy limited to tested storage, backup, export, and network behavior. | `@claim:browser-storage`, `@claim:backup-file`, `@claim:privacy-network`; live `/privacy`. |
| F-2-06 | Kept dormant paid terms absent. | `routes`; live `/terms`. |
| F-2-07 | Kept README instructions limited to commands rerun in the clean clone. | Clean `npm ci`, `npm test`, `npm run build`, `npm run test:e2e`. |
| F-2-08 | Kept every negative-scope clause tested. | `@claim:no-rule-lookup`. |
| F-2-09 | Kept art provenance non-circular and hash-backed. | `@claim:art-provenance`. |
| F-2-10 | Kept the product preview, three steps, privacy/limits, and footer order. | Home screenshots; live `/`. |
| F-2-11 | Kept every visible interactive target at least 44 × 44 px, including offline. | `routes`; `live` target audit; mobile screenshots. |
| F-2-12 | Kept unknown URLs as designed HTTP 404 responses. | `routes`; live `/does-not-exist`; `live-404-390.png`. |
| F-2-13 | Kept database/archive/caching metaphors and jargon out of visitor copy. | `.factory/copy-audit.md`; live body crawl. |
| F-2-14 | Injected the release id into both app and standalone offline footers. | Clean build inspection; `routes`; live footer checks. |

## Review 3

| Finding id | Change retained or made | Evidence |
|---|---|---|
| F-3-01 | Kept synchronous pending drafts and ordered saves before navigation. | `@claim:navigation-save`; live navigation sentinel. |
| F-3-02 | Kept same-origin receipt CSS with content, computed-style, print-call, and console assertions. | `@claim:exports`; live print check. |
| F-3-03 | Kept real/demo session deep links, reload, history, canonical, announcement, and h1 focus. | `gives session notes direct routes…`; live `/session/<id>`. |
| F-3-04 | Kept the privacy link and all other controls at least 44 × 44 px. | `routes`; live target audit. |
| F-3-05 | Kept full demo seed and late-write reset coverage. | `@claim:demo-reset`. |
| F-3-06 | Kept fresh-context backup restore with every field and saved ruling. | `@claim:backup-file`; live restore check. |
| F-3-07 | Kept photo storage, reload, and print proof. | `@claim:setup-photo`. |
| F-3-08 | Kept actual cross-note ruling reuse in isolated demo storage. | `@claim:rule-reuse`. |
| F-3-09 | Kept visitor-facing `decisions` wording absent. | `.factory/copy-audit.md`; live text scan. |
| F-3-10 | Kept sitemap, links, and canonical route forms aligned. | `routes`; live sitemap/canonical loop. |

## Review 4

| Finding id | Change made | Evidence |
|---|---|---|
| F-4-01 | Every editor rerender now restores focus to the replacement control or section heading. Completion, add/remove player, add/remove/reuse ruling, add/remove event, photo add/remove, and finish paths are covered. | `focus` in both projects; live keyboard assertions at `/demo`; `local-demo-390.png` and `live-demo-390.png`. |
| F-4-02 | `/offline.html` now has description, canonical, OG/Twitter metadata, favicon/touch icon, manifest, skip link, shared header/nav/footer, legal links, credit, and injected build id. It remains standalone and uses same-origin CSS. | `routes` offline assertions plus axe/targets/overflow; `local-offline-390.png`, `live-offline-390.png`; live `/offline.html`. |
| F-4-03 | The action now says `Reopen session note` or `Mark session note complete`; a separate `Status: Completed/In progress` line exposes state. | `focus`; demo screenshots; live `/demo`. |
| F-4-04 | Replaced `Try the app again` with `Open session notes`. | `routes`; offline screenshots; live `/offline.html`. |

## Earlier verification findings

| Finding | Change retained | Evidence |
|---|---|---|
| `verification.md` malformed import | Whole-document validation remains atomic before writes. | `npm test`: malformed nested backup test. |
| `verification.md` desktop contrast | Ledger indices and all routes retain AA contrast. | `routes` axe scans; Lighthouse accessibility 100. |
| `verification-2.md` free-tier mismatch | The limit and claim remain removed. | Home/README/live crawl. |
| `verification-2.md` cache and MIME | Hashed assets remain immutable and the manifest MIME remains correct. | Live response headers. |
| `verification-2.md` maskable dimensions | Raster and manifest remain 512 × 512. | Build asset inspection. |

## Verification result

- Clean clone: `/tmp/boardgame-session-notes-polish4.een7tV` at `d2d5159bf97a12ae16f639751263bdf19bb9205c`.
- `npm ci`: 0 vulnerabilities; `npm test`: 8/8; `npm run build`: passed with `dist/`; `npm run test:e2e`: 36/36.
- All 15 literal claim commands passed independently: 30/30 desktop/mobile claim executions.
- Initial app JavaScript: 36.37 kB raw, 11.79 kB gzip; CSS: 20.07 kB raw, 5.42 kB gzip.
- Local Lighthouse mobile: Performance 97, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.8 s, TBT 90 ms, CLS 0.085.
- Local `verify-url.sh`: HTTP 200, one h1, `lang=en`, `<main>`, complete alt/button checks, zero console errors.
- Post-deploy `live`, `verify-url.sh`, Lighthouse, response-header checks, and cold mobile/desktop screenshots passed against the production URL.
- No known finding remains.
