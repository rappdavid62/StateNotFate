/**
 * POLARIS PEER INSIGHTS ENGINE
 * 
 * Polaris 3.0 Enhancement
 * Learn from collective patterns of similar users (anonymously)
 * 
 * Privacy-first: no individual data shared, only aggregated patterns
 * Cohort matching: find users with similar profiles and patterns
 */

export class PeerInsights {
  constructor(userProfile = {}) {
    this.userProfile = userProfile;
    this.similarCohorts = [];
    this.benchmarkData = {}; // Aggregated data from similar users
    this.collectiveInsights = [];
  }

  /**
   * MAIN INTERFACE: Get peer insights for this user
   */
  generatePeerInsights(currentState) {
    // Step 1: Find similar users
    const cohortMatch = this.matchToCohort(currentState);

    // Step 2: Get aggregated patterns
    const benchmarks = this.generateBenchmarks(cohortMatch);

    // Step 3: Compare user to cohort
    const comparison = this.compareToCohorBenchmarks(currentState, benchmarks);

    // Step 4: Extract insights
    const insights = this.extractInsights(comparison, cohortMatch);

    return {
      cohortMatch,
      yourStats: this.getUserStats(currentState),
      cohortStats: benchmarks,
      comparison,
      insights,
      message: this.generateCohortMessage(cohortMatch, insights)
    };
  }

  /**
   * COHORT MATCHING
   * Find users similar to this person
   */
  matchToCohort(userState) {
    // Similarity factors:
    // 1. Depression severity (based on ratings)
    // 2. Energy pattern (collapse/low/medium/high distribution)
    // 3. Time in recovery (how long using Polaris)
    // 4. Age/life stage (optional, for demo use generic)
    // 5. Primary struggles (sleep, social, meaning, etc.)

    const userProfile = this.generateUserProfile(userState);

    // In production: these would be real user cohorts
    // For demo: simulate with patterns
    const simulatedCohorts = this.generateSimulatedCohorts();

    // Score each cohort for similarity
    const scoredCohorts = simulatedCohorts.map(cohort => ({
      cohort,
      similarity: this.calculateSimilarity(userProfile, cohort.profile)
    }));

    // Sort by similarity
    const matched = scoredCohorts.sort((a, b) => b.similarity - a.similarity);

    // Return top matches + aggregate
    return {
      primaryCohort: matched[0]?.cohort,
      primarySimilarity: matched[0]?.similarity || 0,
      relatedCohorts: matched.slice(1, 3),
      cohortSize: matched[0]?.cohort?.size || 50
    };
  }

  generateUserProfile(userState) {
    // Create a profile vector based on observable patterns
    return {
      depressionseverity: this.estimateDepresionSeverity(userState),
      energyPattern: this.analyzeEnergyPattern(userState),
      timeInRecovery: userState.daysInSystem || 0,
      primaryStruggles: this.identifyStruggles(userState),
      resilienceFactors: this.identifyResilienceFactors(userState)
    };
  }

  estimateDepresionSeverity(userState) {
    // Based on average ratings
    const ratings = userState.ratings || {};
    const problematicRatings = [
      ratings.sleep,
      ratings.energy,
      ratings.shame,
      ratings.meaning
    ].filter(r => r !== undefined);

    if (problematicRatings.length === 0) return 'unknown';

    const average = problematicRatings.reduce((a, b) => a + b, 0) / problematicRatings.length;

    if (average > 7) return 'severe';
    if (average > 5) return 'moderate-severe';
    if (average > 3) return 'moderate';
    return 'mild-moderate';
  }

  analyzeEnergyPattern(userState) {
    // Distribution of energy levels
    return {
      primaryEnergy: userState.todayEnergy || 'unknown',
      pattern: 'stable' // In production: analyze last 14 days
    };
  }

  identifyStruggles(userState) {
    const ratings = userState.ratings || {};
    const problems = [];

    if ((ratings.sleep || 0) > 4) problems.push('sleep');
    if ((ratings.energy || 0) > 4) problems.push('energy');
    if ((ratings.shame || 0) > 4) problems.push('shame');
    if ((ratings.meaning || 0) > 4) problems.push('meaning');
    if ((ratings.social || 0) > 4) problems.push('social');

    return problems;
  }

  identifyResilienceFactors(userState) {
    // What's working for this person
    return {
      anchorAdherence: (userState.completed?.length || 0) / (userState.userAnchors?.length || 1),
      hopeLevel: userState.currentHopeLevel || 2,
      socialConnection: 5 - (userState.ratings?.social || 5), // Inverted
      engagement: (userState.completed?.length || 0) > 0 ? 'active' : 'passive'
    };
  }

