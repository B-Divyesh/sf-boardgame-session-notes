# Review-1 handoff — Boardgame Session Notes

## Result

Completed the requested adversarial first-read review without changing product code. The review is **FAIL** and is recorded in [review-1.md](review-1.md).

## Verified

```sh
npm ci
npm test          # 7/7 passed
npm run build     # passed; dist/ produced
npm run test:e2e  # 8/8 passed
```

The live site was opened in fresh 390px and desktop Chromium contexts. Normal unlicensed initial requests were same-origin only and there were no ordinary console errors. The product has a distinct visual identity and the existing core browser tests pass.

## Review outcome and remaining work

The product is not ready for acceptance. Its first-screen action is not a sample demo; `/demo` and `?demo=1` use the ordinary empty archive and its real IndexedDB namespace, with no banner/reset/start-real controls. The required `.factory/claims.json` and tagged claim tests are absent. The purchase link returns HTTP 404. The review also records first-screen/copy defects, routing and metadata gaps, incomplete navigation/footer, and the three still-unfixed historical findings: draft notes consume the advertised complete-note limit, asset cache/MIME policy remains short/incorrect, and maskable icon dimensions do not match the manifest.

## How to inspect

Read `.factory/review-1.md`; it contains exact quotes, observed live behavior, the complete landing/README copy audit with word counts and rewrites, claim test requirements, historical checks, and concrete fixes.
