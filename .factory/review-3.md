# Adversarial first-read review 3 — FAIL

**Reviewed:** 2026-08-29 UTC  
**Production:** <https://boardgame-session-notes.sociobot.in>  
**Candidate/live build:** `4be985c8822b28cea9de281c2a0bce53b6befe96`  
**Verdict:** **FAIL** — 10 findings remain, including nine blocking findings. This is not a release approval.

## Method and evidence

- Opened production cold in new Chromium contexts at 390 × 844 and 1440 × 900 before scrolling. Home returned 200, used one h1, made only same-origin requests, and logged no console errors.
- Read `.factory/brief.json`, `.factory/design.md`, `.factory/claims.json`, every earlier review/polish/verification report, the previous handoff, the README, and the implementation.
- Exercised the live demo with a saved real-data sentinel, edits, Reset demo, Start for real, offline reload, request logging, IndexedDB inspection, text export, print/PDF, browser history, focus, route metadata, unknown routes, and every rendered link.
- Created a clean clone at `/tmp/boardgame-review3.sVKqXJ/clone`. `npm ci`, `npm test` (7/7), `npm run build`, and `npm run test:e2e` (26/26 across desktop and mobile) passed. The build emitted 32.72 kB JavaScript (10.83 kB gzip) and 19.94 kB CSS (5.39 kB gzip).
- Ran all 12 literal claim commands separately from that clean clone. All 24 browser executions passed mechanically. Coverage gaps are recorded below; a green test that does not assert its stated sandbox is not proof of the whole claim.
- The built and live HTML, JavaScript, and CSS matched by SHA-256. `/opt/fleet/lib/verify-url.sh` passed home: 200, 620 ms load, one h1, `lang=en`, `<main>`, no missing alt text, and no unlabeled buttons. The repository Playwright suite ran axe WCAG 2 A/AA checks in both browser projects with no serious/critical result.

## Cold first read

At both widths, before scrolling, I can answer all three questions:

- **What does this do?** It records one boardgame session, including setup, rulings, score changes, and the result.
- **For whom?** Game groups that need to settle a rule or remember setup after the table is cleared.
- **What should I click first?** **Try it with sample data**, with the adjacent result **“See a filled session note.”**

The exact first-screen text is **“Record one boardgame session”**, **“For game groups who need to settle a rule or remember the setup after the table is cleared.”**, and **“Try it with sample data.”** This requirement passes on mobile and desktop.

## Copy audit

Word counts treat a number, URL, hyphenated item, and code token as one word. Standalone separators such as `·`, `—`, and `→` are not words. Repeated navigation/footer labels are listed once. Hidden backup-dialog copy reachable from the landing page is included.

### Landing page

