/**
 * UI INTEGRATION EXAMPLES & TEMPLATES
 * 
 * Practical examples for integrating suicide detection
 * into the Polaris HTML interface
 */

/**
 * EXAMPLE 1: Daily Check-In Integration
 * 
 * Add this to index.html after mood rating but before anchor tracking
 */
export const DAILY_CHECKIN_UI_TEMPLATE = `
<!-- ============================================= -->
<!-- SAFETY CHECK-IN (NEW - Integrated Naturally) -->
<!-- ============================================= -->
<div id="safety-checkin-card" class="anchor-card safety-gradient" style="display: none;">
  <h3 class="card-title">
    <span style="font-size: 0.9em;">Quick Safety Check</span>
  </h3>
  
  <div class="safety-question">
    <p class="question-text">
      In the last 24 hours, have you had any thoughts that life might be better 
      if you weren't here?
    </p>
    <p class="question-subtext">
      This might feel like wanting to disappear, wishing you weren't alive, 
      or a general sense of hopelessness.
    </p>
    
    <div class="response-scale" id="ideation-scale">
      <label class="scale-option">
        <input type="radio" name="ideation-24h" value="0" checked>
        <span class="scale-label">Not at all</span>
      </label>
      <label class="scale-option">
        <input type="radio" name="ideation-24h" value="1">
        <span class="scale-label">Briefly</span>
      </label>
      <label class="scale-option">
        <input type="radio" name="ideation-24h" value="2">
        <span class="scale-label">Off and on</span>
      </label>
      <label class="scale-option">
        <input type="radio" name="ideation-24h" value="3">
        <span class="scale-label">Most of day</span>
      </label>
      <label class="scale-option">
        <input type="radio" name="ideation-24h" value="4">
        <span class="scale-label">Almost always</span>
      </label>
    </div>
  </div>

  <div class="safety-question mt-3">
    <p class="question-text">Do you feel safe right now?</p>
    
    <div class="response-buttons">
      <button class="btn btn-small" data-safety="yes">Yes, I feel safe</button>
      <button class="btn btn-small" data-safety="no">No, I don't feel safe</button>
      <button class="btn btn-small" data-safety="unsure">I'm not sure</button>
    </div>
  </div>

  <div id="safety-response" class="mt-3" style="display: none;">
    <!-- Response will be dynamically inserted here -->
  </div>

  <button class="btn btn-primary mt-2" id="submit-safety-check" style="width: 100%;">
    Continue
  </button>
</div>

<!-- CSS for Safety Card -->
<style>
  .safety-gradient {
    background: linear-gradient(135deg, rgba(147, 112, 219, 0.1) 0%, rgba(138, 43, 226, 0.05) 100%);
    border-left: 4px solid #9370db;
  }

  .safety-question {
    margin-bottom: 1.5rem;
  }

  .question-text {
    font-size: 1em;
    font-weight: 500;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .question-subtext {
    font-size: 0.85em;
    color: #666;
    font-style: italic;
    margin: 0.5rem 0;
  }

  .response-scale {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .scale-option {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .scale-option:hover {
    background: rgba(147, 112, 219, 0.1);
  }

  .scale-option input[type="radio"] {
    margin-right: 0.75rem;
  }

  .response-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .response-buttons .btn {
    flex: 1;
    min-width: 120px;
  }
</style>
`;

/**
 * EXAMPLE 2: Risk Level Dashboard
 */
export const RISK_DASHBOARD_TEMPLATE = `
<!-- ============================================= -->
<!-- RISK LEVEL DASHBOARD (Shown on Momentum Tab)  -->
<!-- ============================================= -->
<div id="safety-dashboard" class="dashboard-card" style="display: none;">
  <h3 class="card-title">Safety Status</h3>
  
  <div class="risk-indicator" id="risk-indicator">
    <!-- Dynamically updated based on risk level -->
  </div>

  <div class="protective-factors">
    <h4>Protective Factors</h4>
    <div id="protective-list">
      <!-- Dynamically populated -->
    </div>
  </div>

  <div class="next-checkin">
    <p class="text-muted text-small">
      Next check-in: <strong id="next-checkin-time"></strong>
    </p>
  </div>

  <button class="btn btn-secondary" id="full-safety-assessment">
    Complete Full Safety Assessment
  </button>
</div>

<!-- Risk Indicator Styles -->
<style>
  .risk-indicator {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-weight: 500;
    text-align: center;
  }

  .risk-low {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .risk-low-moderate {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
  }

  .risk-moderate {
    background: #ffe0b2;
    color: #d84315;
    border: 1px solid #ffb74d;
  }

  .risk-elevated {
    background: #ffccbc;
    color: #bf360c;
    border: 1px solid #ff6f00;
  }

  .risk-acute {
    background: #ffcdd2;
    color: #b71c1c;
    border: 1px solid #ff5252;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  .protective-factors {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
  }

  .protective-factors h4 {
    margin-bottom: 0.5rem;
  }

  #protective-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .protective-badge {
    background: #4caf50;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85em;
  }
</style>
`;

