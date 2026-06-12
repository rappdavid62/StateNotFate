/**
 * POLARIS ADAPTIVE PERSONALIZATION ENGINE
 * 
 * Polaris 3.0 Enhancement
 * Machine-learning inspired anchor optimization
 * 
 * Learns which anchors work best for each person, in different states,
 * at different times, with different conditions
 */

export class AdaptivePersonalization {
  constructor(userState = {}) {
    this.userState = userState;
    this.anchorMetrics = {}; // Track performance of each anchor
    this.contextualPatterns = {}; // Patterns: energy level, time of day, etc.
    this.optimalSequence = []; // Best anchor order for current state
    this.learningHistory = []; // All learning data
  }

  /**
   * ANCHOR PERFORMANCE TRACKING
   * Measure which anchors actually improve outcomes
   */
  trackAnchorPerformance(anchorId, context) {
    if (!this.anchorMetrics[anchorId]) {
      this.anchorMetrics[anchorId] = {
        id: anchorId,
        totalAttempts: 0,
        completions: 0,
        completionRate: 0,
        averageEffort: 0, // 1-10 self-report
        averageImpact: 0, // Impact on mood/energy
        contextualPerformance: {}
      };
    }

    const metrics = this.anchorMetrics[anchorId];
    metrics.totalAttempts += 1;

    return metrics;
  }

  recordAnchorOutcome(anchorId, outcome) {
    const metrics = this.anchorMetrics[anchorId];
    if (!metrics) return;

    const {
      completed = false,
      effort = 5, // 1-10
      moodBefore = 5,
      moodAfter = 5,
      energyBefore = 5,
      energyAfter = 5,
      context = {} // energy level, time, conditions
    } = outcome;

    if (completed) {
      metrics.completions += 1;
      metrics.completionRate = (metrics.completions / metrics.totalAttempts).toFixed(2);
    }

    const impact = (moodAfter - moodBefore) + (energyAfter - energyBefore);
    metrics.averageImpact = (metrics.averageImpact + impact) / 2;
    metrics.averageEffort = (metrics.averageEffort + effort) / 2;

    // Track contextual performance
    const contextKey = this.generateContextKey(context);
    if (!metrics.contextualPerformance[contextKey]) {
      metrics.contextualPerformance[contextKey] = {
        attempts: 0,
        completions: 0,
        impact: 0
      };
    }

    metrics.contextualPerformance[contextKey].attempts += 1;
    if (completed) metrics.contextualPerformance[contextKey].completions += 1;
    metrics.contextualPerformance[contextKey].impact += impact;

    this.learningHistory.push({
      timestamp: new Date().toISOString(),
      anchorId,
      outcome,
      contextKey
    });
  }

  generateContextKey(context) {
    return `${context.energyLevel || 'unknown'}_${context.timeOfDay || 'unknown'}_${context.location || 'unknown'}`;
  }

  /**
   * CALCULATE ANCHOR EFFECTIVENESS SCORE
   * Higher score = more effective for this person right now
   */
  calculateEffectivenessScore(anchorId, currentContext) {
    const metrics = this.anchorMetrics[anchorId];
    if (!metrics || metrics.totalAttempts < 3) return 0.5; // Neutral for untested anchors

    let score = 0;

    // Factor 1: Completion rate (40%)
    const completionBonus = metrics.completionRate * 0.4;
    score += completionBonus;

    // Factor 2: Impact on mood/energy (40%)
    // Normalize impact to 0-1 range
    const normalizedImpact = (metrics.averageImpact + 10) / 20; // Assume -10 to +10 range
    const impactBonus = Math.max(0, Math.min(1, normalizedImpact)) * 0.4;
    score += impactBonus;

    // Factor 3: Effort efficiency (20%)
    // Lower effort is better
    const effortBonus = ((10 - metrics.averageEffort) / 10) * 0.2;
    score += effortBonus;

    // Factor 4: Contextual boost
    // If anchor performed well in similar context before, boost score
    const contextKey = this.generateContextKey(currentContext);
    if (metrics.contextualPerformance[contextKey]) {
      const contextMetrics = metrics.contextualPerformance[contextKey];
      const contextCompletionRate = contextMetrics.completions / contextMetrics.attempts;
      score = score * 1.1 + (contextCompletionRate * 0.05);
    }

    return Math.min(1, score);
  }

