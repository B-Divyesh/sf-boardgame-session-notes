import "./styles.css";
import {
  clearCurrentStorage,
  getSessions,
  getSnippets,
  importBackup,
  putSession,
  putSnippets,
  removeSession,
  setStorageNamespace,
} from "./db";
import {
  createBackup,
  downloadText,
  receiptHtml,
  safeFilename,
  sessionMarkdown,
} from "./export";
import {
  isGameSession,
  newSession,
  sampleSession,
  uid,
  type AppBackup,
  type GameSession,
  type SessionEvent,
} from "./types";

const main = document.querySelector<HTMLElement>("#main")!;
const toastRegion = document.querySelector<HTMLElement>("#toast-region")!;
const connectionStatus =
  document.querySelector<HTMLElement>("#connection-status")!;
const demoBanner = document.querySelector<HTMLElement>("#demo-banner")!;
const routeAnnouncement = document.querySelector<HTMLElement>(
  "#route-announcement",
)!;
const siteUrl = "https://boardgame-session-notes.sociobot.in";
const realDatabaseName = "boardgame-session-notes";

document.querySelector<HTMLElement>("#build-id")!.textContent =
  `build ${__BUILD_ID__}`;

let sessions: GameSession[] = [];
let snippets: string[] = [];
let current: GameSession | null = null;
let saveTimer: number | undefined;
let saveChain: Promise<void> = Promise.resolve();
let search = "";
let deletedForUndo: GameSession | null = null;

const normalizedPath = (path: string): string =>
  path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
const isDemoPath = (path: string): boolean =>
  normalizedPath(path) === "/demo" ||
  normalizedPath(path).startsWith("/demo/session/");
const sessionIdFromPath = (path: string, demo: boolean): string | null => {
  const match = normalizedPath(path).match(
    demo ? /^\/demo\/session\/([^/]+)$/ : /^\/session\/([^/]+)$/,
  );
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
};
const wantsDemoAt = (url: URL): boolean =>
  isDemoPath(url.pathname) || url.searchParams.get("demo") === "1";
let demoMode = wantsDemoAt(new URL(location.href));

setStorageNamespace(demoMode);

const html = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ] ?? character,
  );
const dateLabel = (value: string): string =>
  value
    ? new Date(value).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Date not set";
const notePath = (id: string): string =>
  `${demoMode ? "/demo" : ""}/session/${encodeURIComponent(id)}`;
const listPath = (): string => (demoMode ? "/demo" : "/");
const draftKey = (): string =>
  `${demoMode ? "demo:" : ""}${realDatabaseName}:pending-draft`;

function setMeta(selector: string, value: string): void {
  document.head
    .querySelector<HTMLMetaElement>(selector)
    ?.setAttribute("content", value);
}

function pageTitle(label: string): string {
  if (label === "Home")
    return "Boardgame Session Notes — record one boardgame session";
  const maximumLabelLength = 33;
  const shortLabel =
    label.length > maximumLabelLength
      ? `${label.slice(0, maximumLabelLength - 1)}…`
      : label;
  return `${shortLabel} — Boardgame Session Notes`;
}

function setPage(label: string, description: string, path: string): void {
  document.title = pageTitle(label);
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', document.title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:url"]', `${siteUrl}${path}`);
  setMeta('meta[name="twitter:title"]', document.title);
  setMeta('meta[name="twitter:description"]', description);
  document.head
    .querySelector<HTMLLinkElement>('link[rel="canonical"]')
    ?.setAttribute("href", `${siteUrl}${path}`);
}

function announceRoute(message: string, focus = false): void {
  routeAnnouncement.textContent = "";
  requestAnimationFrame(() => {
    routeAnnouncement.textContent = message;
  });
  if (focus)
    requestAnimationFrame(() => main.querySelector<HTMLElement>("h1")?.focus());
}

