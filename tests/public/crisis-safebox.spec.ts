import { expect, test } from '@playwright/test';

test.describe('Crisis Safe Box Enhancements', () => {

  test('Should block safebox until pre-distress rating is submitted, and show post-distress prompt on close @advisory', async ({ page }) => {
    // Navigate and set local storage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('state_not_fate_state', JSON.stringify({
        isOnboarded: true,
        securityPin: "",
        polaris: { enabled: true }
      }));
    });
    await page.goto('/');

    // Navigate to safebox
    await page.evaluate(() => {
        window.location.hash = '#/safebox';
    });

    // Check that distress overlay is visible
    const overlay = page.locator('#safebox-distress-overlay');
    await expect(overlay).toBeVisible();

    // Check that content is hidden
    const content = page.locator('#safebox-content');
    await expect(content).toBeHidden();

    // Submit pre-distress rating
    await page.click('#btn-unlock-safebox');

    // Check that overlay is hidden and content is visible
    await expect(overlay).toBeHidden();
    await expect(content).toBeVisible();
    
    // We no longer test native dialogs because we moved to an HTML UI
    // Click close safebox
    await page.click('#btn-close-safebox');
    
    // Now it should show the post-distress overlay
    const postOverlay = page.locator('#safebox-post-distress-overlay');
    await expect(postOverlay).toBeVisible();
    await expect(content).toBeHidden();

    // Finalize
    await page.click('#btn-finalize-safebox');
    
    // Check feedback message is visible
    const feedbackMsg = page.locator('#distress-feedback-msg');
    await expect(feedbackMsg).toBeVisible();

    // Click return to dashboard
    await page.click('#btn-return-dashboard');

    // Check we navigated away
    await expect(page).toHaveURL(/.*#\/dashboard/);
  });

  test('Should show Caring Contact Modal if scheduled @advisory', async ({ page }) => {
    await page.goto('/');
    
    // Set scheduled time to past (e.g. 25 hours ago)
    await page.evaluate(() => {
      localStorage.setItem('state_not_fate_state', JSON.stringify({
        isOnboarded: true,
        lastCrisisEvent: Date.now() - (25 * 60 * 60 * 1000),
        caringContactStage: 0
      }));
    });
    
    await page.goto('/');
    
    // Wait for the timeout in initApp (1000ms)
    await page.waitForTimeout(1500);
    
    const modal = page.locator('#caring-contact-modal');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.modal-title')).toContainText('24-Hour');
    
    // Click acknowledge
    await page.click('#caring-contact-modal .btn-primary');
    
    await expect(modal).toBeHidden();
  });
});
