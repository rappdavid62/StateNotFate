/**
 * Polaris 3.0 live-state adapter
 *
 * Maps the static PWA's 0-4 burden ratings and history.energy rows into the
 * shape the unused 3.0 modules expect. Also sanitizes user-facing copy so
 * deterioration scores never read as suicide prediction.
 */

const ENERGY_TO_MOOD = { collapse: 1, low: 2, medium: 3, high: 4 };
const FORBIDDEN_COPY = /suicide|predicts suicide|suicide risk|actuarial|fatality/i;
const MIN_HISTORY_DAYS = 7;

function todayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function hourBucket() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function safeText(value, fallback = '') {
  const text = String(value || '').trim();
  if (!text || FORBIDDEN_COPY.test(text)) return fallback;
  return text;
}

export function ensurePolaris3State(state) {
  if (!state.polaris3 || typeof state.polaris3 !== 'object') {
    state.polaris3 = { anchorMetrics: {}, learningHistory: [] };
  }
  if (!state.polaris3.anchorMetrics || typeof state.polaris3.anchorMetrics !== 'object') {
    state.polaris3.anchorMetrics = {};
  }
  if (!Array.isArray(state.polaris3.learningHistory)) {
    state.polaris3.learningHistory = [];
  }
  return state.polaris3;
}

export function liveAnchors(state) {
  const fromUser = (state.userAnchors || []).map((anchor, index) => ({
    id: anchor.id || `user-${index}`,
    text: anchor.text || String(anchor.label || anchor || '')
  })).filter(anchor => anchor.text);

  const seen = new Set(fromUser.map(anchor => anchor.text));
  const fromMvd = (state.mvd || []).map((text, index) => ({
    id: `mvd-${index}`,
    text
  })).filter(anchor => anchor.text && !seen.has(anchor.text));

  return fromUser.concat(fromMvd);
}

export function adaptHistory(state) {
  const anchors = liveAnchors(state);
  const fallbackRatings = state.ratings || {};

  return (state.history || []).map((row) => {
    const energy = row.energy || row.todayEnergy || state.todayEnergy || 'medium';
    const rowRatings = row.ratings || fallbackRatings;
    return {
      date: row.date,
      energy,
      todayEnergy: energy,
      completed: Array.isArray(row.completed) ? row.completed : [],
      floorCompleted: Boolean(row.floorCompleted),
      mvdCompleted: Boolean(row.mvdCompleted),
      missed: Boolean(row.missed),
      userAnchors: anchors,
      currentHopeLevel: row.currentHopeLevel || state.currentHopeLevel || 1,
      ratings: {
        sleep: Number(rowRatings.sleep) || 0,
        energy: Number(rowRatings.energy) || 0,
        shame: Number(rowRatings.shame) || 0,
        hygiene: Number(rowRatings.hygiene) || 0,
        eating: Number(rowRatings.eating) || 0,
        social: (Number(rowRatings.social) || 0) * 10,
        meaning: (Number(rowRatings.meaning) || 0) * 10,
        mood: ENERGY_TO_MOOD[energy] || 3
      }
    };
  });
}

export function adaptCurrentState(state) {
  const today = todayString();
  const todayLog = (state.history || []).find(row => row.date === today);
  const energy = state.todayEnergy || todayLog?.energy || 'medium';
  return {
    ...state,
    todayEnergy: energy,
    userAnchors: liveAnchors(state),
    completed: todayLog?.completed || [],
    timeSinceLastAnchor: 0
  };
}

export function restorePolaris3Learning(engine, state) {
  if (!engine) return;
  const stored = ensurePolaris3State(state);
  engine.userState = adaptCurrentState(state);
  engine.anchorMetrics = stored.anchorMetrics;
  engine.learningHistory = stored.learningHistory;
}

export function persistPolaris3Learning(engine, state) {
  if (!engine) return;
  const stored = ensurePolaris3State(state);
  stored.anchorMetrics = engine.anchorMetrics || {};
  stored.learningHistory = Array.isArray(engine.learningHistory)
    ? engine.learningHistory.slice(-200)
    : [];
}

export function recordLiveAnchorOutcome(engine, state, label, completed) {
  if (!engine || !label) return;
  restorePolaris3Learning(engine, state);

  const anchors = liveAnchors(state);
  const match = anchors.find(anchor => anchor.text === label);
  const anchorId = match ? match.id : `task-${label.slice(0, 40)}`;
  const energy = state.todayEnergy || 'medium';
  const energyValue = ENERGY_TO_MOOD[energy] || 3;

  engine.trackAnchorPerformance(anchorId, {
    energyLevel: energy,
    timeOfDay: hourBucket()
  });
  engine.recordAnchorOutcome(anchorId, {
    completed: Boolean(completed),
    effort: energy === 'collapse' ? 3 : energy === 'low' ? 4 : 5,
    moodBefore: energyValue,
    moodAfter: completed ? Math.min(4, energyValue + 1) : energyValue,
    energyBefore: energyValue,
    energyAfter: completed ? Math.min(4, energyValue + 1) : energyValue,
    context: { energyLevel: energy, timeOfDay: hourBucket() }
  });

  persistPolaris3Learning(engine, state);
}