function showToast(
  message: string,
  action?: { label: string; run: () => void | Promise<void> },
): void {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>${html(message)}</span>${action ? `<button type="button">${html(action.label)}</button>` : ""}`;
  if (action)
    toast.querySelector("button")?.addEventListener("click", () => {
      void action.run();
      toast.remove();
    });
  toastRegion.replaceChildren(toast);
  window.setTimeout(() => toast.remove(), action ? 8000 : 4500);
}

function updateConnection(online = navigator.onLine): void {
  connectionStatus.textContent = online
    ? "Online · saved in this browser"
    : "Offline · saved in this browser";
  connectionStatus.classList.toggle("is-offline", !online);
}

async function checkConnection(): Promise<void> {
  if (!navigator.onLine) return updateConnection(false);
  try {
    const response = await fetch(
      `/manifest.webmanifest?connectivity-check=${Date.now()}`,
      { cache: "no-store" },
    );
    await response.text();
    updateConnection(response.ok);
  } catch {
    updateConnection(false);
  }
}

function renderDemoBanner(): void {
  demoBanner.hidden = !demoMode;
  demoBanner.innerHTML = demoMode
    ? '<span>Demo — sample data, nothing is saved</span><span><button id="reset-demo" type="button">Reset demo</button><button id="start-real" type="button">Start for real</button></span>'
    : "";
}

function homeHero(): string {
  return `<section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow"><span></span>Private session notes</p><h1 id="hero-title" tabindex="-1">Record one boardgame session</h1><p>For game groups who need to settle a rule or remember the setup after the table is cleared.</p><div class="hero-actions"><a class="primary-action" href="/demo" data-route>Try it with sample data</a><span>See a filled session note.</span></div><p class="plain-facts">No account is required.<br>Works offline after the first visit.<br>Session notes stay in this browser on this device.</p><button class="text-button start-real-button" id="new-session" type="button">Start a blank session note</button></div><figure class="hero-art"><picture><source type="image/avif" srcset="/assets/session-map-768.avif 768w" sizes="(max-width: 760px) 100vw, 52vw"><img src="/assets/session-map-768.webp" srcset="/assets/session-map-768.webp 768w, /assets/session-map-1536.webp 1536w" sizes="(max-width: 760px) 100vw, 52vw" width="768" height="512" fetchpriority="high" decoding="async" alt="Abstract paper game path connecting setup, events, and a final result"></picture><figcaption>Setup → rulings and events → final result</figcaption></figure></section>`;
}

function archiveRows(filtered: GameSession[]): string {
  if (!sessions.length)
    return '<div class="empty-state"><div class="empty-glyph" aria-hidden="true"><span></span><span></span><span></span></div><h2>No session notes yet</h2><p>Start with a game title. Add players, setup notes, rulings, and scores as you play.</p><button class="secondary-action" id="empty-new-session" type="button">Create a session note</button></div>';
  if (!filtered.length)
    return '<div class="empty-state compact"><h2>No matching session notes</h2><p>Try another game title, player, or location.</p></div>';
  return `<ul class="session-list">${filtered
    .map((session) => {
      const players =
        session.participants
          .filter((person) => person.name)
          .map((person) => person.name)
          .join(", ") || "No players named";
      return `<li><button class="session-row" type="button" data-open-session="${html(session.id)}"><span class="session-state ${session.complete ? "complete" : ""}" aria-hidden="true"></span><span class="session-row-main"><strong>${html(session.title || "Untitled session note")}</strong><span>${html(players)}</span></span><span class="session-row-meta"><time datetime="${html(session.playedAt)}">${html(dateLabel(session.playedAt))}</time><small>${session.complete ? "Complete" : "In progress"}</small></span><span class="row-arrow" aria-hidden="true">↗</span></button></li>`;
    })
    .join("")}</ul>`;
}

function dataTools(): string {
  return '<dialog id="data-dialog" aria-labelledby="data-title"><form method="dialog" class="dialog-close"><button type="submit" aria-label="Close backup tools">×</button></form><div class="dialog-content"><p class="eyebrow"><span></span>Backup tools</p><h2 id="data-title">Back up or restore session notes</h2><p>Download a backup file with every session note and saved rule, or restore one to this browser. A backup updates session notes with the same identifier and keeps other notes.</p><div class="dialog-actions"><button class="secondary-action" id="export-backup" type="button">Download backup file</button><label class="file-action">Restore backup file<input id="import-backup" type="file" accept="application/json,.json"></label></div><p class="form-help" id="import-status" aria-live="polite"></p></div></dialog>';
}

function howItWorks(): string {
  return '<section class="explanation" aria-labelledby="how-title"><div><p class="eyebrow"><span></span>How it works</p><h2 id="how-title">Keep one session note as you play</h2></div><ol><li><strong>Start with the game title.</strong><span>Add players and the starting state.</span></li><li><strong>Note rulings and score changes.</strong><span>Keep rulings and events with the session note.</span></li><li><strong>Finish and reopen it later.</strong><span>Export a text receipt or backup file when needed.</span></li></ol></section>';
}

function privacyLimits(): string {
  return '<section class="privacy-limits" aria-labelledby="privacy-title"><div><p class="eyebrow"><span></span>Privacy and limits</p><h2 id="privacy-title">Your notes stay in this browser</h2></div><div><p>Use a backup file before clearing browser data or moving devices.</p><p>The app does not look up rules, calculate scores, or manage campaigns.</p><a href="/privacy" data-route>Read privacy details</a></div></section>';
}

