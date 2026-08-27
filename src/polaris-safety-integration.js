/**
 * POLARIS SAFETY INTEGRATION LAYER
 *
 * The safety score is preserved as an internal routing aid.
 * It is NOT an individual suicide probability and must not be presented as one.
 *
 * Core behavior:
 * - stable / ordinary bad depression day -> do not force a suicide question
 * - meaningful multi-domain deterioration -> tighten support / ask general safety
 * - strong stacked deterioration -> ask directly about suicide
 * - explicit danger -> bypass routine flow and respond immediately
 */

import SafetyDetectionModule from './safety-detection.js';
import CrisisProtocol from './crisis-protocol.js';
import PolarisSafetyRouter from './polaris-safety-routing.js';

export class PolarisEnhancedSafety {
  constructor(polarisState = {}, userLocation = null) {
    this.polarisState = polarisState;
    this.safetyDetection = new SafetyDetectionModule(polarisState);
    this.crisisProtocol = new CrisisProtocol(userLocation);
    this.safetyRouter = new PolarisSafetyRouter(polarisState);
    this.safetyIntegration = {
      lastScreeningDate: null,
      nextScreeningDate: null,
      screeningFrequency: 'context-dependent',
      integratedAnchors: [],
      lastRoutingDecision: null
    };

    // Existing app.js currently tries to reveal the safety card after each energy check.
    // This gate intercepts that behavior without requiring repetitive suicide screening.
    queueMicrotask(() => this.installAdaptiveSafetyGate());
  }

  /**
   * Daily check-in structure. Safety inquiry is conditional, not mandatory.
   */
  dailyCheckInWithSafety() {
    return {
      id: 'daily-check-in-enhanced',
      structure: [
        {
          section: 'Energy & Mood',
          questions: [
            { id: 'today-energy', text: 'What is your energy level today?', type: 'energy-select' },
            { id: 'today-mood', text: 'How would you describe your mood?', type: 'mood-scale' }
          ]
        },
        {
          section: 'Safety',
          conditional: true,
          decision: this.evaluateSafetyState(this.polarisState),
          generalQuestion: 'Things look rougher than your recent baseline. Do you feel able to stay safe right now?',
          directQuestions: this.safetyDetection.quickIdeationScreen().questions
        },
        {
          section: 'Anchors Completed',
          type: 'anchor-tracking'
        }
      ]
    };
  }

  evaluateSafetyState(state = this.polarisState) {
    const decision = this.safetyRouter.decideInquiry(state);
    this.safetyIntegration.lastRoutingDecision = decision;
    state.polarisSafetyRouting = {
      action: decision.action,
      urgency: decision.urgency,
      stateSignalScore: decision.deterioration.score,
      domains: decision.deterioration.domains,
      reasons: decision.deterioration.reasons,
      directSignals: decision.directSignals,
      timestamp: new Date().toISOString(),
      note: 'Routing signal only; not a probability or clinical prediction.'
    };
    return decision;
  }

  /**
   * Compatibility method retained for existing callers.
   * Time alone no longer forces a suicide screen.
   */
  shouldAdministerExpandedScreen(currentState, lastScreeningDate = null) {
    const decision = this.evaluateSafetyState(currentState);
    return {
      shouldScreen: decision.askDirect,
      shouldAskGeneralSafety: decision.askGeneralSafety,
      action: decision.action,
      urgency: decision.urgency,
      stateSignalScore: decision.deterioration.score,
      domains: decision.deterioration.domains,
      directSignals: decision.directSignals,
      triggers: {
        timeBased: false,
        stateBased: decision.deterioration.score > 0,
        patternBased: decision.deterioration.domains.length > 1,
        directDanger: decision.directSignals.length > 0
      },
      lastScreeningDate
    };
  }

