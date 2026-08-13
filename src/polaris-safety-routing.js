/**
 * POLARIS DYNAMIC SAFETY ROUTER
 *
 * Purpose: decide WHEN Polaris should ask direct suicide/safety questions.
 * This is a support-routing signal model, not a suicide prediction model.
 *
 * Core rule:
 * - ordinary depression/collapse signals -> support first, no automatic suicide interrogation
 * - stacked/rapid deterioration -> general safety check or direct inquiry when warranted
 * - explicit danger -> bypass the gentle layer and ask directly / activate crisis flow
 */

export class PolarisSafetyRouter {
  constructor(state = {}) {
    this.state = state;
  }

  clamp(n, min = 0, max = 10) {
    return Math.max(min, Math.min(max, Number(n) || 0));
  }

  highBurden(value) {
    // Polaris function-burden ratings are 0-4: 3=serious, 4=severe/disabling.
    return Number(value) >= 3;
  }

  recentJournalEntry(state = this.state) {
    const entries = Array.isArray(state.safetyJournal) ? state.safetyJournal : [];
    if (!entries.length) return null;
    const last = entries[entries.length - 1];
    if (!last?.timestamp) return last;
    const age = Date.now() - new Date(last.timestamp).getTime();
    return age <= 48 * 60 * 60 * 1000 ? last : null;
  }

  detectDirectDangerSignals(state = this.state) {
    const direct = [];
    const safety = state.safety || {};
    const journal = this.recentJournalEntry(state) || {};
    const feed = Array.isArray(state.safetySignalFeed) ? state.safetySignalFeed : [];
    const recentFeed = feed.filter(item => {
      if (!item?.timestamp) return true;
      return Date.now() - new Date(item.timestamp).getTime() <= 48 * 60 * 60 * 1000;
    });

    if (Number(safety.suicide) >= 2) direct.push('existing-high-suicide-safety-flag');
    if (state.currentlyUnsafe === true || state.canStaySafe === false) direct.push('cannot-stay-safe');
    if (state.currentSuicidalIntent === true) direct.push('current-intent');
    if (state.preparatoryBehavior === true) direct.push('preparatory-behavior');
    if (state.recentSuicideAttempt === true) direct.push('recent-attempt');
    if (journal.currentlyUnsafe === true || journal.canStaySafe === false) direct.push('journal-unsafe');
    if (journal.suicidalIntent === true || journal.preparatoryBehavior === true) direct.push('journal-direct-risk');

    for (const item of recentFeed) {
      if (['explicit-suicidal-intent', 'cannot-stay-safe', 'preparatory-behavior', 'recent-attempt', 'current-suicidal-thought'].includes(item?.type)) {
        direct.push(`signal-feed:${item.type}`);
      }
    }

    return [...new Set(direct)];
  }

