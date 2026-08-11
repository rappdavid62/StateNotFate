/**
 * EXPERIMENTAL — DO NOT IMPORT IN PRODUCTION UI
 *
 * This module is retained for research reference only.
 * Production code must use src/safety-routing.js instead.
 * See issue #5 and the suicide-prevention compendium boundaries.
 *
 * SUICIDE DECISION DETECTION & RISK ASSESSMENT MODULE
 *
 * State Not Fate Safety Enhancement
 * Integrated with Polaris system for real-time monitoring
 * 
 * Design Principles:
 * - Non-shaming, evidence-based language
 * - Function-focused assessment (not just mood)
 * - Integration with existing anchors
 * - Ethical boundaries & professional care referral
 * - State as information, not identity
 */

export class SafetyDetectionModule {
  constructor(polarisState = {}) {
    this.state = polarisState;
    this.history = [];
    this.riskProfile = {
      currentLevel: 'low', // low, moderate, elevated, acute
      trendDirection: 'stable', // stable, improving, worsening, critical
      lastAssessmentDate: null,
      activeFlags: [],
      protectiveFactors: [],
      concerningPatterns: []
    };
    this.assessmentHistory = [];
  }

  /**
   * TIER 1: Quick Ideation Screen (2 questions)
   * Non-invasive daily check
   */
  quickIdeationScreen() {
    return {
      id: 'quick-ideation',
      type: 'brief',
      questions: [
        {
          id: 'ideation-presence',
          text: 'In the last 24 hours, have you had any thoughts that life might be better if you were not here?',
          subtext: 'This might feel like wanting to die, or just disappearing, or a general sense of hopelessness about the future.',
          responseScale: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Briefly, but it passed quickly' },
            { value: 2, label: 'Off and on' },
            { value: 3, label: 'Most of the day' },
            { value: 4, label: 'Almost constantly' }
          ],
          followUpIf: [2, 3, 4]
        },
        {
          id: 'active-planning',
          text: 'Have you been thinking about ways to harm yourself or making plans?',
          subtext: 'This includes detailed thinking about methods, gathering items, or saying goodbye.',
          responseScale: [
            { value: 0, label: 'No' },
            { value: 1, label: 'Brief thoughts I dismiss quickly' },
            { value: 2, label: 'Some planning/research, but unclear if serious' },
            { value: 3, label: 'Concrete plans' },
            { value: 4, label: 'Imminent/active plans' }
          ],
          followUpIf: [1, 2, 3, 4]
        }
      ]
    };
  }

  /**
   * TIER 2: Intent vs Ideation Differentiation
   * Follow-up if ideation is present
   */
  intentVsIdeationAssessment() {
    return {
      id: 'intent-differentiation',
      type: 'detailed',
      context: 'Understanding whether these thoughts reflect genuine intent or are intrusive thoughts',
      questions: [
        {
          id: 'intent-conviction',
          text: 'On a scale of 0-10, how certain do you feel that acting on these thoughts is the right decision?',
          responseType: 'slider',
          range: [0, 10],
          anchors: { 0: 'Not at all certain', 10: 'Completely certain' },
          flagThreshold: 7
        },
        {
          id: 'access-means',
          text: 'Do you have ready access to means that could be lethal? (method specificity)',
          responseScale: [
            { value: 0, label: 'No access or unclear methods' },
            { value: 1, label: 'Theoretical knowledge only' },
            { value: 2, label: 'Some access, but requires effort to obtain' },
            { value: 3, label: 'Ready access with minimal planning' },
            { value: 4, label: 'Immediate lethal access' }
          ],
          flagThreshold: 2
        },
        {
          id: 'plan-timeline',
          text: 'When do you imagine this might happen?',
          responseScale: [
            { value: 0, label: 'I do not imagine it happening' },
            { value: 1, label: 'Vague future (years away or if things get worse)' },
            { value: 2, label: 'Possible in coming months' },
            { value: 3, label: 'Specific timeframe (days/weeks)' },
            { value: 4, label: 'Imminent (today/tonight)' }
          ],
          flagThreshold: 2
        },
        {
          id: 'protective-deterrents',
          text: 'What, if anything, is keeping you from acting on these thoughts?',
          responseType: 'multiselect',
          options: [
            'Fear of the method itself',
            'Worry about causing pain to others',
            'Religious/spiritual beliefs',
            'Uncertainty about whether I really want to die',
            'Responsibilities (children, others depend on me)',
            'Hope that things might improve',
            'Fear of being stopped/discovered',
            'Feeling too exhausted to plan or act',
            'Other: ______________'
          ]
        }
      ]
    };
  }

  /**
   * TIER 3: Comprehensive Risk Assessment
   * Full evaluation if moderate+ risk detected
   */
  comprehensiveRiskAssessment() {
    return {
      id: 'comprehensive-risk',
      type: 'extensive',
      sections: [
        {
          name: 'Recent Behavioral Changes',
          questions: [
            {
              id: 'social-withdrawal-change',
              text: 'Have you withdrawn from people or activities significantly more in the last 1-2 weeks?',
              relatedAnchor: 'Social reintegration anchors'
            },
            {
              id: 'giving-away-items',
              text: 'Have you given away possessions, written letters, or made arrangements that suggest finality?',
              severityIndicator: 'high'
            },
            {
              id: 'reckless-behavior',
              text: 'Have you engaged in unusually risky behaviors (reckless driving, substance abuse spike, self-harm)?',
              relatedAnchor: 'Body care and substance reality anchors'
            },
            {
              id: 'sleep-pattern-shift',
              text: 'Has there been a sudden shift in sleep pattern (extreme insomnia or sleeping excessively)?',
              relatedAnchor: 'Sleep and circadian anchors'
            }
          ]
        },
        {
          name: 'Access to Means',
          questions: [
            {
              id: 'firearms-access',
              text: 'Do you have access to firearms? If yes, are they secured away from you?',
              specificMethod: true
            },
            {
              id: 'medication-access',
              text: 'Have you recently obtained or stockpiled medications?',
              specificMethod: true
            },
            {
              id: 'other-means',
              text: 'Are there other methods accessible to you that you have researched or considered?',
              specificMethod: true
            }
          ]
        },
        {
          name: 'Protective Factors Inventory',
          questions: [
            {
              id: 'reasons-to-live',
              text: 'List specific reasons why you want to continue living (relationships, goals, values)',
              responseType: 'freetext',
              relatedState: 'reasonsLive'
            },
            {
              id: 'social-support',
              text: 'Do you have at least one person who knows you are struggling and you can contact?',
              relatedState: 'safeContacts'
            },
            {
              id: 'professional-connection',
              text: 'Are you currently connected to a therapist, counselor, or psychiatrist?',
              relatedAnchor: 'Therapy/medication integration'
            },
            {
              id: 'hope-signal',
              text: 'Have there been any small moments in the last week where you felt even slightly better or saw a possibility of improvement?',
              relatedAnchor: 'Hope restoration'
            }
          ]
        }
      ]
    };
  }

  /**
   * PATTERN DETECTION ALGORITHM
   * Passive monitoring of state changes for concerning trends
   */
  detectRiskPatterns(currentState, previousState = null) {
    const patterns = [];
    const timestamp = new Date().toISOString();

    // Pattern 1: Rapid Functional Collapse
    if (currentState.todayEnergy === 'collapse' && 
        previousState?.todayEnergy !== 'collapse') {
      patterns.push({
        type: 'rapid-collapse',
        severity: 'moderate',
        description: 'Sudden energy collapse after relative stability',
        timestamp
      });
    }

    // Pattern 2: Accelerating Rumination
    if (currentState.thoughtCorrections?.length < 3 && 
        (previousState?.thoughtCorrections?.length || 0) > 5) {
      patterns.push({
        type: 'rumination-escape',
        severity: 'moderate',
        description: 'Abandoned thought correction practice (increased rumination risk)',
        timestamp
      });
    }

    // Pattern 3: Complete Anchor Abandonment
    const todayCompleted = currentState.history?.[0]?.completed?.length || 0;
    const recentCompleted = currentState.history?.slice(1, 7)
      .map(d => d.completed?.length || 0)
      .filter(x => x > 0).length || 0;
    
    if (todayCompleted === 0 && recentCompleted > 3) {
      patterns.push({
        type: 'anchor-abandonment',
        severity: 'elevated',
        description: 'Abrupt cessation of previously maintained anchors',
        timestamp
      });
    }

    // Pattern 4: Social Isolation Spike
    if (currentState.social > 35 && previousState?.social < 20) {
      patterns.push({
        type: 'social-isolation-surge',
        severity: 'elevated',
        description: 'Rapid withdrawal from social contact',
        timestamp
      });
    }

    // Pattern 5: Meaning & Engagement Collapse
    if (currentState.meaning > 35 && currentState.currentHopeLevel < 2) {
      patterns.push({
        type: 'meaning-collapse',
        severity: 'elevated',
        description: 'Combined low hope and loss of meaning/purpose',
        timestamp
      });
    }

    // Pattern 6: Zero-Day Accumulation
    const zeroCount = (currentState.history || [])
      .slice(0, 7)
      .filter(d => d.completed?.length === 0)
      .length;
    
    if (zeroCount >= 5) {
      patterns.push({
        type: 'zero-day-cascade',
        severity: 'acute',
        description: 'Five or more days with zero anchor completion',
        timestamp
      });
    }

    return patterns;
  }

  /**
   * CONTEXTUAL RISK ASSESSMENT
   * Considers specific life circumstances and triggering events
   */
  contextualRiskFactors(state) {
    const factors = {
      recent_losses: [],
      upcoming_stressors: [],
      anniversary_effects: [],
      substance_factors: [],
      medical_factors: []
    };

    // Check for recent losses or rejection
    if (state.dominantPattern === 'Rejection Sensitivity' || 
        state.dominantPattern === 'Grief/Loss') {
      factors.recent_losses.push('Recent relationship/loss theme active');
    }

    // Check for substance escalation
    if (state.ratings?.eating > 30 || state.history?.[0]?.difficulty === 'extreme') {
      factors.substance_factors.push('Possible substance use escalation');
    }

    // Check for medication changes
    if (state.lastMedicationChange && 
        new Date() - new Date(state.lastMedicationChange) < 14 * 24 * 60 * 60 * 1000) {
      factors.medical_factors.push('Recent medication adjustment');
    }

    return factors;
  }

  /**
   * REAL-TIME RISK LEVEL CALCULATION
   * Combines multiple assessment layers
   */
  calculateRiskLevel(assessmentData) {
    let riskScore = 0;
    const warnings = [];

    // Ideation severity (0-4)
    const ideationScore = assessmentData.quickScreen?.ideation?.value || 0;
    riskScore += ideationScore;

    // Intent assessment (0-4)
    const intentScore = assessmentData.intentAssessment?.intent?.value || 0;
    riskScore += intentScore;

    // Means access (0-4)
    const meansScore = assessmentData.intentAssessment?.access?.value || 0;
    riskScore += meansScore;

    // Plan timeline (0-4)
    const timelineScore = assessmentData.intentAssessment?.timeline?.value || 0;
    riskScore += timelineScore;

    // Pattern penalties
    const patterns = assessmentData.patterns || [];
    const acutePatterns = patterns.filter(p => p.severity === 'acute').length;
    riskScore += acutePatterns * 2;

    // Journal distress integration
    const journalEntries = (this.state && this.state.safetyJournal) ? this.state.safetyJournal : [];
    if (journalEntries.length > 0) {
      const latestEntry = journalEntries[journalEntries.length - 1];
      const entryTime = new Date(latestEntry.timestamp);
      const isRecent = (new Date() - entryTime) < 24 * 60 * 60 * 1000;
      if (isRecent) {
        if (latestEntry.distressLevel >= 8) {
          riskScore += 4;
          warnings.push(`ACUTE JOURNAL EVENT: Distress level ${latestEntry.distressLevel}/10 logged in last 24 hours.`);
        } else if (latestEntry.distressLevel >= 5) {
          riskScore += 2;
          warnings.push(`MODERATE JOURNAL EVENT: Distress level ${latestEntry.distressLevel}/10 logged in last 24 hours.`);
        }
      }
    }

    // Calculate level
    let level = 'low';
    if (riskScore >= 12) {
      level = 'acute';
      warnings.push('ACUTE RISK: Immediate safety assessment required');
    } else if (riskScore >= 8) {
      level = 'elevated';
      warnings.push('ELEVATED RISK: Enhanced monitoring and intervention needed');
    } else if (riskScore >= 4) {
      level = 'moderate';
      warnings.push('MODERATE RISK: Safety planning and protective factors review');
    }

    // Factor in protective factors
    const protectiveCount = assessmentData.intentAssessment?.protective?.selected?.length || 0;
    if (protectiveCount >= 3 && level === 'moderate') {
      level = 'low-moderate';
    }

    return {
      level,
      score: riskScore,
      maxScore: 16,
      percentile: (riskScore / 16) * 100,
      warnings,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * ADAPTIVE RESPONSE PROTOCOL
   * Tailored intervention based on risk level
   */
  generateSafetyResponse(riskLevel, state) {
    const response = {
      riskLevel: riskLevel.level,
      immediateActions: [],
      supportResources: [],
      anchorAdjustments: [],
      followUpSchedule: null
    };

    switch (riskLevel.level) {
      case 'acute':
        response.immediateActions = [
          'TRIGGER CRISIS PROTOCOL: Direct to 988 (US/Canada) or local emergency',
          'Activate emergency contacts from user state',
          'Enable Crisis Safe Box (pre-loaded resources)',
          'Offer immediate grounding techniques',
          'Provide suicide hotline directory (location-specific)'
        ];
        response.supportResources = [
          { name: '988 Suicide & Crisis Lifeline', number: '988', type: 'immediate' },
          { name: 'Crisis Text Line', text: 'HOME to 741741', type: 'immediate' },
          { name: 'Emergency Services', number: '911', type: 'emergency' }
        ];
        response.followUpSchedule = 'Immediate (within 1 hour)';
        break;

      case 'elevated':
        response.immediateActions = [
          'Activate detailed safety planning',
          'Increase check-in frequency to daily',
          'Engage emergency contacts',
          'Review and secure access to means',
          'Transition to survival-level anchors only'
        ];
        response.anchorAdjustments = [
          'Temporarily reduce to Level 0 (Survival)',
          'Focus on contact/connection anchors',
          'Implement hourly check-ins with safe person'
        ];
        response.followUpSchedule = 'Daily check-in, professional evaluation within 24 hours';
        break;

      case 'moderate':
        response.immediateActions = [
          'Initiate collaborative safety planning',
          'Strengthen protective factor activation',
          'Increase anchor frequency',
          'Establish crisis contact protocol'
        ];
        response.anchorAdjustments = [
          'Maintain current level but add support check-ins',
          'Activate "reasons to live" review daily',
          'Increase social anchor frequency'
        ];
        response.followUpSchedule = 'Check-in every 2-3 days, professional evaluation within 1 week';
        break;

      case 'low-moderate':
      case 'low':
        response.immediateActions = [
          'Continue standard anchors',
          'Weekly safety check-in'
        ];
        response.anchorAdjustments = [
          'Maintain current anchor level',
          'Ensure protective factors remain active',
          'Weekly review of concerning patterns'
        ];
        response.followUpSchedule = 'Weekly monitoring, re-assess if patterns change';
        break;
    }

    return response;
  }

  /**
   * CRISIS SAFE BOX
   * Structured crisis resources and de-escalation
   */
  generateCrisisSafeBox(state) {
    return {
      id: 'crisis-safe-box',
      activated: new Date().toISOString(),
      contents: {
        immediateResources: [
          {
            name: '988 Suicide & Crisis Lifeline',
            phone: '988',
            text: 'Available 24/7 in US',
            languages: ['English', 'Spanish']
          },
          {
            name: 'Crisis Text Line',
            text: 'HOME to 741741',
            available: '24/7'
          },
          {
            name: 'International Association for Suicide Prevention',
            url: 'https://www.iasp.info/resources/Crisis_Centres/',
            type: 'global-directory'
          }
        ],
        safeContacts: state.safeContacts || [],
        reasonsToLive: state.reasonsLive || 'Add reasons here: people, goals, incomplete projects',
        distractions: state.distractions || [
          'Walk outside for 5 minutes',
          'Call a trusted person',
          'Watch a specific show or video',
          'Do a physical activity',
          'Take a cold shower'
        ],
        groundingTechniques: [
          {
            name: '5-4-3-2-1 Technique',
            steps: [
              '5 things you can see',
              '4 things you can touch',
              '3 things you can hear',
              '2 things you can smell',
              '1 thing you can taste'
            ]
          },
          {
            name: 'Box Breathing',
            steps: [
              'Breathe in for 4 counts',
              'Hold for 4 counts',
              'Breathe out for 4 counts',
              'Hold for 4 counts',
              'Repeat 5-10 times'
            ]
          }
        ],
        contractOfSafety: {
          commitment: 'I commit to staying alive and seeking help rather than harming myself',
          recognizedTriggers: state.dominantPattern || 'Identify your triggers',
          copingStrategies: state.distractions || [],
          supportPeople: state.safeContacts || [],
          professionalHelp: 'Contact therapist or local mental health services',
          helplineNumbers: ['988 (US)', '1-800-SUICIDE (older line)']
        }
      }
    };
  }

  /**
   * INTEGRATE WITH POLARIS ANCHORS
   * Safety-aware anchor adjustments
   */
  adjustAnchorsForSafety(riskLevel, currentAnchors) {
    const adjustedAnchors = { ...currentAnchors };

    if (riskLevel.level === 'acute' || riskLevel.level === 'elevated') {
      // Move to survival-only mode
      adjustedAnchors.level = 0;
      adjustedAnchors.primary = [
        'Contact safe person (call, text, or visit)',
        'Go to hospital/emergency room if thoughts are active',
        'Do not isolate - stay in shared space if possible'
      ];
      adjustedAnchors.emergency = [
        'Call 988 immediately',
        'Tell someone you are thinking about suicide',
        'Go to nearest ER'
      ];
    } else if (riskLevel.level === 'moderate') {
      // Add protective anchors
      adjustedAnchors.additionalFocus = [
        'Increase social contact anchor frequency',
        'Daily "reasons to live" reflection',
        'Contact check-in with safe person'
      ];
    }

    adjustedAnchors.safetyFlags = {
      checked: true,
      lastAssessmentDate: new Date().toISOString(),
      riskLevel: riskLevel.level,
      nextReviewDate: this.calculateNextReviewDate(riskLevel.level)
    };

    return adjustedAnchors;
  }

  calculateNextReviewDate(riskLevel) {
    const now = new Date();
    let daysUntilReview = 7;

    switch (riskLevel) {
      case 'acute':
        daysUntilReview = 0; // Immediate
        break;
      case 'elevated':
        daysUntilReview = 1;
        break;
      case 'moderate':
        daysUntilReview = 3;
        break;
      case 'low-moderate':
        daysUntilReview = 7;
        break;
      case 'low':
        daysUntilReview = 14;
        break;
    }

    now.setDate(now.getDate() + daysUntilReview);
    return now.toISOString().split('T')[0];
  }

  /**
   * DOCUMENTATION & COMPLIANCE
   * Track assessments for professional review
   */
  logAssessment(assessmentData, response) {
    const log = {
      timestamp: new Date().toISOString(),
      assessmentType: assessmentData.type,
      responses: assessmentData,
      riskLevel: response.riskLevel,
      actionsInitiated: response.immediateActions,
      reviewNotes: 'User completed suicide risk assessment'
    };

    this.assessmentHistory.push(log);
    
    return {
      logged: true,
      logId: `safety-${Date.now()}`,
      recommendation: 'Share this log with your therapist or mental health provider'
    };
  }
}

export default SafetyDetectionModule;
