# Boardgame Session Notes

Boardgame Session Notes is a private, offline-first notebook for one specific play: the starting state, players, house rules, disputes, score changes, setup photo, final scores, and outcome. It is for groups that need to reopen what actually happened after the board has been cleared—or after a game leaves their collection.

The app deliberately does not fetch rule text, connect to BoardGameGeek, automate scoring, or act as a campaign manager. Notes and compressed photos live in IndexedDB on the current device. Users control Markdown, print/PDF, and full JSON backup exports.

Live: <https://boardgame-session-notes.sociobot.in>

## Features

- Complete session template with participants, setup, reusable house rules, event timeline, scores, and outcome
- Local auto-save and offline reopen through an installable PWA
- Markdown receipt and browser print/save-to-PDF receipt for each session
- Full JSON archive export/import for ownership and device migration
- Free archive for three full sessions; $12 one-time Sociobot license unlock for unlimited notes
- Responsive 390px mobile layout, keyboard support, visible focus, reduced motion, and no runtime trackers/CDNs

## Run locally

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

Vite prints the local development URL. The PWA service worker is verified against the production preview rather than dev mode.

## Test and build

```sh
npm test
npm run build
npx playwright install chromium   # first browser-test run only
npm run test:e2e
```

The exact production build command is `npm run build`. It creates `dist/index.html` and static fallbacks for `/privacy/` and `/terms/`.

## Configuration and deployment

The app is a static Vite build. Deploy the contents of `dist/` at the site root. The production billing API is used by default; staging can override it at build time:

```sh
VITE_BILLING_BASE=https://pilot-api.sociobot.in npm run build
```

The factory registers the `boardgame-session-notes` product and return URL. No payment-provider keys or product IDs belong in this repository.

See [`.factory/brief.json`](.factory/brief.json) for scope, [`.factory/design.md`](.factory/design.md) for the visual system and image provenance, and [`.factory/handoff.md`](.factory/handoff.md) for verification results.

## License

MIT. See [`LICENSE`](LICENSE).
