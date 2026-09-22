import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const code = readFileSync(join(root, 'src/polaris-presence.js'), 'utf8');
const context = { window: {}, globalThis: undefined, module: undefined };
context.globalThis = context;
vm.runInNewContext(code, context);
const api = context.window.PolarisPresence;

test('Polaris presence API loads', () => {
  assert.ok(api);
  assert.equal(typeof api.buildPolarisSystemPrompt, 'function');
  assert.equal(typeof api.getPolarisLocalLine, 'function');
});

test('system prompt interpolates live telemetry instead of placeholders', () => {
  const prompt = api.buildPolarisSystemPrompt({
    skin: '🦄',
    energy: 'collapse',
    pattern: 'Rhythm Collapse',
    hopeLevel: 1,
    proofTotal: 4,
    proofToday: 1,
    anchorsToday: { floor_water: true, floor_light: false }
  });
  assert.match(prompt, /Strange Signal/);
  assert.match(prompt, /Energy: COLLAPSE/);
  assert.match(prompt, /Proof today: 1/);
  assert.match(prompt, /floor_water/);
  assert.doesNotMatch(prompt, /\$\{state\.polaris/);
  assert.match(prompt, /988/);
  assert.match(prompt, /Lived, not a study/);
});

test('unicorn collapse copy is specific and hygiene-clean', () => {
  const line = api.getPolarisLocalLine({
    energy: 'collapse',
    proofToday: 0,
    skin: '🦄',
    mode: 'greeting'
  });
  assert.match(line, /Strange Signal/);
  assert.match(line, /Floor Wins Mode/);
  assert.equal(api.assertCopyHygiene(line), true);
});

test('persona voices pass copy hygiene', () => {
  for (const persona of Object.values(api.PERSONAS)) {
    assert.equal(api.assertCopyHygiene(persona.name + ' ' + persona.voice), true, persona.name);
  }
});
