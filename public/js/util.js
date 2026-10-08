/** Escape user and content text before putting it in innerHTML. */
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

/** Turn a question's text into a small block of HTML with code preserved. */
export function richText(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

/** Pick a helpful tone for a mark out of ten. */
export function markTone(marks) {
  if (marks >= 8) return 'good';
  if (marks >= 5) return 'mid';
  return 'low';
}

/** Short, encouraging verdict text for a mark. Never harsh. */
export function verdict(marks, total) {
  const pct = total ? marks / total : 0;
  if (pct >= 1) return 'Full marks! You covered every idea.';
  if (pct >= 0.8) return 'Almost there! A couple of ideas missing.';
  if (pct >= 0.5) return 'Good start! A few more ideas to add.';
  if (pct > 0) return 'You have the seed. Keep building it up.';
  return 'No ideas matched yet. Read the cards and try again.';
}
