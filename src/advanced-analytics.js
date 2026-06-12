/**
 * POLARIS ADVANCED ANALYTICS ENGINE
 * 
 * Polaris 3.0 Enhancement
 * Visual data representation and resilience metrics
 * 
 * Generates charts, trends, and insights for user dashboard
 */

export class AdvancedAnalytics {
  constructor(userHistory = []) {
    this.history = userHistory;
    this.dashboardMetrics = {};
  }

  /**
   * MAIN DASHBOARD GENERATION
   */
  generateDashboard(currentState, timeWindow = 30) {
    const historyWindow = this.getHistoryWindow(timeWindow);

    return {
      generatedAt: new Date().toISOString(),
      timeWindow,
      metrics: {
        resilience: this.calculateResilienceScore(currentState, historyWindow),
        progress: this.calculateProgressMetrics(historyWindow),
        patterns: this.identifyPatterns(historyWindow),
        trends: this.calculateTrends(historyWindow),
        wellbeing: this.calculateWellbeingIndex(historyWindow),
        stability: this.analyzeStability(historyWindow)
      },
      charts: {
        energyTrend: this.generateEnergyChart(historyWindow),
        moodTrend: this.generateMoodChart(historyWindow),
        completionRate: this.generateCompletionChart(historyWindow),
        hopeTrajectory: this.generateHopeChart(historyWindow),
        symptomHeatmap: this.generateSymptomHeatmap(historyWindow),
        resilience: this.generateResilienceChart(historyWindow, currentState)
      },
      recommendations: this.generateRecommendations(currentState, historyWindow)
    };
  }

  /**
   * RESILIENCE SCORE
   * Multi-factor measure of overall functioning
   */
  calculateResilienceScore(currentState, history) {
    const factors = {
      anchorEngagement: this.calculateAnchorEngagement(currentState),
      emotionalStability: this.calculateEmotionalStability(history),
      hopeLevel: (currentState.currentHopeLevel || 2) / 4,
      socialConnection: this.calculateSocialConnection(history),
      meaningfulActivity: this.calculateMeaningfulActivity(history),
      selfCare: this.calculateSelfCareConsistency(history)
    };

    // Weighted score
    const weights = {
      anchorEngagement: 0.25,
      emotionalStability: 0.2,
      hopeLevel: 0.15,
      socialConnection: 0.15,
      meaningfulActivity: 0.15,
      selfCare: 0.1
    };

    let score = 0;
    Object.entries(weights).forEach(([factor, weight]) => {
      score += (factors[factor] || 0) * weight;
    });

    return {
      score: (score * 100).toFixed(1),
      level: this.interpretResilienceLevel(score),
      factors,
      trajectory: this.calculateScoreTrajectory(history)
    };
  }

  calculateAnchorEngagement(currentState) {
    if (!currentState.userAnchors) return 0.3;
    const rate = (currentState.completed?.length || 0) / currentState.userAnchors.length;
    return Math.min(1, rate);
  }

  calculateEmotionalStability(history) {
    if (history.length < 3) return 0.5;

    const energyValues = history.map(d => {
      const map = { collapse: 1, low: 2, medium: 3, high: 4 };
      return map[d.todayEnergy] || 2;
    });

    // Calculate standard deviation
    const mean = energyValues.reduce((a, b) => a + b, 0) / energyValues.length;
    const variance = energyValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / energyValues.length;
    const stdDev = Math.sqrt(variance);

    // Lower std dev = more stable
    return Math.max(0, 1 - stdDev / 2);
  }

  calculateSocialConnection(history) {
    if (history.length < 1) return 0.5;
    const recentSocial = history.slice(-7).map(d => d.ratings?.social || 15);
    const average = recentSocial.reduce((a, b) => a + b, 0) / recentSocial.length;
    // Lower social rating = better
    return Math.max(0, 1 - average / 40);
  }

  calculateMeaningfulActivity(history) {
    if (history.length < 1) return 0.5;
    const recentMeaning = history.slice(-7).map(d => d.ratings?.meaning || 15);
    const average = recentMeaning.reduce((a, b) => a + b, 0) / recentMeaning.length;
    // Lower meaning rating = better
    return Math.max(0, 1 - average / 40);
  }