  scoreStateDeterioration(state = this.state) {
    let score = 0;
    const domains = [];
    const reasons = [];
    const history = Array.isArray(state.history) ? state.history : [];
    const ratings = state.ratings || {};
    const journal = this.recentJournalEntry(state);

    const todayCompleted = history[0]?.completed?.length || 0;
    const priorActiveDays = history.slice(1, 7).filter(d => (d.completed?.length || 0) > 0).length;
    const zeroDays = history.slice(0, 7).filter(d => (d.completed?.length || 0) === 0).length;

    if (state.todayEnergy === 'collapse') {
      score += 1.5; domains.push('function'); reasons.push('collapse-level energy/function');
    }
    if (todayCompleted === 0 && priorActiveDays >= 3) {
      score += 1.5; domains.push('function'); reasons.push('abrupt anchor abandonment');
    } else if (zeroDays >= 5) {
      score += 1; domains.push('function'); reasons.push('multi-day loss of routine');
    }

    if (this.highBurden(ratings.social) || state.socialIsolation === 'severe') {
      score += 1; domains.push('connection'); reasons.push('marked isolation');
    }
    if (this.highBurden(ratings.meaning) && Number(state.currentHopeLevel) <= 1) {
      score += 1.5; domains.push('future'); reasons.push('low hope plus meaning/future collapse');
    }
    if (this.highBurden(ratings.sleep) || state.sleepCrisis === true) {
      score += 1; domains.push('sleep'); reasons.push('major sleep/circadian disruption');
    }
    if (this.highBurden(ratings.shame) || state.entrapment === 'high') {
      score += 0.75; domains.push('cognition'); reasons.push('shame/entrapment load');
    }
    if (state.agitation === 'severe' || state.panic === 'severe') {
      score += 1.25; domains.push('activation'); reasons.push('severe agitation/panic');
    }
    if (state.substanceSafetyConcern === true || state.severeIntoxication === true || state.acuteWithdrawal === true) {
      score += 1.5; domains.push('substance'); reasons.push('substance-related disinhibition/safety concern');
    }
    if (state.recentMajorLoss === true || state.housingCrisis === true || state.legalCrisis === true || state.financialCrisis === true) {
      score += 1; domains.push('stress'); reasons.push('acute major stressor');
    }
    if (state.recentCareTransition === true || state.recentPsychDischarge === true) {
      score += 1.5; domains.push('transition'); reasons.push('high-risk care transition');
    }
    if (journal && Number(journal.distressLevel) >= 8) {
      score += 1.5; domains.push('distress'); reasons.push('recent severe distress entry');
    }
    if (state.psychosisUnsafe === true || state.maniaUnsafe === true) {
      score += 2; domains.push('reality-control'); reasons.push('loss of safe self-management capacity');
    }

    return {
      score: Math.round(this.clamp(score) * 10) / 10,
      maxScore: 10,
      domains: [...new Set(domains)],
      reasons: [...new Set(reasons)]
    };
  }

  decideInquiry(state = this.state) {
    const directSignals = this.detectDirectDangerSignals(state);
    const deterioration = this.scoreStateDeterioration(state);

    if (directSignals.length) {
      return {
        action: 'direct-safety-inquiry',
        urgency: 'immediate',
        askDirect: true,
        askGeneralSafety: true,
        bypassRoutineFlow: true,
        directSignals,
        deterioration,
        rationale: 'Direct danger evidence overrides routine gating.'
      };
    }

    // A concerning stack opens inquiry; one bad depression variable does not.
    if (deterioration.score >= 6 && deterioration.domains.length >= 3) {
      return {
        action: 'direct-safety-inquiry',
        urgency: 'prompt',
        askDirect: true,
        askGeneralSafety: true,
        bypassRoutineFlow: false,
        directSignals: [],
        deterioration,
        rationale: 'Strong multi-domain deterioration warrants direct clarification.'
      };
    }

    if (deterioration.score >= 4 && deterioration.domains.length >= 2) {
      return {
        action: 'general-safety-check',
        urgency: 'prompt',
        askDirect: false,
        askGeneralSafety: true,
        bypassRoutineFlow: false,
        directSignals: [],
        deterioration,
        rationale: 'Deterioration is meaningful, but direct suicide inquiry is not yet automatically indicated.'
      };
    }

    if (deterioration.score >= 2) {
      return {
        action: 'tighten-support',
        urgency: 'routine',
        askDirect: false,
        askGeneralSafety: false,
        bypassRoutineFlow: false,
        directSignals: [],
        deterioration,
        rationale: 'Respond to state deterioration without converting it into a suicide screen.'
      };
    }

    return {
      action: 'normal',
      urgency: 'routine',
      askDirect: false,
      askGeneralSafety: false,
      bypassRoutineFlow: false,
      directSignals: [],
      deterioration,
      rationale: 'No meaningful current safety signal stack.'
    };
  }

  recordDirectSafetySignal(type, source = 'polaris', metadata = {}) {
    this.state.safetySignalFeed = Array.isArray(this.state.safetySignalFeed) ? this.state.safetySignalFeed : [];
    const item = { type, source, metadata, timestamp: new Date().toISOString() };
    this.state.safetySignalFeed.push(item);
    this.state.safetySignalFeed = this.state.safetySignalFeed.slice(-50);
    return item;
  }
}

export default PolarisSafetyRouter;
