/**
 * All sound is generated at runtime with the Web Audio API, plus the browser's
 * own speech synthesis for teaching text. Nothing is downloaded, so the game
 * works with no network at all.
 */

let ctx = null;
let master = null;
let musicGain = null;
let sfxGain = null;
let musicTimer = null;
let musicStep = 0;
let unlocked = false;

function prefs() {
  try {
    const raw = localStorage.getItem('quizquest.v1');
    return JSON.parse(raw)?.prefs || { music: true, sfx: true, speech: true };
  } catch {
    return { music: true, sfx: true, speech: true };
  }
}

/**
 * Browsers block audio until the first tap. Every entry point calls this from
 * a real user gesture.
 */
export function unlock() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    musicGain = ctx.createGain();
    sfxGain = ctx.createGain();
    musicGain.gain.value = prefs().music ? 0.12 : 0;
    sfxGain.gain.value = prefs().sfx ? 0.5 : 0;
    musicGain.connect(master);
    sfxGain.connect(master);
  }

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  unlocked = true;
}

export function vibrate(pattern = 12) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch { /* ignore */ }
  }
}

export function setMusicEnabled(on) {
  unlock();
  if (!musicGain || !ctx) return;
  musicGain.gain.cancelScheduledValues(ctx.currentTime);
  musicGain.gain.setTargetAtTime(on ? 0.12 : 0, ctx.currentTime, 0.05);
  if (on) startMusic();
  else stopMusic();
}

export function setSfxEnabled(on) {
  unlock();
  if (!sfxGain || !ctx) return;
  sfxGain.gain.setTargetAtTime(on ? 0.5 : 0, ctx.currentTime, 0.05);
}

/** One short tone with a shaped envelope. */
function tone(freq, start, duration, { type = 'sine', gain = 1, sweepTo = null } = {}) {
  if (!ctx) unlock();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  try {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
    if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, ctx.currentTime + start + duration);
    env.gain.setValueAtTime(0, ctx.currentTime + start);
    env.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
    osc.connect(env);
    env.connect(sfxGain);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration + 0.02);
  } catch {
    // Audio node error safe fallback
  }
}

export const sfx = {
  tap() {
    vibrate(10);
    if (!prefs().sfx) return;
    tone(660, 0, 0.07, { type: 'triangle', gain: 0.35 });
  },
  correct() {
    vibrate([15, 30, 20]);
    if (!prefs().sfx) return;
    tone(660, 0, 0.12, { type: 'sine', gain: 0.5 });
    tone(880, 0.09, 0.14, { type: 'sine', gain: 0.5 });
    tone(1180, 0.18, 0.2, { type: 'sine', gain: 0.45 });
  },
  /** Deliberately soft. A harsh buzzer makes a student want to close the app. */
  wrong() {
    vibrate([35, 40, 35]);
    if (!prefs().sfx) return;
    tone(300, 0, 0.16, { type: 'sine', gain: 0.3, sweepTo: 200 });
  },
  /** Rising fanfare when a whole concept is covered. */
  mastered() {
    vibrate([25, 40, 30, 40, 50]);
    if (!prefs().sfx) return;
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.24, { type: 'triangle', gain: 0.42 }));
  },
  levelUp() {
    vibrate([20, 30, 30]);
    if (!prefs().sfx) return;
    [392, 523, 659, 784].forEach((f, i) => tone(f, i * 0.08, 0.2, { type: 'square', gain: 0.16 }));
  },
  whoosh() {
    vibrate(8);
    if (!prefs().sfx) return;
    tone(400, 0, 0.18, { type: 'sawtooth', gain: 0.14, sweepTo: 900 });
  },
  tick() {
    vibrate(6);
    if (!prefs().sfx) return;
    tone(1000, 0, 0.035, { type: 'square', gain: 0.16 });
  },
};

/* ---------------------------------- music ---------------------------------- */

// A short bouncy loop. Different scale per subject so each world feels distinct.
const SCALES = {
  city: [523, 587, 659, 784, 880],
  lab: [440, 523, 659, 698, 880],
  site: [494, 587, 659, 740, 880],
  server: [392, 494, 587, 659, 784],
  studio: [523, 622, 784, 831, 1047],
};

let currentScale = SCALES.city;

export function setMusicWorld(world) {
  currentScale = SCALES[world] || SCALES.city;
}

