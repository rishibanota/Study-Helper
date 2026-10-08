import { SUBJECTS, ALL_QUESTIONS, TOTAL_QUESTIONS } from '../data/index.js';
import { renderHome } from './screens/home.js';
import { renderLearn, renderSubject } from './screens/learn.js';
import { renderExam } from './screens/exam.js';
import { renderNotebook } from './screens/notebook.js';
import { unlock, startMusic, setMusicEnabled, setSfxEnabled, setMusicWorld, stopSpeaking, sfx } from './audio.js';
import { getState } from './state.js';
import { escapeHtml } from './util.js';

/**
 * Hash router with proper lifecycle and cleanup management.
 *
 *   #/                    home
 *   #/subject/:subjectId  one subject's questions
 *   #/learn/:questionId   one concept
 *   #/exam?subject=id     final exam
 *   #/notebook            own notes
 */

let currentScreenCleanup = null;

function parseHash() {
  const raw = (typeof window !== 'undefined' ? window.location.hash : '').replace(/^#\/?/, '');
  const [path, search] = raw.split('?');
  const params = Object.fromEntries(new URLSearchParams(search || ''));
  const parts = path.split('/').filter(Boolean);
  return { parts, params };
}

function updateNav(active) {
  const items = document.querySelectorAll('#bottom-nav .nav-item');
  items.forEach((item) => {
    item.classList.toggle('active', item.dataset.nav === active);
  });
}

function notFound(what) {
  updateNav(null);
  document.getElementById('app').innerHTML = `
    <div class="screen">
      <div class="pad center-page">
        <h2>Lost?</h2>
        <p class="muted">That ${escapeHtml(what)} does not exist.</p>
        <div class="actions"><a class="btn btn-primary" href="#/">Back to islands</a></div>
      </div>
    </div>`;
}

function route() {
  if (typeof currentScreenCleanup === 'function') {
    try {
      currentScreenCleanup();
    } catch (err) {
      console.warn('Error in screen cleanup:', err);
    }
    currentScreenCleanup = null;
  }
  stopSpeaking();

  const { parts, params } = parseHash();
  const [head, id] = parts;

  if (!head) {
    updateNav('home');
    setMusicWorld('city');
    currentScreenCleanup = renderHome();
    return;
  }

  if (head === 'subject') {
    const subject = SUBJECTS.find((s) => s.id === id);
    if (!subject) return notFound('subject');
    updateNav('home');
    setMusicWorld(subject.world);
    currentScreenCleanup = renderSubject(subject);
    return;
  }

  if (head === 'learn') {
    const question = ALL_QUESTIONS.find((q) => q.id === id);
    if (!question) return notFound('concept');
    updateNav(null);
    setMusicWorld(question.subject.world);
    currentScreenCleanup = renderLearn(question);
    return;
  }

  if (head === 'exam') {
    updateNav('exam');
    currentScreenCleanup = renderExam(params);
    return;
  }

  if (head === 'notebook') {
    updateNav('notebook');
    setMusicWorld('site');
    currentScreenCleanup = renderNotebook();
    return;
  }

  notFound('page');
}

/** Reflect stored sound preferences on the audio engine. */
function applyPrefs() {
  const prefs = getState().prefs;
  setSfxEnabled(prefs.sfx);
  setMusicEnabled(prefs.music);
}

window.addEventListener('hashchange', () => {
  route();
  window.scrollTo(0, 0);
});

// Audio and music may only start inside a real user gesture.
function onFirstTouch() {
  unlock();
  applyPrefs();
  startMusic();
  document.removeEventListener('pointerdown', onFirstTouch);
  document.removeEventListener('keydown', onFirstTouch);
}
document.addEventListener('pointerdown', onFirstTouch);
document.addEventListener('keydown', onFirstTouch);

// Bottom nav tap sound
document.getElementById('bottom-nav')?.addEventListener('click', (e) => {
  if (e.target.closest('.nav-item')) {
    sfx.tap();
  }
});

route();

// Debugging helper
window.quizquest = { SUBJECTS, ALL_QUESTIONS, TOTAL_QUESTIONS };

