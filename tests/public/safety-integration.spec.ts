import { expect, test } from '@playwright/test';

test('Polaris safety check-in card appears and triggers crisis modal on unsafe response', async ({ page }) => {
  await page.goto('/');
  
  // Set localStorage state to bypass onboarding
  await page.evaluate(() => {
    localStorage.setItem('state_not_fate_state', JSON.stringify({
      isOnboarded: true,
      ratings: {
        sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2
      },
      safety: { suicide: 0, psychosis: 0, mania: 0 },
      customMantra: "I am in a state, not a fate.",
      negativeBeliefs: "",
      worstTime: "morning",
      stillWorks: "",
      mvd: [
        "Wake on workdays by 7:30am, drink water, take morning medication.",
        "Brush teeth, eat a simple protein block before energy crash.",
        "Stand outside for 2 minutes in daylight, keep tomorrow's clothes pre-positioned."
      ],
      reasonsLive: "Family, projects, future possibilities.",
      safeContacts: "David (555-0192)",
      distractions: "Walking, listening to audio, box breathing.",
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
      firstUseDate: '',
      tomorrowAnchor: '',
      personalBests: { longestStreak: 0, mostAnchorsInDay: 0, fastestRestart: null },
      polarisUpgrade: false,
      polarisHistory: [],
      polarisRestartLogs: [],
      polaris: {
        enabled: false,
        proof: { total: 0, today: 0, ledger: [] },
        resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
        day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
        anchors: {
          today: {}
        },
        quests: { daily: [] },
        profile: {},
        questionnaire: {},
        routing: {}
      }
    }));
  });

  // Reload page to apply state
  await page.goto('/');

  // On page load, click an energy button (e.g., Medium) to start check-in
  await page.click('button[data-energy="medium"]');

  // Verify the safety check-in card is now visible
  const safetyCard = page.locator('#safety-checkin-card');
  await expect(safetyCard).toBeVisible();

  // Choose the unsafe response "No, I don't feel safe"
  await page.click('button[data-safety="no"]');

  // Click submit check-in
  await page.click('#submit-safety-check');

  // Safety check-in card should be hidden
  await expect(safetyCard).toBeHidden();

  // The high safety alert crisis modal should be active/visible
  const crisisModal = page.locator('#crisis-modal');
  await expect(crisisModal).toHaveClass(/active/);
});
