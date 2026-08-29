# Review 3 handoff

## Result

Adversarial first-read review 3 is recorded in `.factory/review-3.md` with verdict **FAIL**: 10 findings remain, including nine blocking findings. No product code was changed.

The cold first screen and isolated demo pass. The highest-risk defect is reproducible note data loss when a visitor types while **Saving…** and immediately uses header navigation. Other blockers cover the print popup's CSP violation, missing editor deep links/focus, one 19 px mobile link, incomplete claim tests, unlisted photo/rule-reuse claims, and regressed vague copy.

## Verification performed

Clean clone: `/tmp/boardgame-review3.sVKqXJ/clone` at `4be985c8822b28cea9de281c2a0bce53b6befe96`.

- `npm ci` — 0 vulnerabilities.
- `npm test` — 7 passed.
- `npm run build` — passed; `dist/` produced; initial JS 32.72 kB (10.83 kB gzip).
- Every command in `.factory/claims.json` ran separately — 12 commands, 24 browser executions passed mechanically.
- `npm run test:e2e` — 26 passed across desktop and mobile.
- Playwright axe integration — no serious/critical result in the repository route scan.
- `/opt/fleet/lib/verify-url.sh` against production — passed home checks (200, title/lang/main/h1/alt/buttons/console).
- Live HTML/JS/CSS SHA-256 values match the clean build.
- Live fresh-context checks covered 390 px and desktop cold reads, demo reset/isolation, real-data sentinel, offline reload, request logging, IndexedDB names, print popup, route history/focus, metadata, link crawl, 404 status, and touch target bounds.

## Known gaps / next steps

Use `.factory/review-3.md` as the exact repair list. In particular, add regression tests for immediate navigation while saving and for popup CSP/computed styles before treating the currently green suite as release proof. After repairs, rerun the whole review rather than only the changed checks.
