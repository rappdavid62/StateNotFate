/**
 * POLARIS SAFETY INTEGRATION LAYER
 * 
 * Seamlessly integrates suicide detection and crisis protocols
 * with the existing Polaris 2.0 daily anchor system
 */

import SafetyDetectionModule from './safety-detection.js';
import CrisisProtocol from './crisis-protocol.js';

export class PolarisEnhancedSafety {
  constructor(polarisState = {}, userLocation = null) {
    this.polarisState = polarisState;
    this.safetyDetection = new SafetyDetectionModule(polarisState);
    this.crisisProtocol = new CrisisProtocol(userLocation);
    this.safetyIntegration = {
      lastScreeningDate: null,
      nextScreeningDate: null,
      screeningFrequency: 'daily', // daily, weekly, or context-dependent
      integratedAnchors: []
    };
  }

  /**
   * INTEGRATED DAILY CHECK-IN
   * Combines mood/anchor tracking with safety screening
   */
  dailyCheckInWithSafety() {
    return {
      id: 'daily-check-in-enhanced',
      structure: [
        // Standard Polaris check-in
        {
          section: 'Energy & Mood',
          questions: [
            { id: 'today-energy', text: 'What is your energy level today?', type: 'energy-select' },
            { id: 'today-mood', text: 'How would you describe your mood?', type: 'mood-scale' }
          ]
        },
        // Integrated safety screening
        {
          section: 'Daily Safety Check',
          subtext: 'Quick check-in to understand how you\'re doing',
          questions: [
            {
              id: 'today-ideation',
              text: 'Have you had thoughts today that life might be better if you weren\'t here?',
              scale: [0, 1, 2, 3, 4],
              escalateIf: [2, 3, 4],
              followUp: true
            },
            {
              id: 'today-safety',
              text: 'Do you feel safe in your current situation?',
              responseType: 'yesno',
              escalateIf: 'no'
            }
          ]
        },
        // Anchor completion
        {
          section: 'Anchors Completed',
          type: 'anchor-tracking'
        }
      ],
      conditionalFollowUp: {
        ifIdeationScoreGreaterThan1: 'Offer expanded safety screen',
        ifNotFeelingSafe: 'Activate alert protocol',
        ifCollapsedLevel: 'Assess additional risk factors'
      }
    };
  }

  /**
   * INTELLIGENT SCREENING TRIGGER
   * Determines when to administer expanded safety assessments
   */
  shouldAdministerExpandedScreen(currentState, lastScreeningDate) {
    const triggers = {
      timeBasedTriggers: [
        lastScreeningDate === null, // First time
        this.daysSinceLastAssessment(lastScreeningDate) >= 7 // Weekly minimum
      ],
      stateBasedTriggers: [
        currentState.todayEnergy === 'collapse',
        currentState.currentHopeLevel < 2,
        currentState.dominantPattern === 'Rumination' ||
          currentState.dominantPattern === 'Meaning Loss',
        (currentState.history?.[0]?.completed?.length || 0) === 0, // Zero-day
        (currentState.ratings?.shame || 0) > 30
      ],
      patternBasedTriggers: [
        this.detectRapidDeteriorationPattern(currentState),
        this.detectAnchorAbandonmentPattern(currentState),
        this.detectSocialIsolationSpike(currentState)
      ]
    };

    const shouldScreen =
      triggers.timeBasedTriggers.some(t => t) ||
      triggers.stateBasedTriggers.some(t => t) ||
      triggers.patternBasedTriggers.some(t => t);

    return {
      shouldScreen,
      triggers: {
        timeBased: triggers.timeBasedTriggers.filter(t => t).length > 0,
        stateBased: triggers.stateBasedTriggers.filter(t => t).length > 0,
        patternBased: triggers.patternBasedTriggers.filter(t => t).length > 0
      }
    };
  }

  daysSinceLastAssessment(lastDate) {
    if (!lastDate) return Infinity;
    const days = (new Date() - new Date(lastDate)) / (1000 * 60 * 60 * 24);
    return Math.floor(days);
  }

  detectRapidDeteriorationPattern(state) {
    if (!state.history || state.history.length < 3) return false;
    const recent = state.history.slice(0, 3);
    return recent.every((d, i) => {
      if (i === 0) return true;
      return (d.completed?.length || 0) < (recent[i - 1].completed?.length || 0);
    });
  }