function renderHome(): void {
  current = null;
  setPage(
    "Home",
    "Record setup, rulings, score changes, and outcomes for one boardgame session.",
    "/",
  );
  const query = search.trim().toLowerCase();
  const filtered = sessions.filter(
    (session) =>
      !query ||
      [
        session.title,
        session.location,
        ...session.participants.map((person) => person.name),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
  );
  main.innerHTML = `${homeHero()}<section class="archive" aria-labelledby="archive-title"><div class="section-heading"><div><p class="eyebrow"><span></span>In this browser</p><h2 id="archive-title">Session archive</h2><p>${sessions.length} ${sessions.length === 1 ? "session note" : "session notes"} in this browser on this device</p></div><label class="search-field"><span class="sr-only">Search session notes</span><input id="session-search" type="search" value="${html(search)}" placeholder="Search session notes"><i aria-hidden="true">⌕</i></label></div>${archiveRows(filtered)}</section>${howItWorks()}${privacyLimits()}${dataTools()}`;
}

function participantRows(session: GameSession): string {
  return session.participants
    .map(
      (person, index) =>
        `<div class="participant-row" data-person="${html(person.id)}"><span class="player-number" aria-hidden="true">${index + 1}</span><label><span>Player ${index + 1}</span><input data-person-field="name" value="${html(person.name)}" autocomplete="name" placeholder="Name"></label><label class="score-field"><span>Final score</span><input data-person-field="score" value="${html(person.score)}" inputmode="decimal" placeholder="—"></label>${session.participants.length > 1 ? `<button class="icon-button" type="button" data-remove-person="${html(person.id)}" aria-label="Remove player ${index + 1}">×</button>` : ""}</div>`,
    )
    .join("");
}

function timeline(session: GameSession): string {
  if (!session.events.length)
    return '<div class="timeline-empty"><span aria-hidden="true"></span><p>No events yet. Add rulings, disputes, or score changes as they happen.</p></div>';
  return `<ol class="timeline">${session.events.map((event, index) => `<li><span class="timeline-node" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><div><p><time>${html(event.time || "Time not noted")}</time><span class="event-kind">${html(event.kind)}</span></p><p>${html(event.note)}</p></div><button class="icon-button" type="button" data-remove-event="${html(event.id)}" aria-label="Remove timeline event ${index + 1}">×</button></li>`).join("")}</ol>`;
}

function renderEditor(moveFocus = false, focusSelector?: string): void {
  if (!current) return;
  const session = current;
  const rootDemo =
    demoMode &&
    (normalizedPath(location.pathname) === "/demo" ||
      new URLSearchParams(location.search).get("demo") === "1");
  const path = rootDemo ? "/demo" : notePath(session.id);
  setPage(
    demoMode ? "Demo" : session.title || "New session note",
    demoMode
      ? "Try a filled sample boardgame session note."
      : "Edit a session note stored in this browser.",
    path,
  );
  const rules = session.houseRules.length
    ? `<ul class="rule-list">${session.houseRules.map((rule, index) => `<li><span>${html(rule)}</span><button class="icon-button" type="button" data-remove-rule="${index}" aria-label="Remove house rule">×</button></li>`).join("")}</ul>`
    : '<p class="subtle-empty">No house rules attached to this session note.</p>';
  const options = snippets
    .filter((snippet) => !session.houseRules.includes(snippet))
    .map(
      (snippet) => `<option value="${html(snippet)}">${html(snippet)}</option>`,
    )
    .join("");
  main.innerHTML = `<div class="editor-shell"><nav class="editor-top" aria-label="Session note controls"><button class="text-button back-button" id="back-home" type="button">← All session notes</button><span id="save-status" class="save-status" role="status">Saved in this browser</span><div><button class="secondary-action compact-button" id="export-markdown" type="button">Export text receipt</button><button class="secondary-action compact-button" id="print-receipt" type="button">Print or save PDF</button></div></nav><header class="note-heading"><div><p class="eyebrow"><span></span>${session.complete ? "Completed session note" : "Session note"}</p><h1 id="editor-title" tabindex="-1">${html(session.title || "New session note")}</h1><label for="game-title">Game title</label><input id="game-title" data-session-field="title" value="${html(session.title)}" placeholder="Paste or type a game title" required aria-describedby="title-help"><p id="title-help">The app does not look up game titles.</p><p id="completion-status" class="completion-status">Status: ${session.complete ? "Completed" : "In progress"}.</p></div><button id="toggle-complete" aria-describedby="completion-status" class="status-stamp ${session.complete ? "complete" : ""}" type="button"><span aria-hidden="true">${session.complete ? "✓" : "○"}</span>${session.complete ? "Reopen session note" : "Mark session note complete"}</button></header><div class="note-grid"><section class="note-section basics" aria-labelledby="basics-title"><div class="section-index" aria-hidden="true">01</div><div class="section-content"><div class="section-title"><p>Before the first move</p><h2 id="basics-title">Players and scores</h2></div><div class="two-fields"><label>Played at<input type="datetime-local" data-session-field="playedAt" value="${html(session.playedAt)}"></label><label>Location<input data-session-field="location" value="${html(session.location)}" placeholder="Kitchen table, club…"></label></div><fieldset><legend>Players and final scores</legend><div id="participants">${participantRows(session)}</div><button class="text-button add-button" id="add-player" type="button">＋ Add another player</button></fieldset></div></section><section class="note-section setup" aria-labelledby="setup-title"><div class="section-index" aria-hidden="true">02</div><div class="section-content"><div class="section-title"><p>Before the first move</p><h2 id="setup-title">Starting state</h2></div><label>Setup notes<textarea data-session-field="startingState" rows="5" placeholder="Who started, colors, unusual setup, initial hand details…">${html(session.startingState)}</textarea></label><div class="photo-control">${session.photo ? `<figure><img src="${session.photo}" alt="Saved pre-play setup"><figcaption>Pre-play photo stored in this browser</figcaption></figure>` : '<div class="photo-placeholder" aria-hidden="true"><span>◎</span><i></i><i></i></div>'}<div><label class="file-action">${session.photo ? "Replace setup photo" : "Add setup photo"}<input id="setup-photo" type="file" accept="image/*" capture="environment"></label>${session.photo ? '<button class="text-button danger-text" id="remove-photo" type="button">Remove photo</button>' : ""}<p>A setup photo stays in this browser and appears in the printable receipt.</p></div></div></div></section><section class="note-section rules" aria-labelledby="rules-title"><div class="section-index" aria-hidden="true">03</div><div class="section-content"><div class="section-title"><p>Rulings to reuse</p><h2 id="rules-title">House rules</h2></div>${rules}<form id="add-rule-form" class="inline-add"><label><span>Add a rule or ruling</span><input id="new-rule" required placeholder="For example: Ties favor the later player"></label><button class="secondary-action" type="submit">Add rule</button></form>${options ? `<label class="snippet-select">Reuse a saved rule<select id="snippet-choice"><option value="">Choose a saved rule…</option>${options}</select></label>` : '<p class="form-help">Rules added here can be reused in later session notes.</p>'}</div></section><section class="note-section events" aria-labelledby="events-title"><div class="section-index" aria-hidden="true">04</div><div class="section-content"><div class="section-title"><p>What changed, in order</p><h2 id="events-title">Event timeline</h2></div>${timeline(session)}<form id="add-event-form" class="event-form"><label><span>Time</span><input id="event-time" type="time"></label><label><span>Kind</span><select id="event-kind"><option value="note">Note</option><option value="dispute">Dispute</option><option value="rule">Ruling</option><option value="score">Score change</option></select></label><label class="event-note"><span>What happened</span><input id="event-note" required placeholder="Record the ruling or event while it is fresh"></label><button class="secondary-action" type="submit">Add event</button></form></div></section><section class="note-section outcome" aria-labelledby="outcome-title"><div class="section-index" aria-hidden="true">05</div><div class="section-content"><div class="section-title"><p>At the end of play</p><h2 id="outcome-title">Outcome</h2></div><label>Result and next-time notes<textarea data-session-field="outcome" rows="5" placeholder="Winner, final result, unresolved questions, or what to remember next time…">${html(session.outcome)}</textarea></label><div class="finish-row"><button id="finish-session" class="primary-action" type="button">${session.complete ? "Save completed session note" : "Finish this session note"}</button><button id="delete-session" class="text-button danger-text" type="button">Delete this session note</button></div></div></section></div></div>`;
  for (const headingId of [
    "basics-title",
    "setup-title",
    "rules-title",
    "events-title",
    "outcome-title",
  ])
    document
      .querySelector<HTMLElement>(`#${headingId}`)
      ?.setAttribute("tabindex", "-1");
  if (focusSelector)
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(focusSelector)?.focus(),
    );
  else if (moveFocus) announceRoute(document.title, true);
}