| Copy unit | Words | Result |
|---|---:|---|
| `Skip to session notes` | 4 | Clear. |
| `Boardgame Session Notes` | 3 | Clear wordmark. |
| `Demo` | 1 | Clear navigation label. |
| `Privacy` | 1 | Clear navigation label. |
| `Online · saved in this browser` | 5 | Listed storage claim. |
| `Private session notes` | 3 | Names the product category. |
| `Record one boardgame session` | 4 | Clear job headline. |
| `For game groups who need to settle a rule or remember the setup after the table is cleared.` | 18 | Clear audience and outcome. |
| `Try it with sample data` | 5 | Result-naming action. |
| `See a filled session note.` | 5 | Clear action result. |
| `No account is required.` | 4 | Listed claim. |
| `Works offline after the first visit.` | 6 | Listed claim. |
| `Session notes stay in this browser on this device.` | 9 | Listed claim. |
| `Start a blank session note` | 5 | Result-naming action. |
| `Setup → rulings and events → final result` | 6 | Informative caption. |
| `In this browser` | 3 | Clear section context. |
| `Session archive` | 2 | Clear section heading. |
| `0 session notes in this browser on this device` | 9 | Clear dynamic status. |
| `Search session notes` | 3 | Clear field label. |
| `No session notes yet` | 4 | Clear empty-state heading. |
| `Start with a game title.` | 5 | Clear next step. |
| `Add players, setup notes, rulings, and scores as you play.` | 10 | Clear capability summary. |
| `Create a session note` | 4 | Result-naming action. |
| `How it works` | 3 | Clear section label. |
| `Keep one session note as you play` | 7 | Clear section heading. |
| `Start with the game title.` | 5 | Clear step. |
| `Add players and the starting state.` | 6 | Clear step result. |
| `Note rulings and score changes.` | 5 | Clear step. |
| `Keep decisions with the session note.` | 6 | **F-3-09:** `decisions` is vague and repeats an earlier rejected term. Use `Keep rulings and events with the session note.` |
| `Finish and reopen it later.` | 6 | Clear step. |
| `Export a text receipt or backup file when needed.` | 9 | Listed export capability. |
| `Privacy and limits` | 3 | Clear section label. |
| `Your notes stay in this browser` | 7 | Listed storage claim. |
| `Use a backup file before clearing browser data or moving devices.` | 11 | Concrete recovery instruction. |
| `The app does not look up rules, calculate scores, or manage campaigns.` | 12 | Listed boundary claim. |
| `Read privacy details` | 3 | Result-naming link. |
| `Record one boardgame session in this browser.` | 7 | Clear footer summary. |
| `Terms` | 1 | Clear navigation label. |
| `Open backup tools` | 3 | Result-naming button. |
| `Built by Param Factory` | 4 | Clear credit. |
| `build 4be985c8822b` | 2 | Correct live build identifier. |
| `Generated illustration; source details in the design notes.` | 8 | Listed provenance claim. |
| `Backup tools` | 2 | Clear dialog label. |
| `Back up or restore session notes` | 6 | Clear dialog heading. |
| `Download a backup file with every session note and saved rule, or restore one to this browser.` | 17 | Listed backup claim; its test gap is F-3-06. |
| `A backup updates session notes with the same identifier and keeps other notes.` | 13 | Listed merge claim. |
| `Download backup file` | 3 | Result-naming action. |
| `Restore backup file` | 3 | Result-naming action. |
| `Close backup tools` | 3 | Clear accessible name. |

No landing copy exceeds 22 words or uses a banned marketing adjective. F-3-09 is the only landing copy flag.

### README

| Copy unit | Words | Result |
|---|---:|---|
| `Boardgame Session Notes` | 3 | Clear title. |
| `Record one boardgame session in this browser.` | 7 | Clear job statement. |
| `For game groups who need to check what happened after the board is cleared.` | 14 | Clear audience and situation. |
| `What it records` | 3 | Clear heading. |
| `Players, setup notes, house rules, events, scores, and an outcome` | 10 | Listed capability. |
| `A text receipt, a printable receipt, and a backup file` | 10 | Listed capability; print defect is F-3-02. |
| `Session notes that reopen offline after the first visit` | 9 | Listed claim. |
| `It does not look up rules, calculate scores, or manage campaigns.` | 12 | Listed boundary claim. |
| `Try the sample` | 3 | Clear heading. |
| `Open the demo or add ?demo=1 to the home URL.` | 10 | Clear instruction. |
| `It opens a filled sample without changing your saved session notes.` | 11 | Listed demo claim. |
| `Reset demo restores the filled sample without changing saved session notes.` | 11 | Listed claim; coverage gap is F-3-05. |
| `Start for real deletes the sample before opening your saved session notes.` | 12 | Listed demo claim. |
| `Run and verify` | 3 | Clear heading. |
| `Run npm ci, npm run dev, npm test, npm run build, and npm run test:e2e.` | 15 | Clear commands. |
| `The production build is dist/.` | 5 | Clear build output; independently verified. |
| `Deploy` | 1 | Clear heading. |
| `Deploy dist/ as a static site using the included staticwebapp.config.json.` | 10 | Clear deployment instruction. |
| `See Privacy, Terms, the product brief, and the handoff.` | 9 | Clear references; targets exist. |
| `License` | 1 | Clear heading. |
| `MIT.` | 1 | Clear license statement. |
| `See LICENSE.` | 2 | Clear reference. |

