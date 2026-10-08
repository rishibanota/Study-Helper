#!/usr/bin/env node
/**
 * QuizQuest static server.
 *
 * Uses only Node built-ins on purpose: no `npm install` step, nothing to break,
 * and it runs on a phone (Termux) where installing packages is slow and flaky.
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), 'public');
const PORT = Number(process.env.PORT) || 8081;
const HOST = process.env.HOST || '0.0.0.0';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

/** Reject anything that escapes the public folder. */
function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const clean = normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const full = join(ROOT, clean);
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null;
  return full;
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const POLLINATIONS_KEY = process.env.POLLINATIONS_API_KEY || process.env.DxPOLLINATIONS_API_KEY || '';

function cleanExplanation(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = rawText
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^["'`]+|["'`]+$/g, '')
    .trim();

  const introRegex = /^(sure!?|yes!?|here is a simple explanation:?|here's a simple explanation:?|here is a simpler explanation:?|in simple terms:?|simply put:?|think of it this way:?|to put it simply:?)\s*/i;
  while (introRegex.test(text)) {
    text = text.replace(introRegex, '').trim();
  }

  const firstPara = text.split(/\n+/)[0].trim();
  if (firstPara) text = firstPara;

  const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [text];
  return sentences.map((s) => s.trim()).filter(Boolean).slice(0, 2).join(' ') || text;
}

async function handleSimplifyApi(req, res) {
  let bodyStr = '';
  for await (const chunk of req) {
    bodyStr += chunk;
  }
  let payload = {};
  try {
    payload = JSON.parse(bodyStr || '{}');
  } catch {
    // ignore
  }

  const term = payload.term || 'Concept';
  const text = payload.text || '';
  const hint = payload.hint || '';
  const question = payload.question || '';
  const attempt = Number(payload.attempt) || 1;
  const angle = payload.angle || 'Use a simple everyday analogy.';

  // 1. Primary: OpenRouter auto AI (1-2 sentences max)
  if (OPENROUTER_API_KEY) {
    try {
      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://quizquest.app',
          'X-Title': 'QuizQuest',
        },
        body: JSON.stringify({
          model: 'openrouter/auto',
          max_tokens: 80,
          temperature: 0.85,
          messages: [
            {
              role: 'system',
              content: 'You are an encouraging tutor for school students. Explain the given concept in only 1 to 2 very simple, easy sentences maximum. Use plain everyday words or a simple analogy. Never exceed 2 sentences. No greeting, no intro.',
            },
            {
              role: 'user',
              content: `Explain: "${term}". Context: "${hint || text}". Topic: "${question}". Creative direction: ${angle} (Variation #${attempt})`,
            },
          ],
        }),
      });

      if (openRouterRes.ok) {
        const data = await openRouterRes.json();
        let message = data?.choices?.[0]?.message?.content?.trim();
        if (message) {
          const cleaned = cleanExplanation(message);
          res.writeHead(200, {
            'content-type': 'application/json; charset=utf-8',
            'access-control-allow-origin': '*',
          });
          return res.end(JSON.stringify({ ok: true, explanation: cleaned, provider: 'OpenRouter Auto AI' }));
        }
      }
    } catch (e) {
      console.warn('OpenRouter request failed, falling back to Pollinations:', e.message);
    }
  }

  // 2. Fallback: Pollinations AI
  try {
    const prompt = encodeURIComponent(
      `Explain "${term}" in 1 to 2 very simple, easy sentences for a beginner student. ${angle} Context: ${hint || text}. Variation #${attempt}. Max 2 sentences.`
    );
    const headers = { 'Accept': 'text/plain, application/json' };
    if (POLLINATIONS_KEY) {
      headers['Authorization'] = `Bearer ${POLLINATIONS_KEY}`;
    }

    const pollRes = await fetch(`https://text.pollinations.ai/${prompt}`, { headers });
    if (pollRes.ok) {
      const textRes = await pollRes.text();
      if (textRes && !textRes.startsWith('{') && textRes.length > 5) {
        const cleaned = cleanExplanation(textRes);
        res.writeHead(200, {
          'content-type': 'application/json; charset=utf-8',
          'access-control-allow-origin': '*',
        });
        return res.end(JSON.stringify({ ok: true, explanation: cleaned, provider: 'Pollinations AI' }));
      }
    }
  } catch (e) {
    console.warn('Pollinations fallback failed:', e.message);
  }

  // 3. Fallback: Local synthesis
  const base = (hint || text || term).replace(/\.$/, '');
  const variations = [
    `${term} simply means: ${base}. It helps everything work smoothly and correctly!`,
    `Think of ${term} as the key helper that handles: ${base}.`,
    `In simple words, ${term} makes sure that ${base}.`,
    `Without ${term}, the system could get stuck, because its job is: ${base}.`,
  ];
  const fallbackText = variations[(attempt - 1) % variations.length];

  res.writeHead(200, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  });
  return res.end(JSON.stringify({ ok: true, explanation: fallbackText, provider: 'QuizQuest Helper' }));
}

const server = createServer(async (req, res) => {
  try {
    const url = req.url || '/';

    if (url.startsWith('/api/simplify')) {
      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'POST, OPTIONS',
          'access-control-allow-headers': 'Content-Type',
        });
        return res.end();
      }
      return handleSimplifyApi(req, res);
    }

    let path = safePath(url);
    if (!path) {
      res.writeHead(403, { 'content-type': 'text/plain' });
      return res.end('Forbidden');
    }

    let info = await stat(path).catch(() => null);
    if (info?.isDirectory()) {
      path = join(path, 'index.html');
      info = await stat(path).catch(() => null);
    }

    if (!info) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      return res.end('Not found');
    }

    const body = await readFile(path);
    const type = TYPES[extname(path).toLowerCase()] || 'application/octet-stream';

    res.writeHead(200, {
      'content-type': type,
      // Always revalidate so edited content shows up on refresh.
      'cache-control': 'no-cache',
      'content-length': body.length,
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain' });
    res.end(`Server error: ${err.message}`);
  }
});

function lanAddresses() {
  const found = [];
  for (const list of Object.values(networkInterfaces())) {
    for (const net of list || []) {
      if (net.family === 'IPv4' && !net.internal) found.push(net.address);
    }
  }
  return found;
}

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  QuizQuest is ready!');
  console.log('');
  console.log(`  On this computer:  http://localhost:${PORT}`);
  for (const ip of lanAddresses()) {
    console.log(`  On your phone:     http://${ip}:${PORT}`);
  }
  console.log('');
  console.log('  Phone and computer must be on the same Wi-Fi.');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  Port ${PORT} is already in use.`);
    console.error(`  Try:  PORT=8081 node server.js\n`);
  } else {
    console.error('\n  Server failed to start:', err.message, '\n');
  }
  process.exit(1);
});

// Mobile browsers kill idle sockets; keep-alive can look like a hang.
server.keepAliveTimeout = 5000;
server.headersTimeout = 10000;
