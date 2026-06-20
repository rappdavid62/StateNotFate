import { expect, test } from '@playwright/test';

test('Recovery Engine Controllers work correctly @advisory', async ({ page }) => {
  await page.goto('/');
  
  // Set localStorage state to bypass onboarding and activate Polaris
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
        { date: "2026-06-08", energy: "low", completed: ["Anchor 1"], floorCompleted: true }
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
      polarisUpgrade: true,
      polarisHistory: [],
      polarisRestartLogs: [],
      polaris: {
        enabled: true,
        proof: { total: 0, today: 0, ledger: [] },
        resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
        day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
        anchors: {
          today: {}
        },
        quests: { daily: [] },
        profile: {},
        questionnaire: {},
        routing: {},
        futureNarrowingActive: false,
        possibilityCollapseInterventions: 0,
        startupDragHistory: [],
        ruminationStopLossCount: 0
      }
    }));
  });

  // Reload page to apply state
  await page.goto('/');

  // Navigate to Polaris tab
  await page.click('button[data-tab="polaris"]');

  // Verify Future Narrowing toggle works
  const narrowingBtn = page.locator('#btn-toggle-future-narrowing');
  await expect(narrowingBtn).toBeVisible();
  await narrowingBtn.click();
  
  // Verify narrowing banner is visible
  const banner = page.locator('#future-narrowing-banner');
  await expect(banner).toBeVisible();
  
  // Verify long-term tabs are hidden
  const progressionBtn = page.locator('button[data-tab="progression"]');
  await expect(progressionBtn).toBeHidden();
  
  // Disable Future Narrowing again
  await narrowingBtn.click();
  await expect(banner).toBeHidden();
  await expect(progressionBtn).toBeVisible();

  // Test Possibility Collapse Modal
  const collapseBtn = page.locator('button:has-text("Decompress Paths")');
  await collapseBtn.click();
  const collapseModal = page.locator('#possibility-collapse-modal');
  await expect(collapseModal).toBeVisible();

  // Select Lane 1
  await page.click('text=Lane 1: Rhythm Lock');
  await expect(collapseModal).toBeHidden();

  // Test Startup Drag Modal
  const startupBtn = page.locator('button:has-text("Launch 10s Timer")');
  await startupBtn.click();
  const startupModal = page.locator('#startup-drag-modal');
  await expect(startupModal).toBeVisible();

  // Fill in blocked task and first step
  await page.fill('#input-startup-task', 'Fold laundry');
  await page.fill('#input-startup-step', 'Pick up one shirt');
  
  // Start countdown
  await page.click('button:has-text("Initiate 10-Second Countdown")');
  const timerContainer = page.locator('#startup-drag-timer-container');
  await expect(timerContainer).toBeVisible();
  
  // Force completion of 10s step
  await page.evaluate(() => {
    (window as any).verifyStartupDrag(true);
  });
  await expect(startupModal).toBeHidden();

  // Test Rumination Stop-Loss Modal
  const stopLossBtn = page.locator('button:has-text("Activate Stop-Loss")');
  await stopLossBtn.click();
  const stopLossModal = page.locator('#rumination-stop-loss-modal');
  await expect(stopLossModal).toBeVisible();

  // Click object touched
  await page.click('button:has-text("Object Touched")');
  // Click mantra spoken
  await page.click('button:has-text("Mantra Spoken Aloud")');
  // Click grounding sequence complete
  await page.click('button:has-text("Grounding Sequence Complete")');
  await expect(stopLossModal).toBeHidden();

  // Go to Momentum & Audit page and check metrics
  await page.click('button[data-tab="momentum"]');
  await expect(page.locator('#audit-collapse-count')).toHaveText('1');
  await expect(page.locator('#audit-startup-count')).toHaveText('1');
  await expect(page.locator('#audit-stop-loss-count')).toHaveText('1');
});
