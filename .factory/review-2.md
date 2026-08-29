# Adversarial first-read review 2 — FAIL

**Reviewed:** 2026-08-29 UTC
**Production:** <https://boardgame-session-notes.sociobot.in>
**Candidate:** `2f673bf7bd31c249c5046e00e2658f170b7269ec`
**Verdict:** **FAIL** — 14 findings remain. This is not a release approval.

## Method and evidence

- Started from the clean `main` worktree at the work-order base, ran `npm ci`, and made no product-code changes.
- Opened production in fresh Chromium contexts at 390 × 844 and 1440 × 900 before scrolling. The home page returned 200, made only same-origin requests, had no console errors, and matched the local build byte-for-byte for the HTML, JavaScript, CSS, manifest, service worker, robots file, and sitemap.
- Exercised a real-data sentinel, `/demo`, Reset demo, Start for real, offline reload, browser history/focus, every visible link, `/demo/`, `/404`, an unknown URL, `/privacy/`, `/terms/`, and `/offline.html`.
- Ran `npm test` (7/7), `npm run build` (passed), `npm run test:e2e` (24/24), every command in `.factory/claims.json` separately (11 commands; 2 browser projects each; 22/22 claim executions passed), live axe checks at mobile and desktop, and `/opt/fleet/lib/verify-url.sh` (passed for home).
- Initial built JavaScript is 35,714 bytes (11,758 gzip); CSS is 19,202 bytes (5,254 gzip). The mobile hero is 29,486 bytes. The initial static payload remains below the product budget.

## Cold first read

At 390px, before scrolling:

- **What it does:** records one boardgame session, including setup and decisions, in this browser.
- **For whom:** game groups that need to settle a rule or remember setup after play.
- **What to click first:** **Try it with sample data**, which says it will show a filled session note.

The same answers are clear on desktop. The exact first-screen text is **“Record one boardgame session”**, **“For game groups who need to settle a rule or remember the setup after the table is cleared.”**, **“Try it with sample data”**, and **“See a filled session note.”** This part passes.

## Copy audit

Word counts treat a number, hyphenated item, URL, and code token as one word. Standalone separators such as `·`, `—`, and `→` are not words. Repeated navigation labels are listed once.

### Landing page

