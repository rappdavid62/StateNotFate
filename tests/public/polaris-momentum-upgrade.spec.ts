import { expect, test } from '@playwright/test';

test('Polaris 2.0 system activation and momentum tab work', async ({ page }) => {
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
      reasonsLive: "",
      safeContacts: "",
      distractions: "",
      linkedFiles: [],
      todayEnergy: "medium",
      mantraCompletedToday: false,
      history: [
        { date: "2026-06-08", energy: "low", completed: ["Anchor 1"], floorCompleted: true },
        { date: "2026-06-07", energy: "collapse", completed: [], floorCompleted: false, missed: true },
        { date: "2026-06-06", energy: "medium", completed: ["Anchor 1", "Anchor 2"], floorCompleted: true }
      ],
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

  // Click Dashboard tab to view upgrade banner
  await page.click('button[data-tab="dashboard"]');

  // Verify we are on the dashboard and the activation banner is visible
  const banner = page.locator('#polaris-activation-banner');
  await expect(banner).toBeVisible();

  // Click the activation button
  const activateBtn = page.locator('button:has-text("Activate Polaris")');
  await activateBtn.click();

  // Banner should now be hidden
  await expect(banner).toBeHidden();

  // Switch to momentum tab (done automatically on activate, but let's make sure it's active)
  const momentumTab = page.locator('#tab-momentum');
  await expect(momentumTab).toBeVisible();

  // Check Living System State matches
  await expect(page.locator('#audit-dominant-pattern')).toHaveText('Rhythm Collapse');
  await expect(page.locator('#audit-hope-level')).toContainText('Level 1');
  
  // Verify simulator updates on slider input
  const slider = page.locator('#input-sim-rate');
  await slider.fill('50'); // sets consistency rate to 50%
  // Trigger input event manually since Playwright fill might not fire it for input[type=range]
  await page.evaluate(() => {
    const s = document.getElementById('input-sim-rate') as HTMLInputElement;
    if (s) {
      s.value = '50';
      s.dispatchEvent(new Event('input'));
    }
  });

  await expect(page.locator('#sim-slider-pct')).toHaveText('50%');

  // Verify copy anonymized audit
  const copyBtn = page.locator('button:has-text("Copy Anonymized Audit")');
  await expect(copyBtn).toBeVisible();
});
