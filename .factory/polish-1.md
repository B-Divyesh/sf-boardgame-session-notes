# Polish 1 finding map

All local checks below use the committed production build. Screenshot evidence is in .factory/evidence. Live checks are recorded after deployment in the final section.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-01 | Added one-click /demo and ?demo=1 sample session, banner, reset, start-real, and demo database namespace. | @claim:demo-isolated; demo-390.png |
| F-1-02 | Added no-account claim and request/save proof. | @claim:no-account |
| F-1-03 | Added offline wording and service-worker reload proof. | @claim:offline-reload |
| F-1-04 | Replaced records/account wording with session-note browser wording. | @claim:no-account |
| F-1-05 | Made copy say three session notes, matching the actual allowance. | @claim:three-session-notes |
| F-1-06 | Removed unprovable price and device promises with the dead checkout action. | visible-link crawl and no checkout anchor |
| F-1-07 | Added backup export/restore proof from the sample. | @claim:backup-file |
| F-1-08 | Added matching-identifier merge proof. | @claim:backup-merge |
| F-1-09 | Replaced vague privacy copy with tested browser-storage wording. | @claim:browser-storage |
| F-1-10 | Standardized storage wording. | @claim:browser-storage |
| F-1-11 | Added source/provenance check and linked design record. | @claim:art-provenance |
| F-1-12 | Rewrote README to concrete, tested fields and storage language. | @claim:session-template, @claim:offline-reload |
| F-1-13 | Kept non-goals and proved no lookup/campaign traffic or controls. | @claim:no-rule-lookup |
| F-1-14 | Demonstrated session data in the demo IndexedDB namespace. | @claim:browser-storage |
| F-1-15 | Demonstrated text, print, and backup outcomes. | @claim:exports, @claim:backup-file |
| F-1-16 | Seeded and asserted players, setup, rule, events, scores, and outcome. | @claim:session-template; demo-390.png |
| F-1-17 | Demonstrated saved sample reopen when offline. | @claim:offline-reload |
| F-1-18 | Added 390px, keyboard/focus, reduced-motion, axe, and request checks. | browser suite; axe route scan |
| F-1-19 | Visible h1 now states the job and names the audience/action. | home-390.png |
| F-1-20 | Added real demo/404 states, static fallbacks, focus transfer, and route announcement. | route/accessibility test; 404-desktop.png |
| F-1-21 | Postbuild now creates demo and 404 static entries. | npm run build dist listing |
| F-1-23 | Removed the dead checkout action until the registered endpoint succeeds. | link crawl; no checkout anchor |
| F-1-24 | Added canonical, OG, Twitter, CSP/security config, and social preview. | route metadata test; staticwebapp.config.json |
| F-1-25 | Added immutable asset headers and manifest MIME configuration. | staticwebapp.config.json |
| F-1-26 | Regenerated the maskable icon to 512 × 512. | manifest and image dimension inspection |
| F-1-27 | Added header Demo/Privacy navigation and full footer credit/build information. | home-390.png |
| F-1-28 | Standardized saved-play wording as session note. | copy-audit.md |
| F-1-29 | Removed slogan and mood headings in favor of task headings. | copy-audit.md; home-390.png |
| F-1-30 | Rewrote README lead into short job and audience sentences. | copy-audit.md |
| F-1-31 | Replaced visitor jargon with backup file, browser, and score change. | copy-audit.md |

## Earlier review findings

The malformed-import recovery and desktop contrast fixes were already present and remain covered by src/db.test.ts and the desktop axe scan. The three later historical findings are covered by F-1-05, F-1-25, and F-1-26 above.

## Local result

Fresh-clone npm ci, npm test, npm run build, npm run test:e2e, and all 11 individual claim commands passed. Browser screenshots were reviewed at home-390.png, demo-390.png, and 404-desktop.png.

## Live result

Pending static deployment and cold recheck.
