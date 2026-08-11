import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePolarisResponse } from '../../netlify/functions/polaris-synthesis.mjs';

// ---- valid responses ----

test('validates a correct AI response', () => {
  const result = validatePolarisResponse({
    message: 'You are doing well today.',
    dayStateLabel: 'medium',
    anchors: [
      { id: 'water', text: 'Drink a glass of water' },
      { id: 'light', text: 'Stand by the window for 60 seconds' },
    ],
    floorWinsMode: false,
    synthesisSource: 'ai',
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('accepts synthesisSource "local"', () => {
  const result = validatePolarisResponse({
    message: 'Floor wins count.',
    dayStateLabel: 'collapse',
    anchors: [{ id: 'breathe', text: 'Take one breath' }],
    floorWinsMode: true,
    synthesisSource: 'local',
  });
  assert.equal(result.valid, true);
});

// ---- invalid responses ----

test('rejects non-object input', () => {
  assert.equal(validatePolarisResponse(null).valid, false);
  assert.equal(validatePolarisResponse('string').valid, false);
  assert.equal(validatePolarisResponse([]).valid, false);
});

test('rejects missing message', () => {
  const { valid, errors } = validatePolarisResponse({
    dayStateLabel: 'high',
    anchors: [{ id: 'a', text: 'Task' }],
    floorWinsMode: false,
    synthesisSource: 'ai',
  });
  assert.equal(valid, false);
  assert.ok(errors.some(e => e.includes('message')));
});

test('rejects message over 500 chars', () => {
  const { valid } = validatePolarisResponse({
    message: 'x'.repeat(501),
    dayStateLabel: 'high',
    anchors: [{ id: 'a', text: 'Task' }],
    floorWinsMode: false,
    synthesisSource: 'ai',
  });
  assert.equal(valid, false);
});

test('rejects invalid dayStateLabel', () => {
  const { valid, errors } = validatePolarisResponse({
    message: 'Good.',
    dayStateLabel: 'unknown',
    anchors: [{ id: 'a', text: 'Task' }],
    floorWinsMode: false,
    synthesisSource: 'ai',
  });
  assert.equal(valid, false);
  assert.ok(errors.some(e => e.includes('dayStateLabel')));
});

test('rejects empty anchors array', () => {
  const { valid } = validatePolarisResponse({
    message: 'Good.',
    dayStateLabel: 'medium',
    anchors: [],
    floorWinsMode: false,
    synthesisSource: 'ai',
  });
  assert.equal(valid, false);
});

test('rejects anchors array over 6 items', () => {
  const anchors = Array.from({ length: 7 }, (_, i) => ({ id: `a${i}`, text: 'Task' }));
  const { valid } = validatePolarisResponse({
    message: 'Good.',
    dayStateLabel: 'medium',
    anchors,
    floorWinsMode: false,
    synthesisSource: 'ai',
  });
  assert.equal(valid, false);
});

test('rejects anchor missing id', () => {
  const { valid, errors } = validatePolarisResponse({
    message: 'Good.',
    dayStateLabel: 'medium',
    anchors: [{ text: 'Task without id' }],
    floorWinsMode: false,
    synthesisSource: 'ai',
  });
  assert.equal(valid, false);
  assert.ok(errors.some(e => e.includes('id')));
});

test('rejects floorWinsMode non-boolean', () => {
  const { valid } = validatePolarisResponse({
    message: 'Good.',
    dayStateLabel: 'medium',
    anchors: [{ id: 'a', text: 'Task' }],
    floorWinsMode: 'yes',
    synthesisSource: 'ai',
  });
  assert.equal(valid, false);
});

test('rejects invalid synthesisSource', () => {
  const { valid } = validatePolarisResponse({
    message: 'Good.',
    dayStateLabel: 'medium',
    anchors: [{ id: 'a', text: 'Task' }],
    floorWinsMode: false,
    synthesisSource: 'model',
  });
  assert.equal(valid, false);
});
