/**
 * POLARIS DIRECT SAFETY ASSESSMENT MODULE
 *
 * Numerical scoring is retained as a support-routing aid.
 * The score is NOT an actuarial probability of attempt or suicide death.
 * Dynamic deterioration is handled separately by polaris-safety-routing.js.
 */

export class SafetyDetectionModule {
  constructor(polarisState = {}) {
    this.state = polarisState;
    this.assessmentHistory = [];
    this.riskProfile = {
      currentLevel: 'low',
      trendDirection: 'stable',
      lastAssessmentDate: null,
      activeFlags: [],
      protectiveFactors: [],
      concerningPatterns: []
    };
  }

  quickIdeationScreen() {
    return {
      id: 'quick-ideation',
      type: 'brief',
      questions: [
        {
          id: 'ideation-presence',
          text: 'In the last 24 hours, have you had thoughts that life might be better if you were not here?',
          subtext: 'The point is to understand what is happening now, not to label you.',
          responseScale: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Briefly, but it passed quickly' },
            { value: 2, label: 'Off and on' },
            { value: 3, label: 'Most of the day' },
            { value: 4, label: 'Almost constantly' }
          ],
          followUpIf: [1, 2, 3, 4]
        },
        {
          id: 'active-planning',
          text: 'Have you been thinking about harming yourself or preparing to act on suicidal thoughts?',
          responseScale: [
            { value: 0, label: 'No' },
            { value: 1, label: 'Brief thoughts, no preparation' },
            { value: 2, label: 'Some preparation or growing intent' },
            { value: 3, label: 'Clear current plan or preparation' },
            { value: 4, label: 'I may act very soon' }
          ],
          followUpIf: [1, 2, 3, 4]
        }
      ]
    };
  }

  intentVsIdeationAssessment() {
    return {
      id: 'intent-differentiation',
      type: 'detailed',
      context: 'Clarify current intent, immediacy, access, and ability to stay safe.',
      questions: [
        {
          id: 'intent-conviction',
          text: 'How strong is your current intention to act on these thoughts?',
          responseScale: [
            { value: 0, label: 'No intention to act' },
            { value: 1, label: 'Very low' },
            { value: 2, label: 'Uncertain / changing' },
            { value: 3, label: 'Strong' },
            { value: 4, label: 'I intend to act' }
          ]
        },
        {
          id: 'access-means',
          text: 'Do you currently have ready access to something you believe could be lethal?',
          responseScale: [
            { value: 0, label: 'No ready access' },
            { value: 1, label: 'Not readily accessible' },
            { value: 2, label: 'Access could be obtained' },
            { value: 3, label: 'Ready access' },
            { value: 4, label: 'Immediate access' }
          ]
        },
        {
          id: 'plan-timeline',
          text: 'How immediate does acting on these thoughts feel?',
          responseScale: [
            { value: 0, label: 'I do not expect to act' },
            { value: 1, label: 'Not soon / vague future' },
            { value: 2, label: 'Could become a problem soon' },
            { value: 3, label: 'Current specific timeframe' },
            { value: 4, label: 'I may act now or very soon' }
          ]
        },
        {
          id: 'can-stay-safe',
          text: 'Do you feel able to stay safe right now?',
          responseScale: [
            { value: 0, label: 'Yes' },
            { value: 2, label: 'I am not sure' },
            { value: 4, label: 'No' }
          ]
        },
        {
          id: 'reachable-support',
          text: 'Who or what support is actually reachable right now?',
          responseType: 'multiselect',
          options: ['Trusted person', 'Clinician', 'Crisis service', 'Safer place', 'Other reachable support', 'No reachable support']
        }
      ]
    };
  }

  comprehensiveRiskAssessment() {
    return {
      id: 'comprehensive-risk',
      type: 'extensive',
      sections: [
        {
          name: 'Current suicidal state',
          questions: [
            { id: 'frequency-change', text: 'Have suicidal thoughts become more frequent, intense, persistent, or harder to control?' },
            { id: 'intent-change', text: 'Has your intention to act changed recently?' },
            { id: 'safety-control', text: 'How confident are you that you can keep yourself safe right now?' }
          ]
        },
        {
          name: 'Recent state change',
          questions: [
            { id: 'social-withdrawal-change', text: 'Have you withdrawn much more than usual?' },
            { id: 'sleep-pattern-shift', text: 'Has sleep or circadian timing changed sharply?' },
            { id: 'agitation-change', text: 'Has severe agitation, panic, or mixed activation increased?' },
            { id: 'substance-change', text: 'Has intoxication, withdrawal, or substance-related loss of control increased?' },
            { id: 'major-stressor', text: 'Has a major relationship, housing, legal, financial, medical, or care-transition stressor occurred?' }
          ]
        },
        {
          name: 'Action / access',
          questions: [
            { id: 'preparatory-behavior', text: 'Have you taken any steps that feel like preparation to act?' },
            { id: 'lethal-access', text: 'Is highly lethal access immediate right now?' }
          ]
        },
        {
          name: 'Rescue capacity',
          questions: [
            { id: 'reachable-person', text: 'Is there a person who will answer or come be with you?' },
            { id: 'reachable-care', text: 'Is urgent professional/crisis support actually reachable?' },
            { id: 'safer-place', text: 'Is there a safer place you can go or a way to reduce isolation?' },
            { id: 'environmental-safety', text: 'Can another person help increase time and distance from lethal means?' }
          ]
        }
      ]
    };
  }

  detectRiskPatterns(currentState, previousState = null) {
    const patterns = [];
    const timestamp = new Date().toISOString();
    const ratings = currentState.ratings || {};
    const high = (v) => Number(v) >= 3;

    if (currentState.todayEnergy === 'collapse' && previousState?.todayEnergy !== 'collapse') {
      patterns.push({ type: 'rapid-collapse', severity: 'moderate', description: 'Sudden functional collapse', timestamp });
    }

    const todayCompleted = currentState.history?.[0]?.completed?.length || 0;
    const priorActive = currentState.history?.slice(1, 7).filter(d => (d.completed?.length || 0) > 0).length || 0;
    if (todayCompleted === 0 && priorActive >= 3) {
      patterns.push({ type: 'anchor-abandonment', severity: 'elevated', description: 'Abrupt loss of previously maintained routine', timestamp });
    }

    if (high(ratings.social)) {
      patterns.push({ type: 'social-isolation', severity: 'moderate', description: 'Serious/severe isolation burden', timestamp });
    }
    if (high(ratings.meaning) && Number(currentState.currentHopeLevel) <= 1) {
      patterns.push({ type: 'future-narrowing', severity: 'elevated', description: 'Low hope plus severe meaning/future burden', timestamp });
    }
    if (high(ratings.sleep)) {
      patterns.push({ type: 'sleep-circadian-disruption', severity: 'moderate', description: 'Serious/severe sleep or rhythm disruption', timestamp });
    }

    const zeroCount = (currentState.history || []).slice(0, 7).filter(d => (d.completed?.length || 0) === 0).length;
    if (zeroCount >= 5) {
      patterns.push({ type: 'multi-day-functional-loss', severity: 'moderate', description: 'Five or more zero-anchor days', timestamp });
    }

    return patterns;
  }

  contextualRiskFactors(state) {
    const factors = {
      recent_losses: [],
      upcoming_stressors: [],
      care_transitions: [],
      substance_factors: [],
      medical_factors: []
    };

    if (state.recentMajorLoss === true || ['Rejection Sensitivity', 'Grief/Loss'].includes(state.dominantPattern)) {
      factors.recent_losses.push('Recent loss/rejection context');
    }
    if (state.recentPsychDischarge === true || state.recentCareTransition === true) {
      factors.care_transitions.push('Recent care transition');
    }
    if (state.substanceSafetyConcern === true || state.severeIntoxication === true || state.acuteWithdrawal === true) {
      factors.substance_factors.push('Current substance-related safety concern');
    }
    if (state.lastMedicationChange && Date.now() - new Date(state.lastMedicationChange).getTime() < 14 * 86400000) {
      factors.medical_factors.push('Recent medication change');
    }
    return factors;
  }

  calculateRiskLevel(assessmentData = {}) {
    const quick = assessmentData.quickScreen || {};
    const intent = assessmentData.intentAssessment || {};
    const warnings = [];

    const ideationScore = Number(quick.ideation?.value ?? quick.responses?.ideationPresence ?? 0) || 0;
    const intentScore = Number(intent.intent?.value ?? intent.conviction?.value ?? 0) || 0;
    const meansScore = Number(intent.access?.value ?? 0) || 0;
    const timelineScore = Number(intent.timeline?.value ?? 0) || 0;
    const canStaySafeScore = Number(intent.canStaySafe?.value ?? 0) || 0;
    const safetyAnswer = quick.safety?.value ?? quick.responses?.feeling_safe;

    const directScore = Math.min(16, ideationScore + intentScore + meansScore + timelineScore);
    const patterns = assessmentData.patterns || [];
    const directOverrides = assessmentData.directOverrides || {};

    const cannotStaySafe = safetyAnswer === 'no' || safetyAnswer === false || canStaySafeScore >= 4 || directOverrides.cannotStaySafe === true;
    const currentIntent = directOverrides.currentIntent === true || intentScore >= 4;
    const preparation = directOverrides.preparatoryBehavior === true || assessmentData.preparatoryBehavior === true;
    const recentAttempt = directOverrides.recentAttempt === true || assessmentData.recentAttempt === true;
    const imminent = timelineScore >= 4 && intentScore >= 3;

    let level = 'low';
    if (cannotStaySafe || recentAttempt || preparation || (currentIntent && imminent)) {
      level = 'acute';
      warnings.push('Immediate safety response is warranted from direct current danger evidence.');
    } else if (directScore >= 10 || (ideationScore >= 3 && intentScore >= 2)) {
      level = 'elevated';
      warnings.push('Direct safety information warrants prompt expanded assessment/support.');
    } else if (directScore >= 4 || ideationScore >= 2) {
      level = 'moderate';
      warnings.push('Direct safety information warrants clarification and safety planning/support as appropriate.');
    } else if (directScore >= 1) {
      level = 'low-moderate';
    }

    // Protective factors inform the plan but never mechanically cancel direct danger.
    const protectiveFactors = intent.protective?.selected || intent.reachableSupport?.selected || [];

    return {
      level,
      score: directScore,
      maxScore: 16,
      scalePercent: Math.round((directScore / 16) * 100),
      interpretation: 'Routing score only; not a suicide probability or population percentile.',
      requiresExpandedAssessment: ideationScore > 0 || intentScore > 0 || meansScore > 0 || timelineScore > 0 || cannotStaySafe,
      directOverrides: { cannotStaySafe, currentIntent, preparation, recentAttempt, imminent },
      protectiveFactors,
      patterns,
      warnings,
      timestamp: new Date().toISOString()
    };
  }

  generateSafetyResponse(riskLevel, state = this.state) {
    const level = riskLevel?.level || 'low';
    const response = { riskLevel: level, immediateActions: [], supportResources: [], anchorAdjustments: [], followUpSchedule: null };

    if (level === 'acute') {
      response.immediateActions = [
        'Bring another person or crisis/emergency support into the situation now.',
        'Use the Crisis Safe Box / Emergency Floor.',
        'Increase time and distance from lethal means with help from another person where possible.'
      ];
      response.supportResources = [{ name: '988 Suicide & Crisis Lifeline', number: '988', type: 'immediate-us' }];
      response.anchorAdjustments = ['Suspend expansion goals; safety and human connection first.'];
      response.followUpSchedule = 'Immediate human/crisis response';
    } else if (level === 'elevated') {
      response.immediateActions = ['Complete direct safety clarification.', 'Bring reachable human support closer.', 'Use collaborative safety planning.'];
      response.anchorAdjustments = ['Reduce to survival/stabilization floor.'];
      response.followUpSchedule = 'Prompt reassessment/support';
    } else if (level === 'moderate') {
      response.immediateActions = ['Clarify current safety and recent change.', 'Strengthen reachable supports and safety plan if needed.'];
      response.anchorAdjustments = ['Keep load low and connection visible.'];
      response.followUpSchedule = 'Reassess with meaningful state change';
    } else {
      response.immediateActions = ['Continue ordinary support unless the state changes.'];
      response.followUpSchedule = 'Context-dependent';
    }
    return response;
  }

  generateCrisisSafeBox(state = this.state) {
    return {
      id: 'crisis-safe-box',
      activated: new Date().toISOString(),
      contents: {
        immediateResources: [{ name: '988 Suicide & Crisis Lifeline', phone: '988', text: 'Call or text in the U.S.' }],
        safeContacts: state.safeContacts || [],
        reasonsToLive: state.reasonsLive || [],
        distractions: state.distractions || [],
        collaborativeSafetyPlan: {
          warningSigns: state.personalWarningSigns || [],
          copingStrategies: state.distractions || [],
          reachablePeople: state.safeContacts || [],
          professionalHelp: state.professionalContacts || [],
          environmentalSafety: 'Increase time and distance from lethal means with another person when possible.'
        }
      }
    };
  }

  adjustAnchorsForSafety(riskLevel, currentAnchors = {}) {
    const adjusted = { ...currentAnchors };
    const level = riskLevel?.level || 'low';
    if (level === 'acute' || level === 'elevated') {
      adjusted.level = 0;
      adjusted.primary = ['Bring human support closer', 'Use crisis/professional support', 'Reduce isolation and environmental danger'];
    } else if (level === 'moderate') {
      adjusted.additionalFocus = ['Keep one reachable person visible', 'Use the survival/stabilization floor'];
    }
    adjusted.safetyFlags = {
      checked: true,
      lastAssessmentDate: new Date().toISOString(),
      riskLevel: level,
      directSafetyScore: riskLevel?.score ?? null,
      nextReviewDate: this.calculateNextReviewDate(level)
    };
    return adjusted;
  }

  calculateNextReviewDate(level) {
    const days = { acute: 0, elevated: 1, moderate: 3, 'low-moderate': 7, low: 14 }[level] ?? 7;
    return new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
  }

  logAssessment(assessmentData, response) {
    const log = {
      timestamp: new Date().toISOString(),
      assessmentType: assessmentData.type,
      responses: assessmentData,
      routingBand: response.riskLevel,
      actionsInitiated: response.immediateActions,
      reviewNotes: 'Polaris safety routing record; not an actuarial prediction.'
    };
    this.assessmentHistory.push(log);
    return { logged: true, logId: `safety-${Date.now()}`, recommendation: 'Share with a clinician/support person if useful.' };
  }
}

export default SafetyDetectionModule;
