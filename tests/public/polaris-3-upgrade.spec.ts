import { expect, test } from '@playwright/test';

function dateOffset(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function eightDayHistory() {
  const energies = ['medium', 'low', 'medium', 'collapse', 'low', 'medium', 'medium', 'high'];
  return energies.map((energy, index) => ({
    date: dateOffset(energies.length - 1 - index),
    energy,
    completed: energy === 'collapse' ? [] : ['Water', 'Food'],
    floorCompleted: energy !== 'collapse',
    mvdCompleted: energy !== 'collapse',
    missed: energy === 'collapse'
  }));
}

function baseState(overrides: Record<string, any> = {}) {
  const base = {
    isOnboarded: true,
    ratings: {
      sleep: 2, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2
    },
    safety: { suicide: 0, psychosis: 0, mania: 0 },
    customMantra: 'I am in a state, not a fate.',
    negativeBeliefs: '',
    worstTime: 'morning',
    stillWorks: '',
    mvd: ['Water', 'Food', 'Light'],
    reasonsLive: 'Family, projects, future possibilities.',
    safeContacts: 'Safe person',
    distractions: 'Walking, familiar audio.',
    linkedFiles: [],
    todayEnergy: 'medium',
    mantraCompletedToday: false,
    history: [],
    currentHopeLevel: 2,
    hopeProgress: 0,
    dominantPattern: 'Rhythm Collapse',
    phq9History: [],
    currentLayer: 0,
    activeMediaIndex: -1,
    playbackSpeed: 1,
    gratitudeJournal: [],
    thoughtCorrections: [],
    customTasks: [],
    securityPin: '',
    isLocked: false,
    userAnchors: [{ id: 'user-water', text: 'Water' }],
    firstUseDate: '',
    tomorrowAnchor: '',
    personalBests: { longestStreak: 0, mostAnchorsInDay: 0, fastestRestart: null },
    polarisUpgrade: false,
    polarisHistory: [],
    polarisRestartLogs: [],
    polaris3: { anchorMetrics: {}, learningHistory: [] },
    safetyJournal: [],
    polaris: {
      enabled: false,
      proof: { total: 0, today: 0, ledger: [] },
      resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
      day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
      anchors: { today: {} },
      quests: { daily: [] },
      profile: {},
      questionnaire: {},
      routing: {}
    }
  };

  return {
    ...base,
    ...overrides,
    ratings: { ...base.ratings, ...(overrides.ratings || {}) },
    polaris: { ...base.polaris, ...(overrides.polaris || {}) }
  };
}

async function seed(page, state: any) {
  await page.goto('/');
  await page.evaluate((value) => {
    localStorage.setItem('state_not_fate_state', JSON.stringify(value));
  }, state);
  await page.goto('/');
}

test('Polaris 3.0 cards stay hidden until 2.0 upgrade @advisory', async ({ page }) => {
  await seed(page, baseState({ polarisUpgrade: false, history: eightDayHistory() }));
  await page.click('button[data-tab="momentum"]');
  await expect(page.locator('#tab-momentum')).toBeVisible();
  await expect(page.locator('#polaris-3-panel')).toBeHidden();
});

test('Polaris 3.0 cards render on Momentum after upgrade with history @advisory', async ({ page }) => {
  await seed(page, baseState({ polarisUpgrade: true, history: eightDayHistory() }));
  await page.click('button[data-tab="momentum"]');
  const panel = page.locator('#polaris-3-panel');
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'Next suggested anchor' })).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'Floor pressure' })).toBeVisible();
  await expect(panel.getByRole('heading', { name: '30-day resilience snapshot' })).toBeVisible();
  await expect(panel.locator('#polaris3-next-anchor')).not.toHaveText('Need a few more logged days.');
  await expect(panel.locator('#polaris3-floor-label')).not.toHaveText('need more days');
  await expect(panel.locator('#polaris3-disclaimer')).toContainText('Not a clinical instrument');
});

test('Polaris 3.0 Momentum copy is not a suicide prediction @critical', async ({ page }) => {
  await seed(page, baseState({ polarisUpgrade: true, history: eightDayHistory() }));
  await page.click('button[data-tab="momentum"]');
  const momentum = page.locator('#tab-momentum');
  await expect(momentum.locator('#polaris-3-panel')).toBeVisible();
  await expect(momentum).not.toContainText(/suicide risk/i);
  await expect(momentum).not.toContainText(/predicts suicide/i);
});
