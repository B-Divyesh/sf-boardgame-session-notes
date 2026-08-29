# Demo sandbox

- **URL:** `/demo` or `/?demo=1`
- **Sample:** one completed Lantern Harbor session note with three players, setup notes, a house rule, a dispute, a score change, scores, and an outcome.
- **Storage:** the demo uses `demo:boardgame-session-notes` for its browser database and `demo:boardgame-session-notes:pending-draft` for an interrupted edit. Saved session notes use separate keys without the `demo:` prefix.
- **Routes:** the sample opens at `/demo`; extra sample notes use `/demo/session/<id>` and survive reloads inside the demo.
- **Reset:** **Reset demo** deletes every demo note and pending edit, then recreates every seeded field.
- **Leave:** **Start for real** deletes the sample and opens `/`. Demo data is never read from or written to saved session notes.

The sample is bundled in `src/types.ts`; no account or setup is needed.