  /**
   * OPTIMIZE ANCHOR SEQUENCE
   * Order anchors from easiest to most impactful
   */
  optimizeAnchorSequence(availableAnchors, currentState) {
    const scoredAnchors = availableAnchors.map(anchor => ({
      ...anchor,
      effectivenessScore: this.calculateEffectivenessScore(anchor.id, currentState),
      estimatedEffort: this.anchorMetrics[anchor.id]?.averageEffort || 5
    }));

    // Sort by: first easy wins (low effort), then high impact
    const optimized = scoredAnchors.sort((a, b) => {
      const effortWeighting = 0.3;
      const impactWeighting = 0.7;

      const aScore = (1 - a.estimatedEffort / 10) * effortWeighting + a.effectivenessScore * impactWeighting;
      const bScore = (1 - b.estimatedEffort / 10) * effortWeighting + b.effectivenessScore * impactWeighting;

      return bScore - aScore;
    });

    this.optimalSequence = optimized;
    return optimized;
  }

  /**
   * IDENTIFY ANCHOR PATTERNS
   * What works best at different times/states
   */
  identifyOptimalPatterns(state) {
    const patterns = {
      collapseTriggers: [], // Anchors that help when collapsing
      lowEnergyWins: [], // Easy wins for low energy
      morningStarters: [], // Effective morning anchors
      eveningResets: [], // Good for wind-down
      resilience: [], // Build resilience
      connection: [], // Social/connection
      meaning: [] // Meaning-making
    };

    Object.entries(this.anchorMetrics).forEach(([anchorId, metrics]) => {
      if (metrics.totalAttempts < 2) return; // Skip untested

      const contextPerf = metrics.contextualPerformance;

      // Find best time-of-day performance
      Object.entries(contextPerf).forEach(([contextKey, perf]) => {
        const rate = perf.completions / perf.attempts;
        const impact = perf.impact / perf.attempts;

        if (contextKey.includes('collapse')) patterns.collapseTriggers.push({ anchorId, rate, impact });
        if (contextKey.includes('low')) patterns.lowEnergyWins.push({ anchorId, rate, impact });
        if (contextKey.includes('morning')) patterns.morningStarters.push({ anchorId, rate, impact });
        if (contextKey.includes('evening')) patterns.eveningResets.push({ anchorId, rate, impact });
      });

      // Categorize by impact
      if (metrics.averageImpact > 5) patterns.resilience.push(anchorId);
    });

    return patterns;
  }

  /**
   * RECOMMEND NEXT ANCHOR
   * Smart suggestion based on state, history, time
   */
  recommendNextAnchor(currentState, recentlyCompleted = []) {
    const availableAnchors = this.userState.userAnchors || [];
    const filtered = availableAnchors.filter(a => !recentlyCompleted.includes(a.id));

    if (filtered.length === 0) return null;

    // Get optimal sequence
    const optimized = this.optimizeAnchorSequence(filtered, currentState);

    // Consider time since last anchor
    const timeSinceLastAnchor = currentState.timeSinceLastAnchor || 0;
    let recommendationStrategy = 'momentum';

    if (currentState.todayEnergy === 'collapse') {
      recommendationStrategy = 'easiest-win';
    } else if (timeSinceLastAnchor > 120) {
      // >2 hours since last anchor
      recommendationStrategy = 'restart';
    } else if (currentState.currentHopeLevel < 2) {
      recommendationStrategy = 'meaning-boost';
    }

    return {
      recommendedAnchor: optimized[0],
      allOptions: optimized.slice(0, 3),
      strategy: recommendationStrategy,
      reasoning: this.generateRecommendationReasoning(optimized[0], recommendationStrategy),
      confidence: optimized[0].effectivenessScore
    };
  }