| Copy unit | Words | Result |
|---|---:|---|
| `Skip to session notes` | 4 | Clear link. |
| `Boardgame Session Notes` | 3 | Clear wordmark. |
| `Demo` | 1 | Clear navigation label. |
| `Privacy` | 1 | Clear navigation label. |
| `Online · saved in this browser` | 5 | Covered by browser-storage behavior. |
| `Private session notes` | 3 | Names the product category. |
| `Record one boardgame session` | 4 | Clear job headline. |
| `For game groups who need to settle a rule or remember the setup after the table is cleared.` | 18 | Clear audience and outcome. |
| `Try it with sample data` | 5 | Result-naming action. |
| `See a filled session note.` | 5 | Clear action outcome. |
| `No account is required.` | 4 | Listed claim; test passes. |
| `Works offline after the first visit.` | 6 | Listed claim; test passes. |
| `Session notes stay in this browser on this device.` | 9 | Listed claim; test passes in demo. |
| `Start a blank session note` | 5 | Result-naming action. |
| `Setup → rulings and events → final result` | 6 | Informative illustration caption. |
| `In this browser` | 3 | Clear section context. |
| `Session archive` | 2 | Clear collection heading. |
| `0 session notes in this browser on this device` | 9 | Clear dynamic status. |
| `Search session notes` | 3 | Clear field label. |
| `No session notes yet` | 4 | Clear empty-state heading. |
| `Start with a game title.` | 5 | Clear next step. |
| `Add players, setup notes, rulings, and scores as you play.` | 10 | Clear capability summary. |
| `Create a session note` | 4 | Result-naming action. |
| `Free edition` | 2 | Clear label, but the section is incomplete; F-2-03/F-2-10. |
| `Keep three session notes` | 4 | Listed claim; test passes. |
| `The free edition keeps three session notes.` | 7 | Listed claim; test passes. |
| `Existing licenses can be restored below.` | 6 | Unlisted claim; F-2-03. |
| `Restore a license` | 3 | Result-naming action, but its success path has no claim test; F-2-03. |
| `Record one boardgame session in this browser.` | 7 | Clear footer summary. |
| `Terms` | 1 | Clear navigation label. |
| `Data tools` | 2 | Noun-only button; rewrite as `Open backup tools`; F-2-13. |
| `Built by Param Factory` | 4 | Clear credit. |
| `build 6afba62-polish-1` | 2 | Stale build identifier; F-2-14. |
| `Original generated illustration; provenance in the design notes.` | 8 | Listed claim, but its test is circular; F-2-09. |
| `Backup tools` | 2 | Clear dialog label. |
| `Back up or restore session notes` | 6 | Clear dialog heading. |
| `Download a backup file with every session note and saved rule, or restore one to this browser.` | 17 | Listed claim; test passes. |
| `A backup updates session notes with the same identifier and keeps other notes.` | 13 | Listed claim; test passes. |
| `Download backup file` | 3 | Result-naming action. |
| `Restore backup file` | 3 | Result-naming action. |
| `Close backup tools` | 3 | Clear accessible name. |
| `No matching session notes` | 4 | Clear conditional empty-state heading. |
| `Try another game title, player, or location.` | 7 | Clear conditional recovery step. |
| `License active` | 2 | Clear conditional status. |
| `Unlimited session notes are active` | 5 | Unlisted conditional claim; F-2-03. |
| `This device can create unlimited session notes.` | 7 | Unlisted conditional claim; F-2-03. |
| `Exports remain available to everyone.` | 5 | Unlisted conditional claim; F-2-03. |
| `Move devices` | 2 | Clear license-dialog context. |
| `License token` | 2 | Implementation term; use `License code`; F-2-13. |
| `Paste the complete token from your purchase email.` | 8 | Use `Paste the complete license code from your purchase email.`; F-2-13. |
| `Verify license` | 2 | Result-naming action. |
| `Could not reach the license service.` | 6 | Clear error. |
| `Check your connection and try again.` | 6 | Clear recovery step. |
| `That license is not active for this product.` | 8 | Clear error. |
| `Check the full token and try again.` | 7 | Use `Check the full license code and try again.`; F-2-13. |

No landing sentence exceeds 22 words and no banned marketing adjective appears.

### README

| Copy unit | Words | Result / rewrite when flagged |
|---|---:|---|
| `Boardgame Session Notes` | 3 | Clear title. |
| `Record one boardgame session in this browser.` | 7 | Clear job statement; listed behavior. |
| `For game groups who need to reopen a play after the board is cleared.` | 14 | `play` competes with `session`; use `For game groups who need to check what happened after the board is cleared.`; F-2-13. |
| `What it records` | 3 | Clear heading. |
| `Players, setup notes, house rules, events, scores, and an outcome` | 10 | Listed capability. |
| `A text receipt, a printable receipt, and a backup file` | 10 | Listed exports. |
| `Session notes that reopen offline after the first visit` | 9 | Listed offline behavior. |
| `It does not look up rules, automate scoring, or manage campaigns.` | 11 | Listed, but the tagged test does not cover all three clauses; F-2-08. |
| `Try the sample` | 3 | Clear heading. |
| `Open the demo or add ?demo=1 to the home URL.` | 10 | Clear instruction. |
| `It opens a filled sample session note in the demo browser database.` | 12 | `browser database` is implementation jargon; use `It opens a filled sample without changing your saved session notes.`; F-2-13. |
| `Reset demo replaces that sample.` | 5 | Unlisted and untested reset claim; F-2-04. |
| `Start for real deletes the demo database before opening the real archive.` | 12 | Tested behavior, but `database` and `real archive` are inconsistent terms; use `Start for real deletes the sample before opening your saved session notes.`; F-2-13. |
| `Run and verify` | 3 | Clear heading. |
| `Requires Node.js 22 or later.` | 5 | Unlisted operational claim; F-2-07. |
| `Run: npm ci, npm run dev, npm test, npm run build, and npm run test:e2e.` | 15 | Clear commands. |
| `The production build is dist/.` | 5 | Clear build output. |
| `Browser tests use the production preview so they also verify the service worker.` | 13 | Unlisted operational claim; F-2-07. |
| `Deploy` | 1 | Clear heading. |
| `Deploy dist/ as a static site.` | 6 | Clear instruction. |
| `staticwebapp.config.json supplies the route fallback, 404 page, security headers, manifest MIME type, and immutable hashed-asset policy.` | 16 | Unlisted operational claim; F-2-07. |
| `See Privacy, Terms, the product brief, and the handoff.` | 9 | Clear references; all targets exist. |
| `License` | 1 | Clear heading. |
| `MIT.` | 1 | Clear license statement. |
| `See LICENSE.` | 2 | Clear reference; target exists. |

