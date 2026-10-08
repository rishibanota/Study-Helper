import { escapeHtml } from '../util.js';
import { SUBJECTS, ALL_QUESTIONS, TOTAL_QUESTIONS } from '../../data/index.js';
import { getState, summary, setPref, resetAll } from '../state.js';
import { buddy, world, doodles } from '../art.js';
import { sfx, setMusicEnabled, setSfxEnabled, unlock, startMusic } from '../audio.js';

/** A ring showing how many ideas of a question are already mastered. */
function ring(marks, size = 54) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, marks * 10));
  const colour = marks >= 8 ? '#22c55e' : marks > 0 ? '#f59e0b' : '#cbd5e1';
  return `<svg class="ring" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="5"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${colour}" stroke-width="5"
      stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c - (c * pct) / 100}"
      transform="rotate(-90 ${size / 2} ${size / 2})"/>
    <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
      font-size="16" font-weight="800" fill="#0f172a">${marks}</text>
  </svg>`;
}

function subjectCard(subject, stats) {
  const done = subject.questions.filter((q) => stats.marks[q.id] > 0).length;
  const pct = Math.round((done / subject.questions.length) * 100);
  return `
  <a class="card subject-card" href="#/subject/${subject.id}" style="--main:${subject.colors.main};--soft:${subject.colors.soft};--deep:${subject.colors.deep}">
    <div class="subject-art">${world(subject.world)}</div>
    <div class="subject-body">
      <div class="subject-top">
        <div>
          <span class="chip">${escapeHtml(subject.code)}</span>
          <h3>${escapeHtml(subject.name)}</h3>
        </div>
        <span class="subject-pct">${done}/${subject.questions.length}</span>
      </div>
      <p class="muted">${escapeHtml(subject.blurb)}</p>
      <div class="bar"><i style="width:${pct}%"></i></div>
    </div>
  </a>`;
}

function greeting(stats) {
  if (stats.mastered === 0) return 'Ready when you are, pick an island!';
  if (stats.mastered >= TOTAL_QUESTIONS) return 'Every concept mastered. Exam ready!';
  if (stats.mastered >= TOTAL_QUESTIONS / 2) return 'Over halfway. Keep the streak alive!';
  return 'Nice work. Keep going!';
}

export function renderHome() {
  const state = getState();
  const stats = summary();

  // Flatten progress into a lookup so cards can read it directly.
  const marks = {};
  for (const q of ALL_QUESTIONS) {
    marks[q.id] = state.progress[q.id]?.best || 0;
  }

  const mastered = ALL_QUESTIONS.filter((q) => (marks[q.id] || 0) >= 8).length;
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="screen home">
      <header class="hero" style="--main:#38bdf8;--deep:#0c4a6e">
        <div class="hero-bg">${world('city')}</div>
        <div class="hero-inner">
          ${buddy(stats.mastered ? 'cheer' : 'happy', 96)}
          <div class="hero-text">
            <p class="hero-hi">${escapeHtml(greeting(stats))}</p>
            <div class="hero-stats">
              <div><b>${mastered}</b><span>mastered</span></div>
              <div><b>${stats.notes}</b><span>your notes</span></div>
              <div><b>${stats.streak}</b><span>streak</span></div>
            </div>
          </div>
        </div>
      </header>

      <div class="pad">
        <nav class="quick">
          <a class="btn btn-primary" href="#/exam">${ring(0, 32)}<span>Final Exam</span></a>
          <a class="btn" href="#/notebook">📓 My Notebook</a>
        </nav>

        <h2 class="section-title">Your islands <small>${TOTAL_QUESTIONS} concepts</small></h2>
        <div class="subjects">${SUBJECTS.map((s) => subjectCard(s, { marks })).join('')}</div>

        <div class="panel doodle-panel">
          ${doodles()}
          <div>
            <h3>How this game works</h3>
            <p class="muted">Read the cartoon scene, tap each card to hear it, then tell Buddy the idea in <b>your own words</b>. He checks which ideas you covered, never the exact wording.</p>
          </div>
        </div>

        <div class="settings">
          <h3>Sound & Preferences</h3>
          ${toggle('music', 'Background music', state.prefs.music)}
          ${toggle('sfx', 'Sound effects', state.prefs.sfx)}
          ${toggle('speech', 'Voice narration', state.prefs.speech)}

          <div class="voice-picker">
            <span class="voice-picker-title">Studio Voice Style</span>
            <div class="voice-chips">
              <button type="button" class="voice-chip ${(state.prefs.voice || 'bf_emma') === 'bf_emma' ? 'active' : ''}" data-voice="bf_emma">
                <span class="v-flag">🇬🇧</span>
                <span class="v-meta"><b>Emma</b><small>British Female</small></span>
              </button>
              <button type="button" class="voice-chip ${(state.prefs.voice || 'bf_emma') === 'bm_george' ? 'active' : ''}" data-voice="bm_george">
                <span class="v-flag">🇬🇧</span>
                <span class="v-meta"><b>George</b><small>British Male</small></span>
              </button>
              <button type="button" class="voice-chip ${(state.prefs.voice || 'bf_emma') === 'af_heart' ? 'active' : ''}" data-voice="af_heart">
                <span class="v-flag">🇺🇸</span>
                <span class="v-meta"><b>Heart</b><small>US Female</small></span>
              </button>
              <button type="button" class="voice-chip ${(state.prefs.voice || 'bf_emma') === 'am_adam' ? 'active' : ''}" data-voice="am_adam">
                <span class="v-flag">🇺🇸</span>
                <span class="v-meta"><b>Adam</b><small>US Male</small></span>
              </button>
            </div>
          </div>

          <button class="btn btn-danger" id="reset" style="margin-top:14px; width:100%">Reset all progress</button>
        </div>
      </div>
    </div>`;

  function onClick(event) {
    const voiceBtn = event.target.closest('[data-voice]');
    if (voiceBtn) {
      const chosen = voiceBtn.dataset.voice;
      setPref('voice', chosen);
      sfx.tap();
      document.querySelectorAll('[data-voice]').forEach((b) => {
        b.classList.toggle('active', b.dataset.voice === chosen);
      });
      return;
    }

    const input = event.target.closest('input[data-pref]');
    if (input) {
      const pref = input.dataset.pref;
      const on = input.checked;
      setPref(pref, on);
      sfx.tap();
      if (pref === 'music') {
        setMusicEnabled(on);
      } else if (pref === 'sfx') {
        setSfxEnabled(on);
      }
      return;
    }
    if (event.target.closest('#reset')) {
      if (confirm('Delete all progress and notes? This cannot be undone.')) {
        resetAll();
        renderHome();
      }
    }
  }

  app.addEventListener('click', onClick);

  return () => {
    app.removeEventListener('click', onClick);
  };
}

function toggle(name, label, on) {
  return `<label class="switch">
    <input type="checkbox" data-pref="${name}" ${on ? 'checked' : ''}>
    <span class="switch-ui"></span>
    <span class="switch-label">${escapeHtml(label)}</span>
  </label>`;
}

