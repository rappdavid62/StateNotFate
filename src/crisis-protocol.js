/**
 * CRISIS PROTOCOL & ESCALATION SYSTEM
 * 
 * Integrated emergency response system for State Not Fate
 * Follows evidence-based crisis intervention models
 * 
 * Key Features:
 * - Multi-level escalation pathways
 * - Location-aware resource routing
 * - Emergency contact activation
 * - De-escalation protocols
 * - Post-crisis follow-up
 */

export class CrisisProtocol {
  constructor(userLocation = null) {
    this.userLocation = userLocation; // { country, region/state, city }
    this.crisisContacts = [];
    this.isActive = false;
    this.activationTime = null;
    this.escalationLevel = 0; // 0 = normal, 1 = alert, 2 = active crisis, 3 = emergency
  }

  /**
   * GLOBAL CRISIS RESOURCE DIRECTORY
   * Location-aware emergency contacts
   */
  getCrisisResources(location = null) {
    const resources = {
      us: {
        primary: [
          { name: '988 Suicide & Crisis Lifeline', number: '988', text: 'Yes', languages: ['EN', 'ES'] },
          { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7' },
          { name: 'NAMI Helpline (Peer Support)', number: '1-800-950-NAMI', text: 'Yes' }
        ],
        backup: [
          { name: 'National Suicide Prevention Lifeline', number: '1-800-273-8255', veteran: 'Option 1' },
          { name: 'Veterans Crisis Line', number: '988 then press 1', text: 'Yes' },
          { name: 'Trans Lifeline (US/Canada)', number: '877-565-8860', transgender: true }
        ],
        resources: [
          { name: 'Find therapy: SAMHSA Treatment Locator', url: 'https://findtreatment.gov', type: 'directory' },
          { name: 'Psychiatric emergency services (local 911 or ER)' }
        ]
      },
      ca: {
        primary: [
          { name: '988 Suicide & Crisis Lifeline', number: '988', text: 'Yes', languages: ['EN', 'FR'] },
          { name: 'Talk Suicide Canada', number: '1-833-456-4566', text: 'Yes', 'chat': 'Yes' },
          { name: 'Crisis Text Line Canada', contact: 'Text 741741', available: '24/7' }
        ]
      },
      uk: {
        primary: [
          { name: 'Samaritans', number: '116 123', available: 'Free, 24/7' },
          { name: 'Crisis Text Line UK', contact: 'Text HELLO to 50808', available: '24/7' },
          { name: 'Childline (under 19)', number: '1-800-1111', available: 'Free' }
        ]
      },
      au: {
        primary: [
          { name: 'Lifeline Australia', number: '13 11 14', available: '24/7' },
          { name: 'Crisis Text Line', contact: 'Text 0488 884 001' },
          { name: 'Beyond Blue', number: '1300 224 636', text: 'Yes' }
        ]
      },
      default_international: [
        { name: 'International Association for Suicide Prevention', url: 'https://www.iasp.info/resources/Crisis_Centres/' },
        { name: 'Befrienders International', url: 'https://www.befrienders.org/' }
      ]
    };

    const country = location?.country?.toLowerCase() || 'us';
    return resources[country] || resources.default_international;
  }

  /**
   * ESCALATION PATHWAY LOGIC
   * Determines appropriate response level
   */
  assessEscalationLevel(riskData) {
    let level = 0;

    // Level 3: Emergency
    if (riskData.level === 'acute' ||
        (riskData.intentData?.planTimeline === 4) ||
        (riskData.intentData?.access === 4)) {
      level = 3;
    }
    // Level 2: Active Crisis
    else if (riskData.level === 'elevated' ||
             (riskData.intentData?.conviction > 7) ||
             (riskData.patterns?.acutePatterns > 0)) {
      level = 2;
    }
    // Level 1: Alert
    else if (riskData.level === 'moderate' ||
             riskData.patterns?.length > 2) {
      level = 1;
    }
    // Level 0: Normal
    else {
      level = 0;
    }

    return level;
  }

  /**
   * IMMEDIATE ACTION PROTOCOL - LEVEL 3
   * Emergency response for acute risk
   */
  emergencyProtocol(userState) {
    this.isActive = true;
    this.activationTime = new Date().toISOString();
    this.escalationLevel = 3;

    return {
      status: 'EMERGENCY_ACTIVATED',
      timestamp: this.activationTime,
      actions: [
        {
          priority: 1,
          action: 'IMMEDIATE CONTACT TO EMERGENCY',
          instructions: [
            'Call 911 (US) or your local emergency number NOW',
            'Tell them: "I am having thoughts of suicide and need immediate help"',
            'If you cannot call: Ask someone nearby to call for you',
            'Go to the nearest emergency room',
            'Do not be alone'
          ]
        },
        {
          priority: 2,
          action: 'ACTIVATE EMERGENCY CONTACTS',
          contacts: userState.safeContacts || [],
          template: 'I am experiencing a crisis and having suicidal thoughts. I need immediate help. Can you be with me or call emergency services?'
        },
        {
          priority: 3,
          action: 'CRISIS HOTLINE (if unable to call 911)',
          resources: this.getCrisisResources(userState.location),
          instructions: 'Tell them your location, that you have thoughts of suicide, and whether you have access to means'
        }
      ],
      safeBox: this.generateEmergencySafeBox(userState),
      nextSteps: 'Emergency services will assess your safety and provide immediate care',
      documentation: {
        timeActivated: new Date().toISOString(),
        severityIndicators: ['Acute risk assessment', 'Imminent timeframe', 'Access to means']
      }
    };
  }

  /**
   * ACTIVE CRISIS PROTOCOL - LEVEL 2
   * Structured crisis response
   */
  activeCrisisProtocol(userState, riskData) {
    this.isActive = true;
    this.activationTime = new Date().toISOString();
    this.escalationLevel = 2;

    return {
      status: 'ACTIVE_CRISIS_PROTOCOL',
      timestamp: this.activationTime,
      immediateActions: [
        'Contact one safe person now - tell them you are in crisis',
        'Call crisis line: 988 (US), or available resource from your location',
        'If thoughts feel urgent or plans are becoming more detailed, call 911'
      ],
      safetyPlan: {
        warningSign: riskData.recognizedTrigger || 'Suicidal thoughts increasing',
        internalCopingStrategies: [
          'Use 5-4-3-2-1 grounding technique',
          'Box breathing (4-4-4-4)',
          'Name your emotions without judgment',
          'Step outside for fresh air',
          'Move your body in any way'
        ],
        peopleAndSocialSupport: [
          { name: 'Safe contact', phone: userState.safeContacts?.[0]?.phone, instruction: 'Call immediately' },
          { name: 'Secondary contact', phone: userState.safeContacts?.[1]?.phone },
          { name: 'Therapist/counselor', phone: userState.therapistContact }
        ],
        professionalServices: [
          '988 Suicide & Crisis Lifeline',
          'Crisis Text Line (text HOME to 741741)',
          'Go to nearest emergency room',
          'Call NAMI Helpline for peer support'
        ],
        meansRestriction: {
          actionRequired: true,
          steps: [
            'Tell someone you trust about methods you\'ve considered',
            'Temporarily remove or secure access to means',
            'Ask safe person to help oversee medications'
          ]
        }
      },
      checkInSchedule: {
        immediate: 'Now - contact safe person',
        shortTerm: 'Daily for next 7 days',
        afterCrisisResolves: 'As agreed with therapist'
      }
    };
  }

  /**
   * SAFETY ALERT PROTOCOL - LEVEL 1
   * Enhanced monitoring and prevention
   */
  safetyAlertProtocol(userState, riskData) {
    this.escalationLevel = 1;

    return {
      status: 'SAFETY_ALERT',
      timestamp: new Date().toISOString(),
      alertReason: riskData.primaryConcern || 'Elevated suicide risk detected',
      recommendations: [
        'Reach out to one trusted person today',
        'Avoid being alone for extended periods',
        'Engage your safety plan if thoughts intensify',
        'Contact therapist within 24 hours'
      ],
      checkInFrequency: 'Every 2-3 days',
      enhancedMonitoring: [
        'Daily anchor check-ins (vs weekly)',
        'Safety question at each session',
        'Increased therapy frequency if possible'
      ],
      resources: this.getCrisisResources(userState.location),
      escalationTriggers: [
        'Thoughts become more frequent or persistent',
        'Developing or researching specific methods',
        'Giving away belongings or saying goodbye',
        'Sudden mood improvement after despair (can indicate resolved intent)',
        'Isolation from support system'
      ]
    };
  }

  /**
   * DE-ESCALATION TECHNIQUES
   * Bringing someone down from acute crisis
   */
  deescalationTechniques() {
    return {
      id: 'deescalation-toolkit',
      techniques: [
        {
          name: 'Grounding: 5-4-3-2-1 Sensory Technique',
          duration: '2-5 minutes',
          steps: [
            'Name 5 things you can see around you',
            'Name 4 things you can physically touch',
            'Name 3 things you can hear',
            'Name 2 things you can smell',
            'Name 1 thing you can taste',
            'Repeat if needed until thoughts feel more present'
          ],
          effectiveness: 'High for intrusive thoughts and dissociation'
        },
        {
          name: 'Box Breathing',
          duration: '5-10 minutes',
          steps: [
            'Breathe in slowly through nose for 4 counts',
            'Hold breath for 4 counts',
            'Breathe out slowly for 4 counts',
            'Hold empty for 4 counts',
            'Repeat 5-10 times or until calmer'
          ],
          effectiveness: 'High for anxiety and activation'
        },
        {
          name: 'Progressive Muscle Relaxation',
          duration: '10-15 minutes',
          instructions: 'Tense and then relax each muscle group from toes to head',
          effectiveness: 'High for physical tension and shutdown'
        },
        {
          name: 'Cold Water Exposure',
          duration: '1-2 minutes',
          instructions: [
            'Splash cold water on face or',
            'Hold ice to wrists or neck or',
            'Take a cold shower'
          ],
          effectiveness: 'High for acute suicidality - activates mammalian dive reflex',
          warning: 'May not be appropriate for all (heart conditions, trauma)'
        },
        {
          name: 'Movement & Bilateral Stimulation',
          duration: '5-10 minutes',
          activities: [
            'Walk back and forth while talking',
            'Tap alternating knees',
            'Rock back and forth',
            'Cross-body movements'
          ],
          effectiveness: 'High for trauma responses'
        },
        {
          name: 'Thought Challenging',
          duration: '5-10 minutes',
          process: [
            'Name the thought ("I should be dead")',
            'Evaluate: Is this true? Is this helpful? Is this who I am?',
            'Replace: "I am thinking about dying, but I don\'t have to act on this"',
            'Observe: "This is a thought, not a command"'
          ],
          effectiveness: 'Medium-high for cognitive rumination'
        },
        {
          name: 'Meaning-Based Coping',
          duration: '5-15 minutes',
          process: [
            'Think of someone who depends on you',
            'Recall a time you overcame difficulty',
            'Identify one thing you want to see or do',
            'Journal about your values'
          ],
          effectiveness: 'Medium for meaning-based suicidality'
        }
      ]
    };
  }

  /**
   * SAFETY PLANNING
   * Collaborative, documented safety plan
   */
  generateSafetyPlan(userState, riskFactors) {
    return {
      id: `safety-plan-${Date.now()}`,
      dateCreated: new Date().toISOString(),
      reviewed: [],
      sections: [
        {
          title: 'Warning Signs',
          description: 'What your suicidal crisis looks and feels like',
          userInput: [
            ...(userState.recognizedTriggers ? [userState.recognizedTriggers] : []),
            'Increased social withdrawal',
            'Giving away items',
            'Making final arrangements'
          ]
        },
        {
          title: 'Internal Coping Strategies',
          description: 'Things you can do by yourself to cope when you\'re having suicidal thoughts',
          suggestions: [
            'Grounding techniques (5-4-3-2-1)',
            'Box breathing',
            'Physical activity',
            'Cold water exposure',
            'Music or podcasts',
            'Art or creative activity',
            'Review reasons to live'
          ],
          userCustom: userState.distractions || []
        },
        {
          title: 'People to Talk To',
          description: 'Trusted people you can reach out to',
          contacts: [
            ...((userState.safeContacts || []).map(c => ({
              name: c.name,
              phone: c.phone,
              relationship: c.relationship
            }))),
            {
              name: 'Therapist/Counselor',
              phone: userState.therapistPhone || 'TBD'
            }
          ]
        },
        {
          title: 'Professional and Crisis Services',
          description: 'When to call professional help',
          resources: [
            { name: '988 Suicide & Crisis Lifeline', number: '988', available: '24/7' },
            { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7' },
            { name: 'Local Hospital ER', number: '911', emergency: true },
            { name: 'NAMI Helpline', number: '1-800-950-NAMI', type: 'peer-support' }
          ]
        },
        {
          title: 'Ways to Make My Environment Safer',
          description: 'Reducing access to means and increasing safety',
          actions: [
            'Secure firearms (store separately from ammunition)',
            'Ask trusted person to hold medications',
            'Remove or reduce access to potential means',
            'Avoid isolation - stay in shared spaces',
            'Tell safe person about this plan'
          ]
        },
        {
          title: 'Reasons for Living',
          description: 'Why you want to stay alive',
          userInput: userState.reasonsLive || [
            'People who depend on me',
            'Goals I want to achieve',
            'Things I haven\'t experienced yet',
            'My values and beliefs'
          ]
        }
      ]
    };
  }

  /**
   * POST-CRISIS FOLLOW-UP
   * Recovery and relapse prevention
   */
  postCrisisFollowUp(userState) {
    return {
      phase: 'post-crisis-recovery',
      timeline: [
        {
          period: '0-24 hours',
          actions: [
            'Rest and recover - no major decisions',
            'Stay in contact with at least one safe person',
            'Engage survival-level anchors only',
            'Take medications as prescribed'
          ]
        },
        {
          period: '24-72 hours',
          actions: [
            'Contact therapist or mental health provider',
            'Review and adjust safety plan',
            'Begin gentle reengagement with routine',
            'Maintain frequent check-ins'
          ]
        },
        {
          period: '1 week',
          actions: [
            'Schedule professional follow-up',
            'Gradually increase activity and structure',
            'Identify specific crisis triggers',
            'Strengthen protective factors'
          ]
        },
        {
          period: '2-4 weeks',
          actions: [
            'Return to standard anchor system (if appropriate)',
            'Process what happened with therapist',
            'Build crisis prevention skills',
            'Monitor for recurring thoughts'
          ]
        }
      ],
      relapseWarnings: [
        'Return of suicidal thoughts',
        'Withdrawal from support system',
        'Abandonment of safety plan',
        'Resuming substance use',
        'Isolation increasing again'
      ],
      preventionStrategies: [
        'Maintain weekly therapy sessions initially',
        'Use daily safety check-ins',
        'Keep crisis resources visible/accessible',
        'Build meaning and purpose anchors',
        'Strengthen social connections'
      ]
    };
  }

  /**
   * EMERGENCY SAFE BOX
   * Compact crisis resource collection
   */
  generateEmergencySafeBox(userState) {
    return {
      resources: this.getCrisisResources(userState.location),
      reasonsToLive: userState.reasonsLive || [],
      safeContacts: userState.safeContacts || [],
      copingStrategies: this.deescalationTechniques(),
      helplines: {
        suicide: '988 (US)',
        crisis: 'Text HOME to 741741',
        emergency: '911'
      },
      printableVersion: 'Save and carry with you'
    };
  }

  /**
   * MEANS SAFETY ASSESSMENT
   * Preventing access to lethal means
   */
  meansSafetyAssessment(userState) {
    return {
      assessment: 'Lethal Means Safety Assessment',
      domains: [
        {
          domain: 'Firearms',
          questions: [
            'Do you have access to firearms?',
            'Are they stored securely (locked, ammunition separate)?',
            'Could you realistically access them if in crisis?'
          ],
          interventions: [
            'Store firearms with trusted person',
            'Use lock box with code not known to user',
            'Separate ammunition storage'
          ]
        },
        {
          domain: 'Medications',
          questions: [
            'Do you have access to prescription medications?',
            'Do you have access to large quantities?',
            'Are they stored safely?'
          ],
          interventions: [
            'Use medication management with trusted person',
            'Pill organizer with weekly quantities',
            'Store in locked medication box'
          ]
        },
        {
          domain: 'Other Methods',
          questions: [
            'Do you have access to materials that could be used?',
            'Have you researched specific methods?',
            'Do you have a plan location in mind?'
          ],
          interventions: [
            'Remove or secure high-risk items',
            'Tell safe person about specific methods',
            'Avoid isolation and high-risk locations'
          ]
        }
      ]
    };
  }
}

export default CrisisProtocol;
