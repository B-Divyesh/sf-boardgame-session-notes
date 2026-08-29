# Adversarial first-read review 4 — FAIL

**Reviewed:** 2026-08-29 UTC  
**Production:** <https://boardgame-session-notes.sociobot.in>  
**Repository/live build:** `4b88dbc052e9a40eb825c65b5744307bc8f1e7e6`  
**Verdict:** **FAIL** — two blocking findings and two minor findings remain. This is not a release approval.

## Method and evidence

- Opened production cold in fresh Chromium contexts at 390 × 844 and 1440 × 900 before scrolling. Home returned 200, made only same-origin requests, used one h1, and logged no console errors.
- Read `.factory/brief.json`, `.factory/design.md`, `.factory/claims.json`, `.factory/demo.md`, README, every earlier review, every polish report, the previous handoff, and the implementation.
- Exercised production with a saved real-data sentinel, the one-click demo, Reset demo, Start for real, offline reload, request logging, IndexedDB inspection, keyboard actions, route metadata, unknown routes, and a rendered-link crawl.
- Created clean clone `/tmp/boardgame-review4.UWVTPX/clone` at `4b88dbc052e9a40eb825c65b5744307bc8f1e7e6`. `npm ci`, `npm test` (8/8), `npm run build`, and `npm run test:e2e` (34/34 across desktop and mobile) passed.
- Ran all 15 literal commands in `.factory/claims.json` separately from that clone. All 30 desktop/mobile claim executions passed. Each claim tag occurs exactly once in `tests/app.spec.ts`.
- `/opt/fleet/lib/verify-url.sh` passed production in 623 ms with one h1, `lang=en`, `<main>`, complete image alt text, labeled buttons, and zero console errors.
- The live HTML, JavaScript, CSS, manifest, generated service worker, sitemap, and robots file matched the clean local build byte-for-byte. Initial JavaScript is 35.41 kB, 11.55 kB gzip.
- Evidence: [mobile home](evidence/review-4/live-home-390.png), [desktop home](evidence/review-4/live-home-1440.png), [mobile demo](evidence/review-4/live-demo-mobile.png), and [production verifier](evidence/review-4/verify-live/verify.json).

## Cold first read

At both widths, before scrolling, all three questions are answerable:

- **What does this do?** It records one boardgame session, including setup, rulings, score changes, and the result.
- **For whom?** Game groups that need to settle a rule or remember setup after the table is cleared.
- **What should I click first?** **Try it with sample data**, followed by **“See a filled session note.”**

The exact first-screen text is **“Record one boardgame session”**, **“For game groups who need to settle a rule or remember the setup after the table is cleared.”**, and **“Try it with sample data.”** This requirement passes on mobile and desktop.

## Copy audit

Counts treat a number, URL, hyphenated item, and code token as one word. Standalone `·`, `—`, and `→` separators are not words. Repeated navigation/footer labels are listed once. Labels, actions, statuses, and the landing page's reachable backup dialog are included because visitors rely on them.

### Landing page

