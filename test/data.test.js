import { test } from 'node:test';
import assert from 'node:assert/strict';
import wmc from '../public/data/wmc.js';

const NON_ASCII = /[\u2018\u2019\u201C\u201D\u2013\u2014\u2192]/;

test('subject metadata is present', () => {
  assert.equal(wmc.id, 'wmc');
  assert.equal(wmc.code, 'WMC');
  assert.ok(wmc.questions.length >= 8);
});

test('every question is numbered 1..10 in bank order', () => {
  assert.deepEqual(wmc.questions.map((q) => q.num), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test('every idea has a term, plain text, at least 3 synonyms and a hint', () => {
  for (const q of wmc.questions) {
    for (const idea of q.ideas) {
      const where = `q${q.num}/${idea.key}`;
      assert.ok(idea.term, `${where} missing term`);
      assert.ok(idea.text && idea.text.length > 15, `${where} text too short`);
      assert.ok(Array.isArray(idea.hit) && idea.hit.length >= 3, `${where} needs >=3 hit synonyms`);
      assert.ok(idea.hint, `${where} missing hint`);
    }
  }
});

test('idea keys are unique within each question', () => {
  for (const q of wmc.questions) {
    const keys = q.ideas.map((i) => i.key);
    assert.equal(new Set(keys).size, keys.length, `q${q.num} has duplicate idea keys`);
  }
});

test('every synonym survives grader normalisation', () => {
  // A synonym made only of filler words reduces to empty and can never match.
  for (const q of wmc.questions) {
    for (const idea of q.ideas) {
      for (const phrase of idea.hit) {
        assert.notEqual(normalisePhrase(phrase), '', `q${q.num}/${idea.key} synonym "${phrase}" is all filler`);
      }
    }
  }
});

test('the mnemonic has exactly one word per idea', () => {
  for (const q of wmc.questions) {
    const words = q.mnemonic.line.trim().split(/\s+/).length;
    assert.equal(words, q.ideas.length, `q${q.num} has ${q.ideas.length} ideas but ${words} mnemonic words`);
  }
});

test('every question has an analogy, a definition and a scene', () => {
  for (const q of wmc.questions) {
    assert.ok(q.analogy?.body, `q${q.num} missing analogy`);
    assert.ok(q.definition, `q${q.num} missing definition`);
    assert.ok(q.scene?.art, `q${q.num} missing scene art`);
    assert.ok(q.question, `q${q.num} missing exam question`);
  }
});

test('content is plain ASCII with no curly quotes or dashes', () => {
  const json = JSON.stringify(wmc);
  const bad = json.match(NON_ASCII);
  assert.equal(bad, null, `found non-ascii: ${bad}`);
});

// Local copy of the grader's filler-word list, so this test stays independent.
const FILLER = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'and', 'or', 'as',
  'it', 'its', 'this', 'that', 'these', 'those', 'there', 'here',
  'we', 'i', 'you', 'they', 'he', 'she', 'them', 'his', 'her', 'their',
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might',
  'have', 'has', 'had', 'do', 'does', 'did', 'not', 'no', 'so', 'if',
  'then', 'than', 'when', 'what', 'which', 'who', 'how', 'why',
  'very', 'more', 'most', 'some', 'any', 'all', 'each', 'other',
]);

function normalisePhrase(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((w) => w && !FILLER.has(w))
    .join(' ');
}
