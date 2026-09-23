import { expect, test } from '@playwright/test';

function basePolarisState(overrides: Record<string, unknown> = {}) {
  return {
    isOnboarded: true,
    ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
    safety: { suicide: 0, psychosis: 0, mania: 0 },
    customMantra: 'I am in a state, not a fate.',
    negativeBeliefs: '',
    worstTime: 'morning',
    stillWorks: '',
    mvd: ['Wake on workdays by 7:30am, drink water', 'Brush teeth', 'Stand outside'],
    reasonsLive: '',
    safeContacts: '',
    distractions: '',
    linkedFiles: [],
    todayEnergy: 'medium',
    mantraCompletedToday: false,
    history: [],
    currentHopeLevel: 1,
    hopeProgress: 0,
    dominantPattern: 'Rhythm Collapse',
    phq9History: [],
    currentLayer: 0,
    activeMediaIndex: -1,
    playbackSpeed: 1.0,
    gratitudeJournal: [],
    thoughtCorrections: [],
    customTasks: [],
    securityPin: '',
    isLocked: false,
    userAnchors: [],
    firstUseDate: '2026-08-02',
    tomorrowAnchor: '',
    personalBests: { longestStreak: 0, mostAnchorsInDay: 0, fastestRestart: null },
    polarisUpgrade: true,
    polarisHistory: [],
    polarisRestartLogs: [],
    futureNarrowing: 'action',
    polaris: {
      enabled: true,
      proof: { total: 0, today: 0, ledger: [] },
      resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
      day: { currentState: 'medium', lastCheckInDate: '2026-08-02', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
      anchors: { today: {} },
      quests: { daily: [] },
      profile: {
        companionSkin: '🦊',
        evolvingIntake: {
          enabled: true,
          answers: {},
          lastQuestionDate: null,
          currentQuestionId: 'q21',
          answersEncrypted: false,
          schemaVersion: 4
        }
      },
      questionnaire: {},
      routing: {}
    },
    ...overrides
  };
}

test('Polaris v4 PIN privacy keeps sensitive intake text unreadable in localStorage @critical', async ({ page }) => {
  await page.goto('/');

  await page.evaluate((state) => {
    localStorage.setItem('state_not_fate_state', JSON.stringify(state));
  }, basePolarisState({
    securityPin: '1234',
    polaris: {
      enabled: true,
      proof: { total: 0, today: 0, ledger: [] },
      resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
      day: { currentState: 'medium', lastCheckInDate: '2026-08-02', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
      anchors: { today: {} },
      quests: { daily: [] },
      profile: {
        companionSkin: '🦊',
        evolvingIntake: {
          enabled: true,
          answers: {},
          lastQuestionDate: null,
          currentQuestionId: 'q21_a',
          answersEncrypted: false,
          schemaVersion: 4
        }
      },
      questionnaire: {},
      routing: {}
    }
  }));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Security Locked/i })).toBeVisible();

  // Unlock with PIN
  await page.locator('#screen-lock .keypad-btn[data-val="1"]').click();
  await page.locator('#screen-lock .keypad-btn[data-val="2"]').click();
  await page.locator('#screen-lock .keypad-btn[data-val="3"]').click();
  await page.locator('#screen-lock .keypad-btn[data-val="4"]').click();
  await expect(page.locator('#screen-lock')).toBeHidden({ timeout: 10000 });
  await expect(page.locator('#screen-dashboard')).toBeVisible();

  await page.locator('#screen-dashboard button[data-tab="polaris"]').first().click();
  const qCard = page.locator('#polaris-companion-question');
  await expect(qCard).toBeVisible();
  await expect(page.locator('#companion-question-text')).toHaveText(
    'What situations trigger your emotional numbness most frequently?'
  );

  const secret = 'UNIQUE_POLARIS_SECRET_REFLECTION_ZX9';
  await qCard.locator('#companion-question-text-input').fill(secret);
  await qCard.locator('#btn-submit-companion-text').click();

  const raw = await page.evaluate(() => localStorage.getItem('state_not_fate_state') || '');
  expect(raw).not.toContain(secret);

  const diskMeta = await page.evaluate(() => {
    const parsed = JSON.parse(localStorage.getItem('state_not_fate_state') || '{}');
    const today = Object.keys(parsed.polaris?.profile?.evolvingIntake?.answers || {})[0];
    const ans = parsed.polaris?.profile?.evolvingIntake?.answers?.[today]?.q21_a;
    return {
      answersEncrypted: parsed.polaris?.profile?.evolvingIntake?.answersEncrypted,
      value: ans && typeof ans === 'object' ? ans.value : ans
    };
  });

  expect(diskMeta.answersEncrypted).toBe(true);
  expect(String(diskMeta.value || '')).not.toContain(secret);

  // In-memory state after unlock/save should still be readable via history UI
  await page.click('button[data-tab="polaris"]');
  await expect(page.locator('#polaris-intake-history-list')).toContainText(secret);
});