function beat() {
  if (!ctx || !prefs().music) return;
  const scale = currentScale;
  const note = scale[musicStep % scale.length];
  const bass = scale[0] / 2;

  // lead
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = note;
  env.gain.setValueAtTime(0, ctx.currentTime);
  env.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
  env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);
  osc.connect(env);
  env.connect(musicGain);
  osc.start();
  osc.stop(ctx.currentTime + 0.26);

  // bass on the off-beats
  if (musicStep % 2 === 0) {
    const b = ctx.createOscillator();
    const bEnv = ctx.createGain();
    b.type = 'sine';
    b.frequency.value = bass;
    bEnv.gain.setValueAtTime(0, ctx.currentTime);
    bEnv.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.02);
    bEnv.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    b.connect(bEnv);
    bEnv.connect(musicGain);
    b.start();
    b.stop(ctx.currentTime + 0.32);
  }

  musicStep++;
}

export function startMusic() {
  if (musicTimer || !ctx || !prefs().music) return;
  beat();
  musicTimer = setInterval(beat, 340);
}

export function stopMusic() {
  clearInterval(musicTimer);
  musicTimer = null;
}

/* --------------------------------- speech --------------------------------- */

let currentAudio = null;
let currentUtterance = null;

export function stopSpeaking() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
  }
  try {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
  currentUtterance = null;
}

/**
 * Read text aloud.
 * Checks for a pre-rendered neural TTS audio clip first (/audio/<voice>/<clipId>.mp3).
 * If found and supported, plays high-fidelity neural audio.
 * Falls back to browser SpeechSynthesis for dynamic custom notes or offline missing files.
 */
export function speak(text, { clipId = null, rate = 0.95, pitch = 1.05 } = {}) {
  const p = prefs();
  if (!p.speech) return false;
  stopSpeaking();

  const selectedVoice = p.voice || 'bf_emma';

  // If clipId is supplied and not explicitly system voice, attempt pre-rendered neural audio
  if (clipId && selectedVoice !== 'system') {
    const audioUrl = `/audio/${selectedVoice}/${clipId}.mp3`;
    try {
      const audio = new Audio(audioUrl);
      currentAudio = audio;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audio.onended = () => {
            if (currentAudio === audio) currentAudio = null;
          };
          audio.onerror = () => {
            if (currentAudio === audio) currentAudio = null;
            speakWithSynthesis(text, { rate, pitch });
          };
        }).catch(() => {
          currentAudio = null;
          speakWithSynthesis(text, { rate, pitch });
        });
        return true;
      }
    } catch {
      currentAudio = null;
    }
  }

  return speakWithSynthesis(text, { rate, pitch });
}

function speakWithSynthesis(text, { rate = 0.95, pitch = 1.05 } = {}) {
  if (!('speechSynthesis' in window)) return false;
  try {
    window.speechSynthesis.cancel();
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return false;
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = rate;
    u.pitch = pitch;
    u.lang = 'en-IN';
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => /en-IN|en-GB|en-US/i.test(v.lang));
    if (preferred) u.voice = preferred;
    u.onend = () => {
      if (currentUtterance === u) currentUtterance = null;
    };
    u.onerror = () => {
      if (currentUtterance === u) currentUtterance = null;
    };
    currentUtterance = u;
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    currentUtterance = null;
    return false;
  }
}

export function isSpeaking() {
  const audioPlaying = Boolean(currentAudio && !currentAudio.paused);
  const synthSpeaking = Boolean(currentUtterance && 'speechSynthesis' in window && window.speechSynthesis.speaking);
  return audioPlaying || synthSpeaking;
}

/* ------------------------------- recognition ------------------------------ */

/**
 * Speech-to-text, when the browser has it. Recognition is usually cloud-backed,
 * so this can fail offline - callers must always offer typing as well.
 */
export function createRecogniser({ onResult, onEnd, onError } = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  const rec = new SR();
  rec.lang = 'en-IN';
  rec.interimResults = true;
  rec.continuous = true;
  rec.maxAlternatives = 1;

  let finalText = '';
  let running = false;

  rec.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const chunk = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += `${chunk} `;
      else interim += chunk;
    }
    onResult?.(finalText.trim(), interim.trim());
  };

  rec.onerror = (event) => {
    running = false;
    onError?.(event.error);
  };
  rec.onend = () => {
    running = false;
    onEnd?.(finalText.trim());
  };

  return {
    start() {
      if (running) return;
      finalText = '';
      try {
        rec.start();
        running = true;
      } catch {
        running = false;
      }
    },
    stop() {
      if (!running) return;
      try {
        rec.stop();
      } catch {
        // Not running
      }
      running = false;
    },
    get isRunning() {
      return running;
    },
    get supported() {
      return true;
    },
  };
}

export function recognitionSupported() {
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}