  /**
   * Existing UI compatibility gate.
   * app.js sets #safety-checkin-card to display:block after an energy response.
   * We let that happen only when the current state supports asking.
   */
  installAdaptiveSafetyGate() {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return false;
    const card = document.getElementById('safety-checkin-card');
    if (!card) return false;

    const applyGate = () => {
      // After SNF extracted inline styles, this card is CSS-hidden via
      // `.snf-ui-47 { display: none }`. Only intercept once app.js reveals it
      // with inline display:block after energy check-in.
      if (card.style.display !== 'block') return;
      const decision = this.evaluateSafetyState(this.polarisState);
      const ideationScale = card.querySelector('#ideation-scale');
      const ideationBlock = ideationScale?.closest('.safety-question');

      if (this.shouldActivateCrisisNow(decision)) {
        if (ideationBlock) ideationBlock.style.display = 'block';
        card.style.display = 'block';
        this.activateExistingCrisisFlow(decision);
        return;
      }

      if (decision.askDirect) {
        if (ideationBlock) ideationBlock.style.display = 'block';
        card.style.display = 'block';
        return;
      }

      if (decision.askGeneralSafety) {
        if (ideationBlock) ideationBlock.style.display = 'none';
        const title = card.querySelector('.card-title');
        if (title) title.textContent = 'Quick Safety Check';
        card.style.display = 'block';
        return;
      }

      // No safety question is warranted: continue the normal daily flow.
      card.style.display = 'none';
      if (ideationBlock) ideationBlock.style.display = 'block';
      this.resumeRoutineFlow(decision);
    };

    this._safetyGateObserver?.disconnect?.();
    this._safetyGateObserver = new MutationObserver(() => applyGate());
    this._safetyGateObserver.observe(card, { attributes: true, attributeFilter: ['style', 'class'] });
    applyGate();
    return true;
  }

  shouldActivateCrisisNow(decision) {
    const critical = new Set([
      'cannot-stay-safe',
      'current-intent',
      'preparatory-behavior',
      'recent-attempt',
      'journal-unsafe',
      'journal-direct-risk',
      'existing-high-suicide-safety-flag',
      'signal-feed:explicit-suicidal-intent',
      'signal-feed:cannot-stay-safe',
      'signal-feed:preparatory-behavior',
      'signal-feed:recent-attempt'
    ]);
    return decision.directSignals.some(signal => critical.has(signal));
  }