  generateRecommendationReasoning(anchor, strategy) {
    const reasonings = {
      momentum: `This anchor has worked well for you before. Keep the momentum.`,
      'easiest-win': `You're in collapse. This is one of the easiest anchors for you. Just this one thing.`,
      restart: `It's been a while. Time to reconnect with an anchor that usually helps.`,
      'meaning-boost': `Your hope is low. This anchor tends to remind you why you're doing this.`
    };
    return reasonings[strategy] || 'Try this next.';
  }

  /**
   * IDENTIFY ANCHOR GAPS
   * What might be missing from your system
   */
  identifyAnchorGaps(userState) {
    const categories = {
      circadian: 0,
      movement: 0,
      nutrition: 0,
      hygiene: 0,
      social: 0,
      meaning: 0,
      environment: 0,
      interruption: 0
    };

    // Categorize existing anchors
    (userState.userAnchors || []).forEach(anchor => {
      const text = anchor.text.toLowerCase();
      if (text.includes('wake') || text.includes('sleep') || text.includes('light'))
        categories.circadian += 1;
      if (text.includes('walk') || text.includes('exercise') || text.includes('move'))
        categories.movement += 1;
      if (text.includes('eat') || text.includes('water') || text.includes('drink'))
        categories.nutrition += 1;
      if (text.includes('shower') || text.includes('brush') || text.includes('clean'))
        categories.hygiene += 1;
      if (text.includes('call') || text.includes('text') || text.includes('contact'))
        categories.social += 1;
      if (text.includes('meaning') || text.includes('why') || text.includes('value'))
        categories.meaning += 1;
      if (text.includes('room') || text.includes('clean') || text.includes('tidy'))
        categories.environment += 1;
      if (text.includes('thought') || text.includes('rumination') || text.includes('interrupt'))
        categories.interruption += 1;
    });

    const gaps = Object.entries(categories)
      .filter(([_, count]) => count === 0)
      .map(([category, _]) => category);

    return {
      gaps,
      suggestions: this.generateGapSuggestions(gaps, userState)
    };
  }

  generateGapSuggestions(gaps, userState) {
    const suggestions = {
      circadian:
        'Consider adding a wake-time anchor - circadian rhythm is foundational for depression recovery',
      movement: 'Movement anchors have strong evidence for mood and energy. Even 5 minutes helps.',
      nutrition: 'Regular eating patterns stabilize energy and mood. Simple meals count.',
      hygiene: 'Hygiene anchors build self-care and reduce shame. Start tiny.',
      social: 'Connection is protective. Even brief contact helps.',
      meaning: "Without meaning anchors, motivation becomes fragile. What's worth doing?",
      environment:
        'A slightly less chaotic space reduces hidden friction and energy drain.',
      interruption: 'Rumination interruption anchors give your mind relief when stuck in loops.'
    };

    return gaps.map(gap => ({
      category: gap,
      message: suggestions[gap],
      priority: ['meaning', 'circadian', 'social'].includes(gap) ? 'high' : 'medium'
    }));
  }

  /**
   * PREDICT OPTIMAL ANCHOR TIMING
   * When should this anchor be done for best results
   */
  predictOptimalAnchorTiming(anchorId) {
    const metrics = this.anchorMetrics[anchorId];
    if (!metrics) return null;

    const timingAnalysis = {
      morning: 0,
      afternoon: 0,
      evening: 0
    };

    Object.entries(metrics.contextualPerformance).forEach(([contextKey, perf]) => {
      const rate = perf.completions / perf.attempts;

      if (contextKey.includes('morning')) timingAnalysis.morning += rate;
      if (contextKey.includes('afternoon')) timingAnalysis.afternoon += rate;
      if (contextKey.includes('evening')) timingAnalysis.evening += rate;
    });

    const bestTiming = Object.entries(timingAnalysis).sort(([, a], [, b]) => b - a)[0];

    return {
      anchorId,
      recommendedTime: bestTiming[0],
      successRates: timingAnalysis,
      message: `This anchor works best for you in the ${bestTiming[0]}`
    };
  }

