import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

test('essays pretty URL is wired in Netlify, local server, and sitemap', () => {
  const toml = readFileSync(join(root, 'netlify.toml'), 'utf8');
  assert.match(toml, /from = "\/essays"/);
  assert.match(toml, /to = "\/essays\.html"/);

  const server = readFileSync(join(root, 'scripts/static-server.mjs'), 'utf8');
  assert.match(server, /pathname === '\/essays'/);

  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /https:\/\/statenotfate\.netlify\.app\/essays/);

  const sw = readFileSync(join(root, 'service-worker.js'), 'utf8');
  assert.match(sw, /essays\.html/);
});
