# Review 4 handoff

## Result

Adversarial first-read review 4 is complete. The verdict is **FAIL** with two blocking findings and two minor findings. No product code was changed.

The first screen, one-click demo, sandbox isolation, all listed claims, the main route structure, live privacy behavior, and the distinct visual system pass. The remaining blockers are keyboard focus loss after editor mutations and the standalone offline route's missing metadata and shared header/footer.

See `.factory/review-4.md` for the complete copy audit, claim results, historical finding-by-finding verification, evidence, and concrete fixes.

## Verification performed

- Fresh production Chromium contexts at 390 × 844 and 1440 × 900.
- Production demo with a real-data sentinel, Reset demo, Start for real, IndexedDB inspection, offline reload, request-content logging, and console logging.
- Clean clone `/tmp/boardgame-review4.UWVTPX/clone` at `4b88dbc052e9a40eb825c65b5744307bc8f1e7e6`.
- `npm ci` — passed, 0 vulnerabilities.
- `npm test` — 8/8 passed.
- `npm run build` — passed and produced `dist/`; initial JS 35.41 kB, 11.55 kB gzip.
- `npm run test:e2e` — 34/34 passed across desktop and 390px projects.
- All 15 literal claim commands — 15/15 commands and 30/30 browser executions passed.
- `/opt/fleet/lib/verify-url.sh` — passed production with zero console errors.
- Live link/status/metadata/header crawl and local/live byte comparison — completed.

Evidence is in `.factory/evidence/review-4/`.

## Remaining work

- Preserve logical keyboard focus after completion changes and player/ruling/event removal; add post-action focus tests.
- Rename the completed-state action so it states the result and exposes state consistently.
- Add description/canonical/social/favicon metadata plus the shared header/footer to `/offline.html`; assert them in route tests.
- Rename the offline action from **“Try the app again”** to **“Open session notes.”**

After those repairs, rerun the full suite and every claim command before another review.
