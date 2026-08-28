# Adversarial first-read review 1 — FAIL

**Reviewed:** 2026-08-28 UTC  
**Production:** <https://boardgame-session-notes.sociobot.in>  
**Verdict:** **FAIL** — blocking findings remain. This is not a release approval.

## Method and evidence

- Opened the deployed URL in new Chromium browser contexts at 390 × 844 and 1440 × 900 before scrolling. Both returned 200 and had no ordinary console errors. The initial request log contained only the product origin.
- Ran from this clean worktree: `npm ci`, `npm test` (**7/7 passed**), `npm run build` (**passed; `dist/` produced**), and `npm run test:e2e` (**8/8 passed**). These are not claim tests: there is no `.factory/claims.json` and no `@claim:` test tag in the repository.
- Checked direct `/demo`, `/?demo=1`, `/404`, `/privacy/`, `/terms/`, the sitemap, headers, manifest, and every visible landing-page link. `/demo`, `/?demo=1`, and `/404` return the ordinary archive shell. The visible checkout URL returns HTTP 404.
- Read `.factory/verification.md`, `.factory/verification-2.md`, and `.factory/handoff.md`. There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files.

## Cold first read

At both widths, before scrolling, the page appears to be a place to record a game play's setup, rulings, scores, and outcome. The likely first action is **“Start a session note.”**

It does **not** say who it is for on the first screen. “A durable table record” and “Remember the play, not just the score.” do not identify a boardgame group, and “Capture the setup…” describes fields rather than the person/situation. This is a blocking first-screen failure. A usable first screen would say **“Record one boardgame session”** and **“For game groups who need to settle a rule or remember the setup after the table is cleared.”** It should offer **“Try it with sample data”** first, with “See a filled session note” beside it.

## Copy audit

Word counts treat a number, a hyphenated term, a URL, and a code token as one word. Labels, headings, button names, and visible modal/footer copy are included because they direct the visitor. `—` means the unit is plain enough; a finding reference means it needs the named correction.

### Landing page

| Copy unit | Words | Result / proposed rewrite where flagged |
|---|---:|---|
| `Boardgame Session Notes` (only h1; visually hidden) | 3 | F-1-19: product name is not the job headline. Make the visible job headline the h1. |
| `A durable table record` | 4 | F-1-29: mood/marketing heading. Use `Private notes for one boardgame session`. |
| `Remember the play, not just the score.` | 7 | F-1-19/F-1-29: slogan, not a job. Use `Record one boardgame session`. |
| `Capture the setup, rulings, score laps, and outcome while they’re fresh.` | 11 | F-1-31: unexplained, inconsistent `score laps`. Use `Record the setup, rulings, score changes, and outcome before the game is cleared.` |
| `No catalog account.` | 3 | F-1-02: unlisted claim. Use `No account is required.` only after adding a claim test. |
| `No signal required.` | 3 | F-1-03: unlisted offline claim. Use `Works offline after the first visit.` only after its claim test. |
| `Start a session note` | 4 | F-1-01: verb is clear, but this must be the required sample action instead. Add `Try it with sample data`. |
| `Setup → decisions → result.` | 4 | F-1-29: `decisions` is vague. Use `Setup → rulings and events → final result`. |
| `Kept together.` | 2 | F-1-29: information-free slogan. Delete it. |
| `On this device` | 3 | — |
| `Session archive` | 2 | — |
| `0 records · saved without an account` | 6 | F-1-04/F-1-28: unlisted claim and changes `session notes` to `records`. Use `0 session notes on this device` after proving storage. |
| `Search sessions` | 2 | — |
| `No sessions on this table yet` | 7 | F-1-28: `table` is a metaphor. Use `No session notes yet`. |
| `Start with a pasted game title.` | 7 | — |
| `You can add the rest as the night unfolds.` | 9 | F-1-29: vague `the rest`. Use `Add players, setup notes, rulings, and scores as you play.` |
| `Create the first note` | 4 | — |
| `Keep every game night` | 4 | F-1-29: mood heading. Use `Unlimited session notes`. |
| `Unlock unlimited sessions` | 3 | F-1-28: use `Unlock unlimited session notes`. |
| `The free edition keeps 3 complete session notes.` | 8 | F-1-05: unlisted and false; see historical evidence. Use `The free edition keeps 3 session notes` unless the implementation changes. |
| `A $12 one-time purchase unlocks unlimited notes on every licensed device.` | 11 | F-1-06/F-1-28: unlisted and changes the noun. Use tested, consistent pricing copy. |
| `Buy once · $12` | 3 | F-1-23: clear words, but its destination is dead. |
| `Restore a license` | 3 | — |
| `Local archive` (data dialog) | 2 | — |
| `Your data, in your hands` | 5 | F-1-29: slogan. Use `Back up or restore session notes`. |
| `Download every note and reusable rule as a JSON backup, or restore a backup into this device.` | 16 | F-1-07/F-1-31: unlisted behavior and `JSON` jargon. Use `Download a backup file with every session note and saved rule, or restore one to this device.` after a test. |
| `Imported notes with matching IDs are updated; other notes stay intact.` | 10 | F-1-08/F-1-31: unlisted claim and `IDs` jargon. Use `A backup updates notes with the same identifier and keeps other notes.` after a merge test. |
| `Export full backup` | 3 | — |
| `Import backup` | 2 | — |
| `Private by default.` | 3 | F-1-09: vague, unlisted privacy claim. Use `Your session notes stay in this browser.` only after request/storage proof. |
| `Your notes stay on this device.` | 7 | F-1-10: unlisted privacy/storage claim. Use the same tested wording consistently. |
| `Original generated illustration · no game art or rule text` | 8 | F-1-11: unlisted provenance/copyright claim. Link to provenance or add a check. |