  detectAnchorAbandonmentPattern(state) {
    if (!state.history || state.history.length < 7) return false;
    const hadAnchors = state.history.slice(1, 7).some(d => (d.completed?.length || 0) > 0);
    const nowHasNone = (state.history[0]?.completed?.length || 0) === 0;
    return hadAnchors && nowHasNone;
  }

  detectSocialIsolationSpike(state) {
    if (!state.history || state.history.length < 3) return false;
    const currentSocialScore = state.ratings?.social || 0;
    const recentAverage = state.history
      .slice(0, 7)
      .reduce((sum, h) => sum + (h.socialScore || 0), 0) / Math.min(7, state.history.length);
    return currentSocialScore > recentAverage + 15;
  }

  /**
   * ADAPTIVE SAFETY ANCHORS
   * Integrate protective anchors based on risk level
   */
  generateAdaptiveAnchors(riskLevel, baseAnchors) {
    const adaptiveAnchors = { ...baseAnchors };

    // Map risk levels to anchor adjustments
    const anchorModifications = {
      low: {
        addAnchors: [],
        frequency: 'standard'
      },
      'low-moderate': {
        addAnchors: [
          {
            id: 'weekly-safety-review',
            text: 'Weekly check-in: Review why you want to live',
            category: 'protective',
            level: 1
          }
        ],
        frequency: 'standard'
      },
      moderate: {
        addAnchors: [
          {
            id: 'daily-safe-contact',
            text: 'Contact one safe person today (call, text, or visit)',
            category: 'connection',
            level: 0,
            critical: true
          },
          {
            id: 'daily-reasons-review',
            text: 'Spend 2 minutes thinking about why you want to live',
            category: 'protective',
            level: 0,
            critical: true
          }
        ],
        frequency: 'increased',
        checkInTiming: 'twice-daily'
      },
      elevated: {
        replaceLevel: 0,
        anchors: [
          {
            id: 'emergency-contact',
            text: 'Contact safe person NOW - tell them you are in crisis',
            category: 'crisis',
            critical: true
          },
          {
            id: 'immediate-grounding',
            text: 'Use 5-4-3-2-1 grounding technique or box breathing',
            category: 'coping',
            critical: true
          },
          {
            id: 'locate-support',
            text: 'Have written list of crisis resources visible',
            category: 'connection',
            critical: true
          }
        ],
        frequency: 'continuous',
        checkInTiming: 'hourly'
      },
      acute: {
        action: 'EMERGENCY_PROTOCOL',
        override: true,
        instructions: 'Call 911 or go to nearest ER immediately'
      }
    };

    if (riskLevel.level === 'acute') {
      return anchorModifications.acute;
    }

    const mods = anchorModifications[riskLevel.level] || anchorModifications.low;

    if (mods.replaceLevel !== undefined) {
      adaptiveAnchors.currentLevel = mods.replaceLevel;
      adaptiveAnchors.safetyAnchors = mods.anchors;
    } else {
      adaptiveAnchors.safetyAnchors = mods.addAnchors;
    }

    adaptiveAnchors.checkInFrequency = mods.frequency;
    adaptiveAnchors.checkInTiming = mods.checkInTiming || 'daily';

    return adaptiveAnchors;
  }

  /**
   * SAFETY-AWARE HOPE CALCULATION
   * Adjusts hope level based on safety status
   */
  calculateSafetyAwareHope(currentHope, riskLevel, protectiveFactors) {
    let adjustedHope = currentHope;

    // Safety penalties to hope
    if (riskLevel.level === 'acute' || riskLevel.level === 'elevated') {
      // Acute crisis temporarily suppresses hope perception
      adjustedHope = Math.max(0, currentHope - 2);
    }

    // Protective factor bonuses
    if (protectiveFactors.length > 3) {
      adjustedHope = Math.min(4, adjustedHope + 1);
    }

    return {
      official: currentHope,
      safetyAdjusted: adjustedHope,
      protectiveBoost: protectiveFactors.length > 3 ? 1 : 0,
      crisisAdjustment: riskLevel.level !== 'low' ? -1 : 0,
      message:
        riskLevel.level === 'acute'
          ? 'Right now, getting to safety is more important than feeling hope. Hope can come after immediate help.'
          : riskLevel.level === 'elevated'
            ? 'You are in a difficult place, but crisis passes. Reach out for help now.'
            : 'Your protective factors are strong. Hold onto them.'
    };
  }

