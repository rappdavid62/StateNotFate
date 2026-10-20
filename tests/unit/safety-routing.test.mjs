import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function api() {
  const context = vm.createContext({});
  vm.runInContext(readFileSync(new URL('../../src/safety-routing.js', import.meta.url), 'utf8'), context);
  return context.SNFSafety;
}

test('routing persists only its opened event, survives recreation, and exits explicitly', () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
  const safety = api();
  const router = safety.createRouter(storage);
  router.open('private disclosure that must never be stored');
  assert.equal(router.isActive(), true);
  assert.deepEqual(JSON.parse([...data.values()][0]), { event: 'safety-routing-opened' });
  const restored = safety.createRouter(storage);
  assert.equal(restored.isActive(), true);
  assert.equal(restored.routeMessage('What is for dinner?'), true);
  assert.equal(restored.isActive(), true);
  restored.close();
  assert.equal(safety.createRouter(storage).isActive(), false);
  assert.equal(safety.createRouter({ getItem() {} }).isActive(), false);
});

test('routing remains usable without storage and does not infer danger from low energy', () => {
  const safety = api();
  const router = safety.createRouter({ getItem() { throw Error(); }, setItem() { throw Error(); }, removeItem() { throw Error(); } });
  assert.equal(router.routeMessage('I am exhausted and have no motivation'), false);
  assert.equal(router.routeMessage('I cannot stay safe'), true);
  assert.equal(router.isActive(), true);
  router.close();
  assert.equal(router.isActive(), false);
});

test('regions have source IDs and unknown regions use a local emergency fallback', () => {
  const safety = api();
  assert.equal(safety.resourcesFor('US').emergency.href, 'tel:911');
  assert.equal(safety.resourcesFor('CA').links[0].href, 'tel:988');
  assert.equal(safety.resourcesFor('unknown').emergency.href, null);
  assert.equal(safety.resourcesFor('__proto__').emergency.href, null);
  for (const region of ['US', 'CA', 'OTHER']) {
    for (const link of safety.resourcesFor(region).links) assert.ok(link.sourceId);
  }
});

test('production excludes assessment imports, scoring fallbacks and method-specific fields', () => {
  const app = readFileSync(new URL('../../app.js', import.meta.url), 'utf8');
  const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(app, /safety-detection\.js|polaris-safety-integration\.js|calculateRiskLevel|state\.safety\.suicide\s*=/);
  assert.doesNotMatch(html, /safety-assessment-modal|sa-access|sa-timeline|ideation-scale|safety-sp-risk-badge|data-safety-type="suicide"/);
});


test('older page instances reconcile the tab marker after Back/Forward restoration', () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
  const safety = api();
  const earlierPage = safety.createRouter(storage);
  const laterPage = safety.createRouter(storage);
  laterPage.open();
  assert.equal(earlierPage.isActive(), true);
  assert.equal(earlierPage.generation(), 1);
  laterPage.close();
  assert.equal(earlierPage.isActive(), false);
});
