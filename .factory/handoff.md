# Polish 3 handoff

## Result

Perfection-loop round 3 closes every finding from reviews 1–3 and both earlier verification reports. The product remains a static local-first PWA with its teal felt, clipped ledger paper, score-path art, and compact mobile editor.

The high-risk changes are real behavior changes: pending edits survive immediate navigation/reload/close, each saved note has a direct route, print uses a CSP-safe stylesheet, reset cannot replay a late save, and all previously shallow claim tests now assert their complete sandbox outcomes.

Production: <https://boardgame-session-notes.sociobot.in>

Successful work-order deployment: `c870c88c-25fa-43a8-9424-335d8169b017`

Product repair/config commits: `7373235c4dfa3159be925bf8288796ab1057556d`, `770f8a6b76a57a59e49fc8780a75712c259c3c59`

## What changed

- Added `/session/<id>` and `/demo/session/<id>` routes with direct-load restoration, browser history, route titles/canonicals, polite announcements, and h1 focus.
- Added an isolated synchronous pending-draft layer plus ordered IndexedDB flushing for every exit path.
- Replaced inline print styling with `/print.css`; print waits for load and includes stored setup photos.
- Expanded demo Reset to cancel late writes and restore every seeded field without touching saved notes.
- Restored backups into a truly empty second context and proved saved rulings; added setup-photo, rule-reuse, and navigation-save claims.
- Enlarged the remaining mobile privacy link and now measures every visible interactive target.
- Removed all remaining vague `decisions` wording and aligned sitemap URLs with canonical URLs.
- Updated README, demo notes, claim manifest, copy audit, catalog description, PWA cache version, live verifier, and this evidence record.

`.factory/polish-3.md` maps every historical finding id to its repair and exact proof.

## Verification

Clean clone `/tmp/boardgame-session-notes-polish3.QyAZ8g`:

- `npm ci` — 71 packages, 0 vulnerabilities.
- `npm test` — 8/8 passed.
- `npm run build` — passed; `dist/index.html` produced.
- `npm run test:e2e` — 34/34 passed across desktop Chromium and Pixel 5 at 390 × 844.
- All 15 literal claim commands ran separately — 15/15 commands and 30/30 project executions passed.
- Initial JavaScript: 35.41 kB (11.55 kB gzip). CSS: 19.99 kB (5.40 kB gzip).
- Playwright axe WCAG 2 A/AA scans — no serious/critical findings on all public routes and the editor in both projects.

Production after deployment:

- `node scripts/live-check.mjs https://boardgame-session-notes.sociobot.in` — passed save/navigation, routed reload/focus, demo isolation/reset, fresh backup restore, photo print, ruling reuse, touch, sitemap/canonical, 404, console, and byte-identity checks.
- `/opt/fleet/lib/verify-url.sh` — 200, 670 ms, one h1, `lang=en`, `<main>`, no missing alt, no unlabeled buttons, zero home console errors.
- Lighthouse mobile — Performance 98, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.3 s, TBT 50 ms, CLS 0.085.
- Headers — enforceable CSP with `frame-ancestors 'none'`, nosniff, Referrer Policy, Permissions Policy, immutable hashed assets, and `application/manifest+json`.
- Routes — `/`, `/demo`, `/?demo=1`, `/demo/`, `/privacy`, `/privacy/`, `/terms`, `/terms/`, `/offline.html`, and `/print.css` return 200; unknown URLs return 404.

Evidence is in `.factory/evidence/polish-3/`, including cold mobile home/demo/session/404 screenshots, live verifier output, and Lighthouse JSON.

## Run

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Run any claim exactly as listed in `.factory/claims.json`. Serve `dist/` with `npm run preview -- --port 4173`.

## Known gaps

No unresolved product or review gaps were found. Paid controls remain intentionally absent because no working Sociobot product route is available; no paid promise is shown.