No README sentence exceeds 22 words and no banned marketing adjective appears.

### Terminology to keep

| Concept | One term |
|---|---|
| A game occurrence | boardgame session |
| Its saved record | session note |
| The user's stored collection | saved session notes |
| The isolated try-out | demo |
| Transfer document | backup file |

## Demo and sandbox

The main demo path passes. One click on **Try it with sample data** opens the completed **Lantern Harbor** session with Mina, Jo, and Sam; setup notes; a reusable rule; two timeline events; final scores; and an outcome. The persistent banner, Reset demo, and Start for real are present.

In one browser context, a real session named `Real sentinel review 2` was saved first. Entering demo created `demo:boardgame-session-notes` beside the untouched `boardgame-session-notes` database. Editing and resetting the demo restored the original setup text. Start for real deleted only the demo database and the real sentinel remained. A live offline reload retained an edited demo field. The whole observed demo/offline flow requested only `https://boardgame-session-notes.sociobot.in`.

The alternate published URL `/demo/` does not pass; see F-2-01.

## Claims audit

Every literal command in `.factory/claims.json` passed from the clean worktree:

| Claim id | Result | Observable evidence |
|---|---|---|
| `demo-isolated` | PASS, 2/2 | `/demo` shows Lantern Harbor in the demo database; Start for real removes it. |
| `no-account` | PASS, 2/2 | Demo edit saves with same-origin traffic and no account flow. |
| `offline-reload` | PASS, 2/2 | Service-worker-controlled demo reloads offline. |
| `browser-storage` | PASS, 2/2 | Demo database is present and requests are same-origin. |
| `three-session-notes` | PASS, 2/2 | A fourth real draft is blocked after three notes. |
| `backup-file` | PASS, 2/2 | Backup downloads and restores sample fields. |
| `backup-merge` | PASS, 2/2 | Matching identifier updates and new identifier remains. |
| `session-template` | PASS, 2/2 | Players, setup, rule, event, score, and outcome are present. |
| `exports` | PASS, 2/2 | Text receipt downloads and print receipt opens. |
| `no-rule-lookup` | PASS mechanically, incomplete coverage | The test omits two clauses; F-2-08. |
| `art-provenance` | PASS mechanically, incomplete coverage | The test repeats the design note instead of proving the asset claim; F-2-09. |

No listed command failed. Live and README copy still contain unlisted claims (F-2-03 through F-2-07), so the product does not meet the no-untested-claim rule.

## History check

All earlier `.factory/review-*.md`, `.factory/polish-*.md`, and the handoff were read. The two verification reports were also rechecked because the earlier review incorporated their findings.

