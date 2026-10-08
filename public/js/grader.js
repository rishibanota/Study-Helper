/**
 * Idea-coverage grader.
 *
 * Pure logic. No DOM, no audio, no storage - so it can be unit tested.
 *
 * The rule that matters: the student is never asked to reproduce a sentence.
 * An idea counts as covered when ANY of its listed synonyms appears, which is
 * what makes "write it in your own words" a real option.
 */

/** Words dropped before matching, so filler does not create false hits. */
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

/**
 * Fold common speech-recognition mishearings onto one spelling.
 * Only unambiguous pairs - never anything that could merge two real words.
 */
const MISHEARD = {
  suport: 'support',
  confidance: 'confidence',
  recieve: 'receive',
  seperat: 'separate',
  occured: 'occur',
  begining: 'begin',
  neccessary: 'necessary',
  acurate: 'accurate',
  definately: 'definitely',
  respons: 'response',
  milisecond: 'millisecond',
  transfered: 'transferred',
};

/** Collapse the forms that should count as one idea. */
const PHRASE_SPLIT = {
  multipath: 'multi path',
  cochannel: 'co channel',
  handover: 'handover',
  nomodel: 'no model',
  'non los': 'nlos',
};

const WORD_FIX = { ...MISHEARD, ...PHRASE_SPLIT };

/** Every char that is not a letter or digit. */
function stripToWords(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function foldWord(word) {
  return WORD_FIX[word] || word;
}

/**
 * Turn free text into a comparable phrase: lowercased, punctuation gone,
 * whitespace collapsed, known speech slips folded, filler words removed.
 *
 * @param {string} text
 * @returns {string}
 */
export function normalise(text) {
  if (typeof text !== 'string') return '';
  const words = stripToWords(text)
    .split(' ')
    .map(foldWord)
    .filter((w) => w && !FILLER.has(w));
  return words.join(' ');
}

/** Does `needle` (already normalised) appear inside `haystack` (normalised)? */
function containsPhrase(haystack, needle) {
  if (!needle) return false;
  return ` ${haystack} `.includes(` ${needle} `);
}

/**
 * Grade a free-text answer against a question's ideas.
 *
 * @param {{ideas?: Array<{key: string, hit?: string[], term?: string, hint?: string}>,}} question
 * @param {string} answerText
 * @returns {{score: number, covered: number, total: number,
 *            results: Array<{key: string, term?: string, covered: boolean, hint?: string}>,
 *            missed: Array<object>, text: string}}
 */
export function gradeAnswer(question, answerText) {
  const ideas = Array.isArray(question?.ideas) ? question.ideas : [];
  const text = normalise(answerText);
  const results = ideas.map((idea) => {
    const synonyms = (idea.hit || []).map(normalise).filter(Boolean);
    const covered = text !== '' && synonyms.some((s) => containsPhrase(text, s));
    return { key: idea.key, term: idea.term, covered, hint: idea.hint };
  });

  const covered = results.filter((r) => r.covered).length;
  const total = ideas.length;

  return {
    score: total ? covered / total : 0,
    covered,
    total,
    results,
    missed: results.filter((r) => !r.covered),
    text,
  };
}

/**
 * Marks out of ten, one mark per idea, rounded to nearest.
 * @param {{covered: number, total: number}} result
 * @returns {number}
 */
export function scoreOutOfTen(result) {
  if (!result?.total) return 0;
  return Math.round((result.covered / result.total) * 10);
}
