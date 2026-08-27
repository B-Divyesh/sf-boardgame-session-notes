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
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<GameSession>;
  return typeof item.id === 'string' && typeof item.title === 'string' && Array.isArray(item.participants) && Array.isArray(item.events) && Array.isArray(item.houseRules) && typeof item.updatedAt === 'string';
}