### README

| Copy unit | Words | Result / proposed rewrite where flagged |
|---|---:|---|
| `Boardgame Session Notes` | 3 | F-1-28: title is fine; use `session note` consistently in the body. |
| `Boardgame Session Notes is a private, offline-first notebook for one specific play: the starting state, players, house rules, disputes, score changes, setup photo, final scores, and outcome.` | 27 | F-1-12/F-1-30: unlisted claims and over 22 words. Use `Boardgame Session Notes records one boardgame play on this device.` Then list fields separately. |
| `It is for groups that need to reopen what actually happened after the board has been cleared—or after a game leaves their collection.` | 24 | F-1-30: over 22 words. Use `It is for game groups who need to reopen a play after the board is cleared.` |
| `The app deliberately does not fetch rule text, connect to BoardGameGeek, automate scoring, or act as a campaign manager.` | 19 | F-1-13: unlisted boundary claim. Use `It does not look up rules, automate scoring, or manage campaigns.` after tests. |
| `Notes and compressed photos live in IndexedDB on the current device.` | 11 | F-1-14/F-1-31: unlisted storage claim and implementation jargon. Use `Session notes and compressed photos stay in this browser.` after proof. |
| `Users control Markdown, print/PDF, and full JSON backup exports.` | 9 | F-1-15/F-1-31: unlisted export claim and jargon. Use `You can export a text receipt, print or save a PDF, and download a backup file.` after tests. |
| `Live: https://boardgame-session-notes.sociobot.in` | 1 | — |
| `Complete session template with participants, setup, reusable house rules, event timeline, scores, and outcome` | 12 | F-1-16: unlisted capability claim. Use `Record players, setup, house rules, events, scores, and an outcome.` after an end-to-end test. |
| `Local auto-save and offline reopen through an installable PWA` | 9 | F-1-17/F-1-31: unlisted and unexplained `PWA`. Use `Save notes in this browser and reopen them offline after the first visit.` after tests. |
| `Markdown receipt and browser print/save-to-PDF receipt for each session` | 10 | F-1-15: unlisted export claim. Use `Export a text receipt or print each session as a PDF.` after tests. |
| `Full JSON archive export/import for ownership and device migration` | 9 | F-1-07/F-1-31: unlisted and jargon. Use `Download or restore a full backup file when moving devices.` after tests. |
| `Free archive for three full sessions; $12 one-time Sociobot license unlock for unlimited notes` | 12 | F-1-05/F-1-06/F-1-28: false allowance, unlisted price/license claims, inconsistent nouns. Use tested, consistent pricing copy. |
| `Responsive 390px mobile layout, keyboard support, visible focus, reduced motion, and no runtime trackers/CDNs` | 12 | F-1-18/F-1-31: five unlisted claims and `CDNs` jargon. Move verified facts to accessibility/privacy with one test per assertion. |
| `Requires Node.js 22 or later.` | 6 | — |
| `Vite prints the local development URL.` | 6 | — developer setup copy. |
| `The PWA service worker is verified against the production preview rather than dev mode.` | 14 | F-1-31: developer jargon. Use `Offline behavior is checked in the production preview.` |
| `The exact production build command is npm run build.` | 8 | — |
| `It creates dist/index.html and static fallbacks for /privacy/ and /terms/.` | 9 | F-1-21: incomplete routing claim; 404 and demo fallback are absent. |
| `The app is a static Vite build.` | 7 | — |
| `Deploy the contents of dist/ at the site root.` | 9 | — |
| `The production billing API is used by default; staging can override it at build time:` | 15 | F-1-23: the configured checkout endpoint returns 404. |
| `The factory registers the boardgame-session-notes product and return URL.` | 9 | F-1-23: contradicts the visible checkout result. |
| `No payment-provider keys or product IDs belong in this repository.` | 9 | — |
| `See .factory/brief.json for scope, .factory/design.md for the visual system and image provenance, and .factory/handoff.md for verification results.` | 16 | — |
| `MIT.` | 1 | — |
| `See LICENSE.` | 2 | — |

