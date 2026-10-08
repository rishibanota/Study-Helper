# QuizQuest — Design Spec

A mobile-first, offline, cartoon learning game that teaches the concepts behind
38 exam questions across 5 subjects, so the student can **understand a topic and
write the answer in their own words** rather than reciting memorised sentences.

Runs from `localhost` via a zero-dependency Node.js server.

---

## 1. The problem being solved

The existing `Perfect Answer/*.pdf` files give 10 memorised points per question.
Reciting them works right up until the exam, where the student must *write* the
answer from memory and rephrase. The student explicitly rejected sentence
drilling:

> "I want to learn concept, I can't type the exact word-to-word answer? I am not a robot."

So the game is built around **idea coverage**, not string matching. The student
is never asked to reproduce a sentence. They are asked to *explain the idea*,
and the game checks whether the right **concepts** appeared.

## 2. Non-goals

- Not a flashcard memorisation app.
- Not an exact-text grader.
- No image, audio or font downloads — everything must work fully offline on a
  phone with no network.

## 3. Content scope

| Subject | Code | Questions |
|---|---|---|
| Wireless & Mobile Communication | WMC | 10 |
| Machine Learning & AI | AIML | 8 |
| Software Engineering | SEAP | 8 |
| Web Technology | WEB | 6 |
| UI/UX | UIUX | 6 |
| **Total** | | **38** |

All content is **newly authored** by this project in plain, easy English. The
existing PDF wording is deliberately *not* reused.

Each question carries:
- a **cartoon scene** (inline SVG) with an everyday **analogy**
- a one-paragraph plain-English **definition**
- **8–10 idea cards**, one exam point each, each with a short bold exam term, a
  plain explanation, a mini-visual, and grading keywords
- an original **mnemonic** whose initial letters match the idea order

## 4. Architecture

```
server.js              zero-dependency Node static server (http, fs, path only)
public/
  index.html
  css/style.css        mobile-first, portrait, safe-area aware
  js/
    app.js             bootstrap + hash router
    state.js           store, localStorage persistence
    audio.js           Web Audio SFX + music, SpeechSynthesis TTS
    art.js             SVG cartoon system: mascot, worlds, mini-visuals
    grader.js          idea-coverage grading engine  (pure, unit-tested)
    fx.js              confetti, shake, streak popups
    screens/           home, learn, exam, notebook
  data/                one module per subject + registry
test/grader.test.js    node:test unit tests for the grader
```

**Why vanilla JS + zero dependencies.** The target device is Android
(`/sdcard`, likely Termux). `npm install` there is slow and unreliable, so the
server uses only Node built-ins and the frontend has no build step. Sounds are
synthesised with the Web Audio API and speech uses `SpeechSynthesis`, so there
are zero media assets to ship or fail to load.

**Module boundaries.** `grader.js` is pure — no DOM, no audio, no storage. It is
the only module with real logic and the only one with unit tests. `art.js`,
`audio.js` and `fx.js` are pure presentation. `screens/*` only read `state.js`
and call into those.

## 5. The grading engine (core idea)

Input is free text, from typing or from browser speech-to-text. It is normalised
(lowercase, punctuation stripped, whitespace collapsed, common spelling slips
fenced) and then matched against each idea's `hit[]` synonym list.

```
score = ideasCovered / totalIdeas        -> marks out of 10
```

Per-idea verdicts drive the feedback:

- **hit** — the student covered it. The game echoes back *their own words* for
  that idea, so they see their phrasing was good enough.
- **miss** — one line of plain English naming the idea. Never "you must write X
  exactly".

Grading is deliberately generous: an idea is covered if *any* synonym matches.
This enforces the "not a robot" requirement — there is no single correct answer.

Speech recognition is best-effort and may be unavailable offline, so typing is
always present as an equal alternative.

## 6. Screens

1. **Home Map** — five cartoon islands, one per subject. Progress ring per
   question. Mascot gives tips.
2. **Learn a Concept** — scene → idea cards (each tap-to-hear) → *Your Turn*.
3. **Your Turn** — mascot asks for an explanation; speak or type; graded on
   idea coverage; retry; best attempt saved as the student's own note.
4. **Final Exam** — pick subject + question count + timer; each question is
   graded out of 10 exactly like the paper; final score plus weakest ideas.
5. **Notebook** — every saved own-words note, weak spots flagged, read aloud on
   tap.

## 7. Presentation

- Portrait-first. No horizontal scroll. `100dvh` layout.
- Safe-area insets for notches. 16px screen gutters, 14px card padding,
  >=48px tap targets, 17px+ body text.
- Cartoon worlds per subject (city / robot lab / build site / server room /
  design studio) drawn in SVG with moving clouds and floating shapes.
- Confetti, screen shake, streak counters, level-up celebrations.
- Separate mute toggles for music and effects.
- Progress, notes and best scores persist in `localStorage`.

## 8. Testing

- `node:test` unit tests for `grader.js`: normalisation, synonym matching,
  misspelling tolerance, empty input, partial coverage, punctuation-only input.
- Manual smoke test: server serves `/`, all data modules parse, no console
  errors on load.
