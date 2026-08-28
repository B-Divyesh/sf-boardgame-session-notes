# Verification report — FAIL

**Work order:** `boardgame-session-notes-verify-1`  
**Candidate:** `e24d7af10374e0c97fb3fe719a1f9df7ecaf4f15` (`main`)  
**Production URL:** <https://boardgame-session-notes.sociobot.in>  
**Verified:** 2026-08-28 UTC

## Verdict

**FAIL — do not release this candidate.** The core session flow is functional, but two release-blocking defects remain: a malformed backup can brick the local archive with no in-product recovery, and the desktop editor has a serious WCAG AA contrast violation. This fails the acceptance contract's invalid-input/recovery and accessibility requirements.

## Release blockers

### High — malformed JSON backup is accepted, then makes the archive inaccessible

`isGameSession` only checks that `participants`, `events`, and `houseRules` are arrays. A file with this otherwise accepted session was imported through the UI:

```json
{
  "version": 1,
  "exportedAt": "now",
  "snippets": [],
  "sessions": [{
    "id": "malformed",
    "title": "Broken import",
    "participants": [{}],
    "events": [],
    "houseRules": [],
    "updatedAt": "now"
  }]
}
```

The UI reported `Imported 1 sessions.`. On reload, initialization caught `Cannot read properties of undefined (reading 'replace')` and replaced the application with the misleading “Local storage unavailable” error state. Existing local records are consequently inaccessible and there is no in-product route to remove the bad record or restore a corrected backup. This is a data-recovery failure caused by invalid user input, not an unavailable storage condition.

### High — serious desktop WCAG AA contrast violation

Fresh axe 4.13.0 against the live desktop editor reports one serious `color-contrast` violation with five affected section indices (`01`–`05`): foreground `#7c817d` on `#f5f0e5` is **3.49:1**, below the required **4.5:1** for 18px normal text. The mobile-only repository axe test misses it because `.section-index` is hidden at 390px. This directly violates the stated contrast and “no serious/critical axe findings” gate.

## Passed checks

### Clean local candidate

- Clean checkout at the stated SHA; `npm ci` completed with 0 audited vulnerabilities.
- `npm test`: **5/5 passed**.
- Exact production command `npm run build`: passed (`tsc -b && vite build && node scripts/postbuild.mjs`), producing `dist/`.
- `npm run test:e2e`: **3/3 passed** after installing the matching Chromium binary: mobile create/edit/complete/reopen, mobile axe coverage, and offline reload.
- No lint script exists. Type checking is part of the successful production build.
- Initial assets are within budget: JS 31,219 bytes (11.02 KB gzip), CSS 17,885 bytes (5.00 KB gzip), mobile AVIF hero 29,486 bytes; no downloaded font assets.

### Independent product exercise

- Desktop normal flow: created “River Council <test>”; saved title, location, two players/scores, starting state, reusable rule, dispute event, outcome; exported Markdown receipt (contained title, score, rule, and event); completed, returned to archive, reopened with data preserved; exported JSON backup with session and snippet.
- Boundaries and recovery: missing title when finishing focuses `#game-title` and announces `Add a game title before finishing the record.`; invalid `{}` backup is rejected with `This file is not a valid Session Notes backup.`; the free three-record boundary reports its unlock message and keeps three records. The structurally incomplete backup above is the failed recovery path.
- Desktop 1440px and mobile 390px had no horizontal overflow (scroll width equals viewport width). Mobile reduced-motion computed `scroll-behavior: auto` and animation duration `0.01ms`.
- Keyboard fresh-load smoke: first Tab reached the visible skip link (`3px` marigold focus outline); Enter moved focus to `main`.
- Browser console/page errors: none during normal local and live desktop flow. The expected `ERR_INTERNET_DISCONNECTED` browser resource error was observed only after explicitly taking the live mobile context offline.

### Live deployment and PWA

- Live `index.html` SHA-256 equals candidate output: `9b98cee38ebbf3029fdb309352715f62efd4427d93c015136cdb0111a611c30e`.
- Live SHA-256 also matched candidate output for the hashed JS/CSS, three hero variants, service worker, manifest, offline page, and all three PNG/SVG icons. The deployment therefore represents this candidate; no evidence supports a deployment-only mismatch.
- Live desktop: service worker controlled the page at `/sw.js`; normal session save completed locally; no session-content outbound requests; live homepage/privacy axe had zero serious/critical findings, while editor has the blocker above.
- Live 390px: service-worker-controlled offline reload passed with the archive and `Offline · saving locally` visible.
- Update behavior was independently simulated against an unmodified temporary copy of `dist/`: changing only the service-worker cache version, calling `registration.update()`, and observing `A new app version is ready. Reload`; no errors.
- Manifest contains standalone display, versioned start URL, 192/512/maskable icons, and matching theme/background colors.

### Privacy, policy, and performance

- Request capture on normal unlicensed live/local use found only same-origin application, manifest/connectivity, asset, and service-worker requests; static inspection found no analytics, advertising, third-party fonts, CDN scripts, or session-content network transport. The only conditional external endpoint is the documented Sociobot license verification URL, invoked only when a token exists.
- Local data implementation uses IndexedDB for sessions/snippets and localStorage only for a license token/verdict. Privacy and terms routes load and state these boundaries.
- Fresh Lighthouse 13.4.1 mobile run against production: **Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP 1,127 ms; TBT 193 ms; CLS 0.0029.** (Lighthouse home-page accessibility does not exercise the editor defect.)

## Non-blocking deployment observations

- Live hashed JS/CSS and other static resources use `Cache-Control: public, must-revalidate, max-age=30`, rather than long-lived immutable cache directives requested for hashed PWA assets. The service worker precache mitigates repeat/offline use, but deployment caching does not meet the stated optimal cache policy.
- Live responses have HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`; they do not send CSP, frame-ancestors/X-Frame-Options, or Permissions-Policy. The manifest is served as `application/octet-stream` rather than a manifest/JSON MIME type.

## Required remediation and re-verification

1. Strictly validate every nested participant, event, house-rule, and required scalar before committing an import; reject the entire file atomically on any mismatch. Preserve/recover existing records and make an invalid import leave the UI unchanged.
2. Raise desktop section-index contrast to at least 4.5:1 (or remove the text) and add desktop axe coverage to CI.
3. Re-run the complete clean build, desktop and mobile axe checks, malformed-import recovery test, offline reload/update test, and live hash comparison after a new candidate deploys.