No README sentence exceeds 22 words, uses a banned marketing adjective, or introduces a competing product noun.

## Demo and sandbox

One click on **Try it with sample data** opens the completed **Lantern Harbor** session with three named players and scores, setup notes, a house rule, two events, location/date, and an outcome. The persistent banner says **“Demo — sample data, nothing is saved”** and exposes **Reset demo** and **Start for real**.

Independent live checks used a real note named `Real review 3 sentinel`. Entering the demo created `demo:boardgame-session-notes` beside `boardgame-session-notes`. Editing the demo did not change the real note. Reset restored the title, players, scores, setup, rule, events, outcome, and completion state. Start for real deleted only the demo database; the sentinel remained. An edited sample also reloaded offline. The complete observed flow used only the product origin and no request URL/body contained the entered marker.

The demo behavior passes. Its automated Reset proof is incomplete; see F-3-05.

## Claims audit

All commands below were run exactly as listed from the clean clone. “PASS mechanically” means the command exited zero; it does not waive an assertion gap.

| Claim id | Command result | Evidence / gap |
|---|---|---|
| `demo-isolated` | PASS, 2/2 | Filled sample opened in `demo:boardgame-session-notes`; Start for real removed it. |
| `demo-reset` | PASS mechanically, 2/2 | It checks one setup field and a real sentinel, not all seeded fields promised by the manifest; F-3-05. |
| `no-account` | PASS, 2/2 | Edit saved with same-origin traffic and no account flow. |
| `offline-reload` | PASS, 2/2 | Service-worker-controlled demo reloaded offline; independently repeated on production. |
| `browser-storage` | PASS, 2/2 | Demo database exists and observed traffic is same-origin. It does not cover the separate photo promise; F-3-07. |
| `backup-file` | PASS mechanically, 2/2 | The restore is performed over an already reset copy of the same sample and no restored field or saved-rule snippet is asserted; F-3-06. |
| `backup-merge` | PASS, 2/2 | Matching title updated and a new identifier remained after reload. |
| `session-template` | PASS, 2/2 | Core sample fields are present. It does not prove reuse in a later note; F-3-08. |
| `exports` | PASS mechanically, 2/2 | Text file contains the title and the popup title exists, but the printable receipt logs a CSP error and loses its stylesheet; F-3-02. |
| `no-rule-lookup` | PASS, 2/2 | Same-origin traffic, manual score retention, absent automation control, and 404 campaign route are asserted. |
| `privacy-network` | PASS, 2/2 | Entered marker is absent from same-origin request URLs/bodies. |
| `art-provenance` | PASS, 2/2 | Recorded model, prompt, source hash, and derivative hashes are asserted. |

Claim-like live sentences without complete claim coverage:

- **“A setup photo is stored in this browser and included when you print a receipt.”** There is no photo upload/storage/print claim entry or test; F-3-07.
- **“Rules added here can be reused in later session notes.”** No claim entry creates a second note and reuses a saved rule; F-3-08.

## Structure, accessibility, privacy, and routing

