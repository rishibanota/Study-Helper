# Study-Helper

A mobile-first, offline cartoon learning game: understand a concept, then write the answer **in your own words**. No memorised sentences, no exact-text matching — the grader checks idea coverage.

> **Personal-project note:** this was my own study project that I'm sharing for fun. It was never intended as a polished product, so it still contains **my notes, my mnemonics, and my sample voiceovers** as a first impression / example. **Your syllabus will be different — please modify the content files for your own subjects.** Delete / replace anything that isn't yours.

## What you get

- 5 example subjects, 38 questions (Wireless, AIML, Software Eng, Web Tech, UI/UX) in `public/data/*.js` — **treat these as examples, replace with yours**
- Learn screen (analogy + definition + 8–10 idea cards), Your Turn (speak/type, graded), Mock Exam, Notebook (your own-words notes)
- Zero-dependency Node static server — runs on a laptop or phone (Termux)
- AI "simplify" helper with graceful fallbacks: OpenRouter → Pollinations → local text → browser TTS
- Optional pre-rendered neural voiceovers (`public/audio/`) with automatic fallback to free browser `SpeechSynthesis` when mp3s are missing

## Quick start (try my notes first)

```bash
node server.js
# On this computer:  http://localhost:8081
# On your phone (same Wi-Fi): http://<your-lan-ip>:8081
```

No `npm install` needed. Requires Node >= 18.

```bash
npm test   # runs grader + content + data validation tests
```

## Set up YOUR notes (the important part)

You need two things:

1. **Your PDF / question bank** — the file that has your topics / exam questions to explain.
2. **An agentic CLI tool** like [opencode](https://opencode.ai/docs), Codex, Claude Code, Aider, etc. — to turn each PDF question into a data file.

Everything editable lives in `public/data/`. One file per subject, plain JS data, no build step.

### Step 1 — Read the schema

Open `docs/CONTENT-SCHEMA.md`. It defines the exact shape:

```
subject -> questions[8-10 ideas each] -> idea { key, term, text, hit[], hint }
+ analogy, definition, mnemonic, scene.art
```

`hit[]` is the grader: an idea counts as covered if **any** phrase in `hit` appears in the student's answer. Include the exam term + 3+ everyday paraphrases a real student would say.

### Step 2 — Generate one subject file with AI

Point your CLI tool at your PDF + the schema. Example prompt:

> Read `docs/CONTENT-SCHEMA.md` and my `syllabus.pdf` (Q1: "…", Q2: "…").
> Create `public/data/mysubject.js` following the schema exactly.
> Rules: 8–10 ideas per question, plain easy English, do NOT copy PDF wording, `hit` = exam term + 3 everyday paraphrases, mnemonic initials match idea order, plain ASCII quotes only.
> Then validate with: `node -e "import('./public/data/mysubject.js').then(m=>{...})"`

Repeat for each subject. Keep files small (one subject each).

### Step 3 — Register the subject

Edit `public/data/index.js`:

```js
import mysubject from './mysubject.js';
export const SUBJECTS = [mysubject /*, ...old ones you kept */];
```

Delete my example files you don't need (e.g. `wmc.js`, `aiml.js`, …) and remove their imports.

### Step 4 — Validate

```bash
npm test
node scripts/export_speech_manifest.js  # regenerates speech_manifest.json from YOUR new data
```

Open the app, try Learn → Your Turn → Exam → Notebook. Fix any `hit` phrases that feel too strict.

## Optional: AI simplify keys (works without them)

`/api/simplify` reads keys **only from environment variables**. There are no keys in this repo.

```bash
cp .env.example .env   # then fill in your own keys
export OPENROUTER_API_KEY="sk-or-v1-..."
export POLLINATIONS_API_KEY="..."
node server.js
```

- Without `OPENROUTER_API_KEY`: skips OpenRouter, tries Pollinations, then local fallback — app still works.
- Without any key: fully offline local explanations + browser TTS.
- Get a key at https://openrouter.ai/keys (Pollinations key is optional).
- Never hardcode keys in `server.js` or commit `.env`.

## Optional: voiceovers (my mp3s are just samples)

- My local copy has 4 Kokoro voices under `public/audio/` (~30 MB each). They are **samples** — listen for a first impression, then delete or regenerate.
- `public/audio/` is in `.gitignore` by default so you don't push 120+ MB / 2000+ mp3s. To share one demo voice: `git add -f public/audio/bf_emma`
- To regenerate for YOUR content:
  1. `node scripts/export_speech_manifest.js`
  2. Run `scripts/colab_generator.py` in Colab (Kokoro + GPU) — see comments in that file
  3. Unzip the result into `public/audio/`
- If no mp3 exists for a clip, the app automatically uses browser speech — nothing breaks.

## Project structure

```
server.js                  zero-dep static server + /api/simplify
public/
  index.html / css/ / js/  app, grader, audio, screens
  data/*.js                <-- EDIT THESE for your notes
  audio/                   optional mp3s (gitignored)
docs/CONTENT-SCHEMA.md     how to write a subject file
docs/DESIGN.md             why it works this way
scripts/export_speech_manifest.js  rebuild TTS list from data
scripts/colab_generator.py         bulk neural TTS on Colab
test/                      node:test unit tests
```

## Open source / privacy

- MIT-licensed (see `LICENSE` — replace author name with yours if you fork).
- No analytics, no tracking, notes stay in `localStorage` on device.
- Before pushing: `grep -r "sk-" --exclude-dir=node_modules .` should return nothing; never commit `.env` or `public/audio/` unless you mean to.
- My exam questions / mnemonics may be wrong or outdated for you — verify against your own syllabus.

## Push to GitHub (as I did)

```bash
git init
git add README.md .gitignore .env.example server.js package.json public/js public/css public/data docs scripts test public/index.html
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/rishibanota/Study-Helper.git
git push -u origin main
```

(Adjust the `git add` list — the default `git add .` also works but will skip everything in `.gitignore`, which is what you want.)
