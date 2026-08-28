# Demo sandbox

- **URL:** /demo or /?demo=1
- **Sample:** one completed Lantern Harbor session note with three players, setup notes, a house rule, a dispute, a score change, scores, and an outcome.
- **Storage:** the demo uses IndexedDB database demo:boardgame-session-notes. The real archive uses boardgame-session-notes.
- **Reset:** **Reset demo** deletes the demo database and recreates the sample.
- **Leave:** **Start for real** deletes the demo database and opens /. Demo data is never read from or written to the real archive.

The sample is bundled in src/types.ts; no account, API, or setup is needed.