test('Polaris v4 typed schema renders scale, single-choice, multi-select, and text @advisory', async ({ page }) => {
  await page.goto('/');

  const renderType = async (questionId: string, assert: () => Promise<void>) => {
    await page.evaluate((qid) => {
      const raw = localStorage.getItem('state_not_fate_state');
      const state = raw ? JSON.parse(raw) : {};
      state.polaris.profile.evolvingIntake.currentQuestionId = qid;
      state.polaris.profile.evolvingIntake.lastQuestionDate = null;
      localStorage.setItem('state_not_fate_state', JSON.stringify(state));
    }, questionId);
    await page.goto('/');
    await page.click('button[data-tab="polaris"]');
    await expect(page.locator('#polaris-companion-question')).toBeVisible();
    await assert();
  };

  await page.evaluate((state) => {
    localStorage.setItem('state_not_fate_state', JSON.stringify(state));
  }, basePolarisState());

  await renderType('q21', async () => {
    await expect(page.locator('#companion-question-controls button', { hasText: 'Sometimes' })).toBeVisible();
  });

  await renderType('q_v4_single', async () => {
    await expect(page.locator('#companion-question-controls button', { hasText: 'Floor anchors only' })).toBeVisible();
    await page.locator('#companion-question-controls button', { hasText: 'Floor anchors only' }).click();
  });

  await renderType('q_v4_multi', async () => {
    await expect(page.locator('#btn-submit-companion-multi')).toBeVisible();
    await page.locator('[data-multi-option="water"]').click();
    await page.locator('#btn-submit-companion-multi').click();
  });

  await renderType('q21_a', async () => {
    await expect(page.locator('#companion-question-text-input')).toBeVisible();
    await expect(page.locator('#btn-submit-companion-text')).toBeVisible();
  });

  // Old scalar answers still hydrate
  await page.evaluate(() => {
    const raw = localStorage.getItem('state_not_fate_state');
    const state = raw ? JSON.parse(raw) : {};
    state.polaris.profile.evolvingIntake.answers = {
      '2026-08-01': { q21: 2, q21_a: 'legacy scalar reflection' }
    };
    state.polaris.profile.evolvingIntake.currentQuestionId = 'q22';
    state.polaris.profile.evolvingIntake.lastQuestionDate = '2026-08-02';
    localStorage.setItem('state_not_fate_state', JSON.stringify(state));
  });
  await page.goto('/');
  await page.click('button[data-tab="polaris"]');
  await expect(page.locator('#polaris-intake-history-container')).toBeVisible();
  await expect(page.locator('#polaris-intake-history-list')).toContainText('legacy scalar reflection');
});

test('Polaris v4 typed answers do not override crisis safety routing @critical', async ({ page }) => {
  await page.goto('/');

  await page.evaluate((state) => {
    localStorage.setItem('state_not_fate_state', JSON.stringify(state));
  }, basePolarisState({
    safety: { suicide: 2, psychosis: 0, mania: 0 },
    futureNarrowing: 'none',
    polaris: {
      enabled: true,
      proof: { total: 0, today: 0, ledger: [] },
      resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
      day: { currentState: 'collapse', lastCheckInDate: '2026-08-02', difficulty: 'easy', pacing: 'slow', floorWinsMode: true },
      anchors: { today: {} },
      quests: { daily: [] },
      profile: {
        companionSkin: '🦊',
        evolvingIntake: {
          enabled: true,
          answers: {
            '2026-08-02': {
              q21: {
                schemaVersion: 4,
                questionId: 'q21',
                inputType: 'scale_0_4',
                value: 4,
                labels: ['Almost Always'],
                answeredAt: '2026-08-02T12:00:00.000Z',
                source: 'polaris-evolving-intake',
                sensitive: false
              }
            }
          },
          lastQuestionDate: '2026-08-02',
          currentQuestionId: 'q22',
          answersEncrypted: false,
          schemaVersion: 4
        }
      },
      questionnaire: {},
      routing: {}
    }
  }));

  await page.goto('/');
  await page.click('button[data-tab="safebox"]');
  await expect(page.locator('#crisis-modal')).toHaveClass(/active/);
});
