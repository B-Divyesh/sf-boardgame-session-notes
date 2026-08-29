# Adversarial first-read review 5 — PASS

**Reviewed:** 2026-08-29 UTC  
**Production:** <https://boardgame-session-notes.sociobot.in>  
**Candidate:** `384e27462bfa8655fe345d69aaf23a55f49b777c`  
**Verdict:** **PASS** — zero findings, zero untested claims, and no reopened historical finding.

## Method and evidence

- Opened production cold in fresh Chromium contexts at 390 × 844 and 1440 × 900 before scrolling.
- Exercised the live sample, Reset demo, Start for real, backup restore, photo/print flow, reusable ruling, navigation saves, focus restoration, direct routes, offline page, and 404.
- Captured the complete live request log during a demo edit and export. Every request was same-origin, no request body contained the note text, and only `demo:boardgame-session-notes` existed.
- Crawled every rendered link and every sitemap URL. Valid destinations returned 200; an unknown URL returned the designed 404 with HTTP 404.
- Checked titles, descriptions, canonicals, Open Graph/Twitter data, icons, one h1, landmarks, headers, asset MIME/cache policy, and live/build JavaScript identity.
- Ran Playwright axe against home, demo, Privacy, Terms, offline, and 404 at mobile and desktop sizes: zero WCAG 2 A/AA violations.
- Ran `/opt/fleet/lib/verify-url.sh` against production: HTTP 200, title, `lang=en`, one h1, main landmark, image/button labels, and zero console errors all passed.
- Used a clean clone at `/tmp/boardgame-session-notes-review5.cMjXBY`, pinned to the candidate commit. `npm ci` reported zero vulnerabilities.
- Read `brief.json`, `design.md`, `claims.json`, `demo.md`, `README.md`, both verification reports, reviews 1–4, polish reports 1–4, and the previous handoff. Historical statuses below are based on fresh live and code checks, not the polish labels.

## Cold first read

At both widths, before scrolling:

- **What it does:** records one boardgame session, including the setup, rulings, events, and result.
- **For whom:** game groups that need to settle a rule or remember setup after clearing the table.
- **What to click first:** **Try it with sample data**; the adjacent text says **See a filled session note.**

The exact first-screen copy supplies all three answers: **“Record one boardgame session”**, **“For game groups who need to settle a rule or remember the setup after the table is cleared.”**, and **“Try it with sample data”**. The mobile viewport also shows the three plain facts and the real-data alternative before the illustration. There is no blocking first-screen finding.

## Copy audit

Counts treat hyphenated terms, numbers, paths, and code tokens as one word. Headings, labels, status text, and actions are included even when they are fragments. No unit exceeds 22 words, contains a banned marketing adjective, uses an unexplained metaphor, or changes the established term for a saved record. All buttons use a verb that names the result.

### Landing page