### Terminology to standardize

| Concept | Current competing terms | One term |
|---|---|---|
| A saved play | session note, note, session, record, archive item, table | **session note** |
| A numeric change | score lap, score change, final score | **score change**; use **final score** only for the ending field |
| Stored data | local, on this device, current device, browser, IndexedDB | **in this browser on this device** |
| Transfer file | JSON backup, full backup, archive export/import | **backup file** |

## Claims audit

`.factory/claims.json` does not exist. Therefore there are no listed commands to run from a clean clone and no claim coverage to pass. The local suites above pass, but none is tagged `@claim:<id>` and none is an entry in a claims manifest. The following individually actionable unlisted claims are findings F-1-02 through F-1-18 cited in the audit:

| Finding | Exact claim(s) | Required observable test |
|---|---|---|
| F-1-02 | `No catalog account.` | Fresh context: create, save, and reopen without an account or outbound account request. |
| F-1-03 | `No signal required.` | Demo entry: first online visit, set offline, reload, and reopen sample data. |
| F-1-04 | `saved without an account` | Same fresh-context storage/request assertion. |
| F-1-05 | `3 complete session notes` | Three incomplete drafts must not consume the complete-note allowance, or the copy must say three notes. |
| F-1-06 | `$12 … unlimited notes on every licensed device` | Fixture-backed license/checkout test covering price, a successful route, and device behavior. |
| F-1-07 | backup export/import | Export sample data, import to a new isolated store, and assert all fields and preservation behavior. |
| F-1-08 | matching IDs update/others remain | Import one matching and one new identifier; assert both outcomes. |
| F-1-09 | `Private by default.` | Demo request log through save/export: only allowed requests; inspect demo storage namespace. |
| F-1-10 | `Your notes stay on this device.` | Same request log plus IndexedDB namespace assertion. |
| F-1-11 | original/no game art or rule text | Build-time provenance check against the recorded source list. |
| F-1-12 | private/offline-first notebook capability | Split into tested storage/offline claims; remove the vague adjective. |
| F-1-13 | stated non-goals | Confirm no rule lookup, catalog request, scoring automation, or campaign route. |
| F-1-14 | notes/photos live in IndexedDB | Create a demo note/photo and assert the demo-prefixed store only. |
| F-1-15 | Markdown, PDF, and backup exports | Assert receipt contents, print document, and backup schema from demo data. |
| F-1-16 | complete session template | Demo renders/exports setup, players, rule, event, score, and outcome. |
| F-1-17 | local autosave and offline reopen | Demo edit, reload, then offline reload after first visit. |
| F-1-18 | mobile/keyboard/focus/reduced-motion/no trackers | Separate 390px, keyboard, media-emulation, and full-flow request-log tests. |

