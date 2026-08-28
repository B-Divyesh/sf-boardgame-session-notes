import { describe, expect, it, vi } from 'vitest';
import { isAppBackup, isGameSession, newSession, type GameSession } from './types';

describe('session model', () => {
  it('starts with one editable player and local timestamps', () => {
    vi.stubGlobal('crypto', { randomUUID: vi.fn().mockReturnValueOnce('session-id').mockReturnValueOnce('player-id') });
    const session = newSession('Skat');
    expect(session.title).toBe('Skat');
    expect(session.id).toBe('session-id');
    expect(session.participants).toEqual([{ id: 'player-id', name: '', score: '' }]);
    expect(session.complete).toBe(false);
  });

  it('rejects malformed imports', () => {
    expect(isGameSession({ title: 'No ID' })).toBe(false);
    expect(isGameSession({ id: '1', title: 'Game', participants: [], events: [], houseRules: [], updatedAt: 'now' })).toBe(false);
  });

  it('requires complete nested backup records', () => {
    const valid: GameSession = {
      id: 'session-1', title: 'Skat', playedAt: '2026-08-28T19:00', location: 'Kitchen',
      participants: [{ id: 'player-1', name: 'Ana', score: '31' }], startingState: 'Ana starts.',
      houseRules: ['Ties favor the later player'], events: [{ id: 'event-1', time: '19:20', kind: 'rule', note: 'Kept the bridge open.' }],
      outcome: 'Ana won.', complete: true, createdAt: '2026-08-28T19:00:00.000Z', updatedAt: '2026-08-28T21:00:00.000Z'
    };
    const backup = { version: 1, exportedAt: '2026-08-28T00:00:00.000Z', sessions: [valid], snippets: ['Ties favor the later player'] };
    expect(isAppBackup(backup)).toBe(true);
    expect(isAppBackup({ ...backup, sessions: [{ ...valid, participants: [{}] }] })).toBe(false);
    expect(isAppBackup({ ...backup, snippets: [42] })).toBe(false);
  });
});