| Earlier id | Live and code confirmation | Status |
|---|---|---|
| F-1-01 | Home links to a filled, isolated `/demo` with banner/reset/start-real controls. | Fixed for the primary URL. |
| F-1-02 | `no-account` manifest entry and tagged test pass. | Fixed. |
| F-1-03 | `offline-reload` passes locally and on live demo. | Fixed. |
| F-1-04 | Home uses session-note/browser wording; no-account behavior passes. | Fixed. |
| F-1-05 | Copy says three session notes and the three-draft limit test passes. | Fixed. |
| F-1-06 | The price/every-device wording is removed, but the licensed branch still makes untested unlimited/export promises and there is no purchasable paid state. | **Half-fixed — reopened by F-2-03.** |
| F-1-07 | Backup export/restore claim and test pass. | Fixed. |
| F-1-08 | Backup merge claim and test pass. | Fixed. |
| F-1-09 | Vague `Private by default` is gone; browser-storage request test passes. | Fixed. |
| F-1-10 | Storage wording is standardized and tested. | Fixed. |
| F-1-11 | The claim is listed, but the tagged test only asserts that the design document repeats it and that an image exists. | **Half-fixed — reopened by F-2-09.** |
| F-1-12 | README lead is short and maps to storage/template claims. | Fixed. |
| F-1-13 | The negative claim is listed, but its test does not check the rule-lookup or automated-scoring clauses. | **Half-fixed — reopened by F-2-08.** |
| F-1-14 | Demo storage namespace is asserted. | Fixed. |
| F-1-15 | Text, print, and backup outcomes are asserted. | Fixed. |
| F-1-16 | Filled demo and template fields are asserted. | Fixed. |
| F-1-17 | Offline saved-data reload passes. | Fixed. |
| F-1-18 | 390px layout, focus styling, reduced-motion CSS, axe checks, and same-origin demo traffic were independently confirmed. | Fixed; touch-size failure is new F-2-11. |
| F-1-19 | Visible h1, audience sentence, demo action, and result text pass at both widths. | Fixed. |
| F-1-20 | `/demo` works, 404 is designed, and click/back move focus, but published `/demo/` renders the 404. | **Half-fixed — reopened by F-2-01.** |
| F-1-21 | Build emits `dist/demo/index.html`, but its `/demo/` URL is not recognized by the router. | **Half-fixed — reopened by F-2-01.** |
| F-1-23 | The dead checkout link is absent; all rendered anchors return 200. | Fixed. |
| F-1-24 | SPA metadata and response CSP exist, but the global CSP blocks `/offline.html`'s inline CSS and logs an error. | **Half-fixed — reopened by F-2-02.** |
| F-1-25 | Live hashed assets are immutable and the manifest MIME type is correct. | Fixed. |
| F-1-26 | Maskable icon is now a true 512 × 512 PNG matching the manifest. | Fixed. |
| F-1-27 | Header/footer links, credit, and a build label exist, but the build label is stale. | **Half-fixed — reopened by F-2-14.** |
| F-1-28 | Core landing copy uses `session note`; README reintroduces `play`, `database`, and `real archive`. | **Half-fixed — reopened by F-2-13.** |
| F-1-29 | Original slogans are gone; the offline and 404 headings introduce new table/archive metaphors. | **Regressed — reopened by F-2-13.** |
| F-1-30 | README has no sentence over 22 words. | Fixed. |
| F-1-31 | Original jargon is gone; README/offline copy introduces `browser database`, `app shell`, and `caching`. | **Regressed — reopened by F-2-13.** |
| `verification.md` malformed-import blocker | Strict nested validation remains in code and unit/browser tests pass. | Fixed. |
| `verification.md` desktop contrast blocker | Live desktop axe has no serious/critical result. | Fixed. |
| `verification-2.md` three-complete wording | Copy now says three session notes. | Fixed. |
| `verification-2.md` cache/MIME | Live headers are correct. | Fixed. |
| `verification-2.md` maskable dimensions | Asset is 512 × 512. | Fixed. |

Per the review contract, each half-fixed or regressed earlier finding is blocking again.

## Structure, accessibility, and visual identity

- Home, `/demo`, privacy, terms, 404, and unknown-route views have route titles under 60 characters, one h1, descriptions, canonical/OG/Twitter metadata, favicon, header, footer, and no serious/critical axe findings.
- Header links, browser back, and forward navigation move focus to the new h1 and update the polite route announcement.
- Every rendered anchor crawled from the SPA returned 200. The sitemap route `/demo/` is semantically broken (F-2-01), and unknown pages are soft 404s (F-2-12).
- Home has no horizontal overflow at 390px or desktop. Reduced-motion CSS disables animation/scroll behavior. The worker URL verifier passed home with one h1, `lang=en`, `<main>`, alt text, labeled buttons, and no console errors.
- The teal felt, clipped cream paper, score path, ledger typography, and original table illustration are product-specific. This does not look like a generic SaaS template.
- The landing information order is incomplete (F-2-10), and several mobile targets are below 44px (F-2-11).