function syncEditor(): void {
  if (!current) return;
  document
    .querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >("[data-session-field]")
    .forEach((input) => {
      const key = input.dataset.sessionField as keyof Pick<
        GameSession,
        "title" | "playedAt" | "location" | "startingState" | "outcome"
      >;
      current![key] = input.value;
    });
  document.querySelectorAll<HTMLElement>("[data-person]").forEach((row) => {
    const person = current!.participants.find(
      (item) => item.id === row.dataset.person,
    );
    row
      .querySelectorAll<HTMLInputElement>("[data-person-field]")
      .forEach((input) => {
        if (person && input.dataset.personField === "name")
          person.name = input.value;
        if (person && input.dataset.personField === "score")
          person.score = input.value;
      });
  });
}

function storeDraft(snapshot: GameSession): void {
  localStorage.setItem(draftKey(), JSON.stringify(snapshot));
}

function removeStoredDraft(snapshot?: GameSession): void {
  if (!snapshot) return localStorage.removeItem(draftKey());
  try {
    const stored = JSON.parse(
      localStorage.getItem(draftKey()) || "null",
    ) as unknown;
    if (
      isGameSession(stored) &&
      stored.id === snapshot.id &&
      stored.updatedAt === snapshot.updatedAt
    )
      localStorage.removeItem(draftKey());
  } catch {
    localStorage.removeItem(draftKey());
  }
}

