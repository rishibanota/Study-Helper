import { escapeHtml, markTone } from '../util.js';
import { SUBJECTS, ALL_QUESTIONS } from '../../data/index.js';
import { getState, recordAttempt, saveExam } from '../state.js';
import { buddy, world, scene } from '../art.js';
import { sfx, speak, stopSpeaking, setMusicWorld } from '../audio.js';
import { gradeAnswer, scoreOutOfTen } from '../grader.js';
import { confetti } from '../fx.js';

/**
 * Final exam. Two phases: setup, then the paper.
 * Marking is identical to the learn screen (one mark per idea).
 */
export function renderExam(params) {
  let config = {
    subjectId: params.subject || 'all',
    count: 5,
    minutes: 12,
  };

  let session = null;
  const app = document.getElementById('app');

  /* --------------------------------- setup --------------------------------- */
  function paintSetup() {
    clearInterval(session?.timer);
    app.innerHTML = `
    <div class="screen exam">
      <div class="learn-head" style="--main:#f43f5e;--deep:#7f1d1d">
        <div class="head-top">
          <a class="back" href="#/" aria-label="Back to Islands">
            <span class="back-arrow">&larr;</span> <span>Islands</span>
          </a>
          <span class="chip">Mock Exam</span>
        </div>
        <div class="learn-title">
          <h2>Final Exam Simulator</h2>
        </div>
      </div>
      <div class="pad">
        <div class="buddy-row">
          ${buddy('happy', 72)}
          <div class="speech">
            <p>Timed mock paper! Answer like the real exam &mdash; in your own words.</p>
            <button class="speak" data-speak="This is a full mock paper. Answer in your own words." data-clip="ui/exam_intro" aria-label="Read aloud">🔊</button>
          </div>
        </div>

        <div class="panel">
          <span class="badge">Choose Subject</span>
          <div class="chips">
            <button class="chip-btn ${config.subjectId === 'all' ? 'on' : ''}" data-subject="all">All Subjects</button>
            ${SUBJECTS.map((s) => `<button class="chip-btn ${config.subjectId === s.id ? 'on' : ''}"
              data-subject="${s.id}" style="--main:${s.colors.main}">${escapeHtml(s.code)}</button>`).join('')}
          </div>
        </div>

        <div class="panel">
          <span class="badge">Number of Questions</span>
          <div class="chips">
            ${[3, 5, 8, 10].map((n) => `<button class="chip-btn ${config.count === n ? 'on' : ''}" data-count="${n}">${n} Questions</button>`).join('')}
          </div>
        </div>

        <div class="panel">
          <span class="badge">Time Limit</span>
          <div class="chips">
            ${[0, 5, 10, 15, 20].map((n) => `<button class="chip-btn ${config.minutes === n ? 'on' : ''}" data-minutes="${n}">${n === 0 ? 'No timer' : `${n} min`}</button>`).join('')}
          </div>
        </div>

        <div class="actions">
          <button class="btn btn-primary btn-lg" id="start">Start Mock Exam &rarr;</button>
        </div>
      </div>
    </div>`;
  }

  /* --------------------------------- paper --------------------------------- */
  function start() {
    const pool = ALL_QUESTIONS.filter((q) => config.subjectId === 'all' || q.subject.id === config.subjectId);
    const picked = [];
    const buckets = new Map();
    for (const q of pool) {
      if (!buckets.has(q.subject.id)) buckets.set(q.subject.id, []);
      buckets.get(q.subject.id).push(q);
    }
    for (const list of buckets.values()) list.sort(() => Math.random() - 0.5);
    let round = 0;
    while (picked.length < Math.min(config.count, pool.length)) {
      let added = false;
      for (const list of buckets.values()) {
        if (list[round]) {
          picked.push(list[round]);
          added = true;
          if (picked.length >= Math.min(config.count, pool.length)) break;
        }
      }
      if (!added) break;
      round += 1;
    }

    session = {
      picked,
      index: 0,
      answers: {},
      marks: {},
      endsAt: config.minutes ? Date.now() + config.minutes * 60000 : 0,
      timer: null,
      marksSaved: false,
    };

    setMusicWorld(picked[0].subject.world);
    paintQuestion();
  }

  function startTimer() {
    clearInterval(session.timer);
    if (!session.endsAt) return;
    session.timer = setInterval(() => {
      const el = document.getElementById('timer');
      if (!el) {
        clearInterval(session.timer);
        return;
      }
      const left = Math.max(0, session.endsAt - Date.now());
      const mins = Math.floor(left / 60000);
      const secs = Math.floor((left % 60000) / 1000);
      el.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
      el.classList.toggle('urgent', left < 60000);
      if (left <= 0) {
        clearInterval(session.timer);
        finish();
      }
    }, 1000);
  }

  function currentQ() {
    return session.picked[session.index];
  }

  function saveCurrentDraft() {
    if (!session) return;
    const q = currentQ();
    if (!q) return;
    const box = document.getElementById('answer');
    if (box) {
      session.answers[q.id] = box.value;
    }
  }

  function paintQuestion() {
    const q = currentQ();
    const draft = session.answers[q.id] || '';
    const total = session.picked.length;
    const n = session.index + 1;

    app.innerHTML = `
    <div class="screen exam">
      <div class="learn-head" style="--main:${q.subject.colors.main};--deep:${q.subject.colors.deep}">
        <div class="head-top">
          <button type="button" class="back" id="quit" aria-label="Quit Exam">
            <span class="back-arrow">&times;</span> <span>Quit</span>
          </button>
          <span class="chip">${escapeHtml(q.subject.code)} Q${q.num}</span>
          ${session.endsAt ? `<span class="timer" id="timer">--:--</span>` : ''}
        </div>
        <div class="learn-title">
          <h2>Question ${n} of ${total}</h2>
        </div>

        <div class="jump-bar">
          ${session.picked.map((pq, idx) => {
            const hasAns = Boolean(session.answers[pq.id]?.trim());
            const isCur = idx === session.index;
            return `<button type="button" class="jump-pill ${isCur ? 'current' : ''} ${hasAns ? 'answered' : ''}" data-jump="${idx}">${idx + 1}</button>`;
          }).join('')}
        </div>
      </div>

      <div class="pad">
        <div class="bar slim"><i style="width:${(n / total) * 100}%"></i></div>

        <div class="panel question-echo big">
          <div class="panel-head">
            <span class="badge">Question ${n}/${total}</span>
            <button class="speak" data-speak="${escapeHtml(q.question)}" data-clip="${q.subject.id}/${q.id}/question" aria-label="Read question aloud">🔊</button>
          </div>
          <p>${escapeHtml(q.question)}</p>
        </div>

        <div class="scene-card mini">
          ${scene(q.scene.art)}
          <p class="scene-cap">${escapeHtml(q.scene.caption)}</p>
        </div>

        <div class="textarea-container">
          <textarea id="answer" rows="7" placeholder="Write your explanation in your own words...">${escapeHtml(draft)}</textarea>
        </div>

        <div class="row-btns">
          ${session.index > 0 ? `<button type="button" class="btn" id="prev">&larr; Prev</button>` : ''}
          <button type="button" class="btn" id="peek">💡 Hint</button>
          <button type="button" class="btn btn-primary btn-grow" id="next">
            ${session.index === total - 1 ? 'Finish Exam &rarr;' : 'Next &rarr;'}
          </button>
        </div>
        <div id="hint"></div>
      </div>
    </div>`;

    startTimer();
  }

  /* -------------------------------- marking -------------------------------- */
  function markAll() {
    for (const q of session.picked) {
      const text = session.answers[q.id] || '';
      const result = gradeAnswer(q, text);
      const marks = scoreOutOfTen(result);
      session.marks[q.id] = { marks, result };
      recordAttempt(q.id, marks);
    }
  }

  function finish() {
    clearInterval(session.timer);
    saveCurrentDraft();
    markAll();

    const entries = session.picked.map((q) => ({ q, ...session.marks[q.id] }));
    const totalMarks = entries.reduce((a, e) => a + e.marks, 0);
    const maxMarks = entries.length * 10;
    const avg = entries.length ? totalMarks / entries.length : 0;

    const missed = new Map();
    for (const e of entries) {
      for (const miss of e.result.missed) {
        const idea = e.q.ideas.find((i) => i.key === miss.key);
        if (idea) missed.set(idea.term, (missed.get(idea.term) || 0) + 1);
      }
    }
    const topMissed = [...missed.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

    saveExam({
      subjectId: config.subjectId,
      count: session.picked.length,
      total: totalMarks,
      max: maxMarks,
      avg: Math.round(avg * 10) / 10,
    });

    if (avg >= 7) {
      sfx.mastered();
      confetti(70);
    } else {
      sfx.correct();
    }

    paintResults(entries, totalMarks, maxMarks, avg, topMissed);
  }

  function paintResults(entries, totalMarks, maxMarks, avg, topMissed) {
    const tone = markTone(Math.round(avg));

    app.innerHTML = `
    <div class="screen exam">
      <div class="learn-head" style="--main:#f43f5e;--deep:#7f1d1d">
        <div class="head-top">
          <a class="back" href="#/" aria-label="Back to Islands">
            <span class="back-arrow">&larr;</span> <span>All Islands</span>
          </a>
          <span class="chip">Score Card</span>
        </div>
        <div class="learn-title">
          <h2>Exam Result</h2>
        </div>
      </div>

      <div class="pad">
        <div class="card result big ${tone}">
          <div class="score-ring">
            <svg viewBox="0 0 120 120" width="120" height="120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" stroke-width="12"/>
              <circle cx="60" cy="60" r="52" fill="none" stroke="${avg >= 7 ? '#22c55e' : avg >= 5 ? '#f59e0b' : '#ef4444'}" stroke-width="12"
                stroke-linecap="round" stroke-dasharray="${2 * Math.PI * 52}"
                stroke-dashoffset="${2 * Math.PI * 52 * (1 - avg / 10)}" transform="rotate(-90 60 60)"/>
              <text x="60" y="60" text-anchor="middle" dominant-baseline="middle" font-size="28" font-weight="900" fill="#0f172a">${Math.round(avg)}/10</text>
            </svg>
          </div>
          <p class="verdict">${escapeHtml(
            avg >= 7 ? 'Exam ready! Solid understanding of the core concepts.'
              : avg >= 5 ? 'Good foundation! Revise the weak ideas below and retake.'
              : 'Revisit these concepts on the islands, then try again.',
          )}</p>
          <p class="muted">${totalMarks} total marks scored out of ${maxMarks}</p>
        </div>

        ${topMissed.length ? `
        <div class="panel">
          <span class="badge low">Highest Priority Concepts to Revise</span>
          <ul class="chips tight">
            ${topMissed.map(([term, n]) => `<li class="chip-btn static">${escapeHtml(term)} <b>${n}x missed</b></li>`).join('')}
          </ul>
        </div>` : ''}

        <div class="panel">
          <span class="badge">Question by Question Breakdown</span>
          <ol class="q-list results">
            ${entries.map((e) => {
              const missedTerms = e.result.missed
                .map((m) => e.q.ideas.find((i) => i.key === m.key)?.term)
                .filter(Boolean);
              return `<li class="res-row ${markTone(e.marks)}">
                <span class="q-num">${e.q.num}</span>
                <span class="q-topic">
                  <b>${escapeHtml(e.q.topic)}</b>
                  <small>${escapeHtml(e.q.subject.code)}</small>
                  ${missedTerms.length ? `<em class="tag low">missed: ${escapeHtml(missedTerms.slice(0, 3).join(', '))}${missedTerms.length > 3 ? '...' : ''}</em>` : '<em class="tag good">&check; all ideas covered</em>'}
                </span>
                <span class="q-best ${markTone(e.marks)}">${e.marks}/10</span>
              </li>`;
            }).join('')}
          </ol>
        </div>

        <div class="actions">
          <button type="button" class="btn btn-grow" id="retake">Retake Exam</button>
          <a class="btn btn-primary btn-grow" href="#/">Back to Islands</a>
        </div>
      </div>
    </div>`;
  }

  /* ------------------------------- interaction ----------------------------- */
  function onClick(event) {
    const sub = event.target.closest('[data-subject]');
    if (sub) {
      config.subjectId = sub.dataset.subject;
      sfx.tap();
      paintSetup();
      return;
    }
    const cnt = event.target.closest('[data-count]');
    if (cnt) {
      config.count = Number(cnt.dataset.count);
      sfx.tap();
      paintSetup();
      return;
    }
    const mins = event.target.closest('[data-minutes]');
    if (mins) {
      config.minutes = Number(mins.dataset.minutes);
      sfx.tap();
      paintSetup();
      return;
    }
    if (event.target.closest('#start')) {
      sfx.whoosh();
      start();
      return;
    }
    if (event.target.closest('#quit')) {
      if (confirm('Quit this mock exam? Current answers will not be scored.')) {
        clearInterval(session?.timer);
        sfx.tap();
        paintSetup();
      }
      return;
    }
    const speaker = event.target.closest('[data-speak]');
    if (speaker) {
      sfx.tap();
      speak(speaker.dataset.speak, { clipId: speaker.dataset.clip });
      return;
    }
    const jump = event.target.closest('[data-jump]');
    if (jump && session) {
      saveCurrentDraft();
      session.index = Number(jump.dataset.jump);
      sfx.tap();
      paintQuestion();
      return;
    }
    if (event.target.closest('#prev') && session) {
      saveCurrentDraft();
      if (session.index > 0) {
        session.index -= 1;
        sfx.tap();
        paintQuestion();
      }
      return;
    }
    if (event.target.closest('#peek')) {
      const q = currentQ();
      const terms = q.ideas.slice(0, 5).map((i) => i.term).join(', ');
      const hintEl = document.getElementById('hint');
      if (hintEl) {
        hintEl.innerHTML = `
          <div class="panel hint">
            <span class="badge">Exam Hint</span>
            <p>Your answer should mention ideas like:</p>
            <p><b>${escapeHtml(terms)}</b></p>
            <p class="muted">Express them in your own words. One mark per idea.</p>
          </div>`;
      }
      sfx.tap();
      return;
    }
    if (event.target.closest('#next') && session) {
      saveCurrentDraft();
      sfx.tap();
      if (session.index === session.picked.length - 1) {
        finish();
      } else {
        session.index += 1;
        paintQuestion();
      }
      return;
    }
    if (event.target.closest('#retake')) {
      sfx.tap();
      paintSetup();
    }
  }

  function onInput(event) {
    if (event.target.id === 'answer' && session) {
      const q = currentQ();
      if (q) session.answers[q.id] = event.target.value;
    }
  }

  paintSetup();
  app.addEventListener('click', onClick);
  app.addEventListener('input', onInput);

  return () => {
    clearInterval(session?.timer);
    stopSpeaking();
    app.removeEventListener('click', onClick);
    app.removeEventListener('input', onInput);
  };
}