  calculateSimilarity(userProfile, cohortProfile) {
    // Simple similarity metric (in production: use cosine similarity or ML)
    let match = 0;

    if (userProfile.depressionseverity === cohortProfile.depressionseverity) match += 0.3;
    if (userProfile.primaryEnergy === cohortProfile.primaryEnergy) match += 0.2;
    if (
      userProfile.primaryStruggles.some(s => cohortProfile.primaryStruggles.includes(s))
    )
      match += 0.3;
    if (userProfile.resilienceFactors.engagement === cohortProfile.engagement) match += 0.2;

    return match;
  }

  /**
   * SIMULATE COHORTS FOR DEMO
   * In production: these would be aggregated real user data
   */
  generateSimulatedCohorts() {
    return [
      {
        id: 'cohort-mod-energy',
        name: 'Moderate Depression, Variable Energy',
        size: 324,
        profile: {
          depressionseverity: 'moderate',
          primaryEnergy: 'low',
          primaryStruggles: ['energy', 'meaning', 'sleep'],
          engagement: 'active'
        },
        stats: {
          averageHopeLevel: 2.3,
          averageCompletionRate: 0.68,
          anchorPreferences: ['morning-anchor', 'movement', 'meaning-check'],
          averageRecoveryTime: 18 // days to stabilization
        }
      },
      {
        id: 'cohort-new-user',
        name: 'Early Recovery Users',
        size: 156,
        profile: {
          depressionseverity: 'moderate-severe',
          primaryEnergy: 'collapse',
          primaryStruggles: ['energy', 'shame', 'social'],
          engagement: 'passive'
        },
        stats: {
          averageHopeLevel: 1.8,
          averageCompletionRate: 0.42,
          anchorPreferences: ['minimal-anchors', 'grounding', 'survival'],
          averageRecoveryTime: 25
        }
      },
      {
        id: 'cohort-sleep-first',
        name: 'Sleep-Sensitive Users',
        size: 289,
        profile: {
          depressionseverity: 'moderate',
          primaryEnergy: 'low',
          primaryStruggles: ['sleep', 'energy', 'meaning'],
          engagement: 'active'
        },
        stats: {
          averageHopeLevel: 2.4,
          averageCompletionRate: 0.71,
          anchorPreferences: ['sleep-anchor', 'wind-down', 'circadian'],
          averageRecoveryTime: 16
        }
      },
      {
        id: 'cohort-social-anxiety',
        name: 'Social Sensitivity Users',
        size: 198,
        profile: {
          depressionseverity: 'moderate',
          primaryEnergy: 'medium',
          primaryStruggles: ['social', 'shame', 'meaning'],
          engagement: 'active'
        },
        stats: {
          averageHopeLevel: 2.2,
          averageCompletionRate: 0.65,
          anchorPreferences: ['solo-anchors', 'meaning', 'safe-contact'],
          averageRecoveryTime: 22
        }
      }
    ];
  }

  /**
   * GENERATE BENCHMARKS FROM COHORT
   * Aggregated data - safe to share with user
   */
  generateBenchmarks(cohortMatch) {
    if (!cohortMatch.primaryCohort) return null;

    const cohort = cohortMatch.primaryCohort;

    return {
      cohortName: cohort.name,
      cohortSize: cohort.size,
      demographics: `${cohort.size} people with similar profiles`,

      // Performance metrics
      averageHope: cohort.stats.averageHopeLevel,
      averageCompletion: (cohort.stats.averageCompletionRate * 100).toFixed(0) + '%',
      typicalRecoveryTime: cohort.stats.averageRecoveryTime + ' days to stabilization',

      // What works in this cohort
      topAnchorTypes: cohort.stats.anchorPreferences,

      // Patterns this cohort experiences
      commonChallenges: cohort.profile.primaryStruggles,
      commonResources: this.getCommonResources(cohort.id)
    };
  }

  getCommonResources(cohortId) {
    const resources = {
      'cohort-mod-energy': [
        'Anchor consistency over perfection',
        'Morning routine as foundation',
        'Movement for energy boost',
        'Weekly meaning check'
      ],
      'cohort-new-user': ['Survival mode - minimum viable day', 'One anchor per day', 'Crisis resources', 'Daily check-in'],
      'cohort-sleep-first': [
        'Sleep is #1 priority',
        'Consistent bedtime',
        'No screens before bed',
        'Wind-down 30min before sleep'
      ],
      'cohort-social-anxiety': [
        'Solo anchors reduce pressure',
        'One safe connection per week',
        'Gradual social scaling',
        'Self-compassion for avoidance'
      ]
    };

    return resources[cohortId] || [];
  }

