/**
 * Unit tests — Polaris Response Contract
 *
 * Covers: low energy, collapse, restart, privacy, safety-routing, and
 * deterministic fallback cases as required by issue #6.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePolarisResponse, getSafePolarisResponse } from '../../src/polaris-response-validator.js';
import { POLARIS_SCHEMA_VERSION, FALLBACK_RESPONSES } from '../../src/polaris-response-schema.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal valid recovery response. */
function validRecovery(overrides = {}) {
  return {
    schemaVersion: POLARIS_SCHEMA_VERSION,
    mode: 'recovery',
    energyState: 'medium',
    primaryAction: {
      id: 'test-action-1',
      text: 'Drink a glass of water.',
      estimatedMinutes: 2,
      category: 'physical',
    },
    tinyAction: null,
    message: 'One small step.',
    ...overrides,
  };
}

/** Build a minimal valid education response. */
function validEducation(overrides = {}) {
  return {
    schemaVersion: POLARIS_SCHEMA_VERSION,
    mode: 'education',
    energyState: 'medium',
    explanation: 'Depression is a biological state, not a personal failure.',
    sourceIds: ['pubmed:12345678'],
    primaryAction: {
      id: 'edu-action-1',
      text: 'Read one paragraph from the evidence library.',
      estimatedMinutes: 3,
      category: 'cognitive',
    },
    tinyAction: null,
    message: 'Understanding helps.',
    ...overrides,
  };
}

/** Build a minimal valid restart response. */
function validRestart(overrides = {}) {
  return {
    schemaVersion: POLARIS_SCHEMA_VERSION,
    mode: 'restart',
    energyState: 'low',
    primaryAction: {
      id: 'restart-action-1',
      text: 'Name one tiny thing you can do right now.',
      estimatedMinutes: 5,
      category: 'cognitive',
    },
    tinyAction: {
      id: 'restart-tiny-1',
      text: 'Say: I am starting again.',
      estimatedMinutes: 0,
      category: 'cognitive',
    },
    message: 'Restart only requires beginning.',
    ...overrides,
  };
}

/** Build a minimal valid safety-routing response. */
function validSafetyRouting(overrides = {}) {
  return {
    schemaVersion: POLARIS_SCHEMA_VERSION,
    mode: 'safety-routing',
    energyState: 'collapse',
    crisisLevel: 'high',
    resources: [
      { name: '988 Lifeline', contact: 'Call or text 988', url: 'https://988lifeline.org' },
    ],
    primaryAction: {
      id: 'safety-action-1',
      text: 'Please reach out to the resource listed here right now.',
      estimatedMinutes: 0,
      category: 'safety',
    },
    tinyAction: null,
    message: 'You matter. Help is available.',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Schema version
// ---------------------------------------------------------------------------

test('rejects response with wrong schemaVersion', () => {
  const result = validatePolarisResponse(validRecovery({ schemaVersion: '0.0.1' }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('schemaVersion')));
  assert.ok(result.fallback, 'fallback must be provided');
});

test('accepts response with correct schemaVersion', () => {
  const result = validatePolarisResponse(validRecovery());
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

// ---------------------------------------------------------------------------
// Mode validation
// ---------------------------------------------------------------------------

test('rejects unknown mode', () => {
  const result = validatePolarisResponse(validRecovery({ mode: 'telepathy' }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('mode')));
});

// ---------------------------------------------------------------------------
// Low-energy case
// ---------------------------------------------------------------------------

test('low-energy: rejects high-effort category action', () => {
  const result = validatePolarisResponse(
    validRecovery({
      energyState: 'low',
      primaryAction: {
        id: 'bad-action',
        text: 'Run five miles.',
        estimatedMinutes: 60,
        category: 'high-effort',
      },
    })
  );
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('high-effort') && e.includes('low')));
});

test('low-energy: accepts physical category action', () => {
  const result = validatePolarisResponse(
    validRecovery({
      energyState: 'low',
      primaryAction: {
        id: 'ok-action',
        text: 'Drink one glass of water.',
        estimatedMinutes: 1,
        category: 'physical',
      },
    })
  );
  assert.equal(result.valid, true);
});

// ---------------------------------------------------------------------------
// Collapse case
// ---------------------------------------------------------------------------

test('collapse: rejects social category action', () => {
  const result = validatePolarisResponse(
    validSafetyRouting({
      primaryAction: {
        id: 'bad-collapse',
        text: 'Call a friend for a long chat.',
        estimatedMinutes: 30,
        category: 'social',
      },
    })
  );
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('social') && e.includes('collapse')));
});