function supportLabel(rawLevel) {
  const map = {
    low: 'steady floor',
    moderate: 'watch the floor',
    elevated: 'early support signal',
    high: 'needs more floor',
    critical: 'needs more floor',
    'insufficient-data': 'need more days'
  };
  return map[rawLevel] || 'watch the floor';
}

function resilienceLabel(rawLevel) {
  const map = {
    high: 'solid',
    good: 'steady',
    moderate: 'mixed',
    fragile: 'thin floor',
    critical: 'thin floor'
  };
  return map[rawLevel] || 'mixed';
}

function sanitizeWarning(warning) {
  if (!warning) return null;
  const byType = {
    'anchor-slip': {
      message: 'Anchors have been slipping.',
      suggestion: 'Pick one tiny anchor and do it today.'
    },
    'downward-trend': {
      message: 'Energy has been trending downward.',
      suggestion: 'Keep the floor small and get support today.'
    },
    'hope-loss': {
      message: 'Hope has been thinner lately.',
      suggestion: 'Review what still works. Reach one safe person if you can.'
    },
    instability: {
      message: 'Big swings plus missed anchors.',
      suggestion: 'Increase floor contact. One action is enough.'
    },
    'sleep-energy-loop': {
      message: 'Sleep and energy are feeding each other.',
      suggestion: 'Prioritize one sleep anchor first.'
    }
  };
  const mapped = byType[warning.type] || {
    message: safeText(warning.message),
    suggestion: safeText(warning.suggestion)
  };
  if (!mapped.message) return null;
  return mapped;
}

function fallbackAnchor(state) {
  const anchors = liveAnchors(state);
  if (!anchors.length) return null;
  return {
    recommendedAnchor: anchors[0],
    reasoning: 'Start with the floor. One small action is enough.',
    strategy: 'easiest-win'
  };
}

export function buildPolaris3View(engines, state) {
  const history = adaptHistory(state);
  const current = adaptCurrentState(state);
  if (engines?.personalization) restorePolaris3Learning(engines.personalization, state);
  const hasEnoughHistory = history.length >= MIN_HISTORY_DAYS;
  const needMoreDays = 'Need a few more logged days.';

  const view = {
    hasEnoughHistory,
    personalization: {
      title: needMoreDays,
      reason: 'Complete one floor action to teach Polaris what works for you.',
      strategy: ''
    },
    deterioration: {
      label: 'need more days',
      notes: [needMoreDays]
    },
    analytics: {
      score: '—',
      level: 'need more days',
      trend: 'waiting',
      bars: [],
      disclaimer: 'Personal reflection from your local logs. Not a clinical instrument.'
    }
  };

  try {
    const recommendation = engines?.personalization
      ? engines.personalization.recommendNextAnchor(current, current.completed)
      : fallbackAnchor(state);
    const recommended = recommendation?.recommendedAnchor || fallbackAnchor(state)?.recommendedAnchor;
    if (recommended) {
      const learned = (engines?.personalization?.learningHistory || []).length >= 3;
      view.personalization = {
        title: recommended.text || 'One small floor action',
        reason: learned
          ? safeText(recommendation?.reasoning, 'Start with the floor. One small action is enough.')
          : 'Start with the floor. One small action is enough.',
        strategy: recommendation?.strategy === 'easiest-win' ? 'Keep it tiny.' : ''
      };
    }
  } catch (err) {
    console.error('Polaris 3.0 personalization failed:', err);
  }

  if (!hasEnoughHistory) return view;

  try {
    if (engines?.deterioration) {
      engines.deterioration.history = history;
      const prediction = engines.deterioration.predictDeteriorationRisk(current, 7);
      if (prediction.risk !== 'insufficient-data') {
        const notes = (prediction.warnings || [])
          .map(sanitizeWarning)
          .filter(Boolean)
          .slice(0, 3)
          .map(item => item.suggestion ? `${item.message} ${item.suggestion}` : item.message);
        if (!notes.length) {
          notes.push('Keep the floor small. Scores here only guide support intensity.');
        }
        view.deterioration = {
          label: supportLabel(prediction.riskLevel),
          notes
        };
      }
    }
  } catch (err) {
    console.error('Polaris 3.0 floor-pressure view failed:', err);
  }

  try {
    if (engines?.analytics) {
      engines.analytics.history = history;
      const dashboard = engines.analytics.generateDashboard(current, 30);
      const energyTrend = dashboard.charts?.energyTrend?.data || [];
      view.analytics = {
        score: dashboard.metrics?.resilience?.score || '—',
        level: resilienceLabel(dashboard.metrics?.resilience?.level),
        trend: dashboard.metrics?.trends?.direction === 'declining'
          ? 'softer lately'
          : dashboard.metrics?.trends?.direction === 'improving'
            ? 'steadier lately'
            : 'holding',
        bars: energyTrend.slice(-10).map(point => ({
          value: Number(point.value) || 2,
          label: point.label || ''
        })),
        disclaimer: 'Personal reflection from your local logs. Not a clinical instrument.'
      };
    }
  } catch (err) {
    console.error('Polaris 3.0 analytics view failed:', err);
  }

  return view;
}

export default {
  ensurePolaris3State,
  liveAnchors,
  adaptHistory,
  adaptCurrentState,
  restorePolaris3Learning,
  persistPolaris3Learning,
  recordLiveAnchorOutcome,
  buildPolaris3View
};