function currentSnapshot(): GameSession | null {
  if (!current || !document.querySelector("#editor-title")) return null;
  syncEditor();
  const previousUpdate = Date.parse(current.updatedAt);
  current.updatedAt = new Date(
    Math.max(Date.now(), Number.isNaN(previousUpdate) ? 0 : previousUpdate + 1),
  ).toISOString();
  const snapshot = structuredClone(current);
  storeDraft(snapshot);
  const status = document.querySelector("#save-status");
  if (status) status.textContent = "Saving…";
  return snapshot;
}

function persistSnapshot(snapshot: GameSession): Promise<void> {
  saveChain = saveChain
    .catch(() => undefined)
    .then(async () => {
      try {
        await putSession(snapshot);
        const index = sessions.findIndex((item) => item.id === snapshot.id);
        if (index >= 0) sessions[index] = structuredClone(snapshot);
        else sessions.unshift(structuredClone(snapshot));
        sessions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        removeStoredDraft(snapshot);
        if (current?.id === snapshot.id) {
          const status = document.querySelector("#save-status");
          if (status)
            status.textContent = navigator.onLine
              ? "Saved in this browser"
              : "Saved offline in this browser";
        }
      } catch {
        const status = document.querySelector("#save-status");
        if (status) status.textContent = "Could not save — download a backup";
        showToast(
          "This change could not be saved. Your browser may be out of storage.",
        );
      }
    });
  return saveChain;
}

async function saveCurrent(immediate = false): Promise<void> {
  const snapshot = currentSnapshot();
  if (!snapshot) return saveChain;
  if (saveTimer) window.clearTimeout(saveTimer);
  if (immediate) return persistSnapshot(snapshot);
  saveTimer = window.setTimeout(() => {
    saveTimer = undefined;
    void persistSnapshot(snapshot);
  }, 450);
}

async function flushCurrent(): Promise<void> {
  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = undefined;
  if (current && document.querySelector("#editor-title"))
    await saveCurrent(true);
  else await saveChain;
}