| Exact copy | Words | Result |
|---|---:|---|
| `Skip to session notes` | 4 | Clear skip action. |
| `Boardgame Session Notes` | 3 | Product wordmark. |
| `Demo` | 1 | Clear navigation destination. |
| `Privacy` | 1 | Clear navigation destination. |
| `Online · saved in this browser` | 5 | Concrete status; covered by browser storage/navigation-save tests. |
| `Private session notes` | 3 | Clear product category; privacy is backed by storage and network tests. |
| `Record one boardgame session` | 4 | Job-first h1. |
| `For game groups who need to settle a rule or remember the setup after the table is cleared.` | 18 | Names the audience and situation. |
| `Try it with sample data` | 5 | Result-naming primary action. |
| `See a filled session note.` | 5 | States the immediate result. |
| `No account is required.` | 4 | Listed claim. |
| `Works offline after the first visit.` | 6 | Listed claim. |
| `Session notes stay in this browser on this device.` | 9 | Listed claim. |
| `Start a blank session note` | 5 | Clear real-data action. |
| `Setup → rulings and events → final result` | 6 | Informative illustration caption. |
| `In this browser` | 3 | Clear storage context. |
| `Session archive` | 2 | Names the saved-note collection. |
| `0 session notes in this browser on this device` | 9 | Concrete empty collection status; listed storage claim. |
| `Search session notes` | 3 | Result-naming field label. |
| `No session notes yet` | 4 | Clear empty-state heading. |
| `Start with a game title.` | 5 | Concrete first step. |
| `Add players, setup notes, rulings, and scores as you play.` | 10 | Listed template claim. |
| `Create a session note` | 4 | Result-naming action. |
| `How it works` | 3 | Clear section heading. |
| `Keep one session note as you play` | 7 | Clear section heading. |
| `Start with the game title.` | 5 | Concrete step. |
| `Add players and the starting state.` | 6 | Concrete result. |
| `Note rulings and score changes.` | 5 | Concrete step. |
| `Keep rulings and events with the session note.` | 8 | Concrete result. |
| `Finish and reopen it later.` | 6 | Concrete step. |
| `Export a text receipt or backup file when needed.` | 9 | Listed export/backup claims. |
| `Privacy and limits` | 3 | Clear section heading. |
| `Your notes stay in this browser` | 7 | Listed storage claim. |
| `Use a backup file before clearing browser data or moving devices.` | 11 | Useful recovery instruction. |
| `The app does not look up rules, calculate scores, or manage campaigns.` | 12 | Listed boundary claim. |
| `Read privacy details` | 3 | Result-naming link. |
| `Record one boardgame session in this browser.` | 7 | Concrete footer description. |
| `Terms` | 1 | Clear navigation destination. |
| `Open backup tools` | 3 | Result-naming action. |
| `Built by Param Factory` | 4 | Clear credit. |
| `build 384e27462bfa` | 2 | Current deployed build identifier. |
| `Generated illustration; source details in the design notes.` | 8 | Listed, hash-backed provenance claim. |
| `Backup tools` | 2 | Clear dialog context. |
| `Back up or restore session notes` | 6 | Clear dialog heading. |
| `Download a backup file with every session note and saved rule, or restore one to this browser.` | 17 | Listed backup claim. |
| `A backup updates session notes with the same identifier and keeps other notes.` | 13 | Listed merge claim. |
| `Download backup file` | 3 | Result-naming action. |
| `Restore backup file` | 3 | Result-naming action. |
| `Close backup tools` | 3 | Result-naming accessible button label. |

### README

| Exact copy | Words | Result |
|---|---:|---|
| `Boardgame Session Notes` | 3 | Product heading. |
| `Record one boardgame session in this browser.` | 7 | Clear job statement. |
| `For game groups who need to check what happened after the board is cleared.` | 14 | Clear audience and situation. |
| `What it records` | 3 | Clear section heading. |
| `Players, setup notes, house rules, events, scores, and an outcome` | 10 | Listed template capability. |
| `A setup photo that stays in this browser and appears in the printable receipt` | 14 | Listed photo claim. |
| `Saved rulings that can be reused in a later session note` | 11 | Listed reuse claim. |
| `A text receipt, a printable receipt, and a backup file` | 10 | Listed export/backup capabilities. |
| `Session notes that reopen offline after the first visit` | 9 | Listed offline claim. |
| `Edits are saved in this browser before you leave a session note.` | 12 | Listed navigation-save claim. |
| `It does not look up rules, calculate scores, or manage campaigns.` | 11 | Listed boundary claim. |
| `Try the sample` | 3 | Clear section heading. |
| `Open the demo or add ?demo=1 to the home URL.` | 10 | Concrete demo instruction. |
| `It opens a filled sample without changing your saved session notes.` | 11 | Listed isolated-demo claim. |
| `Reset demo restores the filled sample without changing saved session notes.` | 11 | Listed reset claim. |
| `Start for real deletes the sample before opening your saved session notes.` | 12 | Listed demo-exit behavior. |
| `Run and verify` | 3 | Clear developer heading. |
| `Run npm ci, npm run dev, npm test, npm run build, and npm run test:e2e.` | 15 | Concrete commands. |
| `The production build is dist/.` | 5 | Verified build output. |
| `Deploy` | 1 | Clear developer heading. |
| `Deploy dist/ as a static site using the included staticwebapp.config.json.` | 10 | Concrete deployment instruction. |
| `Documentation` | 1 | Clear section heading. |
| `See Privacy, Terms, the product brief, and the handoff.` | 9 | Clear documentation links. |
| `License` | 1 | Clear section heading. |
| `MIT.` | 1 | Exact license. |
| `See LICENSE.` | 2 | Clear license link. |

