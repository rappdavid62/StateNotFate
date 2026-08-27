import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

function headerBlock(toml, pathPattern) {
  return toml.split('[[headers]]').slice(1).find((block) => block.includes(`for = "${pathPattern}"`)) || '';
}

test('unhashed PWA JS and CSS revalidate instead of using immutable cache', () => {
  const toml = readFileSync(join(root, 'netlify.toml'), 'utf8');

  for (const pathPattern of ['/*.js', '/*.css']) {
    const block = headerBlock(toml, pathPattern);
    assert.equal(
      /immutable/i.test(block),
      false,
      `${pathPattern} must not use immutable caching unless filenames are content-hashed`
    );
    assert.match(
      block,
      /Cache-Control\s*=\s*"public, max-age=0, must-revalidate"/,
      `${pathPattern} must revalidate after each deploy`
    );
  }

  const serviceWorker = headerBlock(toml, '/service-worker.js');
  assert.match(serviceWorker, /max-age=0, must-revalidate/);
});
