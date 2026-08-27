import './styles.css';
import { getSessions, getSnippets, importBackup, putSession, putSnippets, removeSession } from './db';
import { createBackup, downloadText, receiptHtml, safeFilename, sessionMarkdown } from './export';
import { captureLicenseFromUrl, checkoutUrl, hasCachedUnlock, saveLicense, verifyLicense } from './license';
import { newSession, uid, type AppBackup, type GameSession, type SessionEvent } from './types';

const main = document.querySelector<HTMLElement>('#main')!;
const toastRegion = document.querySelector<HTMLElement>('#toast-region')!;
const connectionStatus = document.querySelector<HTMLElement>('#connection-status')!;

let sessions: GameSession[] = [];
let snippets: string[] = [];
let current: GameSession | null = null;
let unlocked = hasCachedUnlock();
let saveTimer: number | undefined;
let search = '';
let deletedForUndo: GameSession | null = null;

const html = (value: string): string => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
const dateLabel = (value: string): string => value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Date not set';

function setDocumentTitle(label?: string): void {
  document.title = label ? `${label} — Boardgame Session Notes` : 'Boardgame Session Notes — offline game-night records';
}

function showToast(message: string, action?: { label: string; run: () => void }): void {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${html(message)}</span>${action ? `<button type="button">${html(action.label)}</button>` : ''}`;
  if (action) toast.querySelector('button')?.addEventListener('click', () => { action.run(); toast.remove(); });
  toastRegion.replaceChildren(toast);
  window.setTimeout(() => toast.remove(), action ? 8000 : 4500);
}

function updateConnection(online = navigator.onLine): void {
  connectionStatus.textContent = online ? 'Online · saving locally' : 'Offline · saving locally';
  connectionStatus.classList.toggle('is-offline', !online);
}

async function checkConnection(): Promise<void> {
  if (!navigator.onLine) { updateConnection(false); return; }
  try {
    const response = await fetch(`/manifest.webmanifest?connectivity-check=${Date.now()}`, { cache: 'no-store' });
    updateConnection(response.ok);
  } catch {
    updateConnection(false);
  }
}

function homeHero(): string {
  return `<section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow"><span></span> A durable table record</p>
      <h2 id="hero-title">Remember the play,<br><em>not just the score.</em></h2>
      <p>Capture the setup, rulings, score laps, and outcome while they’re fresh. No catalog account. No signal required.</p>
      <button class="primary-action" id="new-session" type="button"><span aria-hidden="true">＋</span> Start a session note</button>
    </div>
    <figure class="hero-art">
      <picture>
        <source type="image/avif" srcset="/assets/session-map-768.avif 768w" sizes="(max-width: 760px) 100vw, 52vw">
        <img src="/assets/session-map-768.webp" srcset="/assets/session-map-768.webp 768w, /assets/session-map-1536.webp 1536w" sizes="(max-width: 760px) 100vw, 52vw" width="768" height="512" fetchpriority="high" decoding="async" alt="Abstract paper game path connecting a blank session notebook to setup pieces, events, and a final marker">
      </picture>
      <figcaption>Setup → decisions → result. Kept together.</figcaption>
    </figure>
  </section>`;
}

function archiveRows(filtered: GameSession[]): string {
  if (!sessions.length) return `<div class="empty-state"><div class="empty-glyph" aria-hidden="true"><span></span><span></span><span></span></div><h3>No sessions on this table yet</h3><p>Start with a pasted game title. You can add the rest as the night unfolds.</p><button class="secondary-action" id="empty-new-session" type="button">Create the first note</button></div>`;
  if (!filtered.length) return `<div class="empty-state compact"><h3>No matching notes</h3><p>Try another game title, player, or location.</p></div>`;
  return `<ul class="session-list">${filtered.map((session) => {
    const players = session.participants.filter((p) => p.name).map((p) => p.name).join(', ') || 'No players named';
    return `<li><button class="session-row" type="button" data-open-session="${session.id}"><span class="session-state ${session.complete ? 'complete' : ''}" aria-hidden="true"></span><span class="session-row-main"><strong>${html(session.title || 'Untitled session')}</strong><span>${html(players)}</span></span><span class="session-row-meta"><time datetime="${html(session.playedAt)}">${html(dateLabel(session.playedAt))}</time><small>${session.complete ? 'Complete' : 'In progress'}</small></span><span class="row-arrow" aria-hidden="true">↗</span></button></li>`;
  }).join('')}</ul>`;
}

function paidPanel(): string {
  return `<aside class="unlock-panel" aria-labelledby="unlock-title">
    <div><p class="eyebrow"><span></span>${unlocked ? 'Full archive unlocked' : 'Keep every game night'}</p><h3 id="unlock-title">${unlocked ? 'Unlimited notes are active' : 'Unlock unlimited sessions'}</h3><p>${unlocked ? 'This device can create unlimited notes. Exports always remain yours.' : 'The free edition keeps 3 complete session notes. A $12 one-time purchase unlocks unlimited notes on every licensed device.'}</p></div>
    ${unlocked ? '<span class="license-badge">License active</span>' : `<div class="unlock-actions"><a class="primary-action" href="${checkoutUrl()}">Buy once · $12</a><button class="text-button" id="restore-license" type="button">Restore a license</button></div>`}
  </aside>`;
}

function dataTools(): string {
  return `<dialog id="data-dialog" aria-labelledby="data-title"><form method="dialog" class="dialog-close"><button type="submit" aria-label="Close data tools">×</button></form><div class="dialog-content"><p class="eyebrow"><span></span>Local archive</p><h2 id="data-title">Your data, in your hands</h2><p>Download every note and reusable rule as a JSON backup, or restore a backup into this device. Imported notes with matching IDs are updated; other notes stay intact.</p><div class="dialog-actions"><button class="secondary-action" id="export-backup" type="button">Export full backup</button><label class="file-action">Import backup<input id="import-backup" type="file" accept="application/json,.json"></label></div><p class="form-help" id="import-status" aria-live="polite"></p></div></dialog>`;
}

function renderHome(): void {
  current = null;
  setDocumentTitle();
  const query = search.trim().toLowerCase();
  const filtered = sessions.filter((session) => !query || [session.title, session.location, ...session.participants.map((p) => p.name)].join(' ').toLowerCase().includes(query));
  main.innerHTML = `${homeHero()}<section class="archive" aria-labelledby="archive-title"><div class="section-heading"><div><p class="eyebrow"><span></span>On this device</p><h2 id="archive-title">Session archive</h2><p>${sessions.length} ${sessions.length === 1 ? 'record' : 'records'} · saved without an account</p></div><label class="search-field"><span class="sr-only">Search sessions</span><input id="session-search" type="search" value="${html(search)}" placeholder="Search sessions"><i aria-hidden="true">⌕</i></label></div>${archiveRows(filtered)}</section>${paidPanel()}${dataTools()}`;
}

function participantRows(session: GameSession): string {
  return session.participants.map((person, index) => `<div class="participant-row" data-person="${person.id}"><span class="player-number" aria-hidden="true">${index + 1}</span><label><span>Player ${index + 1}</span><input data-person-field="name" value="${html(person.name)}" autocomplete="name" placeholder="Name"></label><label class="score-field"><span>Final score</span><input data-person-field="score" value="${html(person.score)}" inputmode="decimal" placeholder="—"></label>${session.participants.length > 1 ? `<button class="icon-button" type="button" data-remove-person="${person.id}" aria-label="Remove player ${index + 1}">×</button>` : ''}</div>`).join('');
}

function timeline(session: GameSession): string {
  if (!session.events.length) return `<div class="timeline-empty"><span aria-hidden="true"></span><p>No events yet. Add rulings, disputes, or score changes as they happen.</p></div>`;
  return `<ol class="timeline">${session.events.map((event, index) => `<li><span class="timeline-node" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><div><p><time>${html(event.time || 'Time not noted')}</time><span class="event-kind">${html(event.kind)}</span></p><p>${html(event.note)}</p></div><button class="icon-button" type="button" data-remove-event="${event.id}" aria-label="Remove timeline event ${index + 1}">×</button></li>`).join('')}</ol>`;
}

function renderEditor(focusId?: string): void {
  if (!current) return;
  setDocumentTitle(current.title || 'New session');
  const session = current;
  const ruleItems = session.houseRules.length ? `<ul class="rule-list">${session.houseRules.map((rule, index) => `<li><span>${html(rule)}</span><button class="icon-button" type="button" data-remove-rule="${index}" aria-label="Remove house rule">×</button></li>`).join('')}</ul>` : '<p class="subtle-empty">No house rules attached to this play.</p>';
  const snippetOptions = snippets.filter((snippet) => !session.houseRules.includes(snippet)).map((snippet) => `<option value="${html(snippet)}">${html(snippet)}</option>`).join('');
  main.innerHTML = `<div class="editor-shell">
    <nav class="editor-top" aria-label="Session controls"><button class="text-button back-button" id="back-home" type="button">← All sessions</button><span id="save-status" class="save-status" role="status">Saved on this device</span><div><button class="secondary-action compact-button" id="export-markdown" type="button">Export Markdown</button><button class="secondary-action compact-button" id="print-receipt" type="button">Print / save PDF</button></div></nav>
    <header class="note-heading"><div><p class="eyebrow"><span></span>${session.complete ? 'Completed record' : 'Live session note'}</p><label for="game-title">Game title</label><input id="game-title" data-session-field="title" value="${html(session.title)}" placeholder="Paste or type a game title" required aria-describedby="title-help"><p id="title-help">No catalog lookup—this title stays with the note.</p></div><button id="toggle-complete" class="status-stamp ${session.complete ? 'complete' : ''}" type="button"><span aria-hidden="true">${session.complete ? '✓' : '○'}</span>${session.complete ? 'Marked complete' : 'Mark complete'}</button></header>
    <div class="note-grid">
      <section class="note-section basics" aria-labelledby="basics-title"><div class="section-index" aria-hidden="true">01</div><div class="section-content"><div class="section-title"><p>Before the first move</p><h2 id="basics-title">The table</h2></div><div class="two-fields"><label>Played at<input type="datetime-local" data-session-field="playedAt" value="${html(session.playedAt)}"></label><label>Location<input data-session-field="location" value="${html(session.location)}" placeholder="Kitchen table, club…"></label></div><fieldset><legend>Players and final scores</legend><div id="participants">${participantRows(session)}</div><button class="text-button add-button" id="add-player" type="button">＋ Add another player</button></fieldset></div></section>
      <section class="note-section setup" aria-labelledby="setup-title"><div class="section-index" aria-hidden="true">02</div><div class="section-content"><div class="section-title"><p>Freeze what memory loses</p><h2 id="setup-title">Starting state</h2></div><label>Setup notes<textarea data-session-field="startingState" rows="5" placeholder="Who started, factions or colors, unusual setup, initial hand details…">${html(session.startingState)}</textarea></label><div class="photo-control">${session.photo ? `<figure><img src="${session.photo}" alt="Saved pre-play setup"><figcaption>Pre-play photo · stored only on this device</figcaption></figure>` : `<div class="photo-placeholder" aria-hidden="true"><span>◎</span><i></i><i></i></div>`}<div><label class="file-action">${session.photo ? 'Replace setup photo' : 'Add setup photo'}<input id="setup-photo" type="file" accept="image/*" capture="environment"></label>${session.photo ? '<button class="text-button danger-text" id="remove-photo" type="button">Remove photo</button>' : ''}<p>Compressed before local storage. It is included in printed receipts, never uploaded by this app.</p></div></div></div></section>
      <section class="note-section rules" aria-labelledby="rules-title"><div class="section-index" aria-hidden="true">03</div><div class="section-content"><div class="section-title"><p>Decisions worth repeating</p><h2 id="rules-title">House rules</h2></div>${ruleItems}<form id="add-rule-form" class="inline-add"><label><span>Add a rule or ruling</span><input id="new-rule" required placeholder="e.g. Ties favor the later player"></label><button class="secondary-action" type="submit">Add rule</button></form>${snippetOptions ? `<label class="snippet-select">Reuse a saved rule<select id="snippet-choice"><option value="">Choose a saved rule…</option>${snippetOptions}</select></label>` : '<p class="form-help">Rules added here become reusable in later sessions.</p>'}</div></section>
      <section class="note-section events" aria-labelledby="events-title"><div class="section-index" aria-hidden="true">04</div><div class="section-content"><div class="section-title"><p>What changed, in order</p><h2 id="events-title">Event timeline</h2></div>${timeline(session)}<form id="add-event-form" class="event-form"><label><span>Time</span><input id="event-time" type="time"></label><label><span>Kind</span><select id="event-kind"><option value="note">Note</option><option value="dispute">Dispute</option><option value="rule">Ruling</option><option value="score">Score change</option></select></label><label class="event-note"><span>What happened</span><input id="event-note" required placeholder="Record the decision while it’s fresh"></label><button class="secondary-action" type="submit">Add event</button></form></div></section>
      <section class="note-section outcome" aria-labelledby="outcome-title"><div class="section-index" aria-hidden="true">05</div><div class="section-content"><div class="section-title"><p>Leave the table with an answer</p><h2 id="outcome-title">Outcome</h2></div><label>Result and next-time notes<textarea data-session-field="outcome" rows="5" placeholder="Winner, final result, unresolved questions, or what to remember next time…">${html(session.outcome)}</textarea></label><div class="finish-row"><button id="finish-session" class="primary-action" type="button">${session.complete ? 'Save completed record' : 'Finish this session'}</button><button id="delete-session" class="text-button danger-text" type="button">Delete this note</button></div></div></section>
    </div>
  </div>`;
  if (focusId) requestAnimationFrame(() => document.querySelector<HTMLElement>(focusId)?.focus());
}

function syncEditor(): void {
  if (!current) return;
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-session-field]').forEach((input) => {
    const key = input.dataset.sessionField as keyof Pick<GameSession, 'title' | 'playedAt' | 'location' | 'startingState' | 'outcome'>;
    current![key] = input.value;
  });
  document.querySelectorAll<HTMLElement>('[data-person]').forEach((row) => {
    const person = current!.participants.find((item) => item.id === row.dataset.person);
    if (!person) return;
    row.querySelectorAll<HTMLInputElement>('[data-person-field]').forEach((input) => {
      if (input.dataset.personField === 'name') person.name = input.value;
      if (input.dataset.personField === 'score') person.score = input.value;
    });
  });
}

async function saveCurrent(immediate = false): Promise<void> {
  if (!current) return;
  syncEditor();
  current.updatedAt = new Date().toISOString();
  const status = document.querySelector('#save-status');
  if (status) status.textContent = 'Saving…';
  const operation = async () => {
    if (!current) return;
    try {
      await putSession(current);
      const index = sessions.findIndex((item) => item.id === current!.id);
      if (index >= 0) sessions[index] = structuredClone(current);
      else sessions.unshift(structuredClone(current));
      sessions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      if (status) status.textContent = navigator.onLine ? 'Saved on this device' : 'Saved offline on this device';
    } catch {
      if (status) status.textContent = 'Could not save — export a backup';
      showToast('This change could not be saved. Your browser may be out of storage.');
    }
  };
  if (saveTimer) window.clearTimeout(saveTimer);
  if (immediate) await operation();
  else saveTimer = window.setTimeout(operation, 450);
}

function canCreateSession(): boolean {
  if (unlocked || sessions.length < 3) return true;
  document.querySelector<HTMLElement>('#unlock-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast('The free archive holds 3 sessions. Export is always available; unlock to add more.');
  return false;
}

async function createSession(): Promise<void> {
  if (!canCreateSession()) return;
  current = newSession();
  await putSession(current);
  sessions.unshift(structuredClone(current));
  renderEditor('#game-title');
}

function openSession(id: string): void {
  const found = sessions.find((session) => session.id === id);
  if (!found) return;
  current = structuredClone(found);
  renderEditor();
}

function legalPage(type: 'privacy' | 'terms'): void {
  current = null;
  const privacy = type === 'privacy';
  setDocumentTitle(privacy ? 'Privacy' : 'Terms');
  main.innerHTML = `<article class="legal"><a href="/" data-route class="text-button">← Back to the archive</a><p class="eyebrow"><span></span>Plain-language ${privacy ? 'privacy' : 'terms'}</p><h2>${privacy ? 'Your notes stay yours.' : 'Terms of use'}</h2>${privacy ? `<p class="lede">Boardgame Session Notes is local-first. Creating a note does not send its title, players, photos, scores, or events to us.</p><h3>Data stored on your device</h3><p>Your sessions, rule snippets, and setup photos are stored in your browser’s IndexedDB. A license token and cached verification result are stored in localStorage. Clearing site data removes these records, so export backups you care about.</p><h3>Network requests</h3><p>The app makes no analytics or advertising requests. It may check for app updates. If you buy or verify a license, your browser contacts the Sociobot billing API; Sociobot/Dodo acts as merchant of record and handles payment information under its own policies. Your session content is never included.</p><h3>Your choices</h3><p>You control Markdown, print/PDF, and JSON exports. Setup photos appear only in print/PDF receipts you initiate. We do not have a server copy to restore.</p>` : `<p class="lede">Use the app to keep private notes about games you play. Do not use it to republish copyrighted rulebooks, game art, or content you do not have permission to store.</p><h3>The app and your records</h3><p>The software is provided as-is under the MIT License. You are responsible for keeping backups. The app does not promise cloud recovery because your session records are intentionally stored only on your device.</p><h3>One-time unlock</h3><p>The $12 one-time license unlocks unlimited saved sessions for this product. Checkout is hosted by Sociobot/Dodo, the merchant of record. Refunds are handled there; a refunded or revoked license stops unlocking paid features. Core exports, accessibility, and access to existing notes remain available without an active license.</p><h3>Fair use</h3><p>Do not interfere with the service, bypass licensing controls, or use the app unlawfully. These terms may be updated for future releases; the date below identifies this version.</p>`}<p class="legal-date">Effective 27 August 2026</p></article>`;
}

function route(path = location.pathname): void {
  if (path.startsWith('/privacy')) legalPage('privacy');
  else if (path.startsWith('/terms')) legalPage('terms');
  else renderHome();
}

function openDataDialog(): void {
  if (!document.querySelector('#data-dialog')) {
    history.pushState({}, '', '/');
    renderHome();
  }
  document.querySelector<HTMLDialogElement>('#data-dialog')?.showModal();
}

async function shrinkImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file.');
  if (file.size > 20_000_000) throw new Error('Choose a photo smaller than 20 MB.');
  const source = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(source.width, source.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(source.width * scale);
  canvas.height = Math.round(source.height * scale);
  canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height);
  source.close();
  return canvas.toDataURL('image/jpeg', 0.78);
}

main.addEventListener('input', (event) => {
  const target = event.target as HTMLInputElement;
  if (target.id === 'session-search') { search = target.value; const filtered = sessions.filter((s) => [s.title, s.location, ...s.participants.map((p) => p.name)].join(' ').toLowerCase().includes(search.toLowerCase())); const list = document.querySelector('.session-list, .empty-state'); if (list) list.outerHTML = archiveRows(filtered); return; }
  if (target.matches('[data-session-field], [data-person-field]')) void saveCurrent();
});

main.addEventListener('change', async (event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  if (target.id === 'snippet-choice' && current && target.value) { syncEditor(); current.houseRules.push(target.value); await saveCurrent(true); renderEditor(); }
  if (target.id === 'setup-photo' && current && target instanceof HTMLInputElement && target.files?.[0]) {
    try { syncEditor(); target.disabled = true; current.photo = await shrinkImage(target.files[0]); await saveCurrent(true); renderEditor(); showToast('Setup photo saved on this device.'); }
    catch (error) { showToast(error instanceof Error ? error.message : 'The photo could not be added.'); target.disabled = false; }
  }
  if (target.id === 'import-backup' && target instanceof HTMLInputElement && target.files?.[0]) {
    const status = document.querySelector('#import-status');
    try { const backup = JSON.parse(await target.files[0].text()) as AppBackup; await importBackup(backup); sessions = await getSessions(); snippets = await getSnippets(); if (status) status.textContent = `Imported ${backup.sessions.length} sessions.`; showToast('Backup imported successfully.'); }
    catch (error) { if (status) status.textContent = error instanceof Error ? error.message : 'The backup could not be read.'; }
  }
});

main.addEventListener('submit', async (event) => {
  const form = event.target as HTMLFormElement;
  if (form.id === 'add-rule-form' && current) {
    event.preventDefault(); syncEditor();
    const input = form.querySelector<HTMLInputElement>('#new-rule')!;
    const rule = input.value.trim();
    if (!rule) return;
    current.houseRules.push(rule);
    if (!snippets.includes(rule)) { snippets.push(rule); await putSnippets(snippets); }
    await saveCurrent(true); renderEditor('#new-rule');
  }
  if (form.id === 'add-event-form' && current) {
    event.preventDefault(); syncEditor();
    const note = form.querySelector<HTMLInputElement>('#event-note')!.value.trim();
    if (!note) return;
    const item: SessionEvent = { id: uid(), time: form.querySelector<HTMLInputElement>('#event-time')!.value, kind: form.querySelector<HTMLSelectElement>('#event-kind')!.value as SessionEvent['kind'], note };
    current.events.push(item);
    await saveCurrent(true); renderEditor('#event-note');
  }
});

main.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest<HTMLElement>('button, [data-open-session]');
  if (!button) return;
  if (button.id === 'new-session' || button.id === 'empty-new-session') await createSession();
  else if (button.dataset.openSession) openSession(button.dataset.openSession);
  else if (button.id === 'back-home') { await saveCurrent(true); history.pushState({}, '', '/'); renderHome(); }
  else if (button.id === 'add-player' && current) { syncEditor(); current.participants.push({ id: uid(), name: '', score: '' }); await saveCurrent(true); renderEditor(`[data-person="${current.participants.at(-1)!.id}"] input`); }
  else if (button.dataset.removePerson && current) { syncEditor(); current.participants = current.participants.filter((p) => p.id !== button.dataset.removePerson); await saveCurrent(true); renderEditor(); }
  else if (button.dataset.removeRule && current) { syncEditor(); current.houseRules.splice(Number(button.dataset.removeRule), 1); await saveCurrent(true); renderEditor(); }
  else if (button.dataset.removeEvent && current) { syncEditor(); current.events = current.events.filter((item) => item.id !== button.dataset.removeEvent); await saveCurrent(true); renderEditor(); }
  else if (button.id === 'remove-photo' && current) { syncEditor(); current.photo = undefined; await saveCurrent(true); renderEditor(); showToast('Setup photo removed.'); }
  else if ((button.id === 'toggle-complete' || button.id === 'finish-session') && current) { syncEditor(); if (!current.title.trim()) { document.querySelector<HTMLInputElement>('#game-title')?.focus(); showToast('Add a game title before finishing the record.'); return; } current.complete = button.id === 'finish-session' ? true : !current.complete; await saveCurrent(true); renderEditor(); showToast(current.complete ? 'Session marked complete.' : 'Session reopened.'); }
  else if (button.id === 'export-markdown' && current) { syncEditor(); await saveCurrent(true); downloadText(safeFilename(current.title), sessionMarkdown(current)); showToast('Markdown receipt downloaded.'); }
  else if (button.id === 'print-receipt' && current) { syncEditor(); await saveCurrent(true); const popup = window.open('', '_blank'); if (!popup) { showToast('Allow pop-ups to print this receipt.'); return; } popup.document.write(receiptHtml(current)); popup.document.close(); popup.opener = null; popup.addEventListener('load', () => popup.print()); }
  else if (button.id === 'delete-session' && current) { syncEditor(); const label = current.title || 'this untitled note'; if (!confirm(`Delete “${label}” from this device? You can undo for a few seconds.`)) return; deletedForUndo = structuredClone(current); await removeSession(current.id); sessions = sessions.filter((item) => item.id !== current!.id); history.pushState({}, '', '/'); renderHome(); showToast('Session deleted from this device.', { label: 'Undo', run: async () => { if (!deletedForUndo) return; await putSession(deletedForUndo); sessions.unshift(deletedForUndo); deletedForUndo = null; renderHome(); } }); }
  else if (button.id === 'restore-license') { const dialog = document.createElement('dialog'); dialog.className = 'license-dialog'; dialog.innerHTML = `<form method="dialog" class="dialog-close"><button aria-label="Close license restore">×</button></form><form id="license-form" class="dialog-content"><p class="eyebrow"><span></span>Move devices</p><h2>Restore your purchase</h2><label>License token<input id="license-token" required autocomplete="off" spellcheck="false"></label><p class="form-help" id="license-status" aria-live="polite">Paste the complete token from your purchase email.</p><button class="primary-action" type="submit">Verify license</button></form>`; document.body.append(dialog); dialog.showModal(); dialog.querySelector('form#license-form')?.addEventListener('submit', async (submitEvent) => { submitEvent.preventDefault(); const token = dialog.querySelector<HTMLInputElement>('#license-token')!.value.trim(); const status = dialog.querySelector('#license-status')!; if (!token) return; saveLicense(token); status.textContent = 'Checking…'; const valid = await verifyLicense(true); if (valid) { unlocked = true; dialog.close(); dialog.remove(); renderHome(); showToast('Unlimited sessions unlocked.'); } else if (valid === null) status.textContent = 'Could not reach the license service. Check your connection and try again.'; else status.textContent = 'That license is not active for this product. Check the full token and try again.'; }); dialog.addEventListener('close', () => dialog.remove(), { once: true }); }
  else if (button.id === 'export-backup') { const backup = createBackup(sessions, snippets); downloadText(`session-notes-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(backup, null, 2), 'application/json'); showToast('Full backup downloaded.'); }
});

