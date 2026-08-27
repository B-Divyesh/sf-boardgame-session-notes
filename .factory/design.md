# Boardgame Session Notes — visual thesis

## Direction: generative table geometry

The interface treats a remembered play like a map drawn across a table: routes, score pips, player tokens, and ruled paper align into an irregular but deliberate geometry. It should feel like opening a thoughtfully kept game-night ledger, not browsing a game catalog. Decorative geometry only appears where it explains the product—connecting “setup” to “what happened” to “result”—and never impersonates a specific game or uses game art.

## Palette

- **Felt / background** `#132D2A`: the deep green-blue of a well-used card table, used for the app frame.
- **Paper / surface** `#F5F0E5`: warm archival stock, used for readable working areas.
- **Ink / text** `#17211F`: nearly black green, 14.2:1 on paper.
- **Graphite / muted** `#59635F`: 5.7:1 on paper.
- **Persimmon / accent** `#E15C3A`: a decisive game-piece orange; dark ink is used on it for contrast.
- **Marigold / highlight** `#F2BE4B`: active routes and “current” markers.
- **Success** `#27725E`, **warning** `#8A5A10`, **danger** `#A33A35`.
- Dark treatment uses felt as the explicit outer canvas and paper surfaces for all long-form text; it is intentionally a single-mode, table-at-night composition rather than an OS theme toggle.

All interactive outlines and text pairings meet WCAG AA. Color is always paired with a label, icon, or shape.

## Type

- **Display:** Georgia, Cambria, serif. Its editorial, ledger-like shapes make session titles feel worth keeping.
- **Utility/body:** Inter-style system stack (`ui-sans-serif, system-ui, sans-serif`) for fast, familiar form entry with no font download.
- Scale: 14 / 16 / 20 / 26 / 40 / 56 px. Body is 16px minimum, leading 1.55; scores use tabular figures.

## Spacing and shape

An 8px base rhythm with 4px for tight label relationships: 4, 8, 12, 16, 24, 32, 48, 64. Surfaces use clipped or chamfered corners (not generic rounded cards), 1px graphite rules, and small circular “pips” for metadata. Content is capped at 1180px and form copy at 72 characters. Touch targets are at least 44px.

## Interaction grammar

- The archive is the stable table; opening a note slides its paper sheet from the selected row's direction.
- Primary actions are filled persimmon lozenges; secondary actions are ink-outlined. Destructive actions require a named confirmation and offer a short undo where possible.
- Timeline events sit on a single drawn route; adding an event advances the route and briefly emphasizes only the new node.
- Auto-save is visible as plain status copy. Offline is a normal state (“Offline · saved on this device”), never an error.
- On phones, archive and editor do not squeeze side by side: the archive becomes a full view and the editor replaces it, with a clearly labeled “All sessions” return action.

## Motion

UI transitions run 180–240ms using opacity and transform only, with physical origin. No looping animation. With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are disabled and state changes are instantaneous; hierarchy remains through scale, line, and contrast.

## Original asset plan and provenance

One wide hero illustration depicts an abstract session record assembling itself on dark table felt: layered paper planes, score paths, pips, and neutral wooden pieces. It carries no rules, game names, logos, characters, or legible text. Hand-authored SVG icons and PWA marks extend the same geometry; they are original and MIT-licensed with the app.

### Prompt sheet

- **Use case:** stylized-concept
- **Subject/world:** an abstract boardgame night remembered as a precise archival map; a blank cream note sheet, small unlabeled wooden tokens, score pips, and a continuous route joining setup, event, and result
- **Medium/materials:** dimensional paper cutout, screen-printed ink, matte wood, subtle recycled-paper fibers
- **Composition:** wide 3:2 editorial still life, angled top-down, central paper path with negative space and no cropped focal objects
- **Light/lens:** warm raking table light, long restrained shadows, orthographic-like 50mm clarity
- **Palette words:** deep teal felt, warm cream paper, persimmon orange, marigold yellow, charcoal ink
- **Negative list:** no text, no watermark, no logos, no recognizable branded game, no cards with faces or suits, no people/hands, no dice pips that imply a game outcome, no glossy plastic, no neon gradients

Generated with the factory image model (`factory-image`, Azure OpenAI image generation) on 2026-08-27. The final prompt is stored at `assets/src/session-map.json`; source PNG is retained at `assets/src/session-map.png`. Generated imagery is original to this product and disclosed in the footer.
