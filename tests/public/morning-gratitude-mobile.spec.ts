import { expect, test } from '@playwright/test';

test.describe('Morning Gratitude Journal & Mobile Responsiveness', () => {

  test('Morning Gratitude is the first daily action and completes cleanly @advisory', async ({ page }) => {
    await page.goto('/');
    // Set up onboarded state
    await page.evaluate(() => {
      localStorage.setItem('state_not_fate_state', JSON.stringify({
        isOnboarded: true,
        securityPin: '',
        isLocked: false,
        ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
        safety: { suicide: 0, psychosis: 0, mania: 0 },
        customMantra: 'I am in a state, not a fate.',
        mvd: ['Drink water.', 'Eat protein block.', 'Step outside.'],
        history: [],
        gratitudeJournal: []
      }));
    });
    await page.reload();
    await page.goto('/#/dashboard');

    // Ensure dashboard and morning gratitude card are visible
    await expect(page.locator('#screen-dashboard')).toBeVisible();
    await expect(page.locator('#morning-gratitude-card')).toBeVisible();

    // Check that it's initially marked optional / recommended, NOT Action Required
    await expect(page.locator('#morning-gratitude-status-badge')).toHaveText(/Recommended/i);
    await expect(page.locator('#morning-gratitude-status-badge')).not.toHaveText(/Action Required/i);
    await expect(page.locator('#morning-gratitude-input-section')).toBeVisible();
    await expect(page.locator('#morning-gratitude-completed-section')).toBeHidden();

    // Fill in today's gratitude and micro-moment (even single field works cleanly)
    await page.fill('#morning-input-relief', 'Fresh hot coffee and morning daylight');
    await page.fill('#morning-input-possibility', '10 minute walk after breakfast');
    await page.click('#btn-save-morning-gratitude');

    // Verify it transitions to completed state
    await expect(page.locator('#morning-gratitude-status-badge')).toHaveText(/Anchored Today/i);
    await expect(page.locator('#morning-gratitude-input-section')).toBeHidden();
    await expect(page.locator('#morning-gratitude-completed-section')).toBeVisible();
    await expect(page.locator('#morning-completed-relief')).toContainText('Fresh hot coffee and morning daylight');
    await expect(page.locator('#morning-completed-possibility')).toContainText('10 minute walk after breakfast');

    // Reload page to verify persistence in localStorage
    await page.reload();
    await page.goto('/#/dashboard');
    await expect(page.locator('#morning-gratitude-status-badge')).toHaveText(/Anchored Today/i);
    await expect(page.locator('#morning-gratitude-completed-section')).toBeVisible();
    await expect(page.locator('#morning-completed-relief')).toContainText('Fresh hot coffee and morning daylight');

    // Test edit toggle
    await page.click('#btn-edit-morning-gratitude');
    await expect(page.locator('#morning-gratitude-input-section')).toBeVisible();
    await expect(page.locator('#morning-gratitude-completed-section')).toBeHidden();
  });

  test('Mobile phone viewport has no horizontal overflow and fits cleanly @advisory', async ({ page }) => {
    // iPhone SE viewport (375 x 667)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('state_not_fate_state', JSON.stringify({
        isOnboarded: true,
        securityPin: '',
        isLocked: false,
        ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
        safety: { suicide: 0, psychosis: 0, mania: 0 },
        customMantra: 'I am in a state, not a fate.',
        mvd: ['Drink water.', 'Eat something.', 'Step outside.'],
        history: [],
        gratitudeJournal: []
      }));
    });
    await page.reload();
    await page.goto('/#/dashboard');

    await expect(page.locator('#screen-dashboard')).toBeVisible();
    await expect(page.locator('.bottom-nav')).toBeVisible();
    await expect(page.locator('.sidebar-nav')).toBeHidden();

    // Verify no horizontal overflow
    const overflowCheck = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        viewportWidth: window.innerWidth
      };
    });

    expect(overflowCheck.scrollWidth).toBeLessThanOrEqual(overflowCheck.viewportWidth + 1);

    // Verify Morning Gratitude Card renders within viewport
    const cardRect = await page.locator('#morning-gratitude-card').boundingBox();
    expect(cardRect).not.toBeNull();
    if (cardRect) {
      expect(cardRect.width).toBeLessThanOrEqual(375);
      expect(cardRect.x).toBeGreaterThanOrEqual(0);
    }
  });

});