## Demo and privacy sandbox

**Blocking.** Neither the landing screen nor README has **“Try it with sample data.”** In a fresh 390px context, `/demo` and `/?demo=1` showed the empty real archive, no realistic sample, no demo banner, no **Reset demo**, and no **Start for real** action. Clicking **“Start a session note”** at `/demo` created an untitled session in the production namespace, `boardgame-session-notes`; there is no `demo:` namespace. A demo visitor can therefore write real local data and cannot verify the product from a realistic filled screen. The ordinary unlicensed load request log was same-origin only, but that does not make the missing isolated demo safe.

## History check

Earlier reports use prose headings rather than finding IDs; the table retains their report/number as the only available historical identifier.

| Earlier finding | Live and code confirmation | Status |
|---|---|---|
| `verification.md` High: malformed import bricked the archive | `isAppBackup` validates before the transaction; the shipped malformed-backup test passes in both browser projects. | Fixed. |
| `verification.md` High: desktop section-index contrast | Current desktop axe test passes; the declared muted token is `#59635F` on paper. | Fixed. |
| `verification-2.md` Low 1: “3 complete” counts drafts | Fresh live context: made three untitled drafts, returned to archive, then a fourth attempt stayed on `/` with `The free archive holds 3 sessions.` | **Unfixed — F-1-05, blocking by this review order.** |
| `verification-2.md` Low 2: cache policy and manifest MIME | Live hashed JS has `Cache-Control: public, must-revalidate, max-age=30`; `manifest.webmanifest` is `application/octet-stream`. | **Unfixed — F-1-25, blocking by this review order.** |
| `verification-2.md` Low 3: maskable icon mismatch | `icon-512-maskable.png` is 616 × 616 while its manifest declaration is `512x512`. | **Unfixed — F-1-26, blocking by this review order.** |

## Structural checks

- `<html lang="en">`, `<main>`, skip link, favicon, responsive image alt text, Privacy and Terms routes, and the distinct table-ledger visual system are present. The visual identity is not a generic SaaS template.
- The home title follows the requested product-plus-purpose pattern; Privacy and Terms titles are route-specific. However, canonical, Open Graph, and Twitter metadata are absent on every inspected route.
- The only h1 is the hidden product name. The visible job headline is an h2; legal pages also have no page-specific h1.
- `/demo` and `/404` return 200 but render the ordinary home archive. Source `route()` explicitly renders home for every path except privacy and terms. There is no designed 404, no demo route, no static web-app configuration, and no CSP response header. On popstate, `route()` does not move focus to a new h1 or announce a route change.
- The header has only a wordmark and connection indicator. It omits visible product navigation including Demo and Privacy; the footer omits the requested product one-liner, Param Factory credit, and build id.
- The internal visible links `/`, `/privacy/`, and `/terms/` return 200. The external **“Buy once · $12”** link is `https://api.sociobot.in/api/v1/products/boardgame-session-notes/checkout` and returns **404 application/json** on direct GET.

## Findings, ordered by severity

### Blocking

1. **F-1-01 — No one-click, isolated sample demo.** Exact location: home primary action is **“Start a session note”**; `/demo` and `/?demo=1` render the empty archive. There is no sample, banner, reset, start-real action, or separate storage namespace. Add the first-screen **“Try it with sample data”** action, a filled realistic session at `/demo`, the persistent exact banner **“Demo — sample data, nothing is saved”**, **Reset demo**, **Start for real**, and a `demo:` IndexedDB namespace. Document and test it in `.factory/demo.md`.

