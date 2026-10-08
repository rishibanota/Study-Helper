import { escapeHtml, richText, markTone, verdict } from '../util.js';
import { SUBJECTS } from '../../data/index.js';
import { getState, progressFor, noteFor, recordAttempt, saveNote, bumpStreak } from '../state.js';
import { buddy, world, scene } from '../art.js';
import { sfx, speak, stopSpeaking, setMusicWorld, createRecogniser, recognitionSupported } from '../audio.js';
import { gradeAnswer, scoreOutOfTen } from '../grader.js';
import { confetti, pop, shake } from '../fx.js';
import { simplifyIdea } from '../ai.js';

/**
 * One concept, taught then tested.
 *
 * Three steps: scene, idea cards, then the student's own words.
 * Includes interactive step navigation, collapsible ideas cheat-sheet in Your Turn,
 * live auto-saving draft, and robust mobile voice input.
 */
export function renderLearn(question, { focusIdea = 0 } = {}) {
  let step = 'scene';
  let peekOpen = false;
  let currentDraft = noteFor(question.id) || '';
  const treeStates = {};

  const app = document.getElementById('app');
  setMusicWorld(question.subject.world);

  let recogniser = null;
  let listening = false;
  let baseText = '';

  function stepNav(activeStep, q) {
    return `
    <nav class="step-nav" aria-label="Learning steps">
      <button type="button" class="step-tab ${activeStep === 'scene' ? 'active' : ''}" data-step="scene">
        <span>1. Story</span>
      </button>
      <button type="button" class="step-tab ${activeStep === 'ideas' ? 'active' : ''}" data-step="ideas">
        <span>2. Ideas (${q.ideas.length})</span>
      </button>
      <button type="button" class="step-tab ${activeStep === 'turn' ? 'active' : ''}" data-step="turn">
        <span>3. Your Turn</span>
      </button>
    </nav>`;
  }

  /* ------------------------------- step: scene ------------------------------ */
  function sceneStep(q, prog) {
    return `
    <div class="learn-head" style="--main:${q.subject.colors.main};--deep:${q.subject.colors.deep}">
      <div class="head-top">
        <a class="back" href="#/subject/${q.subject.id}" aria-label="Back to Subject">
          <span class="back-arrow">&larr;</span> <span>${escapeHtml(q.subject.code)}</span>
        </a>
        <span class="chip">${escapeHtml(q.subject.code)} Q${q.num}</span>
      </div>
      <div class="learn-title">
        <h2>${escapeHtml(q.topic)}</h2>
      </div>
      ${stepNav('scene', q)}
    </div>

    <div class="pad">
      <div class="scene-banner">
        <div class="scene-wrap">${world(q.subject.world)}</div>
        <div class="scene-card">
          ${sceneSvg(q)}
          <p class="scene-cap">${escapeHtml(q.scene.caption)}</p>
        </div>
      </div>

      <div class="panel analogy">
        <div class="panel-head">
          <span class="badge">Everyday Analogy</span>
          <h3>${escapeHtml(q.analogy.title)}</h3>
          <button class="speak" data-clip="${q.subject.id}/${q.id}/analogy" data-speak="${escapeHtml(q.analogy.title + '. ' + q.analogy.body)}" aria-label="Read analogy aloud">🔊</button>
        </div>
        <p>${escapeHtml(q.analogy.body)}</p>
      </div>

      <div class="panel definition">
        <div class="panel-head">
          <span class="badge">In Plain Words</span>
          <button class="speak" data-clip="${q.subject.id}/${q.id}/definition" data-speak="${escapeHtml(q.definition)}" aria-label="Read definition aloud">🔊</button>
        </div>
        <p>${escapeHtml(q.definition)}</p>
      </div>

      <div class="panel question-echo">
        <span class="badge">Real Exam Question</span>
        <p>${escapeHtml(q.question)}</p>
      </div>

      <div class="actions">
        <button class="btn btn-primary btn-lg" id="to-ideas">
          Show me the ${q.ideas.length} ideas &rarr;
        </button>
      </div>
      ${prog.best ? `<p class="muted center">Your best so far: <b>${prog.best}/10</b></p>` : ''}
    </div>`;
  }

  /* ------------------------------- step: ideas ------------------------------ */
  function ideasStep(q) {
    return `
    <div class="learn-head" style="--main:${q.subject.colors.main};--deep:${q.subject.colors.deep}">
      <div class="head-top">
        <button type="button" class="back" data-step="scene" aria-label="Back to Scene">
          <span class="back-arrow">&larr;</span> <span>Scene</span>
        </button>
        <span class="chip">${escapeHtml(q.subject.code)} Q${q.num}</span>
      </div>
      <div class="learn-title">
        <h2>Key Ideas & Keywords</h2>
      </div>
      ${stepNav('ideas', q)}
    </div>

    <div class="pad">
      <p class="muted center" style="margin-bottom:12px;">Tap 🔊 to hear an idea, or tap ✨ below it for a simpler 1-2 line explanation.</p>

      <ol class="ideas">
        ${q.ideas.map((idea, i) => {
          const tree = treeStates[i] || { open: false, text: '', provider: '', loading: false };
          return `
          <li class="idea" data-i="${i}">
            <span class="idea-n">${i + 1}</span>
            <div class="idea-body">
              <b>${escapeHtml(idea.term)}</b>
              <p>${richText(idea.text)}</p>
            </div>
            <div class="idea-actions">
              <button class="speak" data-clip="${q.subject.id}/${q.id}/idea_${idea.key}" data-speak="${escapeHtml(idea.term + '. ' + idea.text)}" aria-label="Read ${escapeHtml(idea.term)} aloud">🔊</button>
              <button type="button" class="ai-simplify-btn ${tree.loading ? 'loading' : ''} ${tree.open ? 'active' : ''}" data-tree-btn="${i}" aria-label="Explain ${escapeHtml(idea.term)} in simpler words" title="Explain simply with AI">✨</button>
            </div>
          </li>
          <li class="idea-tree-item ${tree.open ? 'open' : ''}" id="idea-tree-${i}" data-tree-for="${i}" style="${tree.open ? '' : 'display:none;'}">
            <div class="tree-branch">
              <div class="tree-guide" aria-hidden="true">
                <span class="tree-line"></span>
                <span class="tree-elbow">↳</span>
              </div>
              <div class="tree-card card">
                <div class="tree-card-header">
                  <div class="tree-badge">
                    <span class="tree-badge-icon">✨</span>
                    <span class="tree-badge-title">Simpler Words</span>
                    <span class="tree-provider-tag" id="tree-tag-${i}">${escapeHtml(tree.provider || 'AI')}</span>
                  </div>
                  <div class="tree-controls">
                    <button type="button" class="speak small tree-speak ${tree.text ? '' : 'disabled'}" id="tree-speak-${i}" data-speak="${escapeHtml(tree.text || '')}" aria-label="Listen to simple explanation" ${tree.text ? '' : 'disabled'}>🔊</button>
                    <button type="button" class="tree-icon-btn tree-refresh" data-tree-refresh="${i}" title="Get another unique explanation" aria-label="Explain another way">🔄</button>
                    <button type="button" class="tree-icon-btn tree-close" data-tree-close="${i}" title="Close" aria-label="Close">✕</button>
                  </div>
                </div>
                <div class="tree-body" id="tree-body-${i}">
                  ${tree.loading
                    ? '<div class="tree-loading"><span class="tree-spin">✨</span> Thinking simple words...</div>'
                    : tree.text
                      ? `<p class="tree-text">${escapeHtml(tree.text)}</p>`
                      : '<p class="tree-text muted">Tap ✨ to generate an easy 1-2 line explanation.</p>'
                  }
                </div>
              </div>
            </div>
          </li>`;
        }).join('')}
      </ol>

      <div class="panel mnemonic">
        <div class="panel-head">
          <span class="badge">Memory Trick</span>
          <button class="speak" data-clip="${q.subject.id}/${q.id}/mnemonic" data-speak="${escapeHtml(q.mnemonic.line)}" aria-label="Read mnemonic">🔊</button>
        </div>
        <p class="mnemonic-line">${escapeHtml(q.mnemonic.line)}</p>
        <p class="muted">The first letters, in order, match the ideas above.</p>
      </div>

      <div class="actions">
        <button class="btn btn-primary btn-lg" id="to-turn">
          ${buddy('happy', 36)}<span>Your Turn: Explain in your words &rarr;</span>
        </button>
      </div>
    </div>`;
  }

  function updateTreeDom(idx) {
    const tree = treeStates[idx] || { open: false, text: '', provider: '', loading: false };
    const treeItem = document.getElementById(`idea-tree-${idx}`);
    const btn = document.querySelector(`.ai-simplify-btn[data-tree-btn="${idx}"]`);
    const tag = document.getElementById(`tree-tag-${idx}`);
    const speakBtn = document.getElementById(`tree-speak-${idx}`);
    const body = document.getElementById(`tree-body-${idx}`);

    if (treeItem) {
      treeItem.style.display = tree.open ? '' : 'none';
      treeItem.classList.toggle('open', Boolean(tree.open));
    }
    if (btn) {
      btn.classList.toggle('loading', Boolean(tree.loading));
      btn.classList.toggle('active', Boolean(tree.open));
    }
    if (tag) {
      tag.textContent = tree.provider || 'AI';
    }
    if (speakBtn) {
      speakBtn.dataset.speak = tree.text || '';
      if (tree.text) {
        speakBtn.removeAttribute('disabled');
        speakBtn.classList.remove('disabled');
      } else {
        speakBtn.setAttribute('disabled', 'true');
        speakBtn.classList.add('disabled');
      }
    }
    if (body) {
      if (tree.loading) {
        body.innerHTML = '<div class="tree-loading"><span class="tree-spin">✨</span> Thinking simple words...</div>';
      } else if (tree.text) {
        body.innerHTML = `<p class="tree-text">${escapeHtml(tree.text)}</p>`;
      } else {
        body.innerHTML = '<p class="tree-text muted">Tap ✨ to generate an easy 1-2 line explanation.</p>';
      }
    }
  }

  async function handleSimplifyClick(idx) {
    const idea = question.ideas[idx];
    if (!idea) return;

    if (!treeStates[idx]) {
      treeStates[idx] = { open: true, text: '', provider: '', loading: true };
    } else {
      treeStates[idx].open = true;
      treeStates[idx].loading = true;
    }

    sfx.tap();
    updateTreeDom(idx);

    try {
      const res = await simplifyIdea({
        term: idea.term,
        text: idea.text,
        hint: idea.hint,
        question: question.topic || question.question,
        subject: question.subject?.code || question.subject?.id || '',
      });

      treeStates[idx].text = res.explanation;
      treeStates[idx].provider = res.provider;
      treeStates[idx].loading = false;
      sfx.correct();
    } catch {
      treeStates[idx].text = `${idea.term} means: ${idea.hint || idea.text}`;
      treeStates[idx].provider = 'QuizQuest Helper';
      treeStates[idx].loading = false;
    }

    updateTreeDom(idx);
  }

  /* -------------------------------- step: turn ------------------------------ */
  function turnStep(q) {
    const wordCount = currentDraft ? currentDraft.trim().split(/\s+/).filter(Boolean).length : 0;
    return `
    <div class="learn-head" style="--main:${q.subject.colors.main};--deep:${q.subject.colors.deep}">
      <div class="head-top">
        <button type="button" class="back" data-step="ideas" aria-label="Back to Ideas">
          <span class="back-arrow">&larr;</span> <span>Ideas</span>
        </button>
        <span class="chip">${escapeHtml(q.subject.code)} Q${q.num}</span>
      </div>
      <div class="learn-title">
        <h2>Your Turn to Explain</h2>
      </div>
      ${stepNav('turn', q)}
    </div>

    <div class="pad">
      <div class="buddy-row">
        ${buddy('wow', 72)}
        <div class="speech">
          <p>Explain <b>${escapeHtml(q.topic)}</b> in your own words. Write or speak freely!</p>
          <button class="speak" data-speak="Explain ${escapeHtml(q.topic)} in your own words." aria-label="Hear the prompt">🔊</button>
        </div>
      </div>

      <div class="peek-box">
        <button type="button" class="btn btn-peek" id="toggle-peek">
          <span>${peekOpen ? '🙈 Hide Idea Cheatsheet' : '💡 Peek Key Ideas & Mnemonic'}</span>
        </button>
        <div class="peek-drawer ${peekOpen ? 'open' : ''}" id="peek-drawer">
          <div class="peek-inner">
            <div class="peek-mnemonic"><b>Memory Line:</b> ${escapeHtml(q.mnemonic.line)}</div>
            <ul class="peek-ideas-list">
              ${q.ideas.map((idea, idx) => `<li><b>${idx + 1}. ${escapeHtml(idea.term)}</b>: <span class="muted">${escapeHtml(idea.hint || idea.text)}</span></li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <div class="textarea-container">
        <textarea id="answer" rows="6" placeholder="Type your answer in your own words, or tap Speak...">${escapeHtml(currentDraft)}</textarea>
        <div class="textarea-bar">
          <span class="word-counter" id="word-count">${wordCount} ${wordCount === 1 ? 'word' : 'words'}</span>
          ${currentDraft ? '<button type="button" class="btn-clear" id="clear-text">Clear</button>' : ''}
        </div>
      </div>

      <div class="row-btns">
        <button type="button" class="btn btn-mic" id="mic">🎤 Speak</button>
        <button type="button" class="btn btn-primary btn-grow" id="check">Check My Answer</button>
      </div>

      <p class="mic-hint muted" id="mic-hint"></p>
      <div id="result"></div>
    </div>`;
  }

  /* -------------------------------- rendering ------------------------------- */
  function paint() {
    stopListening();
    const screen = document.querySelector('.screen.learn');
    if (!screen) return;
    if (step === 'scene') screen.innerHTML = sceneStep(question, progressFor(question.id));
    else if (step === 'ideas') screen.innerHTML = ideasStep(question);
    else screen.innerHTML = turnStep(question);

    if (step === 'ideas' && focusIdea >= 0) {
      document.querySelector(`.idea[data-i="${focusIdea}"]`)?.scrollIntoView({ block: 'center' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  /* ------------------------------- mic handling ----------------------------- */
  async function toggleMic() {
    const btn = document.getElementById('mic');
    const hint = document.getElementById('mic-hint');
    const box = document.getElementById('answer');

    if (!recogniser) {
      if (!recognitionSupported()) {
        if (hint) hint.textContent = 'Voice input is not supported in this browser. Typing works great!';
        return;
      }
      recogniser = createRecogniser({
        onResult: (final, interim) => {
          const merged = [baseText, final, interim].filter(Boolean).join(' ').trim();
          if (box) {
            box.value = merged;
            currentDraft = merged;
            updateWordCount();
          }
        },
        onError: (err) => {
          if (hint) {
            hint.textContent = err === 'not-allowed'
              ? 'Microphone access denied. You can type your answer instead.'
              : `Speech recognition ended (${err}). Type your answer anytime.`;
          }
          stopListening();
        },
        onEnd: () => stopListening(),
      });
    }

    if (listening) {
      recogniser.stop();
      stopListening();
      return;
    }

    baseText = box ? box.value.trim() : '';
    if (hint) hint.textContent = 'Listening... Speak clearly into your mic.';
    if (btn) {
      btn.classList.add('live');
      btn.textContent = '⏹ Stop';
    }
    listening = true;
    recogniser.start();
  }

  function stopListening() {
    if (!listening) return;
    listening = false;
    try {
      recogniser?.stop();
    } catch {
      // ignore
    }
    const btn = document.getElementById('mic');
    if (btn) {
      btn.classList.remove('live');
      btn.textContent = '🎤 Speak';
    }
    const hint = document.getElementById('mic-hint');
    if (hint && hint.textContent.startsWith('Listening...')) {
      hint.textContent = '';
    }
  }

  function updateWordCount() {
    const el = document.getElementById('word-count');
    if (el) {
      const words = currentDraft.trim().split(/\s+/).filter(Boolean).length;
      el.textContent = `${words} ${words === 1 ? 'word' : 'words'}`;
    }
  }

  /* -------------------------------- checking -------------------------------- */
  function check() {
    const box = document.getElementById('answer');
    const text = box ? box.value.trim() : '';
    const out = document.getElementById('result');
    if (!out) return;

    if (!text) {
      out.innerHTML = `<div class="card warn"><p>Write or speak your explanation first. There is no wrong way to say it!</p></div>`;
      shake(out);
      return;
    }

    currentDraft = text;
    const result = gradeAnswer(question, text);
    const marks = scoreOutOfTen(result);
    recordAttempt(question.id, marks);
    saveNote(question.id, text);

    if (marks >= 8) {
      const streak = bumpStreak();
      sfx.mastered();
      confetti();
      pop(`Streak ${streak}!`);
    } else if (result.covered > 0) {
      sfx.correct();
    } else {
      sfx.wrong();
      shake(out);
    }

    out.innerHTML = feedback(result, marks, text);
    out.scrollIntoView({ block: 'start', behavior: 'smooth' });
    sfx.tap();
  }

  function feedback(result, marks, text) {
    const tone = markTone(marks);
    const hitList = result.results
      .map((r, i) => ({ ...r, idea: question.ideas[i] }))
      .filter((r) => r.covered)
      .map((r) => `<li><b>${escapeHtml(r.idea.term)}</b> <span class="muted">&bull; covered</span></li>`)
      .join('');

    const missList = result.missed
      .map((r) => {
        const idea = question.ideas.find((i) => i.key === r.key);
        return `<li>
          <div class="miss-info">
            <b>${escapeHtml(idea.term)}</b>
            <p>${escapeHtml(idea.hint || idea.text)}</p>
          </div>
          <button class="speak small" data-clip="${question.subject.id}/${question.id}/idea_${idea.key}" data-speak="${escapeHtml(`${idea.term}. ${idea.hint || idea.text}`)}" aria-label="Read idea aloud">🔊</button>
        </li>`;
      })
      .join('');

    return `
    <div class="card result ${tone}">
      <div class="marks">
        <span class="marks-num">${marks}</span>
        <span class="marks-den">/10</span>
      </div>
      <p class="verdict">${escapeHtml(verdict(marks, 10))}</p>
      <p class="muted">Idea coverage grading: your wording is checked for core concepts, never exact phrases.</p>
    </div>

    <div class="panel">
      <span class="badge good">You covered ${result.covered} / ${result.total} ideas</span>
      <ul class="idea-list">${hitList || '<li class="muted">No key ideas detected yet. Check the missed ideas below!</li>'}</ul>
    </div>

    ${missList ? `
    <div class="panel">
      <span class="badge low">Add these ideas to score higher</span>
      <ul class="idea-list miss">${missList}</ul>
      <button class="btn btn-grow" id="again" style="margin-top:10px; width:100%">Add these and try again</button>
    </div>` : ''}

    <div class="panel saved-note">
      <div class="panel-head">
        <span class="badge">Saved into Your Notebook</span>
        <button class="speak" data-speak="${escapeHtml(text)}" aria-label="Read note aloud">🔊</button>
      </div>
      <p>${escapeHtml(text)}</p>
    </div>

    <div class="actions">
      <a class="btn btn-grow" href="#/subject/${question.subject.id}">Back to ${escapeHtml(question.subject.code)}</a>
      <a class="btn btn-primary btn-grow" href="#/exam?subject=${question.subject.id}">Test on ${escapeHtml(question.subject.code)} Exam</a>
    </div>`;
  }

  function sceneSvg(q) {
    return scene(q.scene.art);
  }

  /* ------------------------------- event handling --------------------------- */
  function onClick(event) {
    const stepLink = event.target.closest('[data-step]');
    if (stepLink) {
      stopSpeaking();
      step = stepLink.dataset.step;
      paint();
      return;
    }

    if (event.target.closest('#to-ideas')) {
      sfx.whoosh();
      step = 'ideas';
      paint();
      return;
    }

    if (event.target.closest('#to-turn')) {
      sfx.whoosh();
      step = 'turn';
      paint();
      document.getElementById('answer')?.focus({ preventScroll: true });
      return;
    }

    if (event.target.closest('#toggle-peek')) {
      peekOpen = !peekOpen;
      sfx.tap();
      const drawer = document.getElementById('peek-drawer');
      const btn = document.getElementById('toggle-peek');
      if (drawer) drawer.classList.toggle('open', peekOpen);
      if (btn) btn.innerHTML = `<span>${peekOpen ? '🙈 Hide Idea Cheatsheet' : '💡 Peek Key Ideas & Mnemonic'}</span>`;
      return;
    }

    if (event.target.closest('#clear-text')) {
      currentDraft = '';
      const box = document.getElementById('answer');
      if (box) box.value = '';
      updateWordCount();
      sfx.tap();
      return;
    }

    const treeBtn = event.target.closest('[data-tree-btn]');
    if (treeBtn) {
      const idx = Number(treeBtn.dataset.treeBtn);
      handleSimplifyClick(idx);
      return;
    }

    const treeRefresh = event.target.closest('[data-tree-refresh]');
    if (treeRefresh) {
      const idx = Number(treeRefresh.dataset.treeRefresh);
      handleSimplifyClick(idx);
      return;
    }

    const treeClose = event.target.closest('[data-tree-close]');
    if (treeClose) {
      const idx = Number(treeClose.dataset.treeClose);
      if (treeStates[idx]) {
        treeStates[idx].open = false;
        updateTreeDom(idx);
      }
      return;
    }

    const speaker = event.target.closest('[data-speak]');
    if (speaker) {
      if (speaker.disabled || !speaker.dataset.speak) return;
      sfx.tap();
      speak(speaker.dataset.speak, { clipId: speaker.dataset.clip });
      speaker.classList.add('speaking');
      setTimeout(() => speaker.classList.remove('speaking'), 1400);
      return;
    }

    if (event.target.closest('#mic')) {
      toggleMic();
      return;
    }

    if (event.target.closest('#check')) {
      check();
      return;
    }

    if (event.target.closest('#again')) {
      const box = document.getElementById('answer');
      box?.focus();
      box?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  function onInput(event) {
    if (event.target.id === 'answer') {
      currentDraft = event.target.value;
      updateWordCount();
    }
  }

  app.innerHTML = `<div class="screen learn">${sceneStep(question, progressFor(question.id))}</div>`;
  app.addEventListener('click', onClick);
  app.addEventListener('input', onInput);

  return () => {
    stopSpeaking();
    stopListening();
    app.removeEventListener('click', onClick);
    app.removeEventListener('input', onInput);
  };
}

/** Subject list: one row per question with its progress ring. */
export function renderSubject(subject) {
  const state = getState();
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="screen subject-page">
      <div class="learn-head" style="--main:${subject.colors.main};--deep:${subject.colors.deep}">
        <div class="head-top">
          <a class="back" href="#/" aria-label="Back to Islands">
            <span class="back-arrow">&larr;</span> <span>All Islands</span>
          </a>
          <span class="chip">${escapeHtml(subject.code)}</span>
        </div>
        <div class="learn-title">
          <h2>${escapeHtml(subject.name)}</h2>
        </div>
      </div>
      <div class="pad">
        <div class="scene-wrap short">${world(subject.world)}</div>
        <p class="muted" style="margin-bottom:14px;">${escapeHtml(subject.blurb)}</p>
        <ol class="q-list">
          ${subject.questions.map((q) => {
            const p = state.progress[q.id];
            const best = p?.best || 0;
            const note = state.notes[q.id];
            return `<li>
              <a class="q-row" href="#/learn/${q.id}">
                <span class="q-num">${q.num}</span>
                <span class="q-topic">
                  <b>${escapeHtml(q.topic)}</b>
                  <small>${escapeHtml(q.question)}</small>
                  ${note ? '<em class="tag">note saved</em>' : ''}
                </span>
                <span class="q-best ${best >= 8 ? 'good' : best > 0 ? 'mid' : ''}">${best ? `${best}/10` : 'new'}</span>
              </a>
            </li>`;
          }).join('')}
        </ol>
        <div class="actions">
          <a class="btn btn-primary btn-lg btn-grow" href="#/exam?subject=${subject.id}">
            Final Exam on ${escapeHtml(subject.code)} &rarr;
          </a>
        </div>
      </div>
    </div>`;

  return () => {
    stopSpeaking();
  };
}

export { SUBJECTS };