| Copy unit | Words | Result |
|---|---:|---|
| `Skip to session notes` | 4 | Clear action. |
| `Boardgame Session Notes` | 3 | Clear wordmark. |
| `Demo` | 1 | Clear navigation label. |
| `Privacy` | 1 | Clear navigation label. |
| `Online · saved in this browser` | 5 | Listed storage behavior. |
| `Private session notes` | 3 | Names the product category. |
| `Record one boardgame session` | 4 | Clear job headline. |
| `For game groups who need to settle a rule or remember the setup after the table is cleared.` | 18 | Clear audience and situation. |
| `Try it with sample data` | 5 | Result-naming action. |
| `See a filled session note.` | 5 | Clear action outcome. |
| `No account is required.` | 4 | Listed claim. |
| `Works offline after the first visit.` | 6 | Listed claim. |
| `Session notes stay in this browser on this device.` | 9 | Listed claim. |
| `Start a blank session note` | 5 | Result-naming action. |
| `Setup → rulings and events → final result` | 6 | Informative caption. |
| `In this browser` | 3 | Clear section context. |
| `Session archive` | 2 | Clear collection heading. |
| `0 session notes in this browser on this device` | 9 | Clear dynamic status. |
| `Search session notes` | 3 | Clear field label. |
| `No session notes yet` | 4 | Clear empty-state heading. |
| `Start with a game title.` | 5 | Clear next step. |
| `Add players, setup notes, rulings, and scores as you play.` | 10 | Concrete capability summary. |
| `Create a session note` | 4 | Result-naming action. |
| `How it works` | 3 | Clear section label. |
| `Keep one session note as you play` | 7 | Clear section heading. |
| `Start with the game title.` | 5 | Clear step. |
| `Add players and the starting state.` | 6 | Clear result. |
| `Note rulings and score changes.` | 5 | Clear step. |
| `Keep rulings and events with the session note.` | 8 | Clear result. |
| `Finish and reopen it later.` | 5 | Clear step. |
| `Export a text receipt or backup file when needed.` | 9 | Listed export behavior. |
| `Privacy and limits` | 3 | Clear section label. |
| `Your notes stay in this browser` | 6 | Listed storage behavior. |
| `Use a backup file before clearing browser data or moving devices.` | 11 | Concrete recovery instruction. |
| `The app does not look up rules, calculate scores, or manage campaigns.` | 12 | Listed scope boundary. |
| `Read privacy details` | 3 | Result-naming link. |
| `Record one boardgame session in this browser.` | 7 | Clear footer summary. |
| `Terms` | 1 | Clear navigation label. |
| `Open backup tools` | 3 | Result-naming action. |
| `Built by Param Factory` | 4 | Clear credit. |
| `build 4b88dbc052e9` | 2 | Correct deployed build identifier. |
| `Generated illustration; source details in the design notes.` | 8 | Listed provenance claim. |
| `Backup tools` | 2 | Clear dialog label. |
| `Back up or restore session notes` | 6 | Clear dialog heading. |
| `Download a backup file with every session note and saved rule, or restore one to this browser.` | 17 | Listed backup behavior. |
| `A backup updates session notes with the same identifier and keeps other notes.` | 13 | Listed merge behavior. |
| `Download backup file` | 3 | Result-naming action. |
| `Restore backup file` | 3 | Result-naming action. |
| `Close backup tools` | 3 | Clear accessible action. |

No landing copy exceeds 22 words, uses a banned marketing adjective, or needs a finding.

### README

| Copy unit | Words | Result |
|---|---:|---|
| `Boardgame Session Notes` | 3 | Clear title. |
| `Record one boardgame session in this browser.` | 7 | Clear job statement. |
| `For game groups who need to check what happened after the board is cleared.` | 14 | Clear audience and situation. |
| `What it records` | 3 | Clear heading. |
| `Players, setup notes, house rules, events, scores, and an outcome` | 10 | Listed capability. |
| `A setup photo that stays in this browser and appears in the printable receipt` | 14 | Listed capability. |
| `Saved rulings that can be reused in a later session note` | 11 | Listed capability. |
| `A text receipt, a printable receipt, and a backup file` | 10 | Listed capability. |
| `Session notes that reopen offline after the first visit` | 9 | Listed claim. |
| `Edits are saved in this browser before you leave a session note.` | 12 | Listed save claim. |
| `It does not look up rules, calculate scores, or manage campaigns.` | 11 | Listed scope boundary. |
| `Try the sample` | 3 | Clear heading. |
| `Open the demo or add ?demo=1 to the home URL.` | 10 | Clear instruction. |
| `It opens a filled sample without changing your saved session notes.` | 11 | Listed demo claim. |
| `Reset demo restores the filled sample without changing saved session notes.` | 11 | Listed reset claim. |
| `Start for real deletes the sample before opening your saved session notes.` | 12 | Listed isolation claim. |
| `Run and verify` | 3 | Clear heading. |
| `Run npm ci, npm run dev, npm test, npm run build, and npm run test:e2e.` | 15 | Clear commands. |
| `The production build is dist/.` | 5 | Verified build output. |
| `Deploy` | 1 | Clear heading. |
| `Deploy dist/ as a static site using the included staticwebapp.config.json.` | 10 | Clear developer instruction. |
| `See Privacy, Terms, the product brief, and the handoff.` | 9 | Clear references. |
| `License` | 1 | Clear heading. |
| `MIT.` | 1 | Clear license statement. |
| `See LICENSE.` | 2 | Clear reference. |

No README sentence exceeds 22 words, uses a banned marketing adjective, introduces a competing product term, or needs a finding.

### Terminology