  /**
   * EMERGENCY ANCHOR HIERARCHY
   * What to focus on during crisis
   */
  getEmergencyAnchorHierarchy() {
    return {
      tier1_immediate: [
        {
          action: 'Tell someone you are in crisis',
          how: 'Call safe person, crisis line (988), or go to ER',
          why: 'You need immediate support - this is not something to handle alone'
        },
        {
          action: 'Do not isolate',
          how: 'Stay with someone, go to public place, or go to ER',
          why: 'Isolation increases risk. Being around others is protective'
        },
        {
          action: 'Use grounding technique',
          how: '5-4-3-2-1 sensory, box breathing, or cold water',
          why: 'Brings you back to present moment and reduces acute distress'
        }
      ],
      tier2_first_24_hours: [
        {
          action: 'Contact therapist or mental health provider',
          how: 'Call office, use crisis line to find provider, or ask ER for referral',
          why: 'Professional assessment and care is essential'
        },
        {
          action: 'Secure means (if applicable)',
          how: 'Tell safe person about methods, secure medications, separate from access',
          why: 'Reduces impulsivity risk during high-distress periods'
        },
        {
          action: 'Build safety plan with support person',
          how: 'Write down warning signs, coping strategies, emergency contacts',
          why: 'Having a plan reduces anxiety and improves crisis response'
        }
      ],
      tier3_ongoing: [
        {
          action: 'Daily check-in with safe person',
          how: 'Call, text, or in-person meeting',
          why: 'Maintains connection and allows early detection of worsening'
        },
        {
          action: 'Engage protective anchors',
          how: 'Use distractions, movement, social contact',
          why: 'Builds resilience and reduces rumination'
        },
        {
          action: 'Increase therapy frequency',
          how: 'Request twice-weekly or more intensive treatment',
          why: 'Professional support accelerates crisis resolution'
        }
      ]
    };
  }

  /**
   * SAFETY DASHBOARD
   * Real-time safety status visualization
   */
  generateSafetyDashboard(state, riskAssessment) {
    return {
      timestamp: new Date().toISOString(),
      riskLevel: {
        current: riskAssessment.level,
        score: riskAssessment.score,
        severity: {
          low: '✓ Stable',
          'low-moderate': '⚠ Monitor',
          moderate: '⚠ Alert',
          elevated: '🚨 High Alert',
          acute: '🚨🚨 EMERGENCY'
        }[riskAssessment.level]
      },
      protectiveFactors: {
        count: (state.safeContacts?.length || 0) + (state.reasonsLive?.length || 0),
        status: 'Strong' || 'Adequate' || 'Limited'
      },
      concerningPatterns: {
        active: riskAssessment.patterns?.length || 0,
        types: riskAssessment.patterns?.map(p => p.type) || []
      },
      nextCheckIn: this.calculateNextCheckIn(riskAssessment.level),
      recommendedActions: this.crisisProtocol.generateSafetyResponse(
        riskAssessment,
        state
      ).immediateActions
    };
  }

  calculateNextCheckIn(riskLevel) {
    const now = new Date();
    const intervals = {
      acute: '1 hour',
      elevated: '12 hours',
      moderate: '24 hours',
      'low-moderate': '3 days',
      low: '7 days'
    };
    return {
      interval: intervals[riskLevel],
      nextTime: new Date(now.getTime() + this.parseInterval(intervals[riskLevel]))
    };
  }

  parseInterval(interval) {
    const match = interval.match(/(\d+)\s+(\w+)/);
    if (!match) return 0;
    const [, num, unit] = match;
    const multipliers = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000
    };
    return parseInt(num) * multipliers[unit];
  }

  /**
   * DOCUMENTATION FOR PROGRESS HANDOFF
   * Create shareable assessment for therapist
   */
  prepareForProgressHandoff(state, assessments, riskLevel) {
    return {
      preparedDate: new Date().toISOString(),
      summary: {
        currentRiskLevel: riskLevel.level,
        assessmentsCompleted: assessments.map(a => a.type),
        concerningFindings: riskLevel.warnings
      },
      assessmentResponses: assessments,
      recommendedActions: [
        'Share this with your therapist',
        'Schedule urgent appointment if not recent',
        'Consider psychiatric evaluation if appropriate',
        'Implement safety plan collaboratively'
      ],
      safetyPlan: this.crisisProtocol.generateSafetyPlan(state, {
        recognizedTrigger: state.dominantPattern
      }),
      followUpSchedule: this.crisisProtocol.postCrisisFollowUp(state)
    };
  }
}

export default PolarisEnhancedSafety;