- Home, demo, privacy, terms, and the designed 404 have route titles under 60 characters, one eventual h1, descriptions, canonical/OG/Twitter metadata, SVG favicon, Apple touch icon, a 1200 × 630 social image, consistent header/footer, and product-specific ledger/table art. It does not look like a generic SaaS template.
- Unknown URLs return HTTP 404 with a designed **Page not found** view. `/demo`, `/demo/`, `?demo=1`, `/privacy/`, and `/terms/` deep-load. Every rendered non-hash link crawled to its expected response.
- Header legal navigation and browser back/forward focus the new h1. The session editor itself is not routed and existing-session clicks do not move focus; F-3-03.
- At 390 px, all measured controls except **Read privacy details** met 44 × 44 CSS pixels. That link measured 162 × 19; F-3-04.
- Live headers supply CSP, `frame-ancestors 'none'`, `X-Content-Type-Options`, Referrer Policy, Permissions Policy, correct manifest MIME, immutable hashed assets, and a non-cached worker. The print popup violates the same CSP; F-3-02.
- Home and the full live demo/offline exercise requested only `https://boardgame-session-notes.sociobot.in`. No runtime AI, analytics, advertising, third-party font/script, Azure key, or provider key appears in source.
- The sitemap lists all public content routes, but its `/privacy/` and `/terms/` URLs disagree with the no-slash canonical URLs; F-3-10.

## History check

Every earlier finding was checked against both production and current source. Per the review contract, any half-fix or regression is blocking again.

| Earlier id | Current live/code result | Status |
|---|---|---|
| F-1-01 | One-click filled demo, banner, reset/start controls, and separate database work. | Fixed. |
| F-1-02 | `no-account` is listed and passes. | Fixed. |
| F-1-03 | Offline sample reload passes locally and live. | Fixed. |
| F-1-04 | Account/storage wording is consistent and tested. | Fixed. |
| F-1-05 | False three-complete limit and the limit itself are removed. | Fixed. |
| F-1-06 | Price/license claims and dead checkout are removed. | Fixed. |
| F-1-07 | Backup download is shown, but restore/saved-rule assertions do not match the manifest sandbox. | **Half-fixed — F-3-06.** |
| F-1-08 | Matching/new identifier merge survives reload. | Fixed. |
| F-1-09 | Vague privacy slogan is gone; precise storage/network claims exist. | Fixed. |
| F-1-10 | Browser/device wording and storage namespace are consistent. | Fixed. |
| F-1-11 | Prompt/source/derivative hashes now provide non-circular provenance evidence. | Fixed. |
| F-1-12 | README lead is short and concrete. | Fixed. |
| F-1-13 | Rule lookup, score automation, and campaign clauses now have observable checks. | Fixed. |
| F-1-14 | General demo storage is tested, but the explicit photo storage claim is not. | **Half-fixed — F-3-07.** |
| F-1-15 | Text export works, but print styling is blocked by CSP and its test misses the failure. | **Regressed — F-3-02.** |
| F-1-16 | Core fields are shown; actual cross-note rule reuse remains unlisted/untested. | **Half-fixed — F-3-08.** |
| F-1-17 | Offline reopen passes, but a pending local save is discarded by header navigation. | **Regressed — F-3-01.** |
| F-1-18 | Axe/reduced-motion/request checks pass, but one live mobile link remains 19 px high. | **Half-fixed — F-3-04.** |
| F-1-19 | Job, audience, action, and visible h1 pass at both widths. | Fixed. |
| F-1-20 | Public routes work, but the core editor has no URL/history state and existing-note focus is lost. | **Half-fixed — F-3-03.** |
| F-1-21 | Build emits the demo, privacy, terms, offline, and 404 entries. | Fixed. |
| F-1-23 | Dead checkout remains absent; rendered links resolve. | Fixed. |
| F-1-24 | Route metadata/headers exist, but print injects an inline style that CSP blocks. | **Regressed — F-3-02.** |
| F-1-25 | Live hashed assets are immutable and manifest MIME is correct. | Fixed. |
| F-1-26 | Maskable icon is a real 512 × 512 PNG. | Fixed. |
| F-1-27 | Header/footer/credit are present and live build id equals HEAD. | Fixed. |
| F-1-28 | Core saved-play noun is consistently `session note`. | Fixed. |
| F-1-29 | Old slogans are gone, but landing copy reintroduces vague `decisions`. | **Regressed — F-3-09.** |
| F-1-30 | No README sentence exceeds 22 words. | Fixed. |
| F-1-31 | Visitor copy avoids the previously flagged implementation jargon. | Fixed. |
| F-2-01 | `/demo`, `/demo/`, and `?demo=1` all open the sample. | Fixed. |
| F-2-02 | Offline fallback is fixed, but the print popup now produces the same inline-style CSP violation. | **Regressed — F-3-02.** |
| F-2-03 | Dormant license UI and claims are removed. | Fixed. |
| F-2-04 | Reset behavior works, but its tagged test still does not assert every seeded field as promised. | **Half-fixed — F-3-05.** |
| F-2-05 | Privacy copy is narrowed to listed, observable statements. | Fixed. |
| F-2-06 | Dormant paid terms are removed. | Fixed. |
| F-2-07 | Overstated Node/preview/host promises are removed; current build instructions were verified. | Fixed. |
| F-2-08 | Full non-goal claim is now exercised. | Fixed. |
| F-2-09 | Art claim is narrowed and hash-backed. | Fixed. |
| F-2-10 | Three-step explanation and privacy/limits sections exist; incomplete paid state is gone. | Fixed. |
| F-2-11 | Most targets were enlarged, but **Read privacy details** is still 162 × 19 at 390 px. | **Half-fixed — F-3-04.** |
| F-2-12 | Unknown URLs return a designed HTTP 404. | Fixed. |
| F-2-13 | Previously flagged database/archive/caching phrases were removed. | Fixed apart from the separate F-3-09 wording regression. |
| F-2-14 | Live footer shows actual HEAD `4be985c8822b`. | Fixed. |
| `verification.md` malformed import | Whole-document validation remains before writes; tests pass. | Fixed. |
| `verification.md` desktop contrast | Desktop axe scan has no serious/critical result. | Fixed. |
| `verification-2.md` three-complete wording | Limit and wording are removed. | Fixed. |
| `verification-2.md` cache/MIME | Live response policy is correct. | Fixed. |
| `verification-2.md` maskable dimensions | Asset and declaration are both 512 × 512. | Fixed. |

