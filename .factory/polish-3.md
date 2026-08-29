# Polish 3 — cumulative finding closure map

**Product repair:** `7373235c4dfa3159be925bf8288796ab1057556d`

**Host configuration correction:** `770f8a6b76a57a59e49fc8780a75712c259c3c59`

**Production:** <https://boardgame-session-notes.sociobot.in>

## Review 1 findings

| Finding id | Change made | Evidence |
|---|---|---|
| F-1-01 | Kept the one-click `/demo` and `?demo=1` sample, exact banner, reset/start controls, and separate `demo:` storage; leaving discards demo data. | `@claim:demo-isolated`; `@claim:demo-reset`; `live-demo-390.png`; live `/?demo=1` |
| F-1-02 | Kept account-free use and proved a save without account fields or external requests. | `@claim:no-account` |
| F-1-03 | Kept the precise first-visit offline statement and reloads an edited sample under service-worker control. | `@claim:offline-reload`; live cold check |
| F-1-04 | Uses `session note` and browser-storage wording without the old record/account phrase. | `@claim:no-account`; `.factory/copy-audit.md` |
| F-1-05 | The false three-complete limit and the limit itself remain removed. | Home/README crawl in route test; live home screenshot |
| F-1-06 | Price, device, license, and unavailable checkout promises remain removed. | Rendered-link crawl in route/live checks |
| F-1-07 | Backup restoration now starts in an empty fresh browser and asserts every field plus saved rulings. | `@claim:backup-file` |
| F-1-08 | Matching identifiers update while other notes remain. | `@claim:backup-merge` |
| F-1-09 | Vague privacy language stays removed; the precise request/storage boundary is tested. | `@claim:privacy-network`; `@claim:browser-storage` |
| F-1-10 | Storage wording is consistent and backed by browser-data inspection. | `@claim:browser-storage` |
| F-1-11 | Generated-art provenance remains prompt/source/derivative hash-backed. | `@claim:art-provenance` |
| F-1-12 | README lead remains short and maps to tested storage/template behavior. | `README.md`; copy audit; claim cross-check |
| F-1-13 | Rule lookup, score calculation, and campaign management are each observably absent. | `@claim:no-rule-lookup` |
| F-1-14 | General note storage and setup-photo storage are both proved in demo-only browser data. | `@claim:browser-storage`; `@claim:setup-photo` |
| F-1-15 | Text export and a styled, CSP-safe printable receipt are asserted by content, computed style, print call, and console. | `@claim:exports`; `src/export.test.ts` |
| F-1-16 | The full template and actual cross-note ruling reuse are exercised. | `@claim:session-template`; `@claim:rule-reuse` |
| F-1-17 | Edited notes reopen offline; pending edits survive every navigation, reload, and page close. | `@claim:offline-reload`; `@claim:navigation-save` |
| F-1-18 | Mobile overflow, focus, axe, reduced motion, privacy traffic, and every visible target are covered. | Cross-route accessibility/touch test in both projects; `@claim:privacy-network` |
| F-1-19 | First screen retains the visible job h1, audience sentence, sample action, result, and three facts. | `live-home-390.png`; route/a11y test |
| F-1-20 | Demo/legal/404 remain real routes; session editors now use `/session/<id>` with history, focus, announcements, titles, and reload restoration. | `gives session notes direct routes...`; `live-session-390.png` |
| F-1-21 | Build emits static public entries and host rewrites dynamic session routes while unknown URLs remain 404. | Clean `npm run build`; live `/session/<id>` and `/does-not-exist` |
| F-1-23 | The dead checkout remains absent. | Link crawl and live cold check |
| F-1-24 | Route metadata and response security remain; print no longer violates CSP. | `@claim:exports`; live headers; zero pre-404 console errors |
| F-1-25 | Hashed assets remain immutable and the manifest has its correct MIME type. | Live header checks |
| F-1-26 | The declared maskable icon remains a real 512 × 512 asset. | Manifest/asset test from prior repair; build asset inspection |
| F-1-27 | Shared navigation/footer/credit remain and the footer injects the deployed build id. | Live footer matched the deployed SHA; route and byte-identity checks |
| F-1-28 | `session note` remains the single saved-record term. | `.factory/copy-audit.md` |
| F-1-29 | Replaced the returned `decisions` wording with concrete `rulings and events` in home and editor copy. | Copy audit; live text absence check |
| F-1-30 | README and first-screen sentences remain within 22 words. | `.factory/copy-audit.md` |
| F-1-31 | Visitor copy avoids the previously flagged implementation jargon. | Copy audit and source phrase scan |

## Review 2 findings