  calculateSelfCareConsistency(history) {
    if (history.length < 7) return 0.5;

    const consistency = history.map(d => {
      const hygiene = d.ratings?.hygiene || 20;
      const sleep = d.ratings?.sleep || 20;
      const eating = d.ratings?.eating || 20;
      return 1 - (hygiene + sleep + eating) / 60; // Average of self-care items
    });

    return (consistency.reduce((a, b) => a + b, 0) / consistency.length);
  }

  interpretResilienceLevel(score) {
    if (score > 0.8) return 'high';
    if (score > 0.6) return 'good';
    if (score > 0.4) return 'moderate';
    if (score > 0.2) return 'fragile';
    return 'critical';
  }

  calculateScoreTrajectory(history) {
    if (history.length < 7) return 'insufficient-data';

    const early = this.calculateResilienceScore({ userAnchors: [] }, history.slice(0, 7));
    const recent = this.calculateResilienceScore({ userAnchors: [] }, history.slice(-7));

    const early_score = parseFloat(early.score);
    const recent_score = parseFloat(recent.score);

    if (recent_score > early_score + 5) return 'improving';
    if (recent_score < early_score - 5) return 'declining';
    return 'stable';
  }

  /**
   * PROGRESS METRICS
   * Measurable improvements
   */
  calculateProgressMetrics(history) {
    if (history.length < 7) return null;

    const early = history.slice(0, 7);
    const recent = history.slice(-7);

    return {
      completionTrend: this.calculateTrendChange(
        early.map(d => (d.completed?.length || 0) / (d.userAnchors?.length || 1)),
        recent.map(d => (d.completed?.length || 0) / (d.userAnchors?.length || 1))
      ),
      hopeTrend: this.calculateTrendChange(
        early.map(d => d.currentHopeLevel || 2),
        recent.map(d => d.currentHopeLevel || 2)
      ),
      energyTrend: this.calculateEnergyTrend(early, recent),
      collapseFrequency: this.analyzeCollapseFrequency(history),
      highEnergyDays: this.countHighEnergyDays(history)
    };
  }

  calculateTrendChange(early, recent) {
    const earlyAvg = early.reduce((a, b) => a + b, 0) / early.length;
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const change = ((recentAvg - earlyAvg) / earlyAvg * 100).toFixed(1);

    return {
      early: (earlyAvg * 100).toFixed(0),
      recent: (recentAvg * 100).toFixed(0),
      change: parseFloat(change),
      direction: parseFloat(change) > 0 ? 'improving' : 'declining'
    };
  }

  calculateEnergyTrend(early, recent) {
    const energyMap = { collapse: 1, low: 2, medium: 3, high: 4 };

    const earlyAvg =
      early.map(d => energyMap[d.todayEnergy] || 2).reduce((a, b) => a + b, 0) / early.length;
    const recentAvg =
      recent.map(d => energyMap[d.todayEnergy] || 2).reduce((a, b) => a + b, 0) / recent.length;

    return {
      early: this.energyLevelName(earlyAvg),
      recent: this.energyLevelName(recentAvg),
      change: recentAvg > earlyAvg ? 'increasing' : 'decreasing'
    };
  }

  energyLevelName(value) {
    if (value < 1.5) return 'collapse';
    if (value < 2.5) return 'low';
    if (value < 3.5) return 'medium';
    return 'high';
  }

  analyzeCollapseFrequency(history) {
    const collapseCount = history.filter(d => d.todayEnergy === 'collapse').length;
    return {
      count: collapseCount,
      frequency: ((collapseCount / history.length) * 100).toFixed(1) + '%',
      trend: 'monitored' // Would trend over time
    };
  }

  countHighEnergyDays(history) {
    const highCount = history.filter(d => d.todayEnergy === 'high').length;
    return {
      count: highCount,
      percentage: ((highCount / history.length) * 100).toFixed(1) + '%'
    };
  }

  /**
   * IDENTIFY PATTERNS
   */
  identifyPatterns(history) {
    return {
      dayOfWeek: this.analyzeDayOfWeekPattern(history),
      circadianPattern: this.analyzeCircadianPattern(history),
      symptomClusters: this.identifySymptomClusters(history),
      recoveryPattern: this.analyzeRecoveryPattern(history)
    };
  }

