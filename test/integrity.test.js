import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_QUESTIONS } from '../public/data/index.js';
import { scene } from '../public/js/art.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

function collectJsFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectJsFiles(full));
    } else if (entry.name.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

test('all JavaScript files in public have valid syntax and resolvable relative imports', () => {
  const files = collectJsFiles(publicDir);
  assert.ok(files.length > 5, 'expected several js files in public');

  const importRegex = /import\s+(?:(?:(?:\w+|\{[^}]+\}|\*\s+as\s+\w+)\s+from\s+)?['"]([^'"]+)['"]|['"]([^'"]+)['"]\s*\))/g;

  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      const spec = match[1] || match[2];
      if (spec.startsWith('.')) {
        const target = path.resolve(path.dirname(file), spec);
        assert.ok(
          fs.existsSync(target),
          `Broken import in ${path.relative(publicDir, file)}: "${spec}" (resolved to ${target})`,
        );
      }
    }
  }
});

test('every question scene is defined and renders valid SVG', () => {
  for (const q of ALL_QUESTIONS) {
    if (q.scene?.art) {
      const svg = scene(q.scene.art);
      assert.ok(svg.startsWith('<svg'), `Scene ${q.scene.art} did not render svg`);
      assert.ok(svg.includes(q.scene.art), `Scene ${q.scene.art} svg should include key`);
    }
  }
});
