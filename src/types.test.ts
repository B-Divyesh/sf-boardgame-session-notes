import { describe, expect, it, vi } from 'vitest';
import { isGameSession, newSession } from './types';

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
    expect(isGameSession({ id: '1', title: 'Game', participants: [], events: [], houseRules: [], updatedAt: 'now' })).toBe(true);
  });
});
