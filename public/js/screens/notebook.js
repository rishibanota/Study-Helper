import { escapeHtml, markTone } from '../util.js';
import { SUBJECTS, ALL_QUESTIONS } from '../../data/index.js';
import { getState, summary } from '../state.js';
import { buddy } from '../art.js';
import { sfx, speak, stopSpeaking } from '../audio.js';

/**
 * The student's own words, collected in one place, plus what still needs work.
 * Features fast mobile tab filters (All / Needs Work / Mastered) and search.
 */
export function renderNotebook() {
  const state = getState();
  const stats = summary();
  const app = document.getElementById('app');

  let activeFilter = 'all'; // 'all' | 'weak' | 'good'
  let searchQuery = '';

  const allNotes = ALL_QUESTIONS
    .filter((q) => (state.notes[q.id] || '').trim())
    .map((q) => ({ q, note: state.notes[q.id], best: state.progress[q.id]?.best || 0 }))
    .sort((a, b) => a.best - b.best);

  const weak = ALL_QUESTIONS
    .filter((q) => q.ideas.length)
    .map((q) => ({ q, best: state.progress[q.id]?.best || 0, attempts: state.progress[q.id]?.attempts || 0 }))
    .filter((x) => x.attempts > 0 && x.best < 8)
    .sort((a, b) => a.best - b.best)
    .slice(0, 8);

  function getFilteredNotes() {
    return allNotes.filter(({ q, note, best }) => {
      if (activeFilter === 'weak' && best >= 8) return false;
      if (activeFilter === 'good' && best < 8) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTopic = q.topic.toLowerCase().includes(query);
        const matchesCode = q.subject.code.toLowerCase().includes(query);
        const matchesNote = note.toLowerCase().includes(query);
        return matchesTopic || matchesCode || matchesNote;
      }
      return true;
    });
  }

  function paint() {
    const filtered = getFilteredNotes();

    app.innerHTML = `
    <div class="screen notebook">
      <div class="learn-head" style="--main:#f59e0b;--deep:#78350f">
        <div class="head-top">
          <a class="back" href="#/" aria-label="Back to Islands">
            <span class="back-arrow">&larr;</span> <span>Islands</span>
          </a>
          <span class="chip">Revision Hub</span>
        </div>
        <div class="learn-title">
          <h2>My Concept Notes</h2>
        </div>
      </div>

      <div class="pad">
        <div class="buddy-row">
          ${buddy('think', 72)}
          <div class="speech">
            <p>Your notes in your own words. Read them aloud before the exam to lock them into memory!</p>
            <button class="speak" data-speak="These are your notes, written by you. Read them out loud before the exam." data-clip="ui/notebook_intro" aria-label="Read aloud">🔊</button>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat"><b>${stats.notes}</b><span>Notes</span></div>
          <div class="stat"><b>${stats.mastered}</b><span>Mastered</span></div>
          <div class="stat"><b>${stats.bestStreak}</b><span>Best Streak</span></div>
          <div class="stat"><b>${stats.average}</b><span>Average</span></div>
        </div>

        ${weak.length ? `
        <div class="panel">
          <span class="badge low">Top Revision Focus (Under 8/10)</span>
          <ul class="chips tight">
            ${weak.map((x) => `<li><a class="chip-btn static" href="#/learn/${x.q.id}">
              ${escapeHtml(x.q.subject.code)} Q${x.q.num}
              <b>${x.best}/10</b>
            </a></li>`).join('')}
          </ul>
        </div>` : ''}

        ${stats.exams.length ? `
        <div class="panel">
          <span class="badge">Recent Exam Papers</span>
          <ul class="chips tight">
            ${stats.exams.slice(0, 6).map((e) => {
              const name = e.subjectId === 'all' ? 'All' : (SUBJECTS.find((s) => s.id === e.subjectId)?.code || e.subjectId);
              return `<li class="chip-btn static ${markTone(e.avg)}">${escapeHtml(name)} <b>${e.avg}/10</b></li>`;
            }).join('')}
          </ul>
        </div>` : ''}

        <div class="notebook-controls">
          <div class="search-wrap">
            <input type="search" id="note-search" class="search-input" placeholder="Search notes or topics..." value="${escapeHtml(searchQuery)}">
          </div>
          <div class="filter-pills" role="tablist">
            <button type="button" class="filter-pill ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All (${allNotes.length})</button>
            <button type="button" class="filter-pill ${activeFilter === 'weak' ? 'active' : ''}" data-filter="weak">Needs Work (&lt;8)</button>
            <button type="button" class="filter-pill ${activeFilter === 'good' ? 'active' : ''}" data-filter="good">Mastered (8+)</button>
          </div>
        </div>

        <div id="notes-container">
          ${renderNotesList(filtered)}
        </div>

        <div class="actions" style="margin-top:20px;">
          <a class="btn btn-primary btn-lg btn-grow" href="#/">Explore More Concepts &rarr;</a>
        </div>
      </div>
    </div>`;
  }

  function renderNotesList(notes) {
    if (!notes.length) {
      if (allNotes.length === 0) {
        return `<div class="card warn"><p>No notes yet! Complete "Your Turn" on any concept &mdash; your explanations are automatically saved here.</p></div>`;
      }
      return `<div class="card center muted"><p>No notes match your filter or search query.</p></div>`;
    }

    return notes.map(({ q, note, best }) => `
      <div class="note-card" style="--main:${q.subject.colors.main}">
        <div class="note-head">
          <span class="chip">${escapeHtml(q.subject.code)} Q${q.num}</span>
          <b>${escapeHtml(q.topic)}</b>
          <span class="q-best ${markTone(best)}">${best}/10</span>
        </div>
        <p class="note-text">${escapeHtml(note)}</p>
        <div class="row-btns">
          <button type="button" class="speak" data-speak="${escapeHtml(note)}" aria-label="Read my note aloud">🔊 Read aloud</button>
          <a class="btn small btn-grow" href="#/learn/${q.id}">Practise again &rarr;</a>
        </div>
      </div>`).join('');
  }

  function onClick(event) {
    const filterBtn = event.target.closest('[data-filter]');
    if (filterBtn) {
      activeFilter = filterBtn.dataset.filter;
      sfx.tap();
      paint();
      return;
    }

    const speaker = event.target.closest('[data-speak]');
    if (speaker) {
      sfx.tap();
      speak(speaker.dataset.speak, { clipId: speaker.dataset.clip });
      speaker.classList.add('speaking');
      setTimeout(() => speaker.classList.remove('speaking'), 1400);
      return;
    }
  }

  function onInput(event) {
    if (event.target.id === 'note-search') {
      searchQuery = event.target.value;
      const container = document.getElementById('notes-container');
      if (container) {
        container.innerHTML = renderNotesList(getFilteredNotes());
      }
    }
  }

  paint();
  app.addEventListener('click', onClick);
  app.addEventListener('input', onInput);

  return () => {
    stopSpeaking();
    app.removeEventListener('click', onClick);
    app.removeEventListener('input', onInput);
  };
}

