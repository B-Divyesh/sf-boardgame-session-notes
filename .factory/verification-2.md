# Independent verification report — PASS

**Work order:** `boardgame-session-notes-verify-2`  
**Candidate:** `db8f584fed8c3880ef7595e3dd499b1be67c4994`  
**Production URL:** <https://boardgame-session-notes.sociobot.in>  
**Verified:** 2026-08-28 UTC

## Verdict

**PASS.** The deployed PWA is exactly the requested candidate and satisfies the researched brief's local session-record job: a group can capture setup, players/scores, reusable rules, an event/dispute timeline, outcome, and a pre-play photo; reopen it after refresh/offline; and take a user-controlled Markdown, printable/PDF, or full JSON backup export. The prior malformed-import and desktop-contrast release blockers are fixed on both the candidate and production.

This verification began from a clean worktree at the candidate SHA and a fresh `npm ci`; no product code was changed.

## Local quality gates

```sh
npm ci
npm test
npm run build
npx playwright test --project=desktop-chromium --workers=1
npx playwright test --project=mobile-chromium --workers=1
```

- `npm ci`: 72 packages, 0 vulnerabilities.
- `npm test`: 7/7 passed in 3 files.
- `npm run build`: passed (`tsc -b && vite build && node scripts/postbuild.mjs`) and produced `dist/` including `/privacy/` and `/terms/` static entries.
- Browser suite: 8/8 passed (4/4 desktop 1440 x 900; 4/4 mobile 390 x 844). This is the exact Playwright suite behind `npm run test:e2e`, run by project to remain within the verifier command wall-time limit.
- There is no separate lint command. Type checking is part of the production build.
- Initial JS is 32,007 bytes (11.18 KB gzip) and CSS is 17,923 bytes (5.00 KB gzip), within the static-PWA 200 KB/50 KB budgets. The mobile AVIF is 29,486 bytes; the large WebP is 236,534 bytes.

## Independent product exercise

- On live desktop, created a session, verified the missing-title recovery (focus returned to the title and the error was announced), entered player/score, starting state, reusable house rule, dispute event, and outcome, completed it, returned to the archive, and reopened the persisted note. Existing browser coverage also verifies Markdown receipt content, printable/PDF route, and JSON backup export.
- Invalid photo input (`text/plain`) was rejected with `Choose an image file.` without changing the record.
- A structurally incomplete backup containing `participants: [{}]` was rejected with `This file is not a valid Session Notes backup.`; after reload the existing archive item remained visible and no storage-failure screen appeared. This confirms the import is validated before writes and is recoverable.
- Desktop and 390px mobile had no horizontal overflow. First Tab exposed the skip link (3px marigold focus outline); Enter moved focus to `main`. Reduced-motion computed `scroll-behavior: auto` and `animation-duration: 0.01ms` at both sizes.
- Fresh live axe WCAG 2 A/AA scans had zero serious/critical findings on home and editor at desktop and mobile, and on `/privacy/` and `/terms/`.
- No console or page errors occurred in normal, invalid-input, persistence, offline, or accessibility exercises.

## PWA, privacy, and production identity

- Live service worker is controlling `/sw.js`, uses the `session-notes-shell-v1` cache, and a 390px offline reload displayed the archive plus `Offline · saving locally` with no page errors. The resulting cache contained the HTML shell, JS, CSS, manifest, icons, and responsive images.
- Service-worker update behavior was independently exercised against an in-memory server serving the exact built `dist/`: after only the worker cache version changed, `registration.update()` produced the in-app `A new app version is ready. Reload` notice.
- Manifest has standalone display, a versioned start URL, matching theme/background colors, and normal 192/512 plus maskable icons. Fresh storage used IndexedDB `boardgame-session-notes`; unlicensed local storage was empty.
- Unlicensed live request capture saw only `https://boardgame-session-notes.sociobot.in` (document, assets, manifest connectivity check, and service-worker precache). Static inspection confirms no analytics, trackers, third-party fonts, CDNs, or session-data transport. The only external endpoint in code is the documented Sociobot license verification call, conditional on a stored license token.
- All files in local `dist/` hash-identically to their production URL, including HTML, assets, worker, offline page, manifest, icons, privacy, terms, robots, and sitemap. `index.html` SHA-256 is `f049258b2fedf22ecda7115e0d0fd1025c526ea7f25687422b962f782eae025b`; JS is `8e235d4c0736ed167628ed08cd6366645ca9f2f40cad502c060324e884cff97b`; CSS is `323f348eee1ca326a64301b3a6f284fabdbad89e60628592d1a2ed768710f03d`.
- Production headers supplied HTTPS, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`.
- Fresh Lighthouse 13.0.1 mobile on production: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 998 ms, LCP 1,149 ms, TBT 134 ms, CLS 0.0029.

## Non-blocking defects / follow-up

### Low — free-tier copy says "3 complete session notes", implementation counts drafts

The unlock panel says the free edition keeps **3 complete** session notes. In a fresh profile, creating three untitled/in-progress drafts and returning to the archive prevented a fourth draft; the UI reported `The free archive holds 3 sessions.` The data is not lost, but incomplete notes consume the stated completed-note allowance. Either count `sessions.filter(session => session.complete)` for the limit or change all copy/docs to say three notes regardless of completion.

### Low — deployment response policy is functional but below the stated ideal

Production serves hashed JS/CSS/assets with `Cache-Control: public, must-revalidate, max-age=30`, not long-lived immutable caching, and sends `manifest.webmanifest` as `application/octet-stream`. The installed service worker precache and offline tests pass, so this is not a release blocker; adjust the static-host policy when deployment configuration is available.

### Low — maskable icon metadata does not match the raster dimensions

`icon-512-maskable.png` is 616 x 616 but the manifest declares `sizes: "512x512"`. The normal 512 icon and 192 icon match their declarations and installation/offline checks work. Regenerate or declare the maskable icon's actual dimensions for accurate manifest metadata.

## Scope notes

- The candidate differs from the prior repair commit only in `.factory/handoff.md`; nevertheless the complete application and deployment were freshly verified because the requested candidate is the deployed state.
- The original failure report remains in [`.factory/verification.md`](verification.md). This report supersedes it for candidate `db8f584fed8c3880ef7595e3dd499b1be67c4994`.
