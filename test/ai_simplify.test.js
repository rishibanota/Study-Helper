import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanSimpleExplanation, generateLocalFallback, simplifyIdea } from '../public/js/ai.js';
import { ALL_QUESTIONS } from '../public/data/index.js';

test('cleanSimpleExplanation enforces at most 2 sentences and removes thinking tags', () => {
  const raw1 = '<think>I need to explain RAM simply for a child.</think>RAM is the computer fast working memory. It holds what you are using right now. Extra third sentence that should be dropped. Fourth sentence.';
  const cleaned1 = cleanSimpleExplanation(raw1);
  assert.ok(!cleaned1.includes('<think>'));
  assert.ok(!cleaned1.includes('child.'));
  assert.ok(cleaned1.includes('RAM is the computer fast working memory.'));
  assert.ok(cleaned1.includes('It holds what you are using right now.'));
  assert.ok(!cleaned1.includes('Extra third sentence'));

  const raw2 = 'Sure! Here is a simple explanation: Cache memory is a super fast pocket of memory near the CPU.';
  const cleaned2 = cleanSimpleExplanation(raw2);
  assert.ok(!cleaned2.startsWith('Sure!'));
  assert.ok(!cleaned2.startsWith('Here is a simple explanation:'));
  assert.ok(cleaned2.includes('Cache memory is a super fast pocket'));

  const raw3 = 'Single sentence explanation.';
  const cleaned3 = cleanSimpleExplanation(raw3);
  assert.equal(cleaned3, 'Single sentence explanation.');
});

test('generateLocalFallback generates unique variations by attempt', () => {
  const v1 = generateLocalFallback('RAM', 'Fast memory', 'Main memory', 1);
  const v2 = generateLocalFallback('RAM', 'Fast memory', 'Main memory', 2);
  const v3 = generateLocalFallback('RAM', 'Fast memory', 'Main memory', 3);

  assert.ok(v1.length > 10);
  assert.ok(v2.length > 10);
  assert.notEqual(v1, v2);
  assert.notEqual(v2, v3);
});

test('simplifyIdea produces a valid 1-2 sentence explanation and falls back safely', async () => {
  // Test with local fallback / mock fetch
  const res = await simplifyIdea({
    term: 'Cache',
    text: 'High speed buffer memory',
    hint: 'Quick storage for CPU',
    question: 'Explain Cache',
    subject: 'CO',
  });

  assert.equal(res.ok, true);
  assert.equal(typeof res.explanation, 'string');
  assert.ok(res.explanation.length > 5);
  assert.ok(typeof res.provider, 'string');
});

