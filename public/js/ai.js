/**
 * AI-powered Simplifier for QuizQuest Ideas.
 *
 * Uses OpenRouter Auto as primary AI provider,
 * falling back to Pollinations AI, and finally a local synthesis fallback.
 * Strictly enforces 1-2 easy sentences max for beginner students.
 */

const ATTEMPTS = new Map();

/**
 * Clean and truncate explanation to at most 1-2 simple sentences.
 * Strips reasoning tokens, preamble, and markdown formatting.
 */
export function cleanSimpleExplanation(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText
    // Remove thinking tags if present from reasoning models
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    // Remove markdown code fences or quotes
    .replace(/^["'`]+|["'`]+$/g, '')
    .trim();

  // Strip common conversational intros repeatedly
  const introRegex = /^(sure!?|yes!?|here is a simple explanation:?|here's a simple explanation:?|here is a simpler explanation:?|in simple terms:?|simply put:?|think of it this way:?|to put it simply:?)\s*/i;
  while (introRegex.test(text)) {
    text = text.replace(introRegex, '').trim();
  }

  // If there are multiple paragraphs, keep the first one
  const firstPara = text.split(/\n+/)[0].trim();
  if (firstPara) text = firstPara;

  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [text];
  const cleaned = sentences
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(' ');

  return cleaned || text;
}

/**
 * Generate a dynamic prompt hint based on the attempt counter to ensure uniqueness.
 */
function getAttemptAngle(attempt) {
  const angles = [
    'Use an easy, fun everyday analogy.',
    'Explain it like talking to a 10-year-old using simple words.',
    'Explain the main reason why we need it.',
    'Explain what would go wrong without it.',
    'Use a fresh, punchy comparison from daily life.',
    'Describe how it works in one clear visual picture.',
  ];
  return angles[(attempt - 1) % angles.length];
}

/**
 * Local offline fallback if network or AI providers are unreachable.
 */
export function generateLocalFallback(term, hint, text, attempt = 1) {
  const base = (hint || text || term).replace(/\.$/, '');
  const variations = [
    `${term} simply means: ${base}. It helps everything work quickly and correctly!`,
    `Think of ${term} as the key helper that handles: ${base}.`,
    `In simple words, ${term} makes sure that ${base}.`,
    `Without ${term}, the system could get stuck, because its job is: ${base}.`,
  ];
  return variations[(attempt - 1) % variations.length];
}

/**
 * Request a 1-2 sentence simplified explanation for an idea.
 *
 * @param {Object} params
 * @param {string} params.term - Name of the idea / keyword
 * @param {string} params.text - Original idea text
 * @param {string} [params.hint] - Simple hint for the idea
 * @param {string} [params.question] - Topic or exam question
 * @param {string} [params.subject] - Subject code / title
 * @returns {Promise<{ ok: boolean, explanation: string, provider: string, attempt: number }>}
 */
export async function simplifyIdea({ term, text = '', hint = '', question = '', subject = '' }) {
  const key = `${subject}_${term}`;
  const currentAttempt = (ATTEMPTS.get(key) || 0) + 1;
  ATTEMPTS.set(key, currentAttempt);

  const angle = getAttemptAngle(currentAttempt);

  // 1. Try server endpoint first (/api/simplify)
  try {
    const res = await fetch('/api/simplify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        term,
        text,
        hint,
        question,
        subject,
        attempt: currentAttempt,
        angle,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.explanation) {
        return {
          ok: true,
          explanation: cleanSimpleExplanation(data.explanation),
          provider: data.provider || 'OpenRouter AI',
          attempt: currentAttempt,
        };
      }
    }
  } catch {
    // Server endpoint not reachable or offline; proceed to client-side fallback
  }

  // 2. Client-side fallback: Pollinations AI direct GET
  try {
    const prompt = encodeURIComponent(
      `Explain "${term}" in 1 to 2 very simple, easy sentences for a beginner student. ${angle} Context: ${hint || text}. Max 2 sentences.`
    );
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const pollRes = await fetch(`https://text.pollinations.ai/${prompt}`, {
      headers: {
        'Accept': 'text/plain, application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (pollRes.ok) {
      const raw = await pollRes.text();
      const cleaned = cleanSimpleExplanation(raw);
      if (cleaned && !cleaned.startsWith('{') && cleaned.length > 5) {
        return {
          ok: true,
          explanation: cleaned,
          provider: 'Pollinations AI',
          attempt: currentAttempt,
        };
      }
    }
  } catch {
    // Pollinations network failed or timed out
  }

  // 3. Guaranteed Local Fallback
  return {
    ok: true,
    explanation: generateLocalFallback(term, hint, text, currentAttempt),
    provider: 'Quick Helper',
    attempt: currentAttempt,
  };
}
