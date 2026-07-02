import { expect, test } from '@playwright/test';

test.describe('Routing Integrity & Deep Linking', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Set localStorage state to bypass onboarding and set up polaris
    await page.evaluate(() => {
      localStorage.setItem('state_not_fate_state', JSON.stringify({
        isOnboarded: true,
        ratings: {
          sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2
        },
        safety: { suicide: 0, psychosis: 0, mania: 0 },
        customMantra: "I am in a state, not a fate.",
        mvd: ["Wake up on time.", "Drink water.", "Stand outside."],
        history: [],
        polaris: {
          enabled: true,
          proof: { total: 10, today: 10, ledger: [] },
          resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
          day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', futureNarrowingActive: false, floorWinsMode: false },
          anchors: { today: {} },
          quests: { daily: [] }
        },
        supportMap: {
          anchorPerson: "Alice (555-0100)",
          bufferContact: "Bob (555-0200)",
          safeEnvironment: "Quiet park bench"
        }
      }));
    });
    await page.goto('/');
  });

  test('Should route directly to a subtab on page load via URL hash @critical', async ({ page }) => {
    await page.goto('/#/suicideprevention/systems');
    await page.reload();
    
    // Verify that we are on the suicide prevention page and the systems subtab is open
    const systemsPanel = page.locator('#sp-panel-systems');
    await expect(systemsPanel).toBeVisible();
    await expect(systemsPanel).toContainText('Systems Theory & Hope Repair');
  });

  test('Should update hash when tab button is clicked @critical', async ({ page }) => {
    // Verify URL hash updated
    await page.click('button[data-tab="cognitivelab"]');
    await expect(page).toHaveURL(/#\/cognitivelab/);
    await expect(page.locator('#tab-cognitivelab')).toBeVisible();
  });

  test('Should handle back/forward navigation using browser history @advisory', async ({ page }) => {
    // Click Worksheets & Journal
    await page.click('button[data-tab="cognitivelab"]');
    await expect(page).toHaveURL(/#\/cognitivelab/);

    // Click Suicide Prevention
    await page.click('button[data-tab="suicideprevention"]');
    await expect(page).toHaveURL(/#\/suicideprevention/);

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/#\/cognitivelab/);
    await expect(page.locator('#tab-cognitivelab')).toBeVisible();

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/#\/suicideprevention/);
    await expect(page.locator('#tab-suicideprevention')).toBeVisible();
  });

  test('Should rollback hash if navigation is blocked by future narrowing @advisory', async ({ page }) => {
    // Enable Future Narrowing (we do this by checking the toggle or updating state)
    await page.click('button[data-tab="polaris"]');
    
    // Locate future narrowing controller toggle
    const toggleBtn = page.locator('#btn-toggle-future-narrowing');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    
    // Verify narrowing is active (by checking toast or layout)
    await expect(page.locator('#toast-container')).toContainText('Future Narrowing Active');

    // Attempt to deep-link navigate to Progression tab (which is blocked under future narrowing)
    await page.evaluate(() => {
      window.location.hash = "#/progression";
    });

    // Verify warning toast
    await expect(page.locator('#toast-container')).toContainText('Future Narrowing Active. Horizon restricted');

    // Verify URL hash reverted back to polaris
    await expect(page).toHaveURL(/#\/polaris/);
    await expect(page.locator('#tab-polaris')).toBeVisible();
  });

});