| Concept | Term used |
|---|---|
| A game occurrence | boardgame session |
| Its saved record | session note |
| The user's stored collection | saved session notes |
| A reusable agreement | ruling or house rule |
| The isolated try-out | demo |
| Transfer document | backup file |

The two remaining action-copy problems are outside the requested landing/README surfaces and are recorded as F-4-03 and F-4-04.

## Demo and sandbox

One click on **Try it with sample data** opens the completed **Lantern Harbor** session. The first mobile screen already shows the demo banner, completed-state label, title, game-title field, and the start of the filled player section. The note contains Mina, Jo, and Sam with scores 42, 38, and 35; a date and location; setup notes; a house rule; two events; and an outcome.

The persistent demo controls say **“Demo — sample data, nothing is saved”**, **Reset demo**, and **Start for real**. Independent production verification created `Real review 4 sentinel` in `boardgame-session-notes`, entered the demo, and confirmed a separate `demo:boardgame-session-notes` database. Reset restored the sample. An offline reload reopened it. Start for real removed only the demo database and retained the real sentinel.

The production request log contained 42 requests across the complete real/demo/offline flow. Every request was same-origin, and the entered marker `demo-only review marker 4` appeared in no request URL or body. No console error occurred. The demo and isolation requirements pass.

## Claims audit

Every manifest command was run exactly as listed from the clean clone:

| Claim id | Result | Observable evidence |
|---|---|---|
| `demo-isolated` | PASS, 2/2 | Filled sample opened in the demo database; Start for real removed it. |
| `demo-reset` | PASS, 2/2 | Every seed field, completion state, late write, and real sentinel are asserted. |
| `no-account` | PASS, 2/2 | A note saves without an account field or external request. |
| `offline-reload` | PASS, 2/2 | The edited demo reloads under service-worker control while offline. |
| `browser-storage` | PASS, 2/2 | Demo data is present in the demo IndexedDB namespace; traffic is same-origin. |
| `backup-file` | PASS, 2/2 | A fresh context restores every session field and the saved ruling. |
| `backup-merge` | PASS, 2/2 | A matching identifier updates and another note remains. |
| `session-template` | PASS, 2/2 | Players, setup, ruling, events, scores, outcome, and receipt contents are asserted. |
| `exports` | PASS, 2/2 | Text receipt contents, print content/style, print call, and popup console are asserted. |
| `setup-photo` | PASS, 2/2 | Photo stays in demo storage, survives reload, and appears in print. |
| `rule-reuse` | PASS, 2/2 | A ruling is reused in a second note and survives reload in demo storage. |
| `navigation-save` | PASS, 2/2 | Immediate wordmark/legal/demo/back/reload/close exits preserve edits. |
| `no-rule-lookup` | PASS, 2/2 | No lookup/score automation/campaign controls or routes exist; score remains manual. |
| `privacy-network` | PASS, 2/2 | Edited content appears in no request URL or body. |
| `art-provenance` | PASS, 2/2 | Prompt, source, model record, and derivative hashes are asserted. |

Home, demo/editor, privacy, offline, and README claim-like statements map to those entries. No unlisted claim or untested listed claim was found.

## Structure, accessibility, privacy, and routing

- Home, demo, privacy, terms, session-editor, and designed-404 views use route-specific titles under 60 characters, one h1, descriptions, canonical/OG/Twitter metadata, SVG favicon, Apple touch icon, and the product social image.
- Unknown URLs return HTTP 404 with the designed **Page not found** view. `/demo`, `/demo/`, `?demo=1`, `/privacy`, `/privacy/`, `/terms`, and `/terms/` return 200. Session-note direct URLs restore the note and route title. Sitemap URLs equal their rendered canonicals.
- Every rendered network link resolves. The 404's hash-only skip link remains within the current document and does not issue a request.
- The shared app views have consistent navigation/footer, route announcements, back/forward behavior, and route h1 focus. `/offline.html` is the exception; see F-4-02.
- The Playwright axe WCAG 2 A/AA scans found no serious or critical automated violations, all measured visible targets are at least 44 × 44 px, the 390px pages have no horizontal overflow, and reduced-motion CSS exists. The automated scan misses the post-mutation focus loss in F-4-01.
- Live CSP, `frame-ancestors`, nosniff, Referrer Policy, Permissions Policy, immutable hashed assets, and manifest MIME are correct. Normal app use has no third-party request, runtime AI, analytics, advertising, external font/script, provider key, or Azure endpoint.
- The teal felt, clipped ledger paper, score-path image, editorial type, and stamped controls are product-specific. The page does not use a generic centered SaaS hero or three-card feature grid.

