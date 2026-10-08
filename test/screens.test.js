import { test } from 'node:test';
import assert from 'node:assert/strict';

test('all screens render and return valid cleanups without throwing', async () => {
  global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    location: { hash: '#/' },
    matchMedia: () => ({ matches: false }),
  };
  function createMockEl() {
    return {
      innerHTML: '',
      value: '',
      classList: { add: () => {}, remove: () => {}, toggle: () => {} },
      addEventListener: () => {},
      removeEventListener: () => {},
      querySelector: () => createMockEl(),
      querySelectorAll: () => [],
      focus: () => {},
      scrollIntoView: () => {},
    };
  }
  global.document = {
    getElementById: () => createMockEl(),
    querySelector: () => createMockEl(),
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    body: createMockEl(),
  };
  global.localStorage = { getItem: () => null, setItem: () => {} };

  const { renderHome } = await import('../public/js/screens/home.js');
  const { renderLearn, renderSubject } = await import('../public/js/screens/learn.js');
  const { renderExam } = await import('../public/js/screens/exam.js');
  const { renderNotebook } = await import('../public/js/screens/notebook.js');
  const { SUBJECTS, ALL_QUESTIONS } = await import('../public/data/index.js');

  const c1 = renderHome();
  assert.equal(typeof c1, 'function');
  c1();

  const c2 = renderSubject(SUBJECTS[0]);
  assert.equal(typeof c2, 'function');
  c2();

  const c3 = renderLearn(ALL_QUESTIONS[0]);
  assert.equal(typeof c3, 'function');
  c3();

  const c4 = renderExam({});
  assert.equal(typeof c4, 'function');
  c4();

  const c5 = renderNotebook();
  assert.equal(typeof c5, 'function');
  c5();
});
