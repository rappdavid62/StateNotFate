import { expect, test } from '@playwright/test';

test('Onboarding assessment dropdowns save correctly', async ({ page }) => {
  await page.goto('/#program');

  // Begin assessment
  await page.click('#btn-start-intake');

  // Expand Section 4 (Day Rhythm & Capacity) to make its select dropdowns visible
  await page.click('button:has-text("4. Day Rhythm & Capacity")');

  // Select new dropdown values
  await page.selectOption('#select-future-narrowing', 'weak');
  await page.selectOption('#select-startup-drag', 'freeze');
  await page.selectOption('#select-rumination', 'losehours');
  await page.selectOption('#select-social-isolation', 'worse');
  await page.selectOption('#select-external-anchor', 'plant');

  // Submit intake
  await page.click('#btn-submit-intake');

  // Verify state saved in localStorage
  const savedStateStr = await page.evaluate(() => localStorage.getItem('state_not_fate_state'));
  expect(savedStateStr).not.toBeNull();
  const savedState = JSON.parse(savedStateStr!);
  expect(savedState.futureNarrowing).toBe('weak');
  expect(savedState.startupDrag).toBe('freeze');
  expect(savedState.rumination).toBe('losehours');
  expect(savedState.socialIsolation).toBe('worse');
  expect(savedState.externalAnchor).toBe('plant');
});

test('Possibility Collapse forces Floor Wins Mode and overrides energy', async ({ page }) => {
  await page.goto('/');

  // Bypass onboarding with mock state: futureNarrowing === 'none' (Possibility Collapse)
  await page.evaluate(() => {
    localStorage.setItem('state_not_fate_state', JSON.stringify({
      isOnboarded: true,
      ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
      safety: { suicide: 0, psychosis: 0, mania: 0 },
      mvd: [
        "Wake on workdays by 7:30am, drink water, take medication.",
        "Brush teeth, eat simple protein block.",
        "Stand outside for 2 minutes in daylight."
      ],
      todayEnergy: 'collapse',
      futureNarrowing: 'none',
      startupDrag: 'none',
      rumination: 'redirect',
      socialIsolation: 'neutral',
      externalAnchor: 'plant',
      polaris: {
        enabled: true,
        proof: { total: 0, today: 0, ledger: [] },
        resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
        day: { currentState: 'collapse', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: true },
        anchors: { today: {} }
      }
    }));
  });

  await page.goto('/');
  await page.click('button[data-tab="dashboard"]');

  // Check that the banner shows possibility collapse
  const banner = page.locator('#collapse-warning-banner');
  await expect(banner).toBeVisible();
  await expect(banner).toContainText('Possibility Collapse active');

  // Check that the checklist is limited and contains the external responsibility anchor (plant)
  const checklist = page.locator('#daily-checklist-items');
  await expect(checklist).toContainText('Water plants / care for environment (Responsibility Anchor)');
  // And contains the social presence task
  await expect(checklist).toContainText('Social Presence:');
});

test('Startup Drag Ladder interactive helper awards Proof Points', async ({ page }) => {
  await page.goto('/');

  // Bypass onboarding
  await page.evaluate(() => {
    localStorage.setItem('state_not_fate_state', JSON.stringify({
      isOnboarded: true,
      ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
      safety: { suicide: 0, psychosis: 0, mania: 0 },
      mvd: [ "MVD 1", "MVD 2", "MVD 3" ],
      todayEnergy: 'medium',
      futureNarrowing: 'weak',
      startupDrag: 'freeze',
      rumination: 'redirect',
      socialIsolation: 'neutral',
      externalAnchor: 'none',
      polaris: {
        enabled: true,
        proof: { total: 10, today: 0, ledger: [] },
        resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
        day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
        anchors: { today: {} }
      }
    }));
  });

  await page.goto('/');
  await page.click('button[data-tab="dashboard"]');

  // Expand Startup Drag ladder
  const ladderCard = page.locator('#startup-drag-card');
  await expect(ladderCard).toBeVisible();
  await page.click('#startup-drag-card h4');

  // Check step checkboxes
  const stepsContainer = page.locator('#startup-drag-steps-container');
  await expect(stepsContainer).toBeVisible();

  // Check the first 6 checkboxes
  for (let i = 1; i <= 6; i++) {
    await stepsContainer.locator(`input[type="checkbox"]`).nth(i - 1).check();
  }

  // Check 7th checkbox which triggers completion, Toast, and Proof Points
  await stepsContainer.locator(`input[type="checkbox"]`).nth(6).check();

  // Toast should show correct Copy Bank message
  const toast = page.locator('#toast-container');
  await expect(toast).toContainText('That counts. Not because it fixed everything. Because it happened.');

  // Check proof points in localStorage increased
  const savedStateStr = await page.evaluate(() => localStorage.getItem('state_not_fate_state'));
  const savedState = JSON.parse(savedStateStr!);
  expect(savedState.polaris.proof.today).toBe(1);
  expect(savedState.polaris.proof.total).toBe(11);
});

test('Rumination Stop-Loss workflow completes successfully', async ({ page }) => {
  await page.goto('/');

  // Bypass onboarding
  await page.evaluate(() => {
    localStorage.setItem('state_not_fate_state', JSON.stringify({
      isOnboarded: true,
      ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
      safety: { suicide: 0, psychosis: 0, mania: 0 },
      mvd: [ "MVD 1", "MVD 2", "MVD 3" ],
      todayEnergy: 'medium',
      futureNarrowing: 'weak',
      startupDrag: 'none',
      rumination: 'redirect',
      socialIsolation: 'neutral',
      externalAnchor: 'none',
      ruminationLogs: [],
      polaris: {
        enabled: true,
        proof: { total: 0, today: 0, ledger: [] },
        resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
        day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
        anchors: { today: {} }
      }
    }));
  });

  await page.goto('/');
  // Switch to Worksheets tab
  await page.click('button[data-tab="cognitivelab"]');

  // Fill in Stop-Loss details
  await page.fill('#input-rumination-loop', 'Panicking about code deadlines');
  await page.fill('#input-rumination-issue', 'I feel overwhelmed and stuck in a thought loop thinking I cannot finish this in time.');
  await page.selectOption('#select-rumination-duration', '10');
  await page.fill('#input-rumination-redirect', 'Refocusing on the garden layout design details');

  // Start bounded window timer
  await page.click('#btn-start-rumination');

  // Timer container should be visible
  await expect(page.locator('#rumination-timer-container')).toBeVisible();
  // Click Complete & Redirect
  await page.click('#btn-complete-rumination');

  // Check that input loops are cleared and timer container is hidden
  await expect(page.locator('#rumination-timer-container')).toBeHidden();
  await expect(page.locator('#input-rumination-loop')).toHaveValue('');

  // Check Toast matches the Copy Bank message
  const toast = page.locator('#toast-container');
  await expect(toast).toContainText('You do not need to win the argument in your head. You need to stop it from taking the whole day.');

  // Check state updated in localStorage
  const savedStateStr = await page.evaluate(() => localStorage.getItem('state_not_fate_state'));
  const savedState = JSON.parse(savedStateStr!);
  expect(savedState.ruminationLogs.length).toBe(1);
  expect(savedState.ruminationLogs[0].loop).toBe('Panicking about code deadlines');
  expect(savedState.ruminationLogs[0].redirect).toBe('Refocusing on the garden layout design details');
  expect(savedState.polaris.proof.today).toBe(1);

  // Check Stop-Loss log is rendered in history list
  const historyList = page.locator('#rumination-history-container');
  await expect(historyList).toContainText('Panicking about code deadlines');
});