  analyzeDayOfWeekPattern(history) {
    // Group by day of week
    const byDay = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    history.forEach(entry => {
      if (entry.date) {
        const date = new Date(entry.date);
        const dayName = days[date.getDay()];
        byDay[dayName].push(entry);
      }
    });

    // Calculate average energy per day
    const pattern = {};
    Object.entries(byDay).forEach(([day, entries]) => {
      if (entries.length > 0) {
        const energyMap = { collapse: 1, low: 2, medium: 3, high: 4 };
        const avg =
          entries
            .map(e => energyMap[e.todayEnergy] || 2)
            .reduce((a, b) => a + b, 0) / entries.length;
        pattern[day] = this.energyLevelName(avg);
      }
    });

    return pattern;
  }

  analyzeCircadianPattern(history) {
    // Analyze sleep and wake energy patterns
    const sleepRatings = history.map(d => d.ratings?.sleep || 0);
    const poorSleep = sleepRatings.filter(r => r > 3).length;

    return {
      sleepQuality:
        (poorSleep / sleepRatings.length > 0.4) ? 'disrupted' : 'stable',
      averageSleepRating: (sleepRatings.reduce((a, b) => a + b, 0) / sleepRatings.length).toFixed(1),
      note: 'Sleep patterns impact all other ratings'
    };
  }

  identifySymptomClusters(history) {
    // Which symptoms cluster together
    const clusters = [];

    // Cluster 1: Sleep + Energy + Mood
    if (this.areCorrelated(
      history.map(d => d.ratings?.sleep),
      history.map(d => d.ratings?.energy)
    )) {
      clusters.push('Sleep and energy are linked for you');
    }

    // Cluster 2: Social + Shame
    if (this.areCorrelated(
      history.map(d => d.ratings?.social),
      history.map(d => d.ratings?.shame)
    )) {
      clusters.push('Social withdrawal and shame patterns connected');
    }

    // Cluster 3: Meaning + Hope
    if (this.areCorrelated(
      history.map(d => d.ratings?.meaning),
      history.map(d => d.currentHopeLevel)
    )) {
      clusters.push('Your meaning and hope are closely linked');
    }

    return clusters;
  }

  areCorrelated(series1, series2) {
    // Simple correlation check
    const valid1 = series1.filter(v => v !== undefined);
    const valid2 = series2.filter(v => v !== undefined);
    if (valid1.length < 3 || valid2.length < 3) return false;

    // Simplified: if both trending same direction = correlated
    const trend1 = valid1[valid1.length - 1] - valid1[0];
    const trend2 = valid2[valid2.length - 1] - valid2[0];

    return (trend1 > 0 && trend2 > 0) || (trend1 < 0 && trend2 < 0);
  }

  analyzeRecoveryPattern(history) {
    // Pattern after crashes
    const crashes = [];
    for (let i = 0; i < history.length - 1; i++) {
      if (history[i].todayEnergy === 'collapse' && history[i + 1].todayEnergy !== 'collapse') {
        crashes.push({
          crashDay: i,
          recoveryLength: this.measureRecoveryLength(history, i + 1)
        });
      }
    }

    if (crashes.length === 0) return { crashes: 0, pattern: 'no-crash-recovery-data' };

    const avgRecovery = crashes.map(c => c.recoveryLength).reduce((a, b) => a + b, 0) / crashes.length;

    return {
      crashes: crashes.length,
      averageRecoveryDays: avgRecovery.toFixed(1),
      pattern: avgRecovery < 3 ? 'fast-recovery' : 'slow-recovery'
    };
  }

  measureRecoveryLength(history, startIndex) {
    let days = 0;
    for (let i = startIndex; i < history.length; i++) {
      if (history[i].todayEnergy === 'collapse') {
        break;
      }
      days += 1;
    }
    return days;
  }

  /**
   * GENERATE CHART DATA
   * Format for visualization
   */
  generateEnergyChart(history) {
    const energyMap = { collapse: 1, low: 2, medium: 3, high: 4 };

    return {
      title: 'Energy Trend',
      type: 'line',
      data: history.map((d, i) => ({
        day: i,
        value: energyMap[d.todayEnergy] || 2,
        label: d.todayEnergy
      })),
      yAxis: { min: 0, max: 4, labels: ['Collapse', 'Low', 'Medium', 'High'] }
    };
  }

  generateMoodChart(history) {
    return {
      title: 'Mood Rating Trend',
      type: 'line',
      data: history.map((d, i) => ({
        day: i,
        value: d.ratings?.mood || 3
      }))
    };
  }