## History check

Every earlier finding was checked against current production and source. “Closed” means the live outcome and the implementation were both checked again, not that a polish report called it fixed. There was no F-1-22.

### Review 1

| Earlier id | Current result | Status |
|---|---|---|
| F-1-01 | One-click filled demo, banner, Reset, Start for real, and isolated database work. | Closed. |
| F-1-02 | Account-free save is listed and passes. | Closed. |
| F-1-03 | Offline reload is listed and passes locally and live. | Closed. |
| F-1-04 | Account/storage wording uses session-note/browser terms. | Closed. |
| F-1-05 | The false three-complete limit and limit UI remain absent. | Closed. |
| F-1-06 | Price, license, device, and unavailable-checkout claims remain absent. | Closed. |
| F-1-07 | Backup restore starts in an empty context and asserts all fields and rulings. | Closed. |
| F-1-08 | Matching-note update and preservation behavior pass. | Closed. |
| F-1-09 | Precise privacy wording has request/storage proof. | Closed. |
| F-1-10 | Browser/device storage wording is consistent and tested. | Closed. |
| F-1-11 | Art provenance is prompt/source/derivative hash-backed. | Closed. |
| F-1-12 | README lead is short and maps to listed behavior. | Closed. |
| F-1-13 | Rule lookup, score calculation, and campaign clauses are all checked. | Closed. |
| F-1-14 | Note and photo storage are proved in demo-only browser data. | Closed. |
| F-1-15 | Text and styled print receipts are asserted without CSP errors. | Closed. |
| F-1-16 | Full template and cross-note ruling reuse are exercised. | Closed. |
| F-1-17 | Offline and immediate-navigation saves pass. | Closed. |
| F-1-18 | Static focus styles and route focus pass, but editor mutations drop keyboard focus to `<body>`. | **Regressed — F-4-01.** |
| F-1-19 | Job, audience, primary action, outcome, and one visible h1 pass at both widths. | Closed. |
| F-1-20 | Demo/legal/404/session routes, history, announcements, and route focus work. | Closed. |
| F-1-21 | Build entries and dynamic session rewrites work; unknown URLs return 404. | Closed. |
| F-1-23 | Dead checkout remains absent; the rendered link crawl passes. | Closed. |
| F-1-24 | App routes have metadata and correct response security, but the offline route has no metadata. | **Half-fixed — F-4-02.** |
| F-1-25 | Hashed assets are immutable and the manifest MIME is correct. | Closed. |
| F-1-26 | Maskable icon is a real 512 × 512 PNG. | Closed. |
| F-1-27 | App routes share navigation/footer/build credit, but the offline route omits the shell. | **Half-fixed — F-4-02.** |
| F-1-28 | Saved-record wording consistently uses session note. | Closed. |
| F-1-29 | Earlier slogans and vague decisions wording remain absent. | Closed. |
| F-1-30 | First-screen and README sentences remain within 22 words. | Closed. |
| F-1-31 | Previously flagged implementation jargon remains absent from visitor copy. | Closed. |

### Review 2

| Earlier id | Current result | Status |
|---|---|---|
| F-2-01 | `/demo`, `/demo/`, and `?demo=1` open the same isolated sample. | Closed. |
| F-2-02 | Offline and print styles load from same origin without CSP violations. | Closed. |
| F-2-03 | Dormant license and unlock behavior remain absent. | Closed. |
| F-2-04 | Reset mutates/asserts every seed and preserves real data. | Closed. |
| F-2-05 | Privacy copy is limited to tested storage, backup, export, and network behavior. | Closed. |
| F-2-06 | Dormant paid terms remain absent. | Closed. |
| F-2-07 | README run/build/deploy instructions passed in the clean clone. | Closed. |
| F-2-08 | Every negative-scope clause has an observable check. | Closed. |
| F-2-09 | Art proof is hash-backed rather than circular prose. | Closed. |
| F-2-10 | Product preview, three steps, privacy/limits, and footer follow the required order. | Closed. |
| F-2-11 | All currently measured visible targets pass 44 × 44 px. | Closed. |
| F-2-12 | Unknown routes return a designed HTTP 404. | Closed. |
| F-2-13 | The flagged browser-database/caching/table metaphors and jargon remain absent. | Closed. |
| F-2-14 | Footer build id equals the deployed commit. | Closed. |