### Terminology

| Concept | Term used |
|---|---|
| One occurrence of play | `boardgame session` |
| Its saved record | `session note` |
| The stored collection | `session archive` / `saved session notes`, with `archive` used only as the collection heading |
| A reusable table agreement | `ruling` or `house rule` |
| The isolated try-out | `demo` |
| The transfer document | `backup file` |

No copy finding is present.

## Demo and sandbox

**PASS.** The first-screen action opens `/demo` in one click. The first post-click screen is the completed **Lantern Harbor** session with three named players, date, place, scores, setup, house rule, two events, outcome, and completion state already visible in the editor.

The persistent banner reads **“Demo — sample data, nothing is saved”** and includes **Reset demo** and **Start for real**. A live mutation followed by Reset restored the title, date, location, every player and score, setup, ruling, both events, outcome, and completed state. Start for real removed the demo database and exposed an independently created real-data sentinel unchanged.

The live request/storage audit recorded four same-origin GET requests, no external request, no request containing the entered sentinel, no local/session-storage keys, and exactly one IndexedDB database: `demo:boardgame-session-notes`. The offline claim also passed under service-worker control from a fresh demo context.

## Claims audit

Every literal command in `.factory/claims.json` ran separately in the clean clone. Each selected one tagged test in both configured browser projects.

| Claim id | Result | Observable evidence |
|---|---|---|
| `demo-isolated` | PASS, 2/2 | Filled sample, demo database only, and demo removal on Start for real. |
| `demo-reset` | PASS, 2/2 | Every seeded field restored; real sentinel and late-write cancellation checked. |
| `no-account` | PASS, 2/2 | Save completed without account fields or external traffic. |
| `offline-reload` | PASS, 2/2 | Edited sample reloaded offline under service-worker control. |
| `browser-storage` | PASS, 2/2 | Edited data appeared in the demo IndexedDB namespace; traffic stayed same-origin. |
| `backup-file` | PASS, 2/2 | Backup restored every field and reusable ruling in an empty fresh context. |
| `backup-merge` | PASS, 2/2 | Matching note updated and unrelated/new note remained. |
| `session-template` | PASS, 2/2 | Players, setup, rule, events, scores, outcome, and receipt content asserted. |
| `exports` | PASS, 2/2 | Text receipt, styled print document, print call, and zero popup errors asserted. |
| `setup-photo` | PASS, 2/2 | Photo persisted only in demo storage and appeared in print. |
| `rule-reuse` | PASS, 2/2 | A new ruling was reused in a second note and survived reload. |
| `navigation-save` | PASS, 2/2 | Immediate wordmark, Demo, Privacy, Terms, Back, reload, and close paths retained edits. |
| `no-rule-lookup` | PASS, 2/2 | No lookup/automation/campaign controls or traffic; scores remained manual. |
| `privacy-network` | PASS, 2/2 | Edit, export, and print sent no note content and made no external request. |
| `art-provenance` | PASS, 2/2 | Prompt/source and every derivative matched recorded SHA-256 values. |

There is one tagged test for every manifest id, no listed command failed, and the live landing/Privacy/README reliance statements map to these entries. No unlisted live claim was found.

## Quality gates

- `npm test`: **8/8 passed**.
- `npm run build`: **passed**; `dist/index.html` produced. Initial application JavaScript is 36.37 kB raw / 11.79 kB gzip.
- `npm run test:e2e`: **36/36 passed** in desktop Chromium and 390 × 844 mobile Chromium.
- Individual claim commands: **15/15 passed**, **30/30** browser executions.
- Live end-to-end audit: **passed**; production JavaScript matched the clean build byte-for-byte.
- Live axe: **0 violations** on six routes at both viewport sizes.
- Live verifier: **passed** with zero console errors.

