/**
 * POLARIS RESPONSE CONTRACT — Schema v1
 *
 * Defines the versioned output contract for all Polaris recommendation modes.
 * Any model-generated or rule-generated output must conform to this schema
 * before it is delivered to the user.
 *
 * Modes:
 *   recovery        — daily anchor + energy-state recovery actions
 *   education       — factual explanations about depression / neuroscience
 *   restart         — post-collapse re-entry plan
 *   safety-routing  — immediate crisis triage and resource delivery
 */

export const POLARIS_SCHEMA_VERSION = '1.0.0';

/**
 * Valid energy states accepted by the Polaris system.
 */
export const ENERGY_STATES = Object.freeze(['high', 'medium', 'low', 'collapse']);

/**
 * Valid response modes.
 */
export const RESPONSE_MODES = Object.freeze(['recovery', 'education', 'restart', 'safety-routing']);

/**
 * Prohibited content patterns — strings that must never appear in any
 * field of a Polaris response (safety-routing mode uses its own safe
 * templates and is exempt from the explanation/action text checks).
 */
export const PROHIBITED_PATTERNS = Object.freeze([
  // Harmful method references
  /\b(overdose|hang(ing|ed)?|shoot|gun|knife|razor|bridge|jump)\b/i,
  // Definitive clinical claims without source grounding
  /\b(guaranteed|cure[sd]?|proven treatment|clinically proven)\b/i,
  // Privacy leak patterns — personal identifiers should never be echoed
  /\b(ssn|social security|passport number|credit card)\b/i,
]);

/**
 * Fallback responses keyed by mode.
 * These are deterministic safe defaults used when model output fails validation.
 */
export const FALLBACK_RESPONSES = Object.freeze({
  recovery: {
    schemaVersion: POLARIS_SCHEMA_VERSION,
    mode: 'recovery',
    energyState: 'low',
    primaryAction: {
      id: 'fallback-recovery-primary',
      text: 'Drink one glass of water and sit upright for two minutes.',
      estimatedMinutes: 2,
      category: 'physical',
    },
    tinyAction: {
      id: 'fallback-recovery-tiny',
      text: 'Take one slow breath.',
      estimatedMinutes: 0,
      category: 'physical',
    },
    message: 'You are still here. That is enough for right now.',
    isFallback: true,
  },

  education: {
    schemaVersion: POLARIS_SCHEMA_VERSION,
    mode: 'education',
    energyState: 'medium',
    explanation: 'Depression affects the brain\'s reward circuitry, making ordinary tasks feel costly. This is a biological state, not a character flaw.',
    sourceIds: ['MASTER_SOURCE_LIST:depression-neuroscience'],
    primaryAction: {
      id: 'fallback-education-primary',
      text: 'Read one paragraph from the evidence library.',
      estimatedMinutes: 2,
      category: 'cognitive',
    },
    tinyAction: null,
    message: 'Understanding your state is the first step toward changing it.',
    isFallback: true,
  },

  restart: {
    schemaVersion: POLARIS_SCHEMA_VERSION,
    mode: 'restart',
    energyState: 'low',
    restartStep: 1,
    primaryAction: {
      id: 'fallback-restart-primary',
      text: 'Acknowledge that yesterday is over. Name one tiny thing you can do in the next five minutes.',
      estimatedMinutes: 5,
      category: 'cognitive',
    },
    tinyAction: {
      id: 'fallback-restart-tiny',
      text: 'Say out loud: "I am starting again."',
      estimatedMinutes: 0,
      category: 'cognitive',
    },
    message: 'Restart does not require perfection. It only requires beginning.',
    isFallback: true,
  },

  'safety-routing': {
    schemaVersion: POLARIS_SCHEMA_VERSION,
    mode: 'safety-routing',
    energyState: 'collapse',
    crisisLevel: 'high',
    resources: [
      { name: '988 Suicide & Crisis Lifeline', contact: 'Call or text 988', url: 'https://988lifeline.org' },
      { name: 'Crisis Text Line', contact: 'Text HOME to 741741', url: 'https://crisistextline.org' },
    ],
    primaryAction: {
      id: 'fallback-safety-primary',
      text: 'Please reach out to one of the resources listed here right now.',
      estimatedMinutes: 0,
      category: 'safety',
    },
    tinyAction: null,
    message: 'You matter. Support is available right now.',
    isFallback: true,
  },
});

/**
 * Minimal required fields for each mode.
 * Used by the validator to confirm structural completeness.
 */
export const REQUIRED_FIELDS_BY_MODE = Object.freeze({
  recovery: ['schemaVersion', 'mode', 'energyState', 'primaryAction', 'message'],
  education: ['schemaVersion', 'mode', 'energyState', 'explanation', 'sourceIds', 'primaryAction', 'message'],
  restart: ['schemaVersion', 'mode', 'energyState', 'primaryAction', 'message'],
  'safety-routing': ['schemaVersion', 'mode', 'energyState', 'resources', 'primaryAction', 'message'],
});

/**
 * Energy-state restrictions: actions flagged with these categories are
 * inappropriate when the user is in the corresponding energy states.
 */
export const ENERGY_STATE_RESTRICTIONS = Object.freeze({
  collapse: ['high-effort', 'social', 'planning'],
  low: ['high-effort', 'planning'],
  medium: [],
  high: [],
});
