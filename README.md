# Boardgame Session Notes

Record one boardgame session in this browser.

For game groups who need to reopen a play after the board is cleared.

## What it records

- Players, setup notes, house rules, events, scores, and an outcome
- A text receipt, a printable receipt, and a backup file
- Session notes that reopen offline after the first visit

It does not look up rules, automate scoring, or manage campaigns.

## Try the sample

Open the [demo](https://boardgame-session-notes.sociobot.in/demo) or add ?demo=1 to the home URL. It opens a filled sample session note in the demo browser database. Reset demo replaces that sample. Start for real deletes the demo database before opening the real archive.

## Run and verify

Requires Node.js 22 or later.

Run: npm ci, npm run dev, npm test, npm run build, and npm run test:e2e.
The production build is dist/. Browser tests use the production preview so they also verify the service worker.

## Deploy

Deploy dist/ as a static site. staticwebapp.config.json supplies the route fallback, 404 page, security headers, manifest MIME type, and immutable hashed-asset policy.

See [Privacy](https://boardgame-session-notes.sociobot.in/privacy), [Terms](https://boardgame-session-notes.sociobot.in/terms), [the product brief](.factory/brief.json), and [the handoff](.factory/handoff.md).

## License

MIT. See [LICENSE](LICENSE).
