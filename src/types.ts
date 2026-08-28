export type Participant = { id: string; name: string; score: string };
export type SessionEvent = { id: string; time: string; kind: 'note' | 'dispute' | 'score' | 'rule'; note: string };

export type GameSession = {
  id: string;
  title: string;
  playedAt: string;
  location: string;
  participants: Participant[];
  startingState: string;
  photo?: string;
  houseRules: string[];
  events: SessionEvent[];
  outcome: string;
  complete: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AppBackup = {
  version: 1;
  exportedAt: string;
  sessions: GameSession[];
  snippets: string[];
};

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

function isParticipant(value: unknown): value is Participant {
  return isRecord(value) && typeof value.id === 'string' && typeof value.name === 'string' && typeof value.score === 'string';
}

function isSessionEvent(value: unknown): value is SessionEvent {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.time === 'string'
    && typeof value.note === 'string'
    && (value.kind === 'note' || value.kind === 'dispute' || value.kind === 'score' || value.kind === 'rule');
}

export const uid = (): string => crypto.randomUUID();

export function newSession(title = ''): GameSession {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
  return {
    id: uid(),
    title,
    playedAt: local,
    location: '',
    participants: [{ id: uid(), name: '', score: '' }],
    startingState: '',
    houseRules: [],
    events: [],
    outcome: '',
    complete: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}

/** A realistic, deterministic record for the isolated demo database. */
export function sampleSession(): GameSession {
  return {
    id: 'demo-lantern-harbor',
    title: 'Lantern Harbor',
    playedAt: '2026-08-22T19:30',
    location: 'Mina\'s kitchen table',
    participants: [
      { id: 'demo-mina', name: 'Mina', score: '42' },
      { id: 'demo-jo', name: 'Jo', score: '38' },
      { id: 'demo-sam', name: 'Sam', score: '35' }
    ],
    startingState: 'Mina chose orange and started. We used the harbor-market setup from last month.',
    houseRules: ['Ties go to the player who placed the later marker.'],
    events: [
      { id: 'demo-event-1', time: '20:12', kind: 'dispute', note: 'We agreed the lighthouse bonus may be scored after a trade.' },
      { id: 'demo-event-2', time: '21:05', kind: 'score', note: 'Mina gained 8 points for the completed harbor route.' }
    ],
    outcome: 'Mina won by 4 points. Next time, check the lighthouse timing before the first trade.',
    complete: true,
    createdAt: '2026-08-22T19:25:00.000Z',
    updatedAt: '2026-08-22T21:31:00.000Z'
  };
}

export function isGameSession(value: unknown): value is GameSession {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.title === 'string'
    && typeof value.playedAt === 'string'
    && typeof value.location === 'string'
    && Array.isArray(value.participants) && value.participants.every(isParticipant)
    && typeof value.startingState === 'string'
    && (value.photo === undefined || typeof value.photo === 'string')
    && Array.isArray(value.houseRules) && value.houseRules.every((rule) => typeof rule === 'string')
    && Array.isArray(value.events) && value.events.every(isSessionEvent)
    && typeof value.outcome === 'string'
    && typeof value.complete === 'boolean'
    && typeof value.createdAt === 'string'
    && typeof value.updatedAt === 'string';
}

export function isAppBackup(value: unknown): value is AppBackup {
  if (!isRecord(value)) return false;
  return value.version === 1
    && typeof value.exportedAt === 'string'
    && Array.isArray(value.sessions) && value.sessions.every(isGameSession)
    && Array.isArray(value.snippets) && value.snippets.every((snippet) => typeof snippet === 'string');
}