/**
 * EXAMPLE 3: Crisis Safe Box UI
 */
export const CRISIS_SAFE_BOX_TEMPLATE = `
<!-- ============================================= -->
<!-- CRISIS SAFE BOX (Emergency Mode)              -->
<!-- ============================================= -->
<div id="crisis-safe-box" class="modal-overlay" style="display: none;">
  <div class="crisis-modal glass-card">
    <h1 class="text-center text-red" style="font-size: 1.5em; margin-bottom: 1rem;">
      🚨 CRISIS RESOURCES
    </h1>

    <section class="crisis-section">
      <h2 class="section-title">🆘 IMMEDIATE HELP</h2>
      <div class="resource-list">
        <div class="resource-item clickable" id="call-988">
          <p class="resource-name">📞 Call or Text 988</p>
          <p class="resource-description">
            Suicide & Crisis Lifeline - Free, available 24/7
          </p>
          <button class="btn btn-primary btn-small">Call Now</button>
        </div>

        <div class="resource-item clickable" id="crisis-text">
          <p class="resource-name">💬 Text Crisis Line</p>
          <p class="resource-description">
            Text HOME to 741741 - Available 24/7
          </p>
          <button class="btn btn-primary btn-small">Open Messages</button>
        </div>

        <div class="resource-item critical" id="call-911">
          <p class="resource-name">🚗 Call 911</p>
          <p class="resource-description">
            Go to nearest emergency room
          </p>
          <button class="btn btn-danger btn-small">CALL NOW</button>
        </div>
      </div>
    </section>

    <section class="crisis-section">
      <h2 class="section-title">💪 YOUR REASONS TO LIVE</h2>
      <div id="reasons-to-live-list" class="reasons-list">
        <!-- Populated from user data -->
      </div>
    </section>

    <section class="crisis-section">
      <h2 class="section-title">🤝 YOUR SAFE PEOPLE</h2>
      <div id="safe-contacts-list" class="contacts-list">
        <!-- Populated from user data -->
      </div>
      <button class="btn btn-secondary" id="call-safe-contact">
        Contact Safe Person Now
      </button>
    </section>

    <section class="crisis-section">
      <h2 class="section-title">🧘 GROUNDING TECHNIQUES</h2>
      <div class="grounding-menu">
        <button class="btn btn-secondary" id="technique-5-4-3-2-1">
          5-4-3-2-1 Sensory
        </button>
        <button class="btn btn-secondary" id="technique-box-breathing">
          Box Breathing
        </button>
        <button class="btn btn-secondary" id="technique-cold-water">
          Cold Water Method
        </button>
      </div>
    </section>

    <p class="text-center text-muted mt-3">
      <strong>You are not alone. Help is available. You can get through this.</strong>
    </p>

    <button class="btn btn-secondary" id="close-safe-box" style="width: 100%;">
      Close
    </button>
  </div>
</div>

<!-- Crisis Safe Box Styles -->
<style>
  .crisis-modal {
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    padding: 2rem;
    margin: auto;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
  }

  .crisis-section {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }

  .crisis-section:last-child {
    border-bottom: none;
  }

  .section-title {
    font-size: 1.1em;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .resource-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .resource-item {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #9370db;
  }

  .resource-item.critical {
    background: #ffcdd2;
    border-left: 4px solid #d32f2f;
  }

  .resource-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .resource-description {
    font-size: 0.9em;
    color: #666;
    margin-bottom: 0.75rem;
  }

  .reasons-list, .contacts-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .reason-item, .contact-item {
    background: #f5f5f5;
    padding: 0.75rem;
    border-radius: 4px;
  }

  .grounding-menu {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .grounding-menu .btn {
    width: 100%;
  }

  .text-red {
    color: #d32f2f;
  }
</style>
`;

/**
 * EXAMPLE 4: JavaScript Integration
 */