## Historical finding audit

### Review 1

| Earlier id | Fresh live and code confirmation | Status |
|---|---|---|
| F-1-01 | One-click filled demo, exact banner, Reset/Start controls, and `demo:` database work. | Closed. |
| F-1-02 | Account-free save and request proof pass. | Closed. |
| F-1-03 | Edited demo reloads offline after the first visit. | Closed. |
| F-1-04 | Account/storage copy uses the tested session-note/browser wording. | Closed. |
| F-1-05 | The false three-complete limit and limit UI are absent. | Closed. |
| F-1-06 | Price, license, device, and dead-checkout claims remain absent. | Closed. |
| F-1-07 | Fresh-context backup restoration asserts all fields and saved rulings. | Closed. |
| F-1-08 | Matching-note update and unrelated-note preservation pass. | Closed. |
| F-1-09 | Precise privacy wording has storage and network proof. | Closed. |
| F-1-10 | Browser/device storage wording is consistent and tested. | Closed. |
| F-1-11 | Art provenance is prompt/source/derivative hash-backed. | Closed. |
| F-1-12 | README lead is short, concrete, and mapped to tests. | Closed. |
| F-1-13 | Rule lookup, score calculation, and campaign exclusions are all asserted. | Closed. |
| F-1-14 | Session-note and setup-photo storage stay in demo-only browser data. | Closed. |
| F-1-15 | Text and styled print/PDF receipts pass without CSP errors. | Closed. |
| F-1-16 | Complete template fields and cross-note ruling reuse are exercised. | Closed. |
| F-1-17 | Offline reopen and immediate-navigation saves pass. | Closed. |
| F-1-18 | Keyboard focus, reduced motion, mobile layout/targets, axe, and request checks pass. | Closed. |
| F-1-19 | Job h1, audience, sample action, result text, and three facts are above the fold. | Closed. |
| F-1-20 | Demo/legal/404/session routes, history, announcements, and focus work. | Closed. |
| F-1-21 | Build entries and dynamic-session rewrites work; unknown URLs return 404. | Closed. |
| F-1-23 | Dead checkout remains absent; rendered-link crawl passes. | Closed. |
| F-1-24 | Route metadata and enforceable CSP/security headers are present. | Closed. |
| F-1-25 | Hashed JavaScript is immutable; manifest MIME is correct. | Closed. |
| F-1-26 | Maskable icon is a real 512 × 512 PNG. | Closed. |
| F-1-27 | Shared header/footer, legal links, factory credit, and current build id are present. | Closed. |
| F-1-28 | A saved record is consistently a `session note`. | Closed. |
| F-1-29 | Mood slogans and vague `decisions` copy remain absent. | Closed. |
| F-1-30 | First-screen and README sentences remain within 22 words. | Closed. |
| F-1-31 | Previously flagged visitor jargon remains absent. | Closed. |

Review 1 assigned no F-1-22.

### Review 2

| Earlier id | Fresh live and code confirmation | Status |
|---|---|---|
| F-2-01 | `/demo`, `/demo/`, and `?demo=1` open the same isolated sample with canonical `/demo`. | Closed. |
| F-2-02 | Offline and print styles load same-origin without CSP errors. | Closed. |
| F-2-03 | Dormant license restoration/unlock behavior remains absent. | Closed. |
| F-2-04 | Reset covers every seed, preserves real data, and cancels the pending write. | Closed. |
| F-2-05 | Privacy copy is limited to tested storage, backup, export, and network statements. | Closed. |
| F-2-06 | Dormant paid terms remain absent. | Closed. |
| F-2-07 | README commands/build output were verified in the clean clone. | Closed. |
| F-2-08 | Every negative-scope clause is observed by the tagged test. | Closed. |
| F-2-09 | Provenance proof is hash-backed rather than circular prose. | Closed. |
| F-2-10 | Preview, three steps, privacy/limits, and footer use the required information order. | Closed. |
| F-2-11 | Every measured visible control meets the 44 × 44 target minimum. | Closed. |
| F-2-12 | Unknown URLs return a designed page with HTTP 404. | Closed. |
| F-2-13 | Flagged database/caching metaphors and visitor jargon remain absent. | Closed. |
| F-2-14 | Live footer id equals the deployed candidate; live JavaScript equals the clean build. | Closed. |

