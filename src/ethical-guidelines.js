/**
 * ETHICAL GUIDELINES FOR SUICIDE DECISION DETECTION
 * 
 * State Not Fate - Enhanced Safety Module
 * Principles for responsible, evidence-based crisis intervention
 */

export const ETHICAL_FRAMEWORK = {
  /**
   * CORE PRINCIPLES
   */
  corePrinciples: {
    1: {
      principle: 'Do No Harm (Non-maleficence)',
      details: [
        'Assessment never shames, judges, or moralizes about suicidal thoughts',
        'Language is compassionate, evidence-based, and non-stigmatizing',
        'Questions are phrased to elicit honest responses without inducing guilt',
        'Assessment itself should not increase distress or hopelessness'
      ]
    },
    2: {
      principle: 'Beneficence (Active Help)',
      details: [
        'The purpose is prevention and protection, not punishment',
        'Results lead to concrete support and access to care',
        'Interventions are matched to the person\'s actual context and capacity',
        'Goal is to increase safety, not compliance'
      ]
    },
    3: {
      principle: 'Autonomy (Respect for Agency)',
      details: [
        'Person retains decision-making power',
        'Assessment informs choice, not overrides it',
        'Transparent about what data is collected and how it\'s used',
        'Clear consent and ability to decline assessment'
      ]
    },
    4: {
      principle: 'Justice (Fair Access)',
      details: [
        'Assessment and resources available to all, regardless of ability to pay',
        'Multi-language support and accessibility',
        'No discrimination based on marginalized identities',
        'Resources location-aware for global access'
      ]
    },
    5: {
      principle: 'State vs. Fate (SNF Core)',
      details: [
        'Suicidal ideation is treated as temporary state, not permanent identity',
        'Current thoughts do not define future capacity or self-worth',
        'Crisis is situational - it passes with proper support',
        'Recovery is possible, even from acute suicidality'
      ]
    }
  },

  /**
   * ASSESSMENT ETHICS
   */
  assessmentEthics: {
    transparency: {
      whatYouWillAsk: 'Be clear about question topics before asking',
      whyYouAreAsking: 'Explain the purpose of each assessment tier',
      whatHappensWithAnswers: 'Clearly state how responses will be used',
      dataRetention: 'Specify how long data is kept and who can access it'
    },
    consent: {
      explicitApproval: 'User must actively consent to assessment',
      rightToDeline: 'User can skip or refuse any question',
      noCoercion: 'Assessment refusal does not block access to app features',
      revokeableConsent: 'User can revoke consent and request data deletion anytime'
    },
    lowThreshold: {
      notRequiredForAccess: 'Safety screening should not gate basic app functionality',
      integration: 'Screening is offered, not mandatory',
      persistence: 'Do not repeatedly force screening if user declines',
      optOut: 'Allow users to set screening preferences (daily/weekly/manual only)'
    }
  },

  /**
   * LANGUAGE & TONE STANDARDS
   */
  languageToneStandards: {
    principle: 'Language shapes how people receive information and perceive themselves',
    required: [
      {
        use: 'Normalizing, non-stigmatizing language',
        examples: [
          '✓ "thoughts of suicide are a symptom of depression, not a character flaw"',
          '✓ "Many people with depression have these thoughts - you are not alone"',
          '✗ "Avoid: suicidal people, suicide risk, dangerous thoughts"'
        ]
      },
      {
        use: 'Precise, not vague or scary',
        examples: [
          '✓ "Have you thought about ways you might harm yourself?"',
          '✗ "Are you dangerous? Do you have homicidal or suicidal impulses?"'
        ]
      },
      {
        use: 'Responsive, not alarmist',
        examples: [
          '✓ "We want to help you stay safe. Here are your options..."',
          '✗ "WARNING: SUICIDE RISK DETECTED. Your data is being reported."'
        ]
      },
      {
        use: 'Collaborative, not authoritarian',
        examples: [
          '✓ "Would you be willing to share what is making this feel impossible?"',
          '✗ "Tell me your plan for suicide right now."'
        ]
      },
      {
        use: 'Meaning-based, not doom-focused',
        examples: [
          '✓ "What has been worth living for in the past? What might be possible?"',
          '✗ "Your chances of recovery are low. Most people in this state relapse."'
        ]
      }
    ]
  },

  /**
   * CRISIS RESPONSE ETHICS
   */
  crisisResponseEthics: {
    appropriateEscalation: {
      principle: 'Escalation must be proportional to actual risk, not precautionary',
      rule1: 'Do not automatically report or police-escalate for ideation without intent',
      rule2: 'Intent varies - having thoughts ≠ imminent plan ≠ active attempt',
      rule3: 'Understand cultural context - some cultures view death differently',
      rule4: 'Consider that suicidal ideation can be rational response to genuine persecution'
    },
    mandatedReporting: {
      principleOfHarm: 'Mandatory reporting should prevent imminent specific harm',
      notJustThoughts: 'Report only when there is imminent, specific, credible danger',
      legalContextMatters: 'Mandatory reporting laws vary by location',
      transparencyFirst: 'Tell user what you are obligated to report before reporting',
      documentation: 'Document the specific factors that triggered escalation'
    },
    respectingChoices: {
      capacityAssessment: 'Assume capacity unless person demonstrably cannot think clearly',
      adultAutonomy: 'Adult has right to refuse help, even if we disagree',
      supportNotControl: 'Our job is to present options, not force them',
      persistence: 'Check in repeatedly, but respect boundaries'
    }
  },

  /**
   * DATA ETHICS
   */
  dataEthics: {
    privacy: {
      minimumCollection: 'Collect only data necessary for safety assessment',
      noExtraProfiling: 'Do not use safety data for marketing, personality profiling, or insurance',
      encryption: 'All safety data must be encrypted end-to-end',
      retention: 'Delete historical assessment data after defined period (suggest 1 year)',
      thirdParty: 'Never sell or share data with third parties without explicit consent'
    },
    ownership: {
      userOwnsData: 'All data belongs to user, not app or company',
      rightToDelete: 'User can request complete deletion of all records',
      downloadable: 'User can download all their data in portable format',
      transparency: 'Tell user exactly what is stored and where'
    }
  },

  /**
   * EQUITY & INCLUSION
   */
  equityInclusion: {
    culturalSensitivity: {
      notUniversal: 'Suicidality is understood differently across cultures',
      examples: [
        'Honor cultures may view suicide differently than individualist cultures',
        'Religious/spiritual beliefs shape meaning and acceptance of death',
        'Colonized/oppressed communities may have collective vs. individual framing',
        'Historical trauma impacts how crisis is experienced'
      ],
      requirement: 'Allow cultural context in assessment and response'
    },
    disability: {
      chronicallyIll: 'Suicidal thoughts may be rational for those with terminal illness',
      neurodivergence: 'Autistic, ADHD, and psychotic-spectrum people may process differently',
      requirement: 'Do not pathologize diversity - assess context'
    },
    marginalization: {
      LGBTQ: 'Sexual and gender minority people face specific stressors',
      BIPOC: 'Racial trauma, discrimination, and systemic barriers are real stressors',
      Poverty: 'Material deprivation is a legitimate suicide risk factor',
      Incarceration: 'Detained people have different safety needs and fewer options',
      Requirement: 'Resources should reflect these specific needs'
    }
  },

  /**
   * WHEN THE APP CANNOT HELP
   */
  limitationsAndBoundaries: {
    notAReplacement: 'This app is adjunctive support, not a replacement for professional care',
    crisisManagement: 'For acute crisis, person needs human clinician, not algorithm',
    mandatoryScenarios: [
      'Active suicidal planning with imminent timeline',
      'Psychotic features (delusions, hallucinations)',
      'Acute manic or mixed state',
      'Substance intoxication affecting judgment',
      'Recent suicide attempt',
      'Severe psychiatric symptoms'
    ],
    appropriateRedirect: 'These situations require 911, ER, or crisis hotline - make this clear'
  },

  /**
   * IMPLEMENTATION CHECKLIST
   */
  implementationChecklist: [
    {
      category: 'Assessment',
      items: [
        '☐ Questions are piloted with people with lived suicide experience',
        '☐ Language tested for bias and stigma',
        '☐ Multiple languages available at launch',
        '☐ Accessibility: mobile-friendly, screen reader compatible, keyboard navigable',
        '☐ Assessment can be completed in 5-10 minutes for tier 1'
      ]
    },
    {
      category: 'Response Protocols',
      items: [
        '☐ All response templates reviewed by suicidology experts',
        '☐ Crisis resources tested for accuracy and accessibility',
        '☐ Crisis contacts verified annually',
        '☐ De-escalation techniques evidence-based',
        '☐ Clear escalation pathways documented'
      ]
    },
    {
      category: 'Data & Privacy',
      items: [
        '☐ All data encrypted end-to-end',
        '☐ No data sharing without explicit user consent',
        '☐ Clear privacy policy in plain language',
        '☐ Data deletion protocol documented',
        '☐ Regular security audits'
      ]
    },
    {
      category: 'Legal Compliance',
      items: [
        '☐ Comply with all local mandatory reporting laws',
        '☐ Document mandatory reporting triggers clearly',
        '☐ Obtain legal review in each jurisdiction',
        '☐ Terms of service transparently state limitations',
        '☐ Liability disclaimers appropriate and honest'
      ]
    },
    {
      category: 'Equity',
      items: [
        '☐ Resources available for marginalized communities',
        '☐ Cultural sensitivity review of language',
        '☐ Geographic resources covering rural, urban, international',
        '☐ Free access - no paywall for safety features',
        '☐ Representative advisory group (people with lived experience)'
      ]
    },
    {
      category: 'Monitoring & Learning',
      items: [
        '☐ Track false positives (flagging safe people as at-risk)',
        '☐ Track false negatives (missing people at actual risk)',
        '☐ Regular review with mental health clinicians',
        '☐ Continuous improvement based on outcomes',
        '☐ Transparency report on assessment accuracy published annually'
      ]
    }
  ],

  /**
   * STATEMENTS OF LIMITATION
   */
  limitationStatements: {
    forUsers: `
    This app can help you:
    - Track your emotional state and safety
    - Access crisis resources
    - Connect with anchors that help
    
    This app CANNOT:
    - Replace a therapist or psychiatrist
    - Diagnose mental illness
    - Provide treatment or medication
    - Guarantee safety in emergencies
    
    If you are having a suicide emergency:
    - Call 911 (US) or your local emergency number
    - Go to the nearest emergency room
    - Call 988 (US/Canada) immediately
    - Tell someone you trust RIGHT NOW
    
    This app is a support tool for people also connected to professional care.
    `,
    forClinicians: `
    This assessment is a screening tool, not a diagnostic instrument.
    
    Use this data to inform your clinical judgment, not replace it.
    
    Key limitations:
    - Self-report bias (people may minimize or exaggerate)
    - Context collapse (text-based assessment misses nonverbal cues)
    - Algorithm bias (created by specific people with specific values)
    - No substitute for direct clinical evaluation
    
    Recommended: Use this alongside your standard suicide risk assessment.
    `
  }
};