test('collapse: energyStateOverride forces stricter check', () => {
  const response = validRecovery({
    energyState: 'medium',
    primaryAction: {
      id: 'unsafe-action',
      text: 'Plan your whole week out.',
      estimatedMinutes: 60,
      category: 'planning',
    },
  });
  // Model reports "medium" but app context knows user is in collapse
  const result = validatePolarisResponse(response, 'collapse');
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('planning') && e.includes('collapse')));
});

// ---------------------------------------------------------------------------
// Restart case
// ---------------------------------------------------------------------------

test('restart: valid restart response passes', () => {
  const result = validatePolarisResponse(validRestart());
  assert.equal(result.valid, true);
});

test('restart: missing message fails', () => {
  const r = validRestart();
  delete r.message;
  const result = validatePolarisResponse(r);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('"message"')));
});

test('restart: empty-string message fails', () => {
  const result = validatePolarisResponse(validRestart({ message: '   ' }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('"message"')));
});

// ---------------------------------------------------------------------------
// Education: sourceIds required
// ---------------------------------------------------------------------------

test('education: missing sourceIds fails', () => {
  const result = validatePolarisResponse(validEducation({ sourceIds: [] }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('sourceId')));
});

test('education: with sourceIds passes', () => {
  const result = validatePolarisResponse(validEducation());
  assert.equal(result.valid, true);
});

// ---------------------------------------------------------------------------
// Privacy leak detection
// ---------------------------------------------------------------------------

test('privacy: rejects response containing an email address', () => {
  const result = validatePolarisResponse(
    validRecovery({ message: 'Send your report to user@example.com for review.' })
  );
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('prohibited or private content')));
});

test('privacy: rejects response containing a phone number', () => {
  const result = validatePolarisResponse(
    validRecovery({ message: 'Call 555-867-5309 for immediate help.' })
  );
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('prohibited or private content')));
});

// ---------------------------------------------------------------------------
// Safety-routing case
// ---------------------------------------------------------------------------

test('safety-routing: valid response passes', () => {
  const result = validatePolarisResponse(validSafetyRouting());
  assert.equal(result.valid, true);
});

test('safety-routing: missing resources fails', () => {
  const result = validatePolarisResponse(validSafetyRouting({ resources: [] }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('resource')));
});

// ---------------------------------------------------------------------------
// Fallback on invalid output
// ---------------------------------------------------------------------------

test('fallback: null response returns fallback', () => {
  const result = validatePolarisResponse(null);
  assert.equal(result.valid, false);
  assert.ok(result.fallback);
  assert.equal(result.fallback.isFallback, true);
});

test('getSafePolarisResponse: returns sanitized when valid', () => {
  const response = validRecovery();
  const safe = getSafePolarisResponse(response);
  assert.equal(safe.isFallback, undefined);
  assert.equal(safe.mode, 'recovery');
});

test('getSafePolarisResponse: returns fallback when invalid', () => {
  const safe = getSafePolarisResponse({ garbage: true });
  assert.equal(safe.isFallback, true);
});

test('fallback responses are themselves valid', () => {
  for (const [mode, fb] of Object.entries(FALLBACK_RESPONSES)) {
    const result = validatePolarisResponse(fb);
    assert.equal(
      result.valid,
      true,
      `Fallback for mode "${mode}" must pass validation. Errors: ${result.errors.join('; ')}`
    );
  }
});
