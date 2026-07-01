import { expect, test } from '@playwright/test';

test.describe('Systems & Hope Repair Wisebase Integration', () => {

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
          day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
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
    await page.click('button[data-tab="suicideprevention"]');
  });

  test('Should navigate to Systems subtab and verify feedback loop diagram', async ({ page }) => {
    await page.click('#btn-sp-subtab-systems');
    
    // Verify Systems subpanel is visible
    const systemsPanel = page.locator('#sp-panel-systems');
    await expect(systemsPanel).toBeVisible();
    await expect(systemsPanel).toContainText('Systems Theory & Hope Repair');
    await expect(systemsPanel).toContainText('🔄 The Depressive Feedback Loop');
    
    // Verify SVG is present
    await expect(page.locator('#sp-panel-systems svg')).toBeVisible();
  });

  test('Should interact with Hope Repair Simulator and verify payoff credibility updates', async ({ page }) => {
    await page.click('#btn-sp-subtab-systems');

    const progressLabel = page.locator('#label-hope-sim-percent');
    const feedbackText = page.locator('#text-hope-sim-feedback');
    const checkboxes = page.locator('.hope-sim-check');

    // Default status
    await expect(progressLabel).toHaveText('0% (Pointless)');
    await expect(feedbackText).toHaveText('No anchors checked. Prediction states that effort will fail.');

    // Check first anchor (Wake regular)
    await checkboxes.nth(0).check();
    await expect(progressLabel).toHaveText('25% (Slight Wins)');
    await expect(feedbackText).toHaveText('25% credibility win. Small outcome registered. Keep the same wake time tomorrow.');

    // Check all anchors
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();
    await checkboxes.nth(3).check();
    await expect(progressLabel).toHaveText('100% (Credibility Restored)');
    await expect(feedbackText).toHaveText('100% credibility win. System failure loop interrupted. Self-trust and expectation of reward restored.');
  });

  test('Should toggle Energy-Based Crisis SOPs and verify content changes', async ({ page }) => {
    await page.click('#btn-sp-subtab-systems');

    const detailsBox = page.locator('#state-sop-details-box');

    // Default is Low/Survival SOP
    await expect(detailsBox).toContainText('Survival SOP (Goal: Prevent further collapse)');
    await expect(detailsBox).toContainText('Wake regularity:');

    // Switch to Medium/Stabilize
    await page.click('#btn-state-sop-medium');
    await expect(detailsBox).toContainText('Stabilization SOP (Goal: Protect continuity)');
    await expect(detailsBox).toContainText('One Task Block:');

    // Switch to Strong/Expand
    await page.click('#btn-state-sop-strong');
    await expect(detailsBox).toContainText('Expansion SOP (Goal: Build future stability)');
    await expect(detailsBox).toContainText('Warning: Do not burn all your capacity');
  });

  test('Should toggle clinical triage exclusion checks and verify warnings', async ({ page }) => {
    await page.click('#btn-sp-subtab-systems');

    const alertEl = page.locator('#triage-escalation-alert');
    const checks = page.locator('.triage-exclusion-check');

    // Initially hidden
    await expect(alertEl).toBeHidden();

    // Check Bipolar Mania
    await checks.nth(0).check();
    await expect(alertEl).toBeVisible();
    await expect(alertEl).toContainText('🚨 CRITICAL BOUNDARY EXCEEDED: Self-management is unsafe.');

    // Uncheck and verify it hides again
    await checks.nth(0).uncheck();
    await expect(alertEl).toBeHidden();
  });

});