## Findings, ordered by severity

### Blocking

1. **F-3-01 — Header navigation can discard the newest note edit (reopens F-1-17).** Live reproduction: create a blank note, type **“Unsaved navigation sentinel”**, observe **“Saving…”**, immediately activate header **Privacy**, wait, then return with **Back to session notes**. The archive contains **“Untitled session note”** and not the entered title. In `src/main.ts`, input schedules a 450 ms save, while the general route handler navigates immediately; `legalPage()` sets `current = null`, so the delayed operation returns without writing. Flush `saveCurrent(true)` before every in-app/full-page navigation while an editor is active, and add a test that types then immediately uses wordmark, Demo, Privacy, Terms, browser back, and page close/reload.

2. **F-3-02 — Print/PDF receipt violates CSP and the claim test misses it (reopens F-1-15, F-1-24, and F-2-02).** Live **Print or save PDF** opens an `about:blank` receipt whose inline `<style>` from `receiptHtml()` is blocked by `style-src 'self'`. Chromium logs **“Applying inline style violates … Content Security Policy”**; computed body styling is default Times New Roman/black with no max-width and the header has no border. `@claim:exports` checks only the popup title. Use a same-origin print stylesheet or a routed print view, then assert zero popup console errors, expected computed styles/content, and the print call.

3. **F-3-03 — The core editor has no deep link/history state and loses focus (reopens F-1-20).** Creating or opening a note changes the h1/title but leaves the URL at `/`. Reload returns to the archive; browser Back cannot return from editor to archive; an existing-note click leaves focus on `<body>` instead of the editor h1. Give notes a real route such as `/session/<id>`, push it on create/open, restore it on direct load/reload/back/forward, move focus to its h1, and announce the change. Add live direct-load and history tests.

