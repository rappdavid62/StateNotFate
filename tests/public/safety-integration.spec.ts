import { expect, test } from '@playwright/test';

function baseState(overrides: Record<string, any> = {}) {
  const base = {
    isOnboarded: true,
    ratings: { sleep: 0, morning: 0, initiation: 0, clutter: 0, energy: 0, shame: 0, hygiene: 0, eating: 0, social: 0, meaning: 0 },
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
    userAnchors: [],
    firstUseDate: '',
    tomorrowAnchor: '',
    personalBests: { longestStreak: 0, mostAnchorsInDay: 0, fastestRestart: null },
    polarisUpgrade: false,
    polarisHistory: [],
    polarisRestartLogs: [],
    safetyJournal: [],
    polaris: {
      enabled: false,
      proof: { total: 0, today: 0, ledger: [] },
      resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
      day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
      anchors: { today: {} },
      quests: { daily: [] },
      profile: {}, questionnaire: {}, routing: {}
    }
  };

  return {
    ...base,
    ...overrides,
    ratings: { ...base.ratings, ...(overrides.ratings || {}) },
    safety: { ...base.safety, ...(overrides.safety || {}) }
  };
}

async function seed(page, state: any) {
  await page.goto('/');
  await page.evaluate((value) => {
    localStorage.setItem('state_not_fate_state', JSON.stringify(value));
  }, state);
  await page.goto('/');
}

test('stable bad-day flow does not force a suicide question @critical', async ({ page }) => {
  await seed(page, baseState({ currentHopeLevel: 1 }));
  await page.click('button[data-energy="medium"]');
  await page.waitForTimeout(100);
  await expect(page.locator('#safety-checkin-card')).toBeHidden();
});

test('meaningful deterioration asks general safety without forcing ideation question', async ({ page }) => {
  await seed(page, baseState({
    currentHopeLevel: 0,
    ratings: { sleep: 4, social: 4, meaning: 4, shame: 4 }
  }));
  await page.click('button[data-energy="medium"]');
  await page.waitForTimeout(100);

  const card = page.locator('#safety-checkin-card');
  await expect(card).toBeVisible();
  await expect(card.locator('#ideation-scale').locator('..')).toBeHidden();
  await expect(card.getByText('Do you feel safe right now?')).toBeVisible();
});

test('strong stacked deterioration earns a direct suicide safety inquiry', async ({ page }) => {
  const history = [
    { completed: [] },
    { completed: ['a'] }, { completed: ['a'] }, { completed: ['a'] }, { completed: ['a'] }
  ];
  await seed(page, baseState({
    currentHopeLevel: 0,
    history,
    ratings: { sleep: 4, social: 4, meaning: 4, shame: 4 }
  }));
  await page.click('button[data-energy="collapse"]');
  await page.waitForTimeout(100);

  const card = page.locator('#safety-checkin-card');
  await expect(card).toBeVisible();
  await expect(card.locator('#ideation-scale')).toBeVisible();
});

test('obvious current danger bypasses routine gating and opens crisis response @critical', async ({ page }) => {
  await seed(page, baseState({ safety: { suicide: 2 } }));
  await page.click('button[data-energy="medium"]');
  await page.waitForTimeout(100);
  await expect(page.locator('#crisis-modal')).toHaveClass(/active/);
});

test('unsafe answer still triggers crisis modal when safety inquiry is shown @critical', async ({ page }) => {
  await seed(page, baseState({
    currentHopeLevel: 0,
    ratings: { sleep: 4, social: 4, meaning: 4, shame: 4 }
  }));
  await page.click('button[data-energy="medium"]');
  await page.waitForTimeout(100);

  const safetyCard = page.locator('#safety-checkin-card');
  await expect(safetyCard).toBeVisible();
  await page.click('button[data-safety="no"]');
  await page.click('#submit-safety-check');
  await expect(page.locator('#crisis-modal')).toHaveClass(/active/);
});
