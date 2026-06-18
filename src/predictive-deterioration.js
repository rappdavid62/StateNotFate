/**
 * POLARIS PREDICTIVE DETERIORATION ENGINE
 * 
 * Polaris 3.0 Enhancement
 * Detects early warning signs of deterioration BEFORE crash
 * 
 * Uses pattern recognition and statistical analysis to predict
 * when the person is likely to have a major crash or low episode
 */

export class PredictiveDeterioration {
  constructor(userHistory = []) {
    this.history = userHistory; // Historical state data
    this.riskIndicators = [];
    this.currentTrendline = null;
    this.detectionThresholds = {
      warningLevel: 0.6,
      alertLevel: 0.75,
      criticalLevel: 0.9
    };
  }

  /**
   * MAIN PREDICTION FUNCTION
   * Predict risk of deterioration in next 1-7 days
   */
  predictDeteriorationRisk(currentState, daysAhead = 7) {
    if (!this.history || this.history.length < 7) {
      return {
        risk: 'insufficient-data',
        message: 'Need at least 7 days of data for prediction'
      };
    }

    // Run all detection algorithms
    const riskScores = {
      trendlineRisk: this.analyzeTrendline(),
      volatilityRisk: this.analyzeVolatility(),
      anchorAbandonmentRisk: this.analyzeAnchorAbandonment(),
      energyCollapseRisk: this.analyzeEnergyCollapse(),
      socialWithdrawalRisk: this.analyzeSocialWithdrawal(),
      moodDropRisk: this.analyzeMoodDrop(),
      sleepDisruptionRisk: this.analyzeSleepDisruption(),
      hopeErosionRisk: this.analyzeHopeErosion()
    };

    // Combine scores
    const combinedRisk = this.combineRiskScores(riskScores, currentState);

    // Interpret risk level
    const riskLevel = this.interpretRiskLevel(combinedRisk);

    // Generate specific warnings
    const warnings = this.generateWarnings(riskScores, currentState);

    return {
      overallRiskScore: combinedRisk,
      riskLevel,
      riskScores,
      warnings,
      daysToHighRisk: this.estimateDaysToHighRisk(combinedRisk),
      interventionsRecommended: this.recommendInterventions(riskScores, riskLevel),
      timeWindowAnalysis: this.analyzeRiskTimeWindow(daysAhead)
    };
  }

  /**
   * ALGORITHM 1: TREND LINE ANALYSIS
   * Is the person trending downward?
   */
  analyzeTrendline() {
    const recentDays = this.history.slice(-14);
    if (recentDays.length < 3) return 0.3; // Neutral

    // Extract energy values
    const energyValues = recentDays.map(d => {
      const energyMap = { collapse: 1, low: 2, medium: 3, high: 4 };
      return energyMap[d.todayEnergy] || 2;
    });

    // Simple linear regression
    const n = energyValues.length;
    const xSum = (n * (n + 1)) / 2;
    const xSquaredSum = (n * (n + 1) * (2 * n + 1)) / 6;
    const ySum = energyValues.reduce((a, b) => a + b, 0);
    const xySum = energyValues.reduce((sum, y, i) => sum + (i + 1) * y, 0);

    const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);

    // Negative slope = downward trend
    const downwardTrendStrength = Math.max(0, -slope / 2);

