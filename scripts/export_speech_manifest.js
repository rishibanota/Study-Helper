import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_QUESTIONS } from '../public/data/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifest = [];

for (const q of ALL_QUESTIONS) {
  const subjectId = q.subject.id;
  const qId = q.id;

  // 1. Analogy
  manifest.push({
    id: `${subjectId}/${qId}/analogy`,
    text: `${q.analogy.title}. ${q.analogy.body}`,
    subjectId,
    qId,
    clip: 'analogy'
  });

  // 2. Definition
  manifest.push({
    id: `${subjectId}/${qId}/definition`,
    text: q.definition,
    subjectId,
    qId,
    clip: 'definition'
  });

  // 3. Question
  manifest.push({
    id: `${subjectId}/${qId}/question`,
    text: q.question,
    subjectId,
    qId,
    clip: 'question'
  });

  // 4. Mnemonic
  manifest.push({
    id: `${subjectId}/${qId}/mnemonic`,
    text: q.mnemonic.line,
    subjectId,
    qId,
    clip: 'mnemonic'
  });

  // 5. Ideas
  for (const idea of q.ideas) {
    manifest.push({
      id: `${subjectId}/${qId}/idea_${idea.key}`,
      text: `${idea.term}. ${idea.text}`,
      subjectId,
      qId,
      clip: `idea_${idea.key}`
    });
  }
}

// 6. UI prompts
manifest.push({
  id: `ui/exam_intro`,
  text: 'This is a full mock paper. Answer in your own words.',
  subjectId: 'ui',
  qId: 'common',
  clip: 'exam_intro'
});

manifest.push({
  id: `ui/notebook_intro`,
  text: 'These are your notes, written by you. Read them out loud before the exam.',
  subjectId: 'ui',
  qId: 'common',
  clip: 'notebook_intro'
});

const outPath = path.resolve(__dirname, 'speech_manifest.json');
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`Exported ${manifest.length} audio clips to ${outPath}`);