  generateCompletionChart(history) {
    return {
      title: 'Daily Completion Rate',
      type: 'bar',
      data: history.map((d, i) => ({
        day: i,
        value: ((d.completed?.length || 0) / (d.userAnchors?.length || 1) * 100).toFixed(0),
        label: `${d.completed?.length || 0}/${d.userAnchors?.length || 0}`
      }))
    };
  }

  generateHopeChart(history) {
    return {
      title: 'Hope Level Trajectory',
      type: 'area',
      data: history.map((d, i) => ({
        day: i,
        value: d.currentHopeLevel || 2
      })),
      yAxis: { min: 0, max: 4 }
    };
  }

  generateSymptomHeatmap(history) {
    const symptoms = ['sleep', 'mood', 'energy', 'shame', 'social', 'meaning'];

    return {
      title: 'Symptom Severity Heatmap',
      type: 'heatmap',
      data: symptoms.map(symptom => ({
        symptom,
        values: history.map(d => d.ratings?.[symptom] || 0)
      }))
    };
  }

  generateResilienceChart(history, currentState) {
    // Show resilience factors changing over time
    const windows = [];
    for (let i = 0; i < history.length; i += 7) {
      const window = history.slice(i, i + 7);
      if (window.length > 0) {
        const windowScore = this.calculateResilienceScore(currentState, window);
        windows.push({
          week: Math.floor(i / 7),
          score: parseFloat(windowScore.score)
        });
      }
    }

    return {
      title: 'Resilience Score Over Time',
      type: 'line',
      data: windows
    };
  }

  /**
   * CALCULATE TRENDS
   */
  calculateTrends(history) {
    return {
      direction: this.determineTrendDirection(history),
      momentum: this.calculateMomentum(history),
      volatility: this.calculateVolatility(history),
      outlook: this.predictOutlook(history)
    };
  }

  determineTrendDirection(history) {
    if (history.length < 7) return 'insufficient-data';

    const early = history.slice(0, Math.floor(history.length / 2));
    const recent = history.slice(Math.floor(history.length / 2));

    const energyMap = { collapse: 1, low: 2, medium: 3, high: 4 };
    const earlyEnergy = early.map(d => energyMap[d.todayEnergy] || 2).reduce((a, b) => a + b, 0) / early.length;
    const recentEnergy = recent.map(d => energyMap[d.todayEnergy] || 2).reduce((a, b) => a + b, 0) / recent.length;

    if (recentEnergy > earlyEnergy + 0.5) return 'improving';
    if (recentEnergy < earlyEnergy - 0.5) return 'declining';
    return 'stable';
  }

  calculateMomentum(history) {
    // Is change accelerating?
    const lastWeek = history.slice(-7);
    const trend = this.determineTrendDirection(lastWeek);

    return {
      direction: trend,
      strength: 'moderate' // Would calculate actual rate of change
    };
  }

