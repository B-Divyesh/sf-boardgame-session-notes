# Boardgame Session Notes — verification handoff

## Verification status: FAIL

Candidate `e24d7af10374e0c97fb3fe719a1f9df7ecaf4f15` was independently verified on 2026-08-28 against <https://boardgame-session-notes.sociobot.in>. The live assets byte-match the candidate, so this is not a deployment-only failure.

Do **not** release: (1) a structurally malformed but accepted JSON backup persists and then causes the next application load to show `Cannot read properties of undefined (reading 'replace')` / “Local storage unavailable”, leaving the archive inaccessible with no UI recovery; (2) fresh desktop editor axe finds a serious WCAG AA contrast violation for the five visible section indices (`#7c817d` on `#f5f0e5`, 3.49:1). Full evidence, passed checks, response-policy observations, and remediation are in [`.factory/verification.md`](verification.md).

## Verification commands and results

```sh
npm ci
npm test             # 5/5 passed
npm run build        # passed; dist/ produced
npm run test:e2e     # 3/3 passed after matching Chromium installation
```

Independent production checks passed for normal end-to-end capture/export/reopen, desktop and 390px layout, keyboard skip link/focus, reduced motion, local-only unlicensed requests, service-worker offline reload, update toast, exact live artifact hashes, and Lighthouse (97 performance / 100 accessibility / 100 best practices / 100 SEO on the homepage). These passes do not override the two blockers.

## What must happen next

Validate nested backup data before database writes and retain a usable recovery path; correct the desktop contrast and add desktop axe coverage; then run the complete verification report again on a new candidate/deploy.

---

# Original build handoff (superseded by FAIL verification)

## What shipped

- Complete local-first session notebook for game title/date/location, participants, pre-play notes and compressed photo, reusable house rules, timestamped events/disputes/score changes, final scores, outcome, and complete/in-progress state.
- IndexedDB persistence with visible auto-save status; archive search, specific delete confirmation, and an 8-second undo.
- User-controlled Markdown receipt, printable/save-to-PDF receipt (including the setup photo), plus complete versioned JSON backup and restore.
- Installable PWA manifest and icons, versioned app-shell service worker, build-generated hashed asset precache, navigation fallback, offline status, and update notification.
- Free tier with three complete saved sessions. The $12 one-time unlock uses only the Sociobot billing checkout and license verification contract, supports return-token capture and paste-to-restore, caches verification for 24 hours, and never blocks first paint. Existing notes and all export/accessibility features remain ungated.
- `/privacy/` and `/terms/` static entry points, responsive 390px interface, keyboard/focus treatment, reduced-motion fallback, empty/loading/error/offline states, and original product-specific visual system.

## Visual assets

The generative table-map hero was generated with `/opt/fleet/lib/gen-image.sh` using the factory image deployment, visually checked for text/brand/copyright artifacts, and optimized to 29 KB AVIF / 41 KB mobile WebP / 231 KB large WebP. Source PNG and prompt sidecars are in `assets/src/`; complete provenance and the visual system are in `.factory/design.md`.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Build output is exactly `dist/`, with `dist/index.html` at its root and static route entry points under `dist/privacy/` and `dist/terms/`.

Verification on 2026-08-27:

- Unit tests: 5/5 passed.
- Playwright mobile (390 × 844): end-to-end create/edit/complete/reopen passed; offline reload passed with `context.setOffline(true)`; homepage, editor, and privacy page had no serious or critical axe WCAG A/AA violations; no console errors in the core journey.
- Production build: passed. Initial application JS 31.23 KB (11.02 KB gzip); CSS 17.90 KB (5.00 KB gzip); mobile hero AVIF 29 KB.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100. LCP 1.6 s, total blocking time 90 ms, CLS 0.003.
- Manual screenshot review: 1440px desktop and 390px mobile homepage/editor; content stacks intentionally on mobile and no horizontal clipping was observed.

## Known gaps and next steps

- The factory must register the product/return URL with Sociobot billing before purchases can complete. `VITE_BILLING_BASE` can point staging builds at `https://pilot-api.sociobot.in`; production defaults to `https://api.sociobot.in`. There are no embedded provider keys or product IDs.
- PDF delivery uses the browser’s native Print / Save as PDF dialog so no document content is sent to a server.
- Records are deliberately device-local. The JSON backup is the recovery/migration mechanism; there is no cloud account or sync.
- Validate the billing return flow once the factory-created test product exists, then perform a final production-domain service-worker smoke test after deployment.