async function recoverStoredDraft(): Promise<void> {
  const raw = localStorage.getItem(draftKey());
  if (!raw) return;
  try {
    const draft = JSON.parse(raw) as unknown;
    if (!isGameSession(draft)) throw new Error("Invalid pending draft");
    const stored = sessions.find((session) => session.id === draft.id);
    if (!stored || draft.updatedAt >= stored.updatedAt) {
      await putSession(draft);
      sessions = [
        draft,
        ...sessions.filter((session) => session.id !== draft.id),
      ].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
    removeStoredDraft(draft);
  } catch {
    localStorage.removeItem(draftKey());
  }
}

function updateEditorHeading(): void {
  if (!current) return;
  const heading = document.querySelector<HTMLElement>("#editor-title");
  if (heading) heading.textContent = current.title || "New session note";
  if (!demoMode)
    setPage(
      current.title || "New session note",
      "Edit a session note stored in this browser.",
      notePath(current.id),
    );
}

async function createSession(): Promise<void> {
  await flushCurrent();
  current = newSession();
  await putSession(current);
  sessions.unshift(structuredClone(current));
  history.pushState({}, "", notePath(current.id));
  renderEditor(true);
}

function openSession(id: string, push = true, focus = true): boolean {
  const found = sessions.find((session) => session.id === id);
  if (!found) return false;
  current = structuredClone(found);
  if (push) history.pushState({}, "", notePath(id));
  renderEditor(focus);
  return true;
}

function legalPage(type: "privacy" | "terms"): void {
  current = null;
  const privacy = type === "privacy";
  const label = privacy ? "Privacy" : "Terms";
  setPage(
    label,
    privacy
      ? "How Boardgame Session Notes stores session notes in your browser."
      : "Terms for Boardgame Session Notes.",
    `/${type}`,
  );
  main.innerHTML = `<article class="legal"><a href="/" data-route class="text-button">← Back to session notes</a><p class="eyebrow"><span></span>${label}</p><h1 tabindex="-1">${privacy ? "How your session notes are stored" : "Terms of use"}</h1>${privacy ? '<p class="lede">Session notes stay in this browser on this device.</p><h2>Save a backup file</h2><p>Download a backup file before moving devices or clearing browser data.</p><h2>Network use</h2><p>Normal session-note use does not send session-note content over the network.</p><h2>Your choices</h2><p>You can export a text receipt, print a receipt, and restore a backup file.</p>' : '<p class="lede">Use the app to keep session notes about games you play.</p><h2>Your session notes</h2><p>The software is provided as-is under the MIT License. Download a backup file for notes you want to keep.</p><h2>Fair use</h2><p>Do not use the app unlawfully or republish content you do not have permission to store.</p>'}<p class="legal-date">Effective 29 August 2026</p></article>`;
}

function notFound(
  message = "This address does not open a Boardgame Session Notes page.",
): void {
  current = null;
  setPage(
    "Page not found",
    "This Boardgame Session Notes page does not exist.",
    "/404",
  );
  main.innerHTML = `<section class="error-state"><p class="eyebrow"><span></span>404</p><h1 tabindex="-1">Page not found</h1><p>${html(message)}</p><a class="primary-action" href="/" data-route>Go to session notes</a></section>`;
}

async function seedDemo(): Promise<void> {
  const sample = sampleSession();
  await putSession(sample);
  await putSnippets(sample.houseRules);
  sessions = [sample];
  snippets = [...sample.houseRules];
}

function renderDemo(): void {
  if (!sessions.length) {
    void seedDemo().then(renderDemo);
    return;
  }
  current = structuredClone(sessions[0]);
  renderEditor();
}

function renderDemoArchive(): void {
  current = null;
  setPage("Demo", "Try a filled sample boardgame session note.", "/demo");
  main.innerHTML = `<section class="archive demo-archive" aria-labelledby="archive-title"><div class="section-heading"><div><p class="eyebrow"><span></span>Sample data</p><h1 id="archive-title" tabindex="-1">Sample session notes</h1><p>Open the filled session note or create another sample note.</p></div></div>${archiveRows(sessions)}<button class="secondary-action" id="empty-new-session" type="button">Create a sample session note</button></section>${dataTools()}`;
}

function route(path = location.pathname, moveFocus = false): void {
  renderDemoBanner();
  const normalized = normalizedPath(path);
  const sessionId = sessionIdFromPath(normalized, demoMode);
  if (sessionId) {
    if (!openSession(sessionId, false, moveFocus))
      notFound("This session note was not found in this browser.");
  } else if (
    demoMode &&
    (normalized === "/demo" ||
      new URLSearchParams(location.search).get("demo") === "1")
  ) {
    renderDemo();
    if (moveFocus) announceRoute(document.title, true);
  } else if (normalized === "/" || normalized === "/index.html") {
    renderHome();
    announceRoute(document.title, moveFocus);
  } else if (normalized === "/privacy") {
    legalPage("privacy");
    announceRoute(document.title, moveFocus);
  } else if (normalized === "/terms") {
    legalPage("terms");
    announceRoute(document.title, moveFocus);
  } else {
    notFound();
    announceRoute(document.title, moveFocus);
  }
}

async function goTo(target: URL, replace = false): Promise<void> {
  await flushCurrent();
  const targetDemo = wantsDemoAt(target);
  if (targetDemo !== demoMode) {
    if (demoMode) {
      removeStoredDraft();
      await clearCurrentStorage();
    }
    current = null;
    location.assign(`${target.pathname}${target.search}`);
    return;
  }
  history[replace ? "replaceState" : "pushState"](
    {},
    "",
    `${target.pathname}${target.search}`,
  );
  route(target.pathname, true);
}

async function resetDemo(): Promise<void> {
  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = undefined;
  await saveChain;
  current = null;
  removeStoredDraft();
  await clearCurrentStorage();
  sessions = [];
  snippets = [];
  await seedDemo();
  history.replaceState({}, "", "/demo");
  renderDemo();
  showToast("Sample session note reset.");
}

async function startForReal(): Promise<void> {
  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = undefined;
  await saveChain;
  current = null;
  removeStoredDraft();
  await clearCurrentStorage();
  location.assign("/");
}

async function openDataDialog(): Promise<void> {
  if (!document.querySelector("#data-dialog")) {
    await flushCurrent();
    history.pushState({}, "", listPath());
    demoMode ? renderDemoArchive() : renderHome();
  }
  const dialog = document.querySelector<HTMLDialogElement>("#data-dialog");
  if (dialog && !dialog.dataset.closeBound) {
    dialog.dataset.closeBound = "true";
    dialog.addEventListener(
      "close",
      () => {
        demoMode ? renderDemoArchive() : renderHome();
      },
      { once: true },
    );
  }
  dialog?.showModal();
}

async function shrinkImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 20_000_000)
    throw new Error("Choose a photo smaller than 20 MB.");
  const source = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(source.width * scale);
  canvas.height = Math.round(source.height * scale);
  canvas.getContext("2d")?.drawImage(source, 0, 0, canvas.width, canvas.height);
  source.close();
  return canvas.toDataURL("image/jpeg", 0.78);
}

function openPrintReceipt(session: GameSession): void {
  const markup = receiptHtml(session, `${location.origin}/print.css`);
  const receiptUrl = URL.createObjectURL(
    new Blob([markup], { type: "text/html" }),
  );
  const popup = window.open(receiptUrl, "_blank");
  if (!popup) {
    URL.revokeObjectURL(receiptUrl);
    showToast("Allow pop-ups to print this receipt.");
    return;
  }
  popup.opener = null;
  popup.addEventListener(
    "load",
    () => {
      popup.print();
      window.setTimeout(() => URL.revokeObjectURL(receiptUrl), 1000);
    },
    { once: true },
  );
}

