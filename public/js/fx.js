/** Confetti, shake and streak popups. Presentation only, no game logic. */

function host() {
  let layer = document.getElementById('fx-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'fx-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
  }
  return layer;
}

/** Fire confetti from the top of the screen. */
export function confetti(count = 42) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = host();
  const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#38bdf8', '#a855f7', '#f97316'];
  for (let i = 0; i < count; i += 1) {
    const bit = document.createElement('i');
    bit.className = 'confetti';
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.background = colors[i % colors.length];
    bit.style.animationDelay = `${Math.random() * 0.5}s`;
    bit.style.animationDuration = `${1.5 + Math.random() * 1.4}s`;
    bit.style.setProperty('--spin', `${Math.random() * 900 - 450}deg`);
    layer.appendChild(bit);
    setTimeout(() => bit.remove(), 3200);
  }
}

/** Shake an element sideways. Used for a wrong answer, gently. */
export function shake(el) {
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 520);
}

/** A floating "+1" / "streak" bubble. */
export function pop(text, { tone = 'good' } = {}) {
  const layer = host();
  const bubble = document.createElement('div');
  bubble.className = `fx-pop fx-pop-${tone}`;
  bubble.textContent = text;
  layer.appendChild(bubble);
  setTimeout(() => bubble.remove(), 1400);
}