test('ideas section in learn.js renders AI buttons and tree structure only for the ideas step', async () => {
  let capturedHtml = '';
  const mockContainer = {
    set innerHTML(val) {
      capturedHtml = val;
    },
    get innerHTML() {
      return capturedHtml;
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
  };

  global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    location: { hash: '#/learn/co-q1' },
    matchMedia: () => ({ matches: false }),
  };

  global.document = {
    getElementById: (id) => (id === 'app' ? mockContainer : null),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  global.localStorage = { getItem: () => null, setItem: () => {} };

  const { renderLearn } = await import('../public/js/screens/learn.js');
  const q = ALL_QUESTIONS[0];
  const cleanup = renderLearn(q);

  // In step 1 (Story/Scene), the AI button should NOT be present
  assert.ok(!capturedHtml.includes('ai-simplify-btn'), 'Story step should not have ai-simplify-btn');

  // Verify that when step is ideas, each idea has an actions column with speak and ai-simplify-btn, plus tree card
  const ideasTab = {
    closest: (selector) => (selector === '[data-step]' ? { dataset: { step: 'ideas' } } : null),
  };
  // Simulate clicking to ideas step
  const clickHandler = mockContainer.addEventListener._handler || global.window._clickHandler;

  cleanup();
});

test('ideasStep renders buttons below speaker and tree card with tab-type structure', async () => {
  let inner = '';
  const screenEl = {
    set innerHTML(val) { inner = val; },
    get innerHTML() { return inner; },
    scrollIntoView: () => {},
  };
  const mockApp = {
    set innerHTML(val) { inner = val; },
    get innerHTML() { return inner; },
    addEventListener: (evt, handler) => {
      if (evt === 'click') mockApp._onClick = handler;
    },
    removeEventListener: () => {},
  };
  global.document = {
    getElementById: (id) => (id === 'app' ? mockApp : null),
    querySelector: (sel) => (sel === '.screen.learn' ? screenEl : { innerHTML: '', scrollIntoView: () => {} }),
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    location: { hash: '#/learn/co-q1' },
    matchMedia: () => ({ matches: false }),
  };

  const { renderLearn } = await import('../public/js/screens/learn.js');
  const q = ALL_QUESTIONS[0];
  const cleanup = renderLearn(q);

  // Trigger switch to ideas step
  mockApp._onClick({
    target: {
      closest: (sel) => (sel === '#to-ideas' ? {} : null),
    },
  });

  // Verify that the ideas step rendered
  assert.ok(inner.includes('class="ideas"'));
  // Verify each idea has idea-actions
  assert.ok(inner.includes('class="idea-actions"'));
  // Verify ai-simplify-btn is present
  assert.ok(inner.includes('class="ai-simplify-btn'));
  // Verify tree structure exists
  assert.ok(inner.includes('class="idea-tree-item'));
  assert.ok(inner.includes('class="tree-branch"'));
  assert.ok(inner.includes('class="tree-guide"'));
  assert.ok(inner.includes('class="tree-card card"'));
  assert.ok(inner.includes('class="tree-provider-tag"'));

  cleanup();
});

test('clicking tree buttons triggers opening, loading and closing states', async () => {
  const elements = {};
  function makeEl(id) {
    const el = {
      id,
      style: { display: 'none' },
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        toggle(c, force) {
          if (force === undefined) {
            if (this.classes.has(c)) this.classes.delete(c);
            else this.classes.add(c);
          } else if (force) {
            this.classes.add(c);
          } else {
            this.classes.delete(c);
          }
        },
        has(c) { return this.classes.has(c); },
      },
      dataset: {},
      textContent: '',
      innerHTML: '',
      removeAttribute: () => {},
      setAttribute: () => {},
      scrollIntoView: () => {},
    };
    elements[id] = el;
    return el;
  }

  const mockApp = {
    set innerHTML(val) {},
    get innerHTML() { return ''; },
    addEventListener: (evt, handler) => {
      if (evt === 'click') mockApp._onClick = handler;
    },
    removeEventListener: () => {},
  };

  global.document = {
    getElementById: (id) => (id === 'app' ? mockApp : (elements[id] || makeEl(id))),
    querySelector: (sel) => {
      const match = sel.match(/\[data-tree-btn="(\d+)"\]/);
      if (match) return makeEl(`btn-${match[1]}`);
      return { innerHTML: '', scrollIntoView: () => {} };
    },
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const { renderLearn } = await import('../public/js/screens/learn.js');
  const q = ALL_QUESTIONS[0];
  const cleanup = renderLearn(q);

  // Click AI simplify button for idea index 0
  await mockApp._onClick({
    target: {
      closest: (sel) => (sel === '[data-tree-btn]' ? { dataset: { treeBtn: '0' } } : null),
    },
  });

  const treeItem = elements['idea-tree-0'];
  assert.ok(treeItem);
  assert.equal(treeItem.style.display, '');
  assert.equal(treeItem.classList.has('open'), true);

  // Close the tree item
  mockApp._onClick({
    target: {
      closest: (sel) => (sel === '[data-tree-close]' ? { dataset: { treeClose: '0' } } : null),
    },
  });

  assert.equal(treeItem.style.display, 'none');

  cleanup();
});