### Review 3

| Earlier id | Current result | Status |
|---|---|---|
| F-3-01 | Immediate navigation, reload, back, and close preserve the newest edit. | Closed. |
| F-3-02 | Print uses same-origin CSS, has expected computed styles, calls print, and logs no error. | Closed. |
| F-3-03 | Real/demo note routes deep-load and restore title, canonical, history, announcement, and h1 focus. | Closed. |
| F-3-04 | Privacy link and every measured visible control meet the touch target minimum. | Closed. |
| F-3-05 | Reset asserts all fields, completion, sentinel, and late-write cancellation. | Closed. |
| F-3-06 | Backup restore uses an empty second context and asserts all fields and reusable ruling. | Closed. |
| F-3-07 | Photo storage/reload/print behavior has a dedicated claim. | Closed. |
| F-3-08 | Cross-note ruling reuse has a dedicated claim. | Closed. |
| F-3-09 | Visitor-facing `decisions` wording remains absent. | Closed. |
| F-3-10 | Sitemap, links, and canonical URLs use the same no-slash forms. | Closed. |

## Missed leverage

No missed-leverage finding is warranted. The brief explicitly excludes rule lookup, automated scoring, BoardGameGeek import, and campaign management. The product already supplies the useful local transfer paths: text/print receipts and full backup restore. Account sync would change the local-first privacy model, and an AI feature would not improve the core job enough to justify sending session content or adding a Sociobot key flow. No decorative AI or embedded provider key exists.

## Findings, ordered by severity

### Blocking

1. **F-4-01 — Editor mutations lose keyboard focus (reopens F-1-18).** Exact production reproduction at `/demo`: focus **“Marked complete”** and press Enter; after the UI changes to **“Mark complete”**, `document.activeElement` is `<body>`. The same result occurs after **“Remove player 3”**, **“Remove house rule”**, and **“Remove timeline event 2”**. In `src/main.ts`, these handlers replace the editor with `renderEditor(false)` without selecting a replacement focus target. A keyboard user is returned to the document start and must traverse the whole page again. Preserve focus on the replacement toggle after completion changes; after a removal, move it to the next same-kind control or the section heading. Add a desktop/mobile Playwright test that activates every rerendering editor action with the keyboard and asserts the documented logical focus target.

2. **F-4-02 — The offline route is outside the required metadata and shared shell (reopens F-1-24 and F-1-27).** Exact location: live `/offline.html` has the title **“Offline — Boardgame Session Notes”** and one h1, but has no meta description, canonical, Open Graph/Twitter tags, favicon, Apple touch icon, site header, Privacy/Terms links, footer, build id, or Param Factory credit. It is the only user-facing route with this break in identity and navigation. Add the route metadata and the compact shared header/footer, keeping the standalone same-origin CSS and no-JavaScript fallback. Extend the route test to assert metadata and header/footer on `/offline.html`, not only title, h1, axe, and console state.

### Minor

3. **F-4-03 — The completed-state control does not name the result of pressing it.** Exact quote/location: `/demo`, `#toggle-complete`, **“Marked complete.”** It is a button that reopens the note, but its name describes the current state; it also exposes no `aria-pressed` state. A first-time visitor cannot tell what activation will do. When complete, label it **“Reopen session note”**; when incomplete, use **“Mark session note complete.”** Keep a separate non-interactive **“Completed”** status if the stamped state treatment is needed, or implement a consistent toggle with `aria-pressed` and explicit help text.

4. **F-4-04 — The offline recovery link is not result-naming copy.** Exact quote/location: `/offline.html`, **“Try the app again.”** “Try” does not say where the link goes or what success looks like. Rewrite it as **“Open session notes”** and keep the preceding reconnect instruction.

## What would make this perfect

Close F-4-01 through F-4-04: retain logical focus after every editor rerender, give the completion control an action/result name and explicit state, bring the offline page into the metadata/shared-shell contract, and rename its recovery link. Add the missing post-mutation focus and offline-shell assertions, then rerun the full clean-clone suite, every claim command, the production request/console crawl, and the cold mobile/desktop check. At that point this review found no other product, claim, demo, privacy, routing, copy, visual-identity, or leverage gap.
