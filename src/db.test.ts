import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { getSessions, importBackup, putSession } from './db';
import { newSession, type AppBackup } from './types';

describe('backup imports', () => {
  it('rejects a structurally incomplete backup without changing the archive', async () => {
    const existing = newSession('Existing session');
    await putSession(existing);

    const malformed = {
      version: 1,
      exportedAt: 'now',
      snippets: [],
      sessions: [{ id: 'malformed', title: 'Broken import', participants: [{}], events: [], houseRules: [], updatedAt: 'now' }]
    } as unknown as AppBackup;

    await expect(importBackup(malformed)).rejects.toThrow('This file is not a valid Session Notes backup.');
    await expect(getSessions()).resolves.toEqual([existing]);
  });
});
