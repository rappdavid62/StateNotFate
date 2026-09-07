/**
 * POLARIS RESPONSE VALIDATOR
 *
 * Validates Polaris model output against the versioned response contract
 * defined in polaris-response-schema.js.
 *
 * Usage:
 *   import { validatePolarisResponse } from './polaris-response-validator.js';
 *   const result = validatePolarisResponse(modelOutput, energyState);
 *   if (!result.valid) {
 *     // use result.fallback — guaranteed-safe deterministic response
 *   }
 */

import {
  POLARIS_SCHEMA_VERSION,
  ENERGY_STATES,
  RESPONSE_MODES,
  PROHIBITED_PATTERNS,
  FALLBACK_RESPONSES,
  REQUIRED_FIELDS_BY_MODE,
  ENERGY_STATE_RESTRICTIONS,
} from './polaris-response-schema.js';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Collect all string leaf values from an object so we can scan them for
 * prohibited patterns without hard-coding field names.
 * @param {unknown} value
 * @returns {string[]}
 */
function collectStrings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value !== null && typeof value === 'object') {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

/**
 * Returns true when the string could be a personal identifier or private data
 * that should not be echoed back in a response.
 * @param {string} text
 * @returns {boolean}
 */
function containsPrivacyLeak(text) {
  // Email addresses
  if (/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(text)) return true;
  // US-style phone numbers
  if (/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/.test(text)) return true;
  // Explicit prohibited privacy patterns from schema
  return PROHIBITED_PATTERNS.some(p => p.test(text));
}

/**
 * Validate a single action object.
 * @param {unknown} action
 * @param {string} energyState
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateAction(action, energyState) {
  const errors = [];
  if (!action || typeof action !== 'object') {
    errors.push('action must be a non-null object');
    return { valid: false, errors };
  }
  if (typeof action.id !== 'string' || !action.id.trim()) {
    errors.push('action.id must be a non-empty string');
  }
  if (typeof action.text !== 'string' || !action.text.trim()) {
    errors.push('action.text must be a non-empty string');
  }
  if (typeof action.estimatedMinutes !== 'number' || action.estimatedMinutes < 0) {
    errors.push('action.estimatedMinutes must be a non-negative number');
  }
  if (typeof action.category !== 'string' || !action.category.trim()) {
    errors.push('action.category must be a non-empty string');
  }

  // Energy-state fit check
  const restricted = ENERGY_STATE_RESTRICTIONS[energyState] ?? [];
  if (restricted.includes(action.category)) {
    errors.push(
      `action category "${action.category}" is not appropriate for energy state "${energyState}"`
    );
  }

  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validate a Polaris response object.
 *
 * @param {unknown} response — raw response from a model or rule engine
 * @param {string}  [energyStateOverride] — authoritative energy state from app context;
 *                  if provided it overrides the value embedded in the response for
 *                  energy-fit checks, preventing a model from self-reporting a
 *                  more permissive energy state.
 * @returns {{
 *   valid: boolean,
 *   errors: string[],
 *   sanitized: object | null,
 *   fallback: object
 * }}
 */
export function validatePolarisResponse(response, energyStateOverride) {
  const errors = [];

  // --- Basic type check ---
  if (!response || typeof response !== 'object' || Array.isArray(response)) {
    errors.push('response must be a non-null object');
    const fb = FALLBACK_RESPONSES[energyStateOverride === 'collapse' ? 'safety-routing' : 'recovery'];
    return { valid: false, errors, sanitized: null, fallback: fb };
  }

  // --- Schema version ---
  if (response.schemaVersion !== POLARIS_SCHEMA_VERSION) {
    errors.push(
      `schemaVersion must be "${POLARIS_SCHEMA_VERSION}", got "${response.schemaVersion}"`
    );
  }

  // --- Mode ---
  if (!RESPONSE_MODES.includes(response.mode)) {
    errors.push(`mode must be one of [${RESPONSE_MODES.join(', ')}], got "${response.mode}"`);
    return {
      valid: false,
      errors,
      sanitized: null,
      fallback: FALLBACK_RESPONSES.recovery,
    };
  }

  const mode = response.mode;
  const fallback = FALLBACK_RESPONSES[mode];

  // --- Energy state ---
  const energyState = energyStateOverride ?? response.energyState;
  if (!ENERGY_STATES.includes(energyState)) {
    errors.push(`energyState must be one of [${ENERGY_STATES.join(', ')}], got "${energyState}"`);
  }

  // --- Safety-routing must not be generated for non-collapse states (guard) ---
  if (mode === 'safety-routing' && energyState && energyState !== 'collapse' && energyState !== 'low') {
    errors.push('safety-routing responses are only valid for collapse or low energy states');
  }

  // --- Required fields ---
  const requiredFields = REQUIRED_FIELDS_BY_MODE[mode];
  for (const field of requiredFields) {
    const val = response[field];
    const missing =
      val === undefined ||
      val === null ||
      (typeof val === 'string' && val.trim() === '') ||
      (Array.isArray(val) && val.length === 0 && (field === 'sourceIds' || field === 'resources'));
    if (missing) {
      errors.push(`required field "${field}" is missing, null, or empty`);
    }
  }

  // --- primaryAction ---
  if (response.primaryAction !== undefined) {
    const actionResult = validateAction(response.primaryAction, energyState);
    if (!actionResult.valid) {
      errors.push(...actionResult.errors.map(e => `primaryAction: ${e}`));
    }
  }

  // --- tinyAction (optional, but must be valid if present) ---
  if (response.tinyAction !== null && response.tinyAction !== undefined) {
    const tinyResult = validateAction(response.tinyAction, energyState);
    if (!tinyResult.valid) {
      errors.push(...tinyResult.errors.map(e => `tinyAction: ${e}`));
    }
  }

  // --- Education mode: sourceIds required ---
  if (mode === 'education') {
    if (!Array.isArray(response.sourceIds) || response.sourceIds.length === 0) {
      errors.push('education responses must include at least one sourceId');
    }
  }

  // --- Safety-routing mode: resources required ---
  if (mode === 'safety-routing') {
    if (!Array.isArray(response.resources) || response.resources.length === 0) {
      errors.push('safety-routing responses must include at least one resource');
    }
  }

  // --- Prohibited content scan (exempt only resources array for safety-routing) ---
  const fieldsToScan =
    mode === 'safety-routing'
      ? { message: response.message, primaryAction: response.primaryAction }
      : response;

  for (const text of collectStrings(fieldsToScan)) {
    if (containsPrivacyLeak(text)) {
      errors.push(`response contains prohibited or private content: "${text.slice(0, 60)}…"`);
    }
  }

  const valid = errors.length === 0;
  return {
    valid,
    errors,
    sanitized: valid ? { ...response, energyState } : null,
    fallback,
  };
}

/**
 * Convenience wrapper: always returns a safe, ready-to-use response.
 * Uses the validated & sanitized response when valid, otherwise the fallback.
 *
 * @param {unknown} response
 * @param {string}  [energyStateOverride]
 * @returns {object}
 */
export function getSafePolarisResponse(response, energyStateOverride) {
  const result = validatePolarisResponse(response, energyStateOverride);
  return result.valid ? result.sanitized : result.fallback;
}
