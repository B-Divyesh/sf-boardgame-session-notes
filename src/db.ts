import type { AppBackup, GameSession } from './types';
import { isGameSession } from './types';

const DB_NAME = 'boardgame-session-notes';
const VERSION = 1;
const SESSIONS = 'sessions';
const SETTINGS = 'settings';

let database: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (database) return database;
  database = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      const sessions = db.createObjectStore(SESSIONS, { keyPath: 'id' });
      sessions.createIndex('updatedAt', 'updatedAt');
      db.createObjectStore(SETTINGS, { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open local storage'));
    request.onblocked = () => reject(new Error('Close other tabs to update local storage, then reload.'));
  });
  return database;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Local storage request failed'));
  });
}

export async function getSessions(): Promise<GameSession[]> {
  const db = await openDatabase();
  const items = await requestResult(db.transaction(SESSIONS).objectStore(SESSIONS).getAll()) as GameSession[];
  return items.filter(isGameSession).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function putSession(session: GameSession): Promise<void> {
  const db = await openDatabase();
  await requestResult(db.transaction(SESSIONS, 'readwrite').objectStore(SESSIONS).put(session));
}

export async function removeSession(id: string): Promise<void> {
  const db = await openDatabase();
  await requestResult(db.transaction(SESSIONS, 'readwrite').objectStore(SESSIONS).delete(id));
}

export async function getSnippets(): Promise<string[]> {
  const db = await openDatabase();
  const result = await requestResult(db.transaction(SETTINGS).objectStore(SETTINGS).get('snippets')) as { key: string; value: string[] } | undefined;
  return Array.isArray(result?.value) ? result.value.filter((item) => typeof item === 'string') : [];
}

export async function putSnippets(snippets: string[]): Promise<void> {
  const db = await openDatabase();
  await requestResult(db.transaction(SETTINGS, 'readwrite').objectStore(SETTINGS).put({ key: 'snippets', value: snippets }));
}

export async function importBackup(backup: AppBackup): Promise<void> {
  if (backup.version !== 1 || !Array.isArray(backup.sessions) || !backup.sessions.every(isGameSession) || !Array.isArray(backup.snippets)) {
    throw new Error('This file is not a valid Session Notes backup.');
  }
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction([SESSIONS, SETTINGS], 'readwrite');
    const sessions = transaction.objectStore(SESSIONS);
    backup.sessions.forEach((session) => sessions.put(session));
    transaction.objectStore(SETTINGS).put({ key: 'snippets', value: backup.snippets });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('The backup could not be imported.'));
  });
}
