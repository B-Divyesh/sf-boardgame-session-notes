import type { AppBackup, GameSession } from './types';

const clean = (value: string): string => value.trim() || '—';

export function sessionMarkdown(session: GameSession): string {
  const date = session.playedAt ? new Date(session.playedAt).toLocaleString() : 'Date not recorded';
  const participants = session.participants.filter((person) => person.name.trim());
  const scores = participants.map((person) => `| ${person.name.replaceAll('|', '\\|')} | ${clean(person.score).replaceAll('|', '\\|')} |`).join('\n');
  const events = session.events.map((event) => `- **${event.time || 'Time not noted'} · ${event.kind}:** ${clean(event.note)}`).join('\n');
  const rules = session.houseRules.map((rule) => `- ${rule}`).join('\n');
  return `# ${clean(session.title)} — session receipt

**Played:** ${date}  
**Location:** ${clean(session.location)}  
**Status:** ${session.complete ? 'Complete' : 'In progress'}

## Starting state

${clean(session.startingState)}

## House rules used

${rules || '—'}

## Timeline

${events || '—'}

## Final scores

| Player | Score |
| --- | ---: |
${scores || '| — | — |'}

## Outcome

${clean(session.outcome)}

---
Created locally with Boardgame Session Notes. The pre-play photo remains in the app and is not embedded in this Markdown receipt.
`;
}

export function downloadText(filename: string, text: string, type = 'text/markdown'): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([text], { type }));
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export function safeFilename(title: string): string {
  return (title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'session') + '-receipt.md';
}

export function createBackup(sessions: GameSession[], snippets: string[]): AppBackup {
  return { version: 1, exportedAt: new Date().toISOString(), sessions, snippets };
}

export function receiptHtml(session: GameSession): string {
  const text = (value: string): string => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char);
  const list = (values: string[]): string => values.length ? `<ul>${values.map((value) => `<li>${text(value)}</li>`).join('')}</ul>` : '<p>—</p>';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${text(session.title || 'Session')} receipt</title><style>@page{margin:18mm}body{font:11pt/1.5 system-ui;color:#17211f;max-width:720px;margin:auto}h1,h2{font-family:Georgia,serif}header{border-bottom:4px solid #e15c3a}table{border-collapse:collapse;width:100%}td,th{padding:8px;border-bottom:1px solid #bbb;text-align:left}th:last-child,td:last-child{text-align:right}.event{border-left:3px solid #f2be4b;padding-left:12px}img{max-width:100%;max-height:280px;object-fit:contain}</style></head><body><header><p>Boardgame Session Notes</p><h1>${text(session.title || 'Untitled session')}</h1><p>${text(new Date(session.playedAt).toLocaleString())}${session.location ? ` · ${text(session.location)}` : ''}</p></header><h2>Starting state</h2><p>${text(session.startingState || '—').replaceAll('\n', '<br>')}</p>${session.photo ? `<img src="${session.photo}" alt="Pre-play setup">` : ''}<h2>House rules used</h2>${list(session.houseRules)}<h2>Timeline</h2>${session.events.length ? session.events.map((event) => `<p class="event"><b>${text(event.time || '—')} · ${text(event.kind)}</b><br>${text(event.note)}</p>`).join('') : '<p>—</p>'}<h2>Final scores</h2><table><thead><tr><th>Player</th><th>Score</th></tr></thead><tbody>${session.participants.filter((p) => p.name).map((p) => `<tr><td>${text(p.name)}</td><td>${text(p.score || '—')}</td></tr>`).join('') || '<tr><td>—</td><td>—</td></tr>'}</tbody></table><h2>Outcome</h2><p>${text(session.outcome || '—').replaceAll('\n', '<br>')}</p></body></html>`;
}
