import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

test('service worker is network-first for HTML, app.js, and index.css, with offline fallback', () => {
  const sw = readFileSync(join(root, 'service-worker.js'), 'utf8');

  assert.match(sw, /state-not-fate-cache-v13/);
  assert.match(sw, /function isCoreShellRequest/);
  assert.match(sw, /request\.mode === 'navigate'/);
  assert.match(sw, /path\.endsWith\('\/app\.js'\)/);
  assert.match(sw, /path\.endsWith\('\/index\.css'\)/);
  assert.match(sw, /essays\.html/);
  assert.match(sw, /caches\.match\('\.\/index\.html'\)/);
  assert.doesNotMatch(
    sw,
    /Fetch Interceptor: serve cached assets offline immediately, fallback to network/
  );
});
