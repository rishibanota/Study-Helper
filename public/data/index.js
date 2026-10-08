import wmc from './wmc.js';
import aiml from './aiml.js';
import seap from './seap.js';
import web from './web.js';
import uiux from './uiux.js';

export const SUBJECTS = [wmc, aiml, seap, web, uiux];

export const ALL_QUESTIONS = SUBJECTS.flatMap((subject) =>
  subject.questions.map((question) => ({ ...question, subject })),
);

export const TOTAL_QUESTIONS = ALL_QUESTIONS.length;