### Review 3

| Earlier id | Fresh live and code confirmation | Status |
|---|---|---|
| F-3-01 | Immediate navigation, reload, Back, and close preserve the newest edit. | Closed. |
| F-3-02 | Print uses same-origin CSS, expected styling, a print call, and no console error. | Closed. |
| F-3-03 | Real/demo note deep links restore content, title, canonical, history, announcement, and h1 focus. | Closed. |
| F-3-04 | Privacy link and all other measured controls meet the touch minimum. | Closed. |
| F-3-05 | Reset asserts every field, completion, real sentinel, and late-write cancellation. | Closed. |
| F-3-06 | Backup restoration uses an empty context and checks all fields and reusable ruling. | Closed. |
| F-3-07 | Photo storage, reload, and print behavior have a passing dedicated claim. | Closed. |
| F-3-08 | Cross-note ruling reuse has a passing dedicated claim. | Closed. |
| F-3-09 | Visitor-facing `decisions` wording remains absent. | Closed. |
| F-3-10 | Sitemap, links, and canonicals use the same no-slash route form. | Closed. |

### Review 4

| Earlier id | Fresh live and code confirmation | Status |
|---|---|---|
| F-4-01 | Completion, player/rule/event removal, photo, add, reuse, and finish rerenders retain logical keyboard focus. | Closed. |
| F-4-02 | Offline has route metadata, icons, shared header/footer, legal links, credit, and build id. | Closed. |
| F-4-03 | Completion button names its result and status is separate. | Closed. |
| F-4-04 | Offline recovery action says `Open session notes`. | Closed. |

### Earlier verification reports

| Earlier finding | Fresh confirmation | Status |
|---|---|---|
| `verification.md`: malformed backup could brick the archive | Strict whole-document validation test passes before any write. | Closed. |
| `verification.md`: desktop contrast failure | Desktop axe scan has zero violations. | Closed. |
| `verification-2.md`: three-complete copy/behavior mismatch | Limit and claim remain absent. | Closed. |
| `verification-2.md`: cache/MIME policy | Live hashed asset is immutable and manifest is `application/manifest+json`. | Closed. |
| `verification-2.md`: maskable icon dimensions | Raster and manifest remain 512 × 512. | Closed. |

Polish reports 1–4 and the previous handoff introduce no additional finding ids. Their claimed closures were independently rechecked above.

## Structure, accessibility, and visual identity

**PASS.** Home uses the 54-character title **“Boardgame Session Notes — record one boardgame session”**. Demo, Privacy, Terms, offline, session-note, and 404 views set route-specific titles. Every checked route has one h1, a description, canonical, Open Graph/Twitter data, SVG favicon, Apple touch icon, `lang=en`, and a main landmark. The social image is a real 1200 × 630 product-art derivative.

The header/footer are consistent, the skip link and route announcement work, browser Back/Forward and deep session URLs restore the right state, and route changes focus the h1. The 404 is styled and returns HTTP 404. All valid rendered links returned 200. The response CSP and security headers match the resources in use, and no ordinary console error appeared.

The dark felt, cream ledger paper, persimmon controls, marigold route markers, chamfered shapes, serif display type, generated table-map art, and non-looping motion form a product-specific identity rather than a generic SaaS template. Reduced-motion rules are present.

## Missed leverage

No finding. The brief's obvious adjacent value is user-controlled export/import and offline reopen; both exist and are tested. Sync would change the local-only privacy model, and an AI step would add cost/network disclosure without improving the core job. No AI feature, provider key, decorative model call, or unsupported integration is present.

## Findings

None.

## What would make this perfect

Nothing remains from this review. The product is clear in one screen, immediately tryable with realistic isolated data, honest about storage and limits, fully covered by listed claim tests, accessible at the checked sizes, and complete for the researched job.
