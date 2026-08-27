import { describe, expect, it } from 'vitest';
import { createBackup, safeFilename, sessionMarkdown } from './export';
import type { GameSession } from './types';

const sample: GameSession = {
  id: 'session-1',
  title: 'Forest Council',
  playedAt: '2026-08-27T19:30',
  location: 'Kitchen table',
  participants: [
    { id: 'p1', name: 'Mara', score: '42' },
    { id: 'p2', name: 'Theo', score: '38' }
  ],
  startingState: 'Mara starts. Theo uses blue.',
  houseRules: ['Ties favor the later player'],
  events: [{ id: 'e1', time: '20:15', kind: 'dispute', note: 'Agreed the token stays.' }],
  outcome: 'Mara won. Recheck the end trigger next time.',
  complete: true,
  createdAt: '2026-08-27T19:00:00.000Z',
  updatedAt: '2026-08-27T21:00:00.000Z'
};

describe('session receipts', () => {
  it('includes the state, ruling, timeline, players, and outcome', () => {
    const receipt = sessionMarkdown(sample);
    expect(receipt).toContain('# Forest Council — session receipt');
    expect(receipt).toContain('Mara starts');
    expect(receipt).toContain('Ties favor');
    expect(receipt).toContain('Agreed the token stays');
    expect(receipt).toContain('| Mara | 42 |');
    expect(receipt).toContain('Mara won');
  });

  it('creates a portable filename', () => {
    expect(safeFilename('  My Game: Night #2 ')).toBe('my-game-night-2-receipt.md');
  });

  it('creates a versioned full backup', () => {
    const backup = createBackup([sample], ['Ties favor the later player']);
    expect(backup.version).toBe(1);
    expect(backup.sessions).toHaveLength(1);
    expect(backup.snippets).toEqual(['Ties favor the later player']);
  });
});