document.addEventListener('click', (event) => {
  const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-route]');
  if (!link || link.origin !== location.origin) return;
  event.preventDefault();
  history.pushState({}, '', link.pathname);
  route(link.pathname);
  main.focus();
});

document.querySelector('#open-data-tools')?.addEventListener('click', openDataDialog);
window.addEventListener('popstate', () => route());
window.addEventListener('online', () => void checkConnection());
window.addEventListener('offline', () => updateConnection(false));

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
let installPrompt: InstallPrompt | null = null;
const installButton = document.querySelector<HTMLButtonElement>('#install-app')!;
window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); installPrompt = event as InstallPrompt; installButton.hidden = false; });
installButton.addEventListener('click', async () => { if (!installPrompt) return; await installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; installButton.hidden = true; });

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) showToast('A new app version is ready.', { label: 'Reload', run: () => location.reload() }); });
    });
  } catch { showToast('Offline support could not be installed in this browser.'); }
}

async function initialize(): Promise<void> {
  void checkConnection();
  if (captureLicenseFromUrl()) { unlocked = true; showToast('Purchase restored. Unlimited sessions are ready.'); }
  main.innerHTML = '<div class="loading-state"><span aria-hidden="true"></span><p>Opening your local archive…</p></div>';
  try {
    [sessions, snippets] = await Promise.all([getSessions(), getSnippets()]);
    route();
  } catch (error) {
    main.innerHTML = `<section class="error-state"><p class="eyebrow"><span></span>Local storage unavailable</p><h2>Your archive could not open.</h2><p>${html(error instanceof Error ? error.message : 'This browser blocked local storage.')}</p><p>Check private-browsing or storage settings, then reload. No data was sent anywhere.</p><button class="primary-action" type="button" onclick="location.reload()">Try again</button></section>`;
  }
  document.body.classList.add('app-ready');
  const valid = await verifyLicense();
  if (valid !== null && valid !== unlocked) { unlocked = valid; if (!valid) showToast('This license is no longer active. Existing notes and exports remain available.'); if (location.pathname === '/') renderHome(); }
  void registerServiceWorker();
}

void initialize();
