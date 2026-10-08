# QuizQuest content schema — read this before writing a data file

Create **one file per subject** at `public/data/<name>.js` exporting a single
default object. Use ONLY plain JavaScript data — no imports, no functions, no
comments needed beyond optional section markers.

## File shape

```js
export default {
  id: 'wmc',                  // short lowercase id, unique
  code: 'WMC',                // short label shown in UI
  name: 'Wireless & Mobile Communication',   // full subject name
  world: 'city',              // one of: city | lab | site | server | studio
  colors: { main: '#3b82f6', deep: '#1e3a8a', soft: '#dbeafe', accent: '#f59e0b' },
  blurb: 'One easy line about what this subject is about.',
  questions: [ /* see below */ ],
};
```

## Question shape

```js
{
  id: 'wmc-q1',               // `${subjectId}-q${num}`
  num: 1,                     // 1-based, matches the question bank numbering
  topic: 'LOS vs NLOS',       // 2-4 word title
  question: 'Differentiate between LOS and NLOS propagation.',  // the REAL exam question, verbatim from the bank
  scene: {
    art: 'los-nlos',          // pick a key from the list below
    caption: 'Shouting across a field vs shouting around a hill',
  },
  analogy: {
    title: 'Think of shouting',              // short, fun
    body: 'One or two sentences using an everyday comparison. This is what makes it click.',
  },
  definition: 'One or two plain sentences. No jargon. This is the "what is it" answer.',
  ideas: [ /* 8-10 items, see below */ ],
  mnemonic: {
    line: 'Clear Sky Keeps Signal High',     // initials match idea order
  },
}
```

## Idea shape — the heart of the whole app

```js
{
  key: 'los',                 // short machine id, lowercase, unique in this question
  term: 'LOS',                // THE EXAM KEYWORD. Shown bold. Must be a real exam term.
  text: 'One or two plain sentences explaining it. Easy words, short sentences.',
  hit: ['los', 'line of sight', 'clear path', 'straight path'],   // grading synonyms
  hint: 'One short line shown when the student misses this idea.',
}
```

### The `hit` array is the most important field

The grader marks an idea as covered if **ANY** item in `hit` appears in the
student's free-text answer. The student writes in their OWN words, so:

- Include the exam term itself plus **at least 3 everyday paraphrases**.
- Paraphrases must be words a student would *actually say*: "bounces off walls",
  "signal gets weaker", "slowly goes up and down", "big buildings in the way".
- Keep each entry to 1-4 words. The grader matches whole phrases.
- Never require an exact sentence. Never include a full-sentence match.

Good:
```js
hit: ['shadowing', 'big obstacles blocking', 'slowly changes', 'buildings in the way']
```
Bad (too strict, defeats the whole point):
```js
hit: ['shadowing is the slow random variation of average received power around the path loss mean']
```

### Rules

1. **8 to 10 ideas per question.** One exam mark per idea.
2. `term` must be the real technical/exam keyword — that is what earns the mark.
3. `text` must be genuinely easier than the PDF wording. Short sentences. No long noun stacks.
4. `hit` needs 3-6 entries: the exam term + 3+ real paraphrases.
5. `hint` is ONE short line, not a repeat of `text`.
6. `mnemonic.line` must have one word per idea, in order, whose first letters
   form a real memorable sentence. Count them and check they line up.
7. Everything must be understandable to someone who has not read the PDF.
8. Do NOT copy wording from the existing PDFs. Write it fresh.
9. Use plain ASCII apostrophes only (no curly quotes). Use `-` not en-dashes.

## Available `scene.art` keys

`los-nlos`, `pathloss`, `multipath`, `interference`, `handover`, `callsetup`,
`roaming`, `simcard`, `edgeai`, `5g`, `kmeans`, `apriori`, `pca`, `crossval`,
`confusion`, `overfit`, `tuning`, `risk`, `scm`, `testing`, `sqa`,
`maintenance`, `reengineering`, `agile`, `scrum`, `mongodb`, `crud`, `nodejs`,
`repl`, `express`, `rest`, `designthink`, `prototype`, `principles`,
`heuristics`, `usability`, `uxmetrics`

If your question has no matching key, reuse the closest one.

## When you finish

Run this to confirm the file is valid:
```
cd quizquest && node -e "import('./public/data/<name>.js').then(m=>{const d=m.default;console.log(d.code,d.questions.length,'questions');console.log(d.questions.map(q=>q.ideas.length).join(','))})"
```
Every number must be between 8 and 10.