2. **F-1-02 through F-1-18 — Reliance claims have no manifest or sandbox proof.** Exact quotes and individual claim IDs are in the claims table. The required `.factory/claims.json` is absent, so every listed claim is untested from the prescribed sandbox. Add one manifest entry and one observable `@claim:` test per claim, using the demo entry point; delete any claim that cannot be proved.

3. **F-1-19 — The first screen fails the job/reader/action shape and heading semantics.** Exact text: **“A durable table record”** and **“Remember the play, not just the score.”** The first is unexplained marketing language; the second is a slogan. The only h1 is the hidden **“Boardgame Session Notes.”** Make the visible h1 `Record one boardgame session`; add `For game groups who need to settle a rule or remember the setup after the table is cleared.`; put the demo action beside its outcome statement.

4. **F-1-20 — Routing is not real for demo/404, and history misses the focus contract.** Direct `/demo` and `/404` return the normal home UI; `route()` has only privacy and terms cases. Build a `/demo` route, a designed `/404` with a way home, deployment fallback/error configuration, route-specific h1/title/metadata, and popstate focus plus an aria-live announcement.

5. **F-1-05 — Historical free-tier allowance finding remains unfixed.** Exact quote: **“The free edition keeps 3 complete session notes.”** A fresh live test blocked a fourth untitled draft after three untitled drafts. Count only completed notes, or say `3 session notes` everywhere and register a limit test.

6. **F-1-25 — Historical asset response-policy finding remains unfixed.** Live JS still has `max-age=30` rather than immutable caching and the manifest is still `application/octet-stream`. Configure long-lived immutable headers for hashed assets and a manifest MIME type at deployment.

7. **F-1-26 — Historical maskable-icon metadata finding remains unfixed.** The maskable PNG is 616 × 616 but the manifest declares `512x512`. Regenerate a true 512px asset or declare actual dimensions and test the manifest.

### High

8. **F-1-23 — The paid action is a dead link.** **“Buy once · $12”** links directly to a checkout URL that returned HTTP 404. Register the product/checkout route, verify the redirect in an integration test, and keep the action hidden until it succeeds.

9. **F-1-24 — Required metadata and response protection are incomplete.** Live pages have no canonical link, Open Graph/Twitter metadata, CSP, or static host configuration. Add route-specific canonical/OG/Twitter values and product art, plus enforceable CSP/security headers matching same-origin assets.

### Minor

10. **F-1-27 — Required navigation/footer skeleton is incomplete.** The header has no Demo or Privacy navigation, and the footer lacks **Built by Param Factory** and a version/build id. Add the same compact header/footer to every route.

11. **F-1-28 — Core nouns are inconsistent.** Exact examples: **“session note,” “records,” “note,” “sessions,”** and **“table.”** Apply the terminology table and use **session note** for one saved play.

12. **F-1-29 — Several headings/slogans carry no usable information.** Exact examples: **“A durable table record,” “Kept together,” “Keep every game night,”** and **“Your data, in your hands.”** Replace or delete them using the audit's rewrites.

13. **F-1-30 — README has two sentences over the 22-word cap.** The 27-word product description and 24-word audience sentence are listed above. Split them using the supplied rewrites.

14. **F-1-31 — Copy exposes unexplained or inconsistent jargon.** Exact examples: **“score laps,” “IDs,” “IndexedDB,” “JSON,” “PWA,”** and **“CDNs.”** Replace visitor-facing instances with the plain-language alternatives in the audit; retain developer tool names only in setup instructions.

## Missed leverage check

No additional AI, sync, or import feature is required beyond the brief: it expressly prefers a local, game-agnostic record, and backup import/export is already in scope. Adding AI would be decorative. The obvious missing leverage is the required sample demo, not an AI feature.

## What would make this perfect

Ship a genuine, isolated sample session that immediately shows setup, players, a disputed ruling, a score change, outcome, and export; make every factual promise testable from that sandbox; replace the slogan-led first screen with a plain job/audience/action; repair checkout and real routes; then resolve the three acknowledged historical defects. Re-run the full review with no claim, copy, routing, metadata, link, or history exception left.
