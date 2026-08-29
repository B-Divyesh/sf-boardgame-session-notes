# Demo sandbox

- **URL:** /demo or /?demo=1
- **Sample:** one completed Lantern Harbor session note with three players, setup notes, a house rule, a dispute, a score change, scores, and an outcome.
- **Storage:** the demo uses the separate `demo:boardgame-session-notes` IndexedDB namespace. Saved session notes use `boardgame-session-notes`.
- **Reset:** **Reset demo** deletes the demo database and recreates the sample.
- **Leave:** **Start for real** deletes the sample and opens `/`. Demo data is never read from or written to saved session notes.

The sample is bundled in src/types.ts; no account, API, or setup is needed.