main.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement;
  if (target.id === "session-search") {
    search = target.value;
    const filtered = sessions.filter((session) =>
      [
        session.title,
        session.location,
        ...session.participants.map((person) => person.name),
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
    const list = document.querySelector(".session-list, .empty-state");
    if (list) list.outerHTML = archiveRows(filtered);
    return;
  }
  if (target.matches("[data-session-field], [data-person-field]")) {
    syncEditor();
    if (target.id === "game-title") updateEditorHeading();
    void saveCurrent();
  }
});

main.addEventListener("change", async (event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  if (target.id === "snippet-choice" && current && target.value) {
    syncEditor();
    current.houseRules.push(target.value);
    await saveCurrent(true);
    renderEditor(false, "#rules-title");
  }
  if (
    target.id === "setup-photo" &&
    current &&
    target instanceof HTMLInputElement &&
    target.files?.[0]
  ) {
    try {
      syncEditor();
      target.disabled = true;
      current.photo = await shrinkImage(target.files[0]);
      await saveCurrent(true);
      renderEditor(false, "#setup-photo");
      showToast("Setup photo saved in this browser.");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "The photo could not be added.",
      );
      target.disabled = false;
    }
  }
  if (
    target.id === "import-backup" &&
    target instanceof HTMLInputElement &&
    target.files?.[0]
  ) {
    const status = document.querySelector("#import-status");
    try {
      const backup = JSON.parse(await target.files[0].text()) as AppBackup;
      await importBackup(backup);
      sessions = await getSessions();
      snippets = await getSnippets();
      if (status)
        status.textContent = `Restored ${backup.sessions.length} session notes.`;
      showToast("Backup file restored.");
    } catch (error) {
      if (status)
        status.textContent =
          error instanceof Error
            ? error.message
            : "The backup file could not be read.";
    }
  }
});

main.addEventListener("submit", async (event) => {
  const form = event.target as HTMLFormElement;
  if (form.id === "add-rule-form" && current) {
    event.preventDefault();
    syncEditor();
    const input = form.querySelector<HTMLInputElement>("#new-rule")!;
    const rule = input.value.trim();
    if (!rule) return;
    current.houseRules.push(rule);
    if (!snippets.includes(rule)) {
      snippets.push(rule);
      await putSnippets(snippets);
    }
    await saveCurrent(true);
    renderEditor(false, "#new-rule");
  }
  if (form.id === "add-event-form" && current) {
    event.preventDefault();
    syncEditor();
    const note = form
      .querySelector<HTMLInputElement>("#event-note")!
      .value.trim();
    if (!note) return;
    current.events.push({
      id: uid(),
      time: form.querySelector<HTMLInputElement>("#event-time")!.value,
      kind: form.querySelector<HTMLSelectElement>("#event-kind")!
        .value as SessionEvent["kind"],
      note,
    });
    await saveCurrent(true);
    renderEditor(false, "#event-note");
  }
});