| Finding id | Change made | Evidence |
|---|---|---|
| F-2-01 | `/demo`, `/demo/`, and `?demo=1` all resolve to the isolated sample with canonical `/demo`. | Route test; live checks for all forms |
| F-2-02 | Offline and print views both load same-origin styles without inline-style CSP errors. | Route test; `@claim:exports`; live print check |
| F-2-03 | Dormant license restoration and unlock behavior remain removed. | Source/copy/link scan |
| F-2-04 | Reset now mutates and verifies every seed field and cancels a last-millisecond pending write. | `@claim:demo-reset`; live reset check |
| F-2-05 | Privacy copy remains limited to listed browser-storage, backup, export, and network claims. | Claims manifest cross-check; privacy route |
| F-2-06 | Dormant paid terms remain removed. | Terms route crawl |
| F-2-07 | README keeps only verified run/build/deploy instructions. | Clean-clone install/test/build evidence |
| F-2-08 | Every clause in the negative-scope statement is tested. | `@claim:no-rule-lookup` |
| F-2-09 | Art proof remains non-circular and hash-backed. | `@claim:art-provenance` |
| F-2-10 | The product-specific three-step and privacy/limits sections remain in the standard information order. | `live-home-390.png` |
| F-2-11 | The privacy-details link is now a 44px target; the test checks every visible interactive element on every route. | Cross-route target test in desktop/mobile; live target audit |
| F-2-12 | Unknown URLs still return HTTP 404 with the designed view. | Route test; live `/does-not-exist`; `live-404-390.png` |
| F-2-13 | Database/archive/caching metaphors remain removed from visitor prose. | Copy audit and source phrase scan |
| F-2-14 | Postbuild injects the real release SHA. | Live footer and byte-identity check |

## Review 3 findings

| Finding id | Change made | Evidence |
|---|---|---|
| F-3-01 | Each edit gets a synchronous namespaced pending draft; every internal/full navigation flushes ordered IndexedDB writes before discarding editor state. Demo exits cannot resurrect cleared data. | `@claim:navigation-save` covers wordmark, Demo, Privacy, Terms, Back, reload, and close; live navigation sentinel |
| F-3-02 | Receipt HTML links `/print.css`; the blob receipt has no inline style and invokes print only after styles load. | `@claim:exports`; `uses the same-origin print stylesheet...`; live computed-style/console check |
| F-3-03 | Real notes use `/session/<id>` and demo extras use `/demo/session/<id>`; create/open/reload/back/forward restore content, title, canonical, announcement, and h1 focus. | Direct-route/history test; live session URL and `live-session-390.png` |
| F-3-04 | `Read privacy details` is an inline-flex 44px target; all visible links, buttons, fields, and file actions are measured. | Cross-route touch test in both projects; live target audit |
| F-3-05 | Reset mutates/asserts title, date, location, every player/score, setup, ruling, both events, outcome, completion, real sentinel, and an immediate pending write. | `@claim:demo-reset`; live full-seed check |
| F-3-06 | Backup is restored into an empty second context and every session field, completion state, and reusable ruling are asserted. | `@claim:backup-file`; live fresh-context restore |
| F-3-07 | Added a separate photo claim using a bundled image; it checks demo-only data, reload, text-receipt exclusion, and printable image inclusion. | `@claim:setup-photo`; live photo/print check |
| F-3-08 | Added a ruling in one demo note, reused it in a later note, reloaded, and verified both notes stay in demo storage. | `@claim:rule-reuse`; live second-note check |
| F-3-09 | Replaced every visitor-facing `decisions` occurrence with `rulings` or `rulings and events`. | `.factory/copy-audit.md`; live body scan |
| F-3-10 | Sitemap, links, and canonical tags now use no-slash `/demo`, `/privacy`, and `/terms`; compatibility URLs still render. | Sitemap/canonical loop in browser and live checks |

## Earlier verification findings

| Finding | Change retained | Evidence |
|---|---|---|
| `verification.md` malformed import | Whole-document validation remains atomic before writes. | `npm test`: malformed nested backup test |
| `verification.md` desktop contrast | Ledger indices retain AA contrast. | Desktop axe route/editor scan |
| `verification-2.md` three-complete mismatch | The limit and claim remain removed. | Home/README live crawl |
| `verification-2.md` cache/MIME | Immutable hashed asset and manifest MIME response policy remains live. | Production response headers |
| `verification-2.md` maskable size | Asset and manifest remain 512 × 512. | Build asset inspection |

## Exact verification

- Clean clone: `/tmp/boardgame-session-notes-polish3.QyAZ8g` at `7373235c4dfa3159be925bf8288796ab1057556d`.
- `npm ci` — 0 vulnerabilities; `npm test` — 8 passed; `npm run build` — passed with `dist/`; `npm run test:e2e` — 34 passed.
- Every literal `.factory/claims.json` command ran separately: 15/15 commands passed, 30/30 desktop/mobile claim executions.
- Playwright axe scans found no serious/critical findings across home, demo, legal, editor, offline, and 404 views in both projects.
- `/opt/fleet/lib/verify-url.sh` passed production: 200, one h1, `lang=en`, `<main>`, alt/button checks, zero console errors.
- Production cold audit: `node scripts/live-check.mjs https://boardgame-session-notes.sociobot.in` passed; live JavaScript matched `dist/` byte-for-byte.
- Lighthouse mobile production: Performance 98, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.3 s, TBT 50 ms, CLS 0.085.
- Evidence: `live-home-390.png`, `live-demo-390.png`, `live-session-390.png`, `live-404-390.png`, `verify-live/`, and `lighthouse-live.json` in `.factory/evidence/polish-3/`.