## Findings, ordered by severity

### Blocking

1. **F-2-01 — Published demo deep link renders the 404 (reopens F-1-20 and F-1-21).** Exact location: `public/sitemap.xml` publishes `https://boardgame-session-notes.sociobot.in/demo/`, `scripts/postbuild.mjs` emits `dist/demo/index.html`, and the service-worker core caches `/demo/`; live `/demo/` shows **“This page is not in the session archive.”** `src/main.ts` recognizes only `location.pathname === '/demo'`. A catalog, crawler, or static-host trailing-slash normalization can therefore send a visitor to a false 404 instead of the required demo. Normalize paths or accept both `/demo` and `/demo/`, use one canonical form everywhere, and add direct-load/offline tests for both forms.

2. **F-2-02 — The offline fallback logs a CSP error and loses its design (reopens F-1-24).** Exact location: live `/offline.html` contains an inline `<style>`, while the response sends `style-src 'self'`. Chromium logs **“Applying inline style violates the following Content Security Policy directive 'style-src 'self''”**; computed body styles fall back to transparent background and black text. Move the fallback CSS to a same-origin file or add the exact style hash to CSP, then include `/offline.html` in the no-console and visual checks.

3. **F-2-08 — The negative-scope claim test does not test the whole claim (reopens F-1-13).** Exact claim: **“The app does not look up rules, automate scoring, or manage campaigns.”** `@claim:no-rule-lookup` checks same-origin requests, the sentence **“The app does not look up game titles,”** and absence of the word `campaign`; it never checks for rule lookup and never checks that score fields are manual rather than calculated. Split the claim or add observable assertions for no rule-lookup action/service, no score-calculation action or automatic mutation, and no campaign controls/routes.

4. **F-2-09 — The art-provenance claim test is circular (reopens F-1-11).** Exact claim: **“Original generated illustration · no game art or rule text.”** `@claim:art-provenance` proves only that the footer, image, and `.factory/design.md` exist and that the design document says it was generated. It does not assert the recorded source JSON, source image/derivative relationship, or absence of text/brand material. Narrow the public claim to what can be proved, then test the generation metadata and derivative hashes; if retaining the no-text/no-game-art clause, add a documented visual/OCR review rather than treating repeated prose as proof.

5. **F-2-13 — Plain wording regressed outside the hero (reopens F-1-28, F-1-29, and F-1-31).** Exact locations: README **“demo browser database”**, **“real archive”**, and **“reopen a play”**; footer button **“Data tools”**; 404 h1 **“This page is not in the session archive”**; offline h1 **“The table is still here.”**; offline copy **“app shell”** and **“caching.”** These reintroduce inconsistent nouns, implementation jargon, a noun-only button, and metaphor headings. Use the rewrites in the copy tables; rename the button **“Open backup tools”**, the 404 h1 **“Page not found”**, and the offline h1 **“Reconnect once to finish offline setup.”**

6. **F-2-14 — The footer's build identifier is stale (reopens F-1-27).** Exact live text: **“build 6afba62-polish-1”**. Production bytes match candidate `2f673bf`, and the last product-code change is `977d832`; `6afba62` is the earlier review commit. The value cannot identify the deployed build. Inject the release commit/build id during the production build and assert it against the deployed candidate.

7. **F-2-03 — License restoration and unlock behavior are unlisted claims with no success-path proof (reopens F-1-06).** Exact landing copy includes **“Existing licenses can be restored below.”**, **“Restore a license”**, **“Unlimited session notes are active”**, **“This device can create unlimited session notes”**, and **“Exports remain available to everyone.”** No `.factory/claims.json` entry exercises a valid license fixture. An invalid token correctly failed live, but that does not prove restoration, unlimited creation, persistence, or export access after license changes. Add `license-restore` with a fixture-backed valid response and assertions for unlock, refresh, limits, invalidation, exports, and no session-content transmission; otherwise remove these claims and controls.

### High