  /**
   * LEARNING INSIGHTS
   * What the system has learned about this person
   */
  generateLearningInsights(userState) {
    const insights = [];

    // Insight 1: Easiest anchors
    const easiestAnchors = Object.entries(this.anchorMetrics)
      .filter(([, m]) => m.completionRate > 0.7)
      .map(([id, m]) => ({ id, rate: m.completionRate }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 3);

    if (easiestAnchors.length > 0) {
      insights.push({
        type: 'strength',
        title: 'Your Easiest Wins',
        description: `You consistently complete these anchors. Use them to build momentum.`,
        anchors: easiestAnchors
      });
    }

    // Insight 2: Most impactful
    const mostImpactful = Object.entries(this.anchorMetrics)
      .filter(([, m]) => m.averageImpact > 3)
      .map(([id, m]) => ({ id, impact: m.averageImpact }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 3);

    if (mostImpactful.length > 0) {
      insights.push({
        type: 'high-value',
        title: 'Your Most Powerful Anchors',
        description: `These anchors have the biggest impact on your mood and energy.`,
        anchors: mostImpactful
      });
    }

    // Insight 3: Time-based pattern
    const timePatterns = this.identifyOptimalPatterns(userState);
    if (timePatterns.morningStarters.length > 0) {
      insights.push({
        type: 'timing',
        title: 'Your Morning Setup',
        description: `Mornings go better when you start with these anchors.`,
        anchors: timePatterns.morningStarters
      });
    }

    // Insight 4: Collapse strategy
    if (timePatterns.collapseTriggers.length > 0) {
      insights.push({
        type: 'crisis',
        title: 'When You Collapse',
        description: `These anchors have helped you restart after low points.`,
        anchors: timePatterns.collapseTriggers
      });
    }

    return insights;
  }

  /**
   * EXPORT LEARNING DATA
   * Share with therapist or use for analysis
   */
  exportPersonalizationData() {
    return {
      exportDate: new Date().toISOString(),
      totalDataPoints: this.learningHistory.length,
      anchorMetrics: this.anchorMetrics,
      patterns: this.identifyOptimalPatterns(this.userState),
      learningCurve: this.calculateLearningCurve(),
      insights: this.generateLearningInsights(this.userState),
      recommendations: {
        nextAnchor: this.recommendNextAnchor(this.userState),
        gaps: this.identifyAnchorGaps(this.userState)
      }
    };
  }

  /**
   * CALCULATE LEARNING CURVE
   * How much has the system improved over time
   */
  calculateLearningCurve() {
    if (this.learningHistory.length < 10) return null;

    // Split history into early and recent periods
    const midpoint = Math.floor(this.learningHistory.length / 2);
    const early = this.learningHistory.slice(0, midpoint);
    const recent = this.learningHistory.slice(midpoint);

    const calcCompletionRate = (entries) => {
      const completed = entries.filter(e => e.outcome.completed).length;
      return completed / entries.length;
    };

    const calcAverageImpact = (entries) => {
      const impacts = entries.map(e => {
        const { moodBefore = 5, moodAfter = 5, energyBefore = 5, energyAfter = 5 } = e.outcome;
        return (moodAfter - moodBefore) + (energyAfter - energyBefore);
      });
      return impacts.reduce((a, b) => a + b, 0) / impacts.length;
    };

    return {
      early: {
        completionRate: calcCompletionRate(early),
        averageImpact: calcAverageImpact(early)
      },
      recent: {
        completionRate: calcCompletionRate(recent),
        averageImpact: calcAverageImpact(recent)
      },
      improvement: {
        completionChange: calcCompletionRate(recent) - calcCompletionRate(early),
        impactChange: calcAverageImpact(recent) - calcAverageImpact(early)
      }
    };
  }
}

export default AdaptivePersonalization;