main.addEventListener("click", async (event) => {
  const button = (event.target as HTMLElement).closest<HTMLElement>(
    "button, [data-open-session]",
  );
  if (!button) return;
  if (button.id === "reload-app") location.reload();
  else if (button.id === "new-session" || button.id === "empty-new-session")
    await createSession();
  else if (button.dataset.openSession) {
    await flushCurrent();
    openSession(button.dataset.openSession);
  } else if (button.id === "back-home") {
    await flushCurrent();
    history.pushState({}, "", listPath());
    demoMode ? renderDemoArchive() : renderHome();
    announceRoute(document.title, true);
  } else if (button.id === "add-player" && current) {
    syncEditor();
    current.participants.push({ id: uid(), name: "", score: "" });
    await saveCurrent(true);
    renderEditor(
      false,
      `[data-person="${current.participants.at(-1)!.id}"] input`,
    );
  } else if (button.dataset.removePerson && current) {
    syncEditor();
    const removedIndex = current.participants.findIndex(
      (person) => person.id === button.dataset.removePerson,
    );
    current.participants = current.participants.filter(
      (person) => person.id !== button.dataset.removePerson,
    );
    await saveCurrent(true);
    const replacementIndex = Math.min(
      Math.max(removedIndex, 0),
      current.participants.length - 1,
    );
    renderEditor(
      false,
      current.participants.length > 1
        ? `#participants .participant-row:nth-of-type(${replacementIndex + 1}) [data-remove-person]`
        : "#basics-title",
    );
  } else if (button.dataset.removeRule && current) {
    syncEditor();
    const removedIndex = Number(button.dataset.removeRule);
    current.houseRules.splice(removedIndex, 1);
    await saveCurrent(true);
    renderEditor(
      false,
      current.houseRules.length
        ? `[data-remove-rule="${Math.min(removedIndex, current.houseRules.length - 1)}"]`
        : "#rules-title",
    );
  } else if (button.dataset.removeEvent && current) {
    syncEditor();
    const removedIndex = current.events.findIndex(
      (item) => item.id === button.dataset.removeEvent,
    );
    current.events = current.events.filter(
      (item) => item.id !== button.dataset.removeEvent,
    );
    await saveCurrent(true);
    const replacementIndex = Math.min(
      Math.max(removedIndex, 0),
      current.events.length - 1,
    );
    renderEditor(
      false,
      current.events.length
        ? `.timeline li:nth-child(${replacementIndex + 1}) [data-remove-event]`
        : "#events-title",
    );
  } else if (button.id === "remove-photo" && current) {
    current.photo = undefined;
    await saveCurrent(true);
    renderEditor(false, "#setup-title");
    showToast("Setup photo removed.");
  } else if (
    (button.id === "toggle-complete" || button.id === "finish-session") &&
    current
  ) {
    syncEditor();
    if (!current.title.trim()) {
      document.querySelector<HTMLInputElement>("#game-title")?.focus();
      showToast("Add a game title before finishing the session note.");
      return;
    }
    current.complete =
      button.id === "finish-session" ? true : !current.complete;
    await saveCurrent(true);
    renderEditor(
      false,
      button.id === "toggle-complete" ? "#toggle-complete" : "#finish-session",
    );
    showToast(
      current.complete
        ? "Session note marked complete."
        : "Session note reopened.",
    );
  } else if (button.id === "export-markdown" && current) {
    syncEditor();
    await saveCurrent(true);
    downloadText(safeFilename(current.title), sessionMarkdown(current));
    showToast("Text receipt downloaded.");
  } else if (button.id === "print-receipt" && current) {
    syncEditor();
    await saveCurrent(true);
    openPrintReceipt(current);
  } else if (button.id === "delete-session" && current) {
    const label = current.title || "this untitled session note";
    if (
      !confirm(
        `Delete “${label}” from this browser? You can undo for a few seconds.`,
      )
    )
      return;
    deletedForUndo = structuredClone(current);
    await removeSession(current.id);
    sessions = sessions.filter((item) => item.id !== current!.id);
    history.pushState({}, "", listPath());
    demoMode ? renderDemoArchive() : renderHome();
    showToast("Session note deleted from this browser.", {
      label: "Undo",
      run: async () => {
        if (!deletedForUndo) return;
        await putSession(deletedForUndo);
        sessions.unshift(deletedForUndo);
        deletedForUndo = null;
        demoMode ? renderDemoArchive() : renderHome();
      },
    });
  } else if (button.id === "export-backup") {
    downloadText(
      `session-notes-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(createBackup(sessions, snippets), null, 2),
      "application/json",
    );
    showToast("Backup file downloaded.");
  }
});

document.addEventListener("click", (event) => {
  const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
    "a[data-route]",
  );
  if (!link || link.origin !== location.origin) return;
  event.preventDefault();
  void goTo(new URL(link.href));
});

demoBanner.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "button",
  );
  if (button?.id === "reset-demo") void resetDemo();
  if (button?.id === "start-real") void startForReal();
});

document.querySelector("#open-data-tools")?.addEventListener("click", () => {
  void openDataDialog();
});

window.addEventListener("popstate", () => {
  void (async () => {
    await flushCurrent();
    const targetDemo = wantsDemoAt(new URL(location.href));
    if (targetDemo !== demoMode) {
      if (demoMode) {
        removeStoredDraft();
        await clearCurrentStorage();
      }
      current = null;
      location.reload();
      return;
    }
    route(location.pathname, true);
  })();
});

window.addEventListener("pagehide", () => {
  const snapshot = currentSnapshot();
  if (snapshot) void persistSnapshot(snapshot);
});
window.addEventListener("online", () => void checkConnection());
window.addEventListener("offline", () => updateConnection(false));

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
let installPrompt: InstallPrompt | null = null;
const installButton =
  document.querySelector<HTMLButtonElement>("#install-app")!;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event as InstallPrompt;
  installButton.hidden = false;
});
installButton.addEventListener("click", async () => {
  if (!installPrompt) return;
  await installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
});

async function registerServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller)
          showToast("A new app version is ready.", {
            label: "Reload",
            run: () => location.reload(),
          });
      });
    });
  } catch {
    showToast("Offline support could not be installed in this browser.");
  }
}

async function initialize(): Promise<void> {
  void checkConnection();
  main.innerHTML =
    '<div class="loading-state"><span aria-hidden="true"></span><p>Opening session notes…</p></div>';
  try {
    [sessions, snippets] = await Promise.all([getSessions(), getSnippets()]);
    await recoverStoredDraft();
    if (demoMode && !sessions.length) await seedDemo();
    const directSession =
      sessionIdFromPath(location.pathname, demoMode) !== null;
    route(location.pathname, directSession);
  } catch (error) {
    main.innerHTML = `<section class="error-state"><p class="eyebrow"><span></span>Storage unavailable</p><h1 tabindex="-1">Session notes could not open</h1><p>${html(error instanceof Error ? error.message : "This browser blocked local storage.")}</p><button class="primary-action" id="reload-app" type="button">Try again</button></section>`;
  }
  document.body.classList.add("app-ready");
  void registerServiceWorker();
}

void initialize();