export const JS_INTEGRATION_EXAMPLE = `
// In app.js, add to initialization:

import SafetyDetectionModule from './src/safety-detection.js';
import PolarisEnhancedSafety from './src/polaris-safety-integration.js';

// Initialize safety modules
const safetyDetection = new SafetyDetectionModule(state);
const polarisEnhanced = new PolarisEnhancedSafety(state, userLocation);

// Add to daily check-in flow
function initiateDailyCheckIn() {
  // Show safety check-in card
  document.getElementById('safety-checkin-card').style.display = 'block';

  // Handle responses
  document.getElementById('submit-safety-check').addEventListener('click', () => {
    const ideationResponse = document.querySelector('input[name="ideation-24h"]:checked').value;
    const safetyResponse = document.querySelector('[data-safety]')?.getAttribute('data-safety');

    // Create assessment data
    const assessmentData = {
      type: 'quick-screen',
      ideation: { value: parseInt(ideationResponse) },
      safety: { value: safetyResponse },
      timestamp: new Date().toISOString()
    };

    // Calculate risk
    const riskLevel = safetyDetection.calculateRiskLevel({
      quickScreen: assessmentData,
      patterns: safetyDetection.detectRiskPatterns(state)
    });

    // Handle response
    handleSafetyResponse(riskLevel, assessmentData);
  });
}

function handleSafetyResponse(riskLevel, assessmentData) {
  if (riskLevel.level === 'acute' || riskLevel.level === 'elevated') {
    // Show crisis safe box
    showCrisisSafeBox();
  } else if (riskLevel.level === 'moderate') {
    // Show safety planning
    showSafetyPlanning(assessmentData);
  } else {
    // Continue normal flow
    continueDailyCheckIn();
  }

  // Update dashboard
  updateSafetyDashboard(riskLevel);
}

function showCrisisSafeBox() {
  const safeBox = document.getElementById('crisis-safe-box');
  safeBox.style.display = 'flex';

  // Populate resources
  populateCrisisSafeBox();

  // Handle close
  document.getElementById('close-safe-box').addEventListener('click', () => {
    safeBox.style.display = 'none';
  });
}

function populateCrisisSafeBox() {
  // Add reasons to live
  const reasonsList = document.getElementById('reasons-to-live-list');
  (state.reasonsLive || []).forEach(reason => {
    const item = document.createElement('div');
    item.className = 'reason-item';
    item.textContent = reason;
    reasonsList.appendChild(item);
  });

  // Add safe contacts
  const contactsList = document.getElementById('safe-contacts-list');
  (state.safeContacts || []).forEach(contact => {
    const item = document.createElement('div');
    item.className = 'contact-item';
    item.innerHTML = \`<strong>\${contact.name}</strong><br/>\${contact.phone}\`;
    contactsList.appendChild(item);
  });
}

function updateSafetyDashboard(riskLevel) {
  const dashboard = document.getElementById('safety-dashboard');
  const indicator = document.getElementById('risk-indicator');

  const riskColors = {
    low: 'risk-low',
    'low-moderate': 'risk-low-moderate',
    moderate: 'risk-moderate',
    elevated: 'risk-elevated',
    acute: 'risk-acute'
  };

  const riskEmojis = {
    low: '✓',
    'low-moderate': '⚠',
    moderate: '⚠',
    elevated: '🔴',
    acute: '🚨'
  };

  indicator.className = \`risk-indicator \${riskColors[riskLevel.level]}\`;
  indicator.textContent = \`\${riskEmojis[riskLevel.level]} \${riskLevel.level.toUpperCase()}\`;

  dashboard.style.display = 'block';
}
`;

/**
 * EXAMPLE 5: CSS Classes Needed
 */
export const CSS_CLASSES_NEEDED = `
/* Ensure these classes exist in index.css */

.text-red { color: #d32f2f; }
.text-muted { color: #999; }
.text-small { font-size: 0.85em; }

.btn-danger {
  background: #d32f2f;
  color: white;
}

.btn-danger:hover {
  background: #b71c1c;
}

.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }

.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal-overlay {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

/* Ensure btn-small exists */
.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.85em;
}
`;

export default {
  DAILY_CHECKIN_UI_TEMPLATE,
  RISK_DASHBOARD_TEMPLATE,
  CRISIS_SAFE_BOX_TEMPLATE,
  JS_INTEGRATION_EXAMPLE,
  CSS_CLASSES_NEEDED
};