    return Math.min(1, downwardTrendStrength);
  }

  /**
   * ALGORITHM 2: VOLATILITY ANALYSIS
   * High variability = unstable = higher risk
   */
  analyzeVolatility() {
    const recentDays = this.history.slice(-14);
    const energyValues = recentDays.map(d => {
      const energyMap = { collapse: 1, low: 2, medium: 3, high: 4 };
      return energyMap[d.todayEnergy] || 2;
    });

    // Calculate standard deviation
    const mean = energyValues.reduce((a, b) => a + b, 0) / energyValues.length;
    const variance = energyValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / energyValues.length;
    const stdDev = Math.sqrt(variance);

    // High volatility (std dev > 1.5) is concerning
    const volatilityRisk = Math.min(1, stdDev / 2);

    return volatilityRisk;
  }

  /**
   * ALGORITHM 3: ANCHOR ABANDONMENT TRACKING
   * Abandoning anchors predicts crash
   */
  analyzeAnchorAbandonment() {
    const recentDays = this.history.slice(-14);
    if (recentDays.length < 3) return 0.3;

    // Track completion pattern
    const completionRates = recentDays.map(d => (d.completed?.length || 0) / (d.userAnchors?.length || 1));

    // Is completion rate declining?
    const recent = completionRates.slice(-7);
    const earlier = completionRates.slice(0, 7);

    const recentAverage = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAverage = earlier.reduce((a, b) => a + b, 0) / earlier.length;

    const abandonmentRisk = Math.max(0, (earlierAverage - recentAverage) * 2);

    // Zero-days are especially concerning
    const zeroDayCount = recentDays.filter(d => (d.completed?.length || 0) === 0).length;
    const zeroDayRisk = Math.min(1, zeroDayCount / 7);

    return Math.max(abandonmentRisk, zeroDayRisk);
  }

  /**
   * ALGORITHM 4: ENERGY COLLAPSE PATTERN
   * Detecting crashes that happened before
   */
  analyzeEnergyCollapse() {
    const recentDays = this.history.slice(-14);
    const collapseCount = recentDays.filter(d => d.todayEnergy === 'collapse').length;
    const collapseFrequency = collapseCount / 14;

    // If someone has multiple collapses, pattern is becoming unstable
    if (collapseFrequency > 0.2) {
      // >2 collapse days per 14 days is high
      return Math.min(1, collapseFrequency * 3);
    }

    // Check for rapid transitions (stability-low-collapse pattern)
    let rapidTransitions = 0;
    for (let i = 1; i < recentDays.length; i++) {
      const prev = recentDays[i - 1].todayEnergy;
      const curr = recentDays[i].todayEnergy;

      if ((prev === 'medium' || prev === 'high') && curr === 'collapse') {
        rapidTransitions += 1;
      }
    }

    return Math.min(1, collapseFrequency + rapidTransitions * 0.15);
  }

  /**
   * ALGORITHM 5: SOCIAL WITHDRAWAL PATTERN
   * Social isolation predicts deterioration
   */
  analyzeSocialWithdrawal() {
    const recentDays = this.history.slice(-14);
    if (recentDays.length < 3) return 0.3;

    const socialRatings = recentDays
      .map(d => d.ratings?.social || 15)
      .filter(r => r !== undefined);

    if (socialRatings.length === 0) return 0.3;

    // Is social score increasing (worse)?
    const recent = socialRatings.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const earlier = socialRatings.slice(0, 7).reduce((a, b) => a + b, 0) / 7;

    const withdrawalTrend = Math.max(0, (recent - earlier) / 40); // 0-40 scale normalized

    return Math.min(1, withdrawalTrend);
  }

  /**
   * ALGORITHM 6: MOOD DROP PATTERN
   * Sharp mood drops = increased crash risk
   */
  analyzeMoodDrop() {
    const recentDays = this.history.slice(-14);
    if (recentDays.length < 3) return 0.3;

    const moodRatings = recentDays.map(d => d.ratings?.mood || 3);

    // Calculate day-to-day changes
    let largeDropCount = 0;
    for (let i = 1; i < moodRatings.length; i++) {
      const drop = moodRatings[i - 1] - moodRatings[i];
      if (drop > 1.5) largeDropCount += 1;
    }

    const dropFrequency = largeDropCount / (recentDays.length - 1);

    return Math.min(1, dropFrequency * 2);
  }

  /**
   * ALGORITHM 7: SLEEP DISRUPTION TRACKING
   * Sleep problems precede crashes
   */
  analyzeSleepDisruption() {
    const recentDays = this.history.slice(-14);
    if (recentDays.length < 3) return 0.3;

    const sleepRatings = recentDays.map(d => d.ratings?.sleep || 2);

    // Poor sleep (rating > 3 on problem scale)
    const poorSleepCount = sleepRatings.filter(r => r > 3).length;
    const poorSleepFrequency = poorSleepCount / recentDays.length;

    // Trend: is sleep getting worse?
    const recent = sleepRatings.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const earlier = sleepRatings.slice(0, 7).reduce((a, b) => a + b, 0) / 7;

    const sleepWorsening = Math.max(0, (recent - earlier) / 5);

    return Math.min(1, poorSleepFrequency + sleepWorsening * 0.5);
  }

  /**
   * ALGORITHM 8: HOPE EROSION TRACKING
   * Declining hope = crash incoming
   */
  analyzeHopeErosion() {
    const recentDays = this.history.slice(-14);
    if (recentDays.length < 3) return 0.3;

    const hopeLevels = recentDays.map(d => d.currentHopeLevel || 2);

    // Trend analysis
    const recent = hopeLevels.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const earlier = hopeLevels.slice(0, 7).reduce((a, b) => a + b, 0) / 7;

    const hopeDecline = Math.max(0, (earlier - recent) / 4); // 0-4 scale

    // Combined with low absolute hope
    const lowHope = Math.max(0, (3 - recent) / 3); // If average hope < 3/4

    return Math.min(1, hopeDecline * 0.7 + lowHope * 0.3);
  }

  /**
   * COMBINE ALL RISK SCORES
   * Weighted average of all algorithms
   */
  combineRiskScores(riskScores, currentState) {
    const weights = {
      trendlineRisk: 0.2, // Trend is important but not sole predictor
      volatilityRisk: 0.15,
      anchorAbandonmentRisk: 0.25, // Strongest predictor
      energyCollapseRisk: 0.15,
      socialWithdrawalRisk: 0.05,
      moodDropRisk: 0.1,
      sleepDisruptionRisk: 0.05,
      hopeErosionRisk: 0.05
    };

    let combinedScore = 0;
    Object.entries(weights).forEach(([indicator, weight]) => {
      combinedScore += (riskScores[indicator] || 0) * weight;
    });

    // Boost if in acute crash now (recent low energy)
    if (currentState.todayEnergy === 'collapse') {
      combinedScore = Math.min(1, combinedScore + 0.2);
    }

    return combinedScore;
  }

  /**
   * INTERPRET RISK LEVEL
   * Convert score to actionable level
   */
  interpretRiskLevel(score) {
    if (score < 0.3) return 'low';
    if (score < 0.6) return 'moderate';
    if (score < 0.75) return 'elevated';
    if (score < 0.9) return 'high';
    return 'critical';
  }

  /**
   * GENERATE SPECIFIC WARNINGS
   * Tell user what we're seeing
   */
  generateWarnings(riskScores, currentState) {
    const warnings = [];

    if (riskScores.anchorAbandonmentRisk > 0.6) {
      warnings.push({
        type: 'anchor-slip',
        severity: 'high',
        message: 'Your anchors have been slipping. This often comes before crashes.',
        suggestion: 'Pick ONE tiny anchor and do it today'
      });
    }

    if (riskScores.trendlineRisk > 0.7) {
      warnings.push({
        type: 'downward-trend',
        severity: 'high',
        message: 'Your energy has been trending downward consistently',
        suggestion: 'This is a pattern, not a personality. Get support today.'
      });
    }

    if (riskScores.hopeErosionRisk > 0.6) {
      warnings.push({
        type: 'hope-loss',
        severity: 'high',
        message: 'Your sense of hope has been eroding',
        suggestion: 'Review your reasons to live. Reach out to someone.'
      });
    }

    if (riskScores.volatilityRisk > 0.6 && riskScores.anchorAbandonmentRisk > 0.5) {
      warnings.push({
        type: 'instability',
        severity: 'critical',
        message: 'Your system is becoming unstable - big swings + anchor loss',
        suggestion: 'This is a crisis pattern. Increase contact and monitoring.'
      });
    }

    if (riskScores.sleepDisruptionRisk > 0.6 && riskScores.energyCollapseRisk > 0.5) {
      warnings.push({
        type: 'sleep-energy-loop',
        severity: 'high',
        message: 'Sleep problems and low energy are reinforcing each other',
        suggestion: 'Prioritize ONE sleep anchor - everything else depends on it'
      });
    }

    return warnings;
  }

  /**
   * ESTIMATE DAYS TO HIGH RISK
   * When will this person be in real danger?
   */
  estimateDaysToHighRisk(currentRiskScore) {
    // Assume risk grows at current trajectory
    const recentTrend = this.analyzeTrendline();

    // Days until score reaches 0.75 (high threshold)
    if (currentRiskScore > 0.75) return 0;
    if (currentRiskScore > 0.6) return 1;
    if (currentRiskScore > 0.4) return 2;

    if (recentTrend > 0.2) return 3; // Trending down = 3 days
    return 7; // Stable or improving
  }

  /**
   * RECOMMEND INTERVENTIONS
   * What should person do right now
   */
  recommendInterventions(riskScores, riskLevel) {
    const interventions = [];

    if (riskLevel === 'critical') {
      interventions.push({
        priority: 1,
        action: 'Contact therapist/doctor TODAY',
        reason: 'Critical risk indicators detected'
      });
      interventions.push({
        priority: 2,
        action: 'Increase contact with safe people',
        reason: 'Isolation amplifies crashes'
      });
    }

    if (riskLevel === 'high' || riskLevel === 'elevated') {
      interventions.push({
        priority: 1,
        action: 'Survival-level anchors only',
        reason: 'No ambition right now - just survive'
      });
      interventions.push({
        priority: 2,
        action: 'Daily check-in with safe person',
        reason: 'Early detection prevents full crash'
      });
    }

    if (riskScores.anchorAbandonmentRisk > 0.6) {
      interventions.push({
        action: 'Pick ONE anchor - just one thing',
        reason: 'Restart is better than zero'
      });
    }

    if (riskScores.sleepDisruptionRisk > 0.5) {
      interventions.push({
        action: 'Prioritize sleep anchor',
        reason: 'Everything else depends on sleep'
      });
    }

    if (riskScores.hopeErosionRisk > 0.6) {
      interventions.push({
        action: 'Review reasons to live',
        reason: 'Hope is reconstructable'
      });
    }

    return interventions;
  }

  /**
   * ANALYZE RISK BY TIME WINDOW
   * When is risk highest?
   */
  analyzeRiskTimeWindow(daysAhead) {
    const windows = [];

    for (let day = 1; day <= daysAhead; day++) {
      // Estimate risk for each day
      // (In production, use seasonal data, day-of-week patterns, etc.)
      const dayRisk = this.estimateDaySpecificRisk(day);
      windows.push({
        day,
        estimatedRisk: dayRisk,
        riskLabel: this.interpretRiskLevel(dayRisk)
      });
    }

    // Find highest risk day
    const highestRiskDay = windows.reduce((a, b) => (a.estimatedRisk > b.estimatedRisk ? a : b));

    return {
      windows,
      highestRiskDay,
      safePeriod: windows.filter(w => w.estimatedRisk < 0.4).map(w => w.day)
    };
  }

  estimateDaySpecificRisk(daysFromNow) {
    // Placeholder - in production use ML/historical patterns
    // For now: slight degradation trend
    const currentRisk = this.analyzeTrendline();
    return Math.min(1, currentRisk + daysFromNow * 0.05);
  }

  /**
   * EXPORT PREDICTION FOR PROFESSIONAL
   */
  exportPredictionReport() {
    const currentState = this.history[this.history.length - 1];
    const prediction = this.predictDeteriorationRisk(currentState);
 
    return {
      reportDate: new Date().toISOString(),
      reportPeriod: `Last ${this.history.length} days`,
      overallAssessment: prediction.riskLevel.toUpperCase(),
      riskScore: (prediction.overallRiskScore * 100).toFixed(1) + '%',
      keyIndicators: prediction.warnings,
      recommendedInterventions: prediction.interventionsRecommended,
      note: 'This is a predictive tool, not a replacement for professional judgment.'
    };
  }
}

export default PredictiveDeterioration;
