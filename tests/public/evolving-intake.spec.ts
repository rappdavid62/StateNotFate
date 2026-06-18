import { expect, test } from '@playwright/test';

test('Evolving intake questionnaire flows through reflection questions and clears daily limits correctly', async ({ page }) => {
  await page.goto('/');
  
  // Set localStorage state with intake enabled at q21
  await page.evaluate(() => {
    localStorage.setItem('state_not_fate_state', JSON.stringify({
      isOnboarded: true,
      ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
      safety: { suicide: 0, psychosis: 0, mania: 0 },
      customMantra: "I am in a state, not a fate.",
      negativeBeliefs: "",
      worstTime: "morning",
      stillWorks: "",
      mvd: ["Wake on workdays by 7:30am, drink water", "Brush teeth", "Stand outside"],
      reasonsLive: "",
      safeContacts: "",
      distractions: "",
      linkedFiles: [],
      todayEnergy: "medium",
      mantraCompletedToday: false,
      history: [],
      currentHopeLevel: 1,
      hopeProgress: 0,
      dominantPattern: "Rhythm Collapse",
      phq9History: [],
      currentLayer: 0,
      activeMediaIndex: -1,
      playbackSpeed: 1.0,
      gratitudeJournal: [],
      thoughtCorrections: [],
      customTasks: [],
      securityPin: "",
      isLocked: false,
      userAnchors: [],
      firstUseDate: '2026-06-16',
      tomorrowAnchor: '',
      personalBests: { longestStreak: 0, mostAnchorsInDay: 0, fastestRestart: null },
      polarisUpgrade: true,
      polarisHistory: [],
      polarisRestartLogs: [],
      polaris: {
        enabled: true,
        proof: { total: 0, today: 0, ledger: [] },
        resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
        day: { currentState: 'medium', lastCheckInDate: '2026-06-16', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
        anchors: { today: {} },
        quests: { daily: [] },
        profile: {
          companionSkin: '🦊',
          evolvingIntake: {
            enabled: true,
            answers: {},
            lastQuestionDate: null,
            currentQuestionId: 'q21'
          }
        },
        questionnaire: {},
        routing: {}
      }
    }));
  });

  await page.goto('/');
  
  // Navigate to Polaris tab
  await page.click('button[data-tab="polaris"]');

  // Verify q21 is visible
  const qCard = page.locator('#polaris-companion-question');
  const qText = page.locator('#companion-question-text');
  await expect(qCard).toBeVisible();
  await expect(qText).toHaveText('I feel emotionally numb more than simply tired.');

  // Answer q21 with Sometimes (2), which transitions to q21_a
  // Find the button directly by text content
  const sometimesBtn = qCard.locator('button', { hasText: 'Sometimes' });
  await sometimesBtn.click();

  // The card should stay visible and transition directly to the reflection q21_a
  await expect(qCard).toBeVisible();
  await expect(qText).toHaveText('What situations trigger your emotional numbness most frequently?');

  // Fill in the reflection and save
  const textarea = qCard.locator('#companion-question-text-input');
  await textarea.fill('Stressful mornings and social pressure');
  const saveBtn = qCard.locator('#btn-submit-companion-text');
  await saveBtn.click();

  // After saving a reflection, it transitions to q22 (core question) and should now hide
  await expect(qCard).toBeHidden();

  // The "Ask Another Question" container should now be visible
  const askAnotherContainer = page.locator('#polaris-answer-another-container');
  const askAnotherBtn = askAnotherContainer.locator('button:has-text("Ask Another Question")');
  await expect(askAnotherBtn).toBeVisible();

  // Click "Ask Another Question" to unlock q22 immediately
  await askAnotherBtn.click();

  // Card should show again with q22
  await expect(qCard).toBeVisible();
  await expect(qText).toHaveText('I feel grief-like heaviness without clear relief.');
});
