# Polish 1 handoff

## Delivered

- Real demo at /demo and ?demo=1 with a filled Lantern Harbor session note, an isolated demo:boardgame-session-notes database, Reset demo, and Start for real.
- Plain-language first screen, consistent session-note terminology, 11 tested claims, routes for demo, privacy, terms, and a product-styled 404.
- Route titles, descriptions, canonical/OG/Twitter metadata, navigation, footer build information, service-worker precache, host response policy, and a corrected 512px maskable icon.
- A 1200 × 630 social preview derived from the recorded original illustration.
- The dead checkout action is not rendered while the configured product checkout returns no usable route. License restore remains available for a valid existing license; this prevents a dead link.

## Verification

Fresh clone at commit 4e19c5f766c04881e135dcecad1492d5f2ded412:

- npm ci: passed, 0 vulnerabilities.
- npm test: 7 passed.
- npm run build: passed; dist includes index, demo, privacy, terms, 404, service worker, manifest, sitemap, and staticwebapp.config.json.
- npm run test:e2e: 24 passed across 1440px desktop and 390px mobile.
- Every command in .factory/claims.json: passed individually (11 commands, each in both browser projects).
- Playwright axe scans: zero serious or critical violations on home, demo, privacy, terms, and 404.
- The browser suite covers keyboard focus, mobile width, real route titles/canonical metadata, demo isolation, backup merge, request privacy, offline reload, text and print exports, and no-console normal flows.

Evidence screenshots:

- .factory/evidence/home-390.png
- .factory/evidence/demo-390.png
- .factory/evidence/404-desktop.png

Initial built payload: 35,657 bytes JavaScript, 19,200 bytes CSS, 29,486 bytes mobile AVIF hero, and 96,236 bytes social preview.

## Deploy and final live check

Commit and deployment result are added below after the static work-order deploy completes.
