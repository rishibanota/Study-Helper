import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECTS, ALL_QUESTIONS, TOTAL_QUESTIONS } from '../public/data/index.js';

test('five subjects are registered with unique ids and codes', () => {
  assert.equal(SUBJECTS.length, 5);
  assert.equal(new Set(SUBJECTS.map((s) => s.id)).size, 5);
  assert.equal(new Set(SUBJECTS.map((s) => s.code)).size, 5);
});

test('every question id is unique across all subjects', () => {
  const ids = ALL_QUESTIONS.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every question carries a back-reference to its subject', () => {
  for (const q of ALL_QUESTIONS) {
    assert.ok(q.subject, `${q.id} has no subject`);
    assert.ok(q.subject.questions.some((sq) => sq.id === q.id), `${q.id} not found in its own subject`);
  }
});

test('all 38 questions are present', () => {
  assert.equal(TOTAL_QUESTIONS, 38);
});

test('each subject has a world and a full colour set for theming', () => {
  const worlds = new Set(['city', 'lab', 'site', 'server', 'studio']);
  for (const s of SUBJECTS) {
    assert.ok(worlds.has(s.world), `${s.id} has unknown world ${s.world}`);
    for (const key of ['main', 'deep', 'soft', 'accent']) {
      assert.match(s.colors[key], /^#[0-9a-f]{6}$/i, `${s.id} colour ${key} is not a hex colour`);
    }
  }
});

test('every question has between 8 and 10 ideas', () => {
  for (const q of ALL_QUESTIONS) {
    assert.ok(q.ideas.length >= 8 && q.ideas.length <= 10, `${q.id} has ${q.ideas.length} ideas`);
  }
});

test('every idea has a term, text, hint and at least 3 grading synonyms', () => {
  for (const q of ALL_QUESTIONS) {
    for (const idea of q.ideas) {
      const where = `${q.id}/${idea.key}`;
      assert.ok(idea.term?.trim(), `${where} has no term`);
      assert.ok(idea.text?.trim(), `${where} has no text`);
      assert.ok(idea.hint?.trim(), `${where} has no hint`);
      assert.ok(Array.isArray(idea.hit) && idea.hit.length >= 3, `${where} has too few synonyms`);
    }
  }
});

test('idea keys are unique inside each question', () => {
  for (const q of ALL_QUESTIONS) {
    const keys = q.ideas.map((i) => i.key);
    assert.equal(new Set(keys).size, keys.length, `${q.id} has duplicate idea keys`);
  }
});

test('every question has a mnemonic with one word per idea', () => {
  for (const q of ALL_QUESTIONS) {
    const words = q.mnemonic.line.trim().split(/\s+/).length;
    assert.equal(words, q.ideas.length, `${q.id}: ${q.ideas.length} ideas but ${words} mnemonic words`);
  }
});

test('every question has a scene, analogy, definition and the real exam wording', () => {
  for (const q of ALL_QUESTIONS) {
    assert.ok(q.scene?.art, `${q.id} has no scene art`);
    assert.ok(q.scene?.caption, `${q.id} has no scene caption`);
    assert.ok(q.analogy?.body, `${q.id} has no analogy`);
    assert.ok(q.definition?.trim(), `${q.id} has no definition`);
    assert.ok(q.question?.trim(), `${q.id} has no exam question`);
    assert.ok(q.topic?.trim(), `${q.id} has no topic`);
  }
});

test('content is plain ASCII - no curly quotes or dashes', () => {
  const bad = JSON.stringify(SUBJECTS).match(/[\u2018\u2019\u201C\u201D\u2013\u2014]/);
  assert.equal(bad, null, `found non-ascii character: ${bad}`);
});