/**
 * RESPONSIBLE HARM REDUCTION PERSPECTIVE
 * 
 * Why traditional "prevent all suicide" framing can backfire:
 * 
 * 1. Oversimplifies complex decisions
 *    - Some people face genuine inescapable suffering
 *    - Pressuring all suicidal people toward life can increase shame
 *    - People need space to feel ambivalent
 *
 * 2. Breaks trust if seen as controlling
 *    - Secret reporting violates autonomy
 *    - Treating people as fragile can increase hopelessness
 *    - Transparency about limits is more respectful
 *
 * 3. May not work for all populations
 *    - Terminal illness: suicide may be rational choice
 *    - Systemic oppression: systemic solutions more important than individual intervention
 *    - Incarceration: person has limited agency and options
 *
 * BETTER APPROACH:
 * - Support autonomy while encouraging life
 * - Be honest about what we don't know
 * - Focus on reducing suffering, not eliminating choice
 * - Work WITH person's values, not against them
 * - Provide real resources, not just words
 */

export const RESPONSIBLE_APPROACH = {
  concept: 'Collaborative Safety Planning, not Coercive Control',
  principles: [
    'You know yourself best - we offer information and options',
    'Suicidal thoughts are about unbearable pain, not weakness',
    'We cannot force life, but we can reduce suffering',
    'Your autonomy matters - even in crisis',
    'Recovery happens through connection, not punishment'
  ]
};

export default ETHICAL_FRAMEWORK;