8. **F-2-04 — Reset demo is documented but has no matching claim test.** Exact README sentence: **“Reset demo replaces that sample.”** The `demo-isolated` test never clicks Reset; `backup-file` clicks it but does not assert the reset state before importing. Add a `demo-reset` entry/test that edits the sample, resets it, asserts every seeded field, and confirms a pre-existing real-data sentinel is unchanged.

9. **F-2-05 — The privacy route contains unlisted reliance claims.** Exact copy: **“The app does not send their content to us.”**, **“Clearing site data removes them”**, **“The app has no analytics or advertising requests.”**, **“It checks for updates.”**, **“Restoring a license contacts Sociobot only after you choose to verify a license.”**, **“Session note content is not included.”**, and **“We do not keep a server copy to restore.”** Existing demo request tests do not cover clearing storage, update traffic, the real license flow, or server-retention wording. Add one claim entry and observable test per promise, or narrow/remove statements that a browser sandbox cannot prove.

10. **F-2-06 — The terms route contains unlisted paid-behavior claims.** Exact copy: **“Sociobot/Dodo is the merchant of record.”**, **“A refunded or revoked license stops unlocking paid features.”**, and **“Existing session notes and exports remain available.”** There is no purchase/refund/revocation fixture in the claim manifest. Add fixture-backed billing/license tests and a live integration check, or remove this dormant paid section until purchases are available.

11. **F-2-07 — README makes operational claims outside the claim manifest.** Exact copy: **“Requires Node.js 22 or later.”**, **“Browser tests use the production preview so they also verify the service worker.”**, and **“staticwebapp.config.json supplies the route fallback, 404 page, security headers, manifest MIME type, and immutable hashed-asset policy.”** These happened to pass this review except for the route/CSP defects above, but there is no manifest mapping and the latter two sentences overstate the suite. Add build/host claim entries and tests for the minimum Node version, preview service-worker control, trailing-slash routes, fallback CSP, response headers, MIME, and cache policy; rewrite the README to match actual coverage.

12. **F-2-10 — The landing skeleton omits required explanation/privacy and leaves the paid state incomplete.** Exact sequence on live home: hero → session archive → **“Free edition / Keep three session notes”** → footer. There is no **How it works** three-step section and no plain **Privacy and limits** section. The free-edition panel supplies neither a purchase action nor a price or unavailable-state explanation, so a first-time visitor sees a limit and an existing-license path without knowing how to obtain one. Add three concrete steps and a privacy/non-goals section. For the paid state, either provide a tested Sociobot checkout with exact price and unlocks, clearly say purchases are currently unavailable, or remove the limit/license UI until purchase works.

13. **F-2-11 — Mobile touch targets are below the required 44px.** At 390px, the header wordmark is 128 × 32; header/footer Demo is 39 × 20; Privacy is 47 × 20; Terms is 38 × 20; Reset demo is 115 × 36; Start for real is 125 × 36; and both receipt controls are 179 × 40. Axe does not detect this requirement. Give every mobile interactive element at least a 44 × 44 hit area and add a bounding-box test across home, demo, privacy, terms, and 404.

14. **F-2-12 — Unknown URLs are soft 404s.** Live `/does-not-exist` returns HTTP 200 while rendering **“This page is not in the session archive.”** A crawler or cache cannot distinguish the missing page from valid content. Keep the designed view but configure valid SPA routes explicitly and return HTTP 404 for unknown routes; add a response-status test as well as the current DOM check.

## Missed leverage

No AI feature is warranted. The brief is local-first, and drafting or summarization would add network/key/cost complexity without solving the core record-keeping job. Backup import/export, offline reopen, setup photos, reusable rules, and text/print receipts cover the obvious leverage. Sync would conflict with the stated local-by-default scope unless introduced as an explicit, separately consented feature.

## What would make this perfect

Make every published demo URL enter the same isolated sample; fix the offline page's CSP; close the claim manifest gaps with non-circular observable tests; complete the landing's how-it-works, privacy/limits, and honest paid-state sections; return a real 404 status; raise every mobile hit area to 44px; remove the remaining metaphor/jargon; and inject the actual release id. Then rerun the full review from fresh browser contexts with zero findings and no untested sentence.