  calculateVolatility(history) {
    const energyMap = { collapse: 1, low: 2, medium: 3, high: 4 };
    const values = history.map(d => energyMap[d.todayEnergy] || 2);

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
      volatility: stdDev > 1.5 ? 'high' : 'moderate',
      stdDev: stdDev.toFixed(2)
    };
  }

  predictOutlook(history) {
    // Simple 7-day outlook
    const trend = this.determineTrendDirection(history);

    const outlooks = {
      improving: 'Week ahead likely to be stabilizing. Maintain anchors.',
      stable: 'Week ahead expected to continue current pattern. Stay consistent.',
      declining: 'Week ahead may require extra support. Plan proactively.'
    };

    return outlooks[trend] || 'Insufficient data for prediction';
  }

  /**
   * WELLBEING INDEX
   * Composite measure of overall wellbeing
   */
  calculateWellbeingIndex(history) {
    const components = {
      physical: this.calculatePhysicalWellbeing(history),
      emotional: this.calculateEmotionalWellbeing(history),
      social: this.calculateSocialWellbeing(history),
      meaningful: this.calculateMeaningfulWellbeing(history)
    };

    const index = Object.values(components).reduce((a, b) => a + b, 0) / 4;

    return {
      overallIndex: (index * 100).toFixed(1),
      components,
      interpretation: this.interpretWellbeingIndex(index)
    };
  }

  calculatePhysicalWellbeing(history) {
    const sleep = (history.map(d => d.ratings?.sleep || 0).reduce((a, b) => a + b, 0) / history.length);
    const hygiene = (history.map(d => d.ratings?.hygiene || 0).reduce((a, b) => a + b, 0) / history.length);
    return Math.max(0, 1 - (sleep + hygiene) / 80);
  }

  calculateEmotionalWellbeing(history) {
    const mood = (history.map(d => d.ratings?.mood || 0).reduce((a, b) => a + b, 0) / history.length);
    const shame = (history.map(d => d.ratings?.shame || 0).reduce((a, b) => a + b, 0) / history.length);
    return Math.max(0, 1 - (mood + shame) / 80);
  }

  calculateSocialWellbeing(history) {
    const social = (history.map(d => d.ratings?.social || 0).reduce((a, b) => a + b, 0) / history.length);
    return Math.max(0, 1 - social / 40);
  }

  calculateMeaningfulWellbeing(history) {
    const meaning = (history.map(d => d.ratings?.meaning || 0).reduce((a, b) => a + b, 0) / history.length);
    return Math.max(0, 1 - meaning / 40);
  }

  interpretWellbeingIndex(index) {
    if (index > 0.8) return 'thriving';
    if (index > 0.6) return 'stable';
    if (index > 0.4) return 'managing';
    if (index > 0.2) return 'struggling';
    return 'in-crisis';
  }

  /**
   * STABILITY ANALYSIS
   */
  analyzeStability(history) {
    return {
      overallStability: this.calculateOverallStability(history),
      stableAreas: this.identifyStableAreas(history),
      unstableAreas: this.identifyUnstableAreas(history),
      recommendations: this.stabilityRecommendations(history)
    };
  }

  calculateOverallStability(history) {
    const volatility = this.calculateVolatility(history);
    const crashes = history.filter(d => d.todayEnergy === 'collapse').length;

    if (volatility.stdDev > 1.5 || crashes > 2) return 'fragile';
    if (volatility.stdDev > 1 || crashes > 0) return 'moderate';
    return 'stable';
  }

  identifyStableAreas(history) {
    const areas = [];
    const sleep = (history.map(d => d.ratings?.sleep || 0).reduce((a, b) => a + b, 0) / history.length);
    const completion = (history.map(d => (d.completed?.length || 0) / (d.userAnchors?.length || 1)).reduce((a, b) => a + b, 0) / history.length);

    if (sleep < 3) areas.push('Sleep is stable');
    if (completion > 0.6) areas.push('Anchor completion is strong');

    return areas;
  }

  identifyUnstableAreas(history) {
    const areas = [];
    const social = (history.map(d => d.ratings?.social || 0).reduce((a, b) => a + b, 0) / history.length);
    const meaning = (history.map(d => d.ratings?.meaning || 0).reduce((a, b) => a + b, 0) / history.length);

    if (social > 4) areas.push('Social connection is unstable');
    if (meaning > 4) areas.push('Meaning is fragile');

    return areas;
  }

  stabilityRecommendations(history) {
    return [
      'Maintain consistent daily anchor routine',
      'Prioritize sleep as foundation',
      'One social connection per week minimum'
    ];
  }

  /**
   * EXPORT ANALYTICS
   */
  exportAnalyticsReport(currentState) {
    const timeWindow = 30;
    const history = this.getHistoryWindow(timeWindow);
    const dashboard = this.generateDashboard(currentState, timeWindow);

    return {
      title: 'Personal Analytics Report',
      generatedAt: new Date().toISOString(),
      timeWindow,
      dataPoints: history.length,
      metrics: dashboard.metrics,
      insights: [
        ...dashboard.charts,
        ...dashboard.recommendations
      ],
      disclaimer: 'This analytics is for personal reflection. Share with therapist for clinical interpretation.'
    };
  }

  /**
   * HELPER: Get history window
   */
  getHistoryWindow(days) {
    return this.history.slice(-days);
  }

  /**
   * RECOMMENDATIONS
   */
  generateRecommendations(currentState, history) {
    const recommendations = [];

    // Based on trends
    const trend = this.determineTrendDirection(history);
    if (trend === 'declining') {
      recommendations.push({
        priority: 'high',
        action: 'Increase professional support frequency',
        reason: 'Declining trend detected'
      });
    }

    // Based on stability
    const stability = this.analyzeStability(history);
    if (stability.overallStability === 'fragile') {
      recommendations.push({
        priority: 'high',
        action: 'Daily check-in with safe person',
        reason: 'System is fragile'
      });
    }

    return recommendations;
  }
}

export default AdvancedAnalytics;
