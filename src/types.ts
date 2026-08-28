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