  activateExistingCrisisFlow(decision) {
    this.polarisState.safety = this.polarisState.safety || {};
    this.polarisState.safety.suicide = Math.max(2, Number(this.polarisState.safety.suicide) || 0);
    this.polarisState.polarisSafetyRouting.crisisBypass = true;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('polaris:direct-danger', { detail: decision }));
      if (typeof window.triggerCrisisOverlay === 'function') {
        window.triggerCrisisOverlay();
      }
    }
  }

  resumeRoutineFlow(decision) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('polaris:safety-gate-skipped', { detail: decision }));

    // These are existing global functions in the static PWA when available.
    const safeCalls = ['renderDailyChecklist', 'updateDashboardMetrics'];
    for (const name of safeCalls) {
      try {
        if (typeof window[name] === 'function') window[name]();
      } catch (err) {
        console.warn(`Polaris safety routing could not call ${name}:`, err);
      }
    }
  }

  recordCompanionSafetySignal(type, metadata = {}) {
    const item = this.safetyRouter.recordDirectSafetySignal(type, 'polaris-companion', metadata);
    const decision = this.evaluateSafetyState(this.polarisState);
    if (this.shouldActivateCrisisNow(decision)) this.activateExistingCrisisFlow(decision);
    return { item, decision };
  }

  daysSinceLastAssessment(lastDate) {
    if (!lastDate) return Infinity;
    return Math.floor((Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));
  }

  detectRapidDeteriorationPattern(state) {
    if (!state.history || state.history.length < 3) return false;
    const recent = state.history.slice(0, 3);
    return recent.every((d, i) => i === 0 || (d.completed?.length || 0) < (recent[i - 1].completed?.length || 0));
  }

  detectAnchorAbandonmentPattern(state) {
    if (!state.history || state.history.length < 7) return false;
    const hadAnchors = state.history.slice(1, 7).some(d => (d.completed?.length || 0) > 0);
    return hadAnchors && (state.history[0]?.completed?.length || 0) === 0;
  }

  detectSocialIsolationSpike(state) {
    if (!state.history || state.history.length < 3) return false;
    const current = Number(state.ratings?.social) || 0;
    const average = state.history.slice(0, 7)
      .reduce((sum, h) => sum + (Number(h.socialScore) || 0), 0) / Math.min(7, state.history.length);
    return current > average + 15;
  }

  /**
   * Preserve adaptive anchors, but do not let an indirect score alone create an emergency.
   */
  generateAdaptiveAnchors(riskLevel, baseAnchors = {}) {
    const adaptive = { ...baseAnchors };
    const level = riskLevel?.level || 'low';

    const map = {
      low: { safetyAnchors: [], checkInFrequency: 'standard' },
      'low-moderate': {
        safetyAnchors: [{ id: 'support-bridge', text: 'Keep one reachable human connection open today.', category: 'connection', level: 1 }],
        checkInFrequency: 'standard'
      },
      moderate: {
        safetyAnchors: [
          { id: 'daily-safe-contact', text: 'Contact one safe person today.', category: 'connection', level: 0, critical: true },
          { id: 'reduce-load', text: 'Reduce the day to the survival floor.', category: 'stabilization', level: 0, critical: true }
        ],
        checkInFrequency: 'increased'
      },
      elevated: {
        safetyAnchors: [
          { id: 'contact-now', text: 'Bring another person into the situation now.', category: 'crisis', critical: true },
          { id: 'professional-support', text: 'Use your crisis/professional support route now.', category: 'crisis', critical: true }
        ],
        checkInFrequency: 'high'
      },
      acute: { action: 'EMERGENCY_PROTOCOL', override: true }
    };

    return { ...adaptive, ...(map[level] || map.low) };
  }

  calculateSafetyAwareHope(currentHope, riskLevel, protectiveFactors = []) {
    const level = riskLevel?.level || 'low';
    return {
      official: currentHope,
      safetyAdjusted: currentHope,
      protectiveFactorCount: protectiveFactors.length,
      message: level === 'acute'
        ? 'The priority is immediate safety and human support.'
        : level === 'elevated'
          ? 'Reduce load and bring support closer.'
          : 'Keep the current floor stable.'
    };
  }

  getEmergencyAnchorHierarchy() {
    return {
      tier1_immediate: [
        { action: 'Tell another person you are not safe', how: 'Use a trusted person, crisis service, or emergency service.' },
        { action: 'Reduce isolation', how: 'Move toward another person or another supervised/supported setting.' },
        { action: 'Increase time and distance from lethal means', how: 'Use another person to help create safer distance and access control.' }
      ],
      tier2_first_24_hours: [
        { action: 'Connect with professional support', how: 'Use the care route appropriate to the current level of danger.' },
        { action: 'Review a collaborative safety plan', how: 'Use warning signs, coping steps, reachable people, professional contacts, and environmental safety.' }
      ],
      tier3_ongoing: [
        { action: 'Maintain follow-up contact', how: 'Keep agreed check-ins and care transitions visible.' },
        { action: 'Restore biological and functional floor', how: 'Sleep/rhythm, food, hydration, prescribed medication routine, movement, and basic environment.' }
      ]
    };
  }

  generateSafetyDashboard(state, riskAssessment = {}) {
    const route = this.evaluateSafetyState(state);
    return {
      timestamp: new Date().toISOString(),
      directSafetyScore: riskAssessment.score ?? null,
      directSafetyBand: riskAssessment.level ?? null,
      stateSignalScore: route.deterioration.score,
      stateSignalDomains: route.deterioration.domains,
      routingAction: route.action,
      directSignals: route.directSignals,
      protectiveFactors: {
        reachableContacts: state.safeContacts || null,
        reasonsForLiving: state.reasonsLive || null
      },
      interpretation: 'Scores guide support routing and questioning; they are not suicide probabilities.'
    };
  }

  calculateNextCheckIn(riskLevel) {
    const intervals = { acute: '1 hour', elevated: '12 hours', moderate: '24 hours', 'low-moderate': '3 days', low: '7 days' };
    const interval = intervals[riskLevel] || '7 days';
    return { interval, nextTime: new Date(Date.now() + this.parseInterval(interval)) };
  }

  parseInterval(interval) {
    const match = String(interval).match(/(\d+)\s+(\w+)/);
    if (!match) return 0;
    const multipliers = { hour: 3600000, hours: 3600000, day: 86400000, days: 86400000, week: 604800000, weeks: 604800000 };
    return Number(match[1]) * (multipliers[match[2]] || 0);
  }

  prepareForProgressHandoff(state, assessments = [], riskLevel = {}) {
    return {
      preparedDate: new Date().toISOString(),
      summary: {
        directSafetyBand: riskLevel.level || null,
        directSafetyScore: riskLevel.score ?? null,
        stateRouting: this.evaluateSafetyState(state),
        assessmentsCompleted: assessments.map(a => a.type)
      },
      assessmentResponses: assessments,
      note: 'Polaris data is longitudinal context for a human professional, not an actuarial prediction.',
      safetyPlan: this.crisisProtocol.generateSafetyPlan?.(state, { recognizedTrigger: state.dominantPattern }) || null,
      followUpSchedule: this.crisisProtocol.postCrisisFollowUp?.(state) || null
    };
  }
}

export default PolarisEnhancedSafety;
