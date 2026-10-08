import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalise, gradeAnswer, scoreOutOfTen } from '../public/js/grader.js';
import { verdict } from '../public/js/util.js';

test('normalise lowercases, strips punctuation and collapses whitespace', () => {
  assert.equal(normalise('LOS,  propagation!'), 'los propagation');
  assert.equal(normalise('  Multi-Path   fading  '), 'multi path fading');
  assert.equal(normalise('Rician/Rayleigh'), 'rician rayleigh');
  assert.equal(normalise('co-channel interference.'), 'co channel interference');
});

test('normalise folds the common spelling slips the speech API returns', () => {
  assert.equal(normalise('suport'), 'support');
  assert.equal(normalise('confidance'), 'confidence');
  assert.equal(normalise('multipath'), 'multi path');
});

test('normalise folds joined and split variants onto one phrase', () => {
  assert.equal(normalise('co-channel interference'), 'co channel interference');
  assert.equal(normalise('cochannel interference'), 'co channel interference');
  assert.equal(normalise('multipath propagation'), 'multi path propagation');
});

test('a single synonym match counts as covering an idea', () => {
  const q = {
    ideas: [{ key: 'a', hit: ['line of sight', 'los', 'clear path'] }],
  };
  const r = gradeAnswer(q, 'It has a clear path');
  assert.equal(r.results[0].covered, true);
});

test('wording does not have to match - any listed synonym is enough', () => {
  const q = { ideas: [{ key: 'a', hit: ['shadowing', 'big obstacles blocking'] }] };
  const r = gradeAnswer(q, 'I think big obstacles blocking causes it');
  assert.equal(r.results[0].covered, true);
  assert.equal(r.score, 1);
});

test('an unrelated answer covers nothing', () => {
  const q = { ideas: [{ key: 'a', hit: ['shadowing'] }, { key: 'b', hit: ['fading'] }] };
  const r = gradeAnswer(q, 'I like pizza');
  assert.equal(r.score, 0);
  assert.equal(r.results.length, 2);
});

test('partial coverage reports exactly which ideas were missed', () => {
  const q = {
    ideas: [
      { key: 'a', hit: ['fresnel'] },
      { key: 'b', hit: ['rayleigh'] },
      { key: 'c', hit: ['rician'] },
      { key: 'd', hit: ['delay spread'] },
    ],
  };
  const r = gradeAnswer(q, 'the fresnel zone and rayleigh fading matter here');
  assert.equal(r.covered, 2);
  assert.equal(r.total, 4);
  assert.deepEqual(r.missed.map((i) => i.key), ['c', 'd']);
});

test('empty input scores zero without throwing', () => {
  const q = { ideas: [{ key: 'a', hit: ['x'] }] };
  const r = gradeAnswer(q, '   ');
  assert.equal(r.score, 0);
  assert.equal(r.covered, 0);
});

test('punctuation-only input scores zero without throwing', () => {
  const q = { ideas: [{ key: 'a', hit: ['x'] }] };
  const r = gradeAnswer(q, '!!! ??? ...');
  assert.equal(r.score, 0);
});

test('a question with no ideas is handled safely', () => {
  const r = gradeAnswer({ ideas: [] }, 'anything');
  assert.equal(r.total, 0);
  assert.equal(r.score, 0);
});

test('scoreOutOfTen rounds to one mark per idea', () => {
  assert.equal(scoreOutOfTen({ covered: 7, total: 10 }), 7);
  assert.equal(scoreOutOfTen({ covered: 3, total: 7 }), 4);
  assert.equal(scoreOutOfTen({ covered: 1, total: 3 }), 3);
  assert.equal(scoreOutOfTen({ covered: 0, total: 0 }), 0);
});

test('multi-word synonyms match as a phrase, not loose substrings', () => {
  const q = { ideas: [{ key: 'a', hit: ['free space path loss'] }] };
  assert.equal(gradeAnswer(q, 'free space is empty up here').score, 0);
  assert.equal(gradeAnswer(q, 'free space path loss applies').score, 1);
});

test('verdict correctly acknowledges full marks and edge scores', () => {
  assert.match(verdict(10, 10), /full marks/i);
  assert.match(verdict(10, 8), /full marks/i);
  assert.match(verdict(8, 10), /almost there/i);
  assert.match(verdict(5, 10), /good start/i);
  assert.match(verdict(2, 10), /seed/i);
  assert.match(verdict(0, 10), /no ideas matched/i);
});
