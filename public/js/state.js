/**
 * Central store. One plain object, one save function, one subscribe list.
 *
 * Everything is per-browser localStorage, so progress survives a phone lock,
 * a browser restart and going offline. No server, no account.
 */

const KEY = 'quizquest.v1';

const EMPTY = {
  /** questionId -> { seen, best, attempts, lastAt } */
  progress: {},
  /** questionId -> the student's own words for that concept */
  notes: {},
  streak: 0,
  bestStreak: 0,
  /** exam history, newest first */
  exams: [],
  prefs: { music: true, sfx: true, speech: true, voice: 'bf_emma' },
};

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(EMPTY);
    const parsed = JSON.parse(raw);
    // Merge over EMPTY so a shape added later does not break an old save.
    return {
      ...structuredClone(EMPTY),
      ...parsed,
      prefs: { ...EMPTY.prefs, ...(parsed.prefs || {}) },
    };
  } catch {
    return structuredClone(EMPTY);
  }
}

const listeners = new Set();

let state = read();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode or a full quota. The game still works for this session.
  }
}

function emit() {
  for (const fn of listeners) fn(state);
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Apply a mutation to state, save, and notify listeners. */
export function update(mutator) {
  const draft = structuredClone(state);
  mutator(draft);
  state = draft;
  persist();
  emit();
}

/** Progress for one question, creating a blank record if needed. */
export function progressFor(questionId) {
  return state.progress[questionId] || { seen: false, best: 0, attempts: 0, lastAt: 0 };
}

/** Record a graded attempt. `marks` is out of 10. */
export function recordAttempt(questionId, marks) {
  update((draft) => {
    const prev = draft.progress[questionId] || { seen: false, best: 0, attempts: 0, lastAt: 0 };
    draft.progress[questionId] = {
      seen: true,
      best: Math.max(prev.best || 0, marks),
      attempts: (prev.attempts || 0) + 1,
      lastAt: Date.now(),
    };
  });
}

/** Store the student's own wording for a concept. */
export function saveNote(questionId, text) {
  update((draft) => {
    draft.notes[questionId] = text;
  });
}

export function noteFor(questionId) {
  return state.notes[questionId] || '';
}

export function bumpStreak() {
  update((draft) => {
    draft.streak = (draft.streak || 0) + 1;
    draft.bestStreak = Math.max(draft.bestStreak || 0, draft.streak);
  });
  return state.streak;
}

export function saveExam(result) {
  update((draft) => {
    draft.exams.unshift({ ...result, at: Date.now() });
    draft.exams = draft.exams.slice(0, 20);
  });
}

export function setPref(name, value) {
  update((draft) => {
    draft.prefs[name] = value;
  });
}

/** Aggregate numbers for the home screen. */
export function summary() {
  const entries = Object.values(state.progress);
  const mastered = entries.filter((p) => (p.best || 0) >= 8).length;
  const started = entries.filter((p) => p.seen).length;
  const marks = entries.map((p) => p.best || 0);
  const average = marks.length ? marks.reduce((a, b) => a + b, 0) / marks.length : 0;
  return {
    mastered,
    started,
    total: marks.length,
    average: Math.round(average * 10) / 10,
    notes: Object.values(state.notes).filter((n) => n && n.trim()).length,
    streak: state.streak || 0,
    bestStreak: state.bestStreak || 0,
    exams: state.exams || [],
  };
}

export function resetAll() {
  state = structuredClone(EMPTY);
  persist();
  emit();
}