  /**
   * COMPARE USER TO COHORT BENCHMARKS
   */
  compareToCohorBenchmarks(userState, benchmarks) {
    if (!benchmarks) return null;

    const userCompletion = (userState.completed?.length || 0) / (userState.userAnchors?.length || 1);
    const benchmarkCompletion = parseInt(benchmarks.averageCompletion) / 100;

    return {
      completion: {
        yourRate: (userCompletion * 100).toFixed(0) + '%',
        cohortAverage: benchmarks.averageCompletion,
        comparison: userCompletion > benchmarkCompletion ? 'above' : 'below',
        gap: Math.abs(userCompletion - benchmarkCompletion).toFixed(2)
      },
      hope: {
        yourLevel: userState.currentHopeLevel || 2,
        cohortAverage: benchmarks.averageHope,
        comparison: (userState.currentHopeLevel || 2) >= benchmarks.averageHope ? 'at-or-above' : 'below'
      },
      recovery: {
        timeframe: benchmarks.typicalRecoveryTime,
        note: 'Your path is individual - this is just the average'
      }
    };
  }

  /**
   * EXTRACT INSIGHTS
   * What should this user know about their cohort?
   */
  extractInsights(comparison, cohortMatch) {
    const insights = [];

    if (!comparison) return insights;

    // Insight 1: How they compare
    if (comparison.completion.comparison === 'above') {
      insights.push({
        type: 'strength',
        title: 'You're doing better than your cohort',
        message: `${comparison.completion.gap} higher completion rate than average. Keep it up.`,
        actionable: true
      });
    } else if (comparison.completion.gap > 0.15) {
      insights.push({
        type: 'opportunity',
        title: 'Completion rate lower than similar users',
        message: `Your cohort averages ${comparison.completion.cohortAverage}. Even +5% makes a difference.`,
        actionable: true
      });
    }

    // Insight 2: Hope comparison
    if (comparison.hope.comparison === 'below') {
      insights.push({
        type: 'pattern',
        title: 'Hope is lower than your cohort',
        message: 'Most people like you recover hope gradually. Yours will too.',
        actionable: false
      });
    }

    // Insight 3: Recovery timeline
    insights.push({
      type: 'timeline',
      title: 'Typical recovery timeline',
      message: `Others in your cohort typically stabilize in ${comparison.recovery.timeframe}. Your path may differ.`,
      actionable: false
    });

    return insights;
  }

  /**
   * GENERATE NATURAL MESSAGE
   */
  generateCohortMessage(cohortMatch, insights) {
    return `You've been matched with ${cohortMatch.cohortSize} people with similar profiles.
They're experiencing similar struggles and have found what works.
You're not alone in this. ${insights.length > 0 ? 'Here's what you can learn from them:' : ''}`;
  }

  /**
   * GET USER STATS FOR DISPLAY
   */
  getUserStats(userState) {
    return {
      depressionseverity: this.estimateDepresionSeverity(userState),
      currentHope: userState.currentHopeLevel || 2,
      completionToday: userState.completed?.length || 0,
      totalAnchors: userState.userAnchors?.length || 0,
      streak: userState.streak || 0
    };
  }

  /**
   * RECOMMEND ANCHOR BASED ON COHORT PREFERENCES
   */
  recommendAnchorFromCohort(cohortMatch, userAnchors) {
    const cohort = cohortMatch.primaryCohort;
    if (!cohort) return null;

    // Find which of user's anchors match cohort preferences
    const matches = userAnchors.filter(anchor => {
      const text = anchor.text.toLowerCase();
      return cohort.stats.anchorPreferences.some(pref => text.includes(pref.replace(/-/g, ' ')));
    });

    if (matches.length > 0) {
      return {
        anchor: matches[0],
        reason: `This works well for others in your cohort.`,
        evidenceCount: matches.length
      };
    }

    return null;
  }

  /**
   * PEER INSIGHT DASHBOARD EXPORT
   */
  generateDashboard(currentState) {
    const insights = this.generatePeerInsights(currentState);

    return {
      title: 'Peer Insights',
      subtitle: 'Learning from people like you',
      sections: [
        {
          heading: 'Your Cohort',
          content: insights.message
        },
        {
          heading: 'By The Numbers',
          stats: [
            { label: 'Cohort Size', value: insights.cohortMatch.cohortSize },
            { label: 'Average Hope', value: (insights.cohortStats?.averageHope || 0).toFixed(1) + '/4' },
            { label: 'Average Completion', value: insights.cohortStats?.averageCompletion || 'N/A' },
            { label: 'Typical Recovery', value: insights.cohortStats?.typicalRecoveryTime || 'N/A' }
          ]
        },
        {
          heading: 'Key Insights',
          insights: insights.insights
        },
        {
          heading: 'What Works in Your Cohort',
          resources: insights.cohortStats?.topAnchorTypes || []
        }
      ],
      disclaimer: 'Peer data is aggregated and anonymized. No individual data is shared.'
    };
  }

  /**
   * EXPORT AGGREGATED INSIGHTS FOR RESEARCH
   * Completely anonymized, ethical use only
   */
  exportAggregatedInsights() {
    // This would only be used with explicit consent
    // Returns completely anonymized statistical data
    return {
      cohortData: this.generateSimulatedCohorts(),
      note: 'This data is simulated for demonstration. Real data would be aggregated from actual users with informed consent.'
    };
  }
}

export default PeerInsights;