4. **F-3-04 — One mobile touch target is still below 44 px (reopens F-1-18 and F-2-11).** At 390 px, landing link **“Read privacy details”** measures **162 × 19 CSS px**. The current target test checks only header/footer elements and selected demo controls, so it misses this link. Give the link a 44 px minimum hit area and test every visible interactive element on every route.

5. **F-3-05 — Reset demo's tagged test does not prove its declared sandbox (reopens F-2-04).** `.factory/claims.json` requires **“assert all seeded fields and the sentinel.”** `@claim:demo-reset` changes/asserts only setup text, checks a heading that never changes when the title input changes, and checks the sentinel. It does not assert date, location, all players/scores, rule, both events, outcome, or completed state. Extend the one tagged test to mutate and assert every seed field plus the real-data sentinel.

6. **F-3-06 — Backup restore/saved-rule claim is not observably tested (reopens F-1-07).** Exact claim: **“Download or restore a backup file with session notes and saved rules.”** The test downloads the sample, resets to the same already-filled sample, imports the identical file, and checks only **“Restored 1 session notes.”** It never asserts `snippets`, never restores into a fresh empty context, and never verifies restored fields, so a no-op importer could pass. Restore into a fresh isolated database and assert every session field plus saved rules; keep malformed/merge coverage separate.

7. **F-3-07 — Setup-photo storage/print promise is unlisted and untested (reopens F-1-14).** Exact editor sentence: **“A setup photo is stored in this browser and included when you print a receipt.”** The sample has no photo; `browser-storage` does not upload/inspect one and `exports` does not assert an image in the receipt. Add a `setup-photo` claim using a bundled sample image, assert only the demo database receives it, reload it, and assert the print receipt contains it; or remove the sentence and photo capability until covered.

8. **F-3-08 — Cross-note house-rule reuse is an unlisted claim (reopens F-1-16).** Exact editor sentence: **“Rules added here can be reused in later session notes.”** `session-template` only confirms that one attached rule is visible. Add a `rule-reuse` claim/test that creates a rule, opens a second sample note, chooses it through **Reuse a saved rule**, reloads, and verifies both notes remain isolated to demo storage; otherwise remove the sentence/control.

9. **F-3-09 — Vague `decisions` wording returned on the landing page (reopens F-1-29).** Exact copy: **“Keep decisions with the session note.”** The earlier review already rejected `decisions` as vague; the product otherwise uses `rulings and events`. Rewrite it as **“Keep rulings and events with the session note.”** The same term should also be removed from editor labels such as **“Decisions to reuse”** and **“Record the decision while it is fresh.”**

### Minor

10. **F-3-10 — Sitemap URLs disagree with legal-route canonicals.** `public/sitemap.xml` publishes `/privacy/` and `/terms/`, while live canonical links are `/privacy` and `/terms`; all four URLs return 200. Choose one URL form, use it in links/sitemap/canonical/static routes, and add an assertion that every sitemap URL equals the rendered canonical.

## Missed leverage

No AI feature is warranted. The core job is capturing factual table state locally; model calls would add keys, cost, and network disclosure without removing a necessary user step. BoardGameGeek import and campaign management are explicit non-goals. Backup import/export, offline reopen, setup photos, reusable rules, and text/print receipts are the right leverage; the existing implementations need the reliability and proof fixes above. Optional sync would change the local-only privacy model and is not an obvious requirement from this brief.

## What would make this perfect

Prevent pending-save data loss on every navigation; give each session a focus-safe real URL; move print styles onto a CSP-compatible same-origin path; cover the entire demo reset, fresh backup restore, setup photo, and rule-reuse outcomes with claim tests; enlarge the remaining mobile link; replace vague `decisions`; and make sitemap/canonical URLs identical. Then rerun every claim plus independent live navigation, popup-console, storage, offline, link, and accessibility checks with zero findings.
