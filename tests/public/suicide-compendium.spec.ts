import { expect, test } from '@playwright/test';

test.describe('Suicide Compendium & Course Gated Content', () => {

  test('Should show lock screen when user has less than 10 proof points @advisory', async ({ page }) => {
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
        mvd: ["Wake up on time.", "Drink water.", "Stand outside."],
        history: [],
        polaris: {
          enabled: true,
          proof: { total: 5, today: 5, ledger: [] }, // 5 proof points (under 10 threshold)
          resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
          day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
          anchors: { today: {} },
          quests: { daily: [] }
        }
      }));
    });

    await page.goto('/');
    
    // Select the Suicide Prevention tab
    await page.click('button[data-tab="suicideprevention"]');
    
    // Select the Compendium subtab
    await page.click('#btn-sp-subtab-compendium');
    
    // Check that locked view is visible
    const lockedCard = page.locator('#sp-compendium-locked');
    await expect(lockedCard).toBeVisible();
    await expect(page.locator('#sp-lock-progress-text')).toHaveText('5 / 10 pts');
    
    // Check that unlocked content is hidden
    const unlockedContainer = page.locator('#sp-compendium-unlocked');
    await expect(unlockedContainer).toBeHidden();
  });

  test('Should show unlocked view, allow navigating modules, and submitting a reflection when user has >= 10 proof points @advisory', async ({ page }) => {
    await page.goto('/');
    
    // Set localStorage state to bypass onboarding with 12 proof points
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
          proof: { total: 12, today: 12, ledger: [] }, // 12 proof points (>= 10 threshold)
          resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
          day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
          anchors: { today: {} },
          quests: { daily: [] }
        }
      }));
    });

    await page.goto('/');
    
    // Select the Suicide Prevention tab
    await page.click('button[data-tab="suicideprevention"]');
    
    // Select the Compendium subtab
    await page.click('#btn-sp-subtab-compendium');
    
    // Locked view should be hidden
    const lockedCard = page.locator('#sp-compendium-locked');
    await expect(lockedCard).toBeHidden();
    
    // Unlocked view should be visible
    const unlockedContainer = page.locator('#sp-compendium-unlocked');
    await expect(unlockedContainer).toBeVisible();
    
    // Verify first module title is present in the education body
    const moduleBody = page.locator('#module-education-body');
    await expect(moduleBody).toContainText('Module 1: Differentiating Ideation & Intent');
    
    // Verify the character count starts at 0
    await expect(page.locator('#module-char-count')).toContainText('0 / 15 chars');
    
    // Type a reflection less than 15 chars
    await page.fill('#module-reflection-input', 'Short text');
    await page.click('#btn-submit-module');
    
    // Verify character count update
    await expect(page.locator('#module-char-count')).toContainText('10 / 15 chars');
    
    // Type a reflection >= 15 chars and submit
    await page.fill('#module-reflection-input', 'This is a long enough reflection to pass the test.');
    await page.click('#btn-submit-module');
    
    // Check that it shows COMPLETED badge now
    await expect(moduleBody).toContainText('COMPLETED');

    // Verify expanded education tools render
    await expect(page.locator('#sp-action-map-display')).toContainText('Distress spike but no clear plan or intent');
    await expect(page.locator('#sp-script-display')).toContainText('I am not doing well and I do not want to be alone with my thoughts right now.');
    await expect(page.locator('#sp-boundary-display')).toContainText('Can do:');
    await expect(page.locator('#sp-scenario-display')).toContainText('I am struggling and I need the next right step');
    await expect(page.locator('#sp-setting-display')).toContainText('Home and close relationships');
    await expect(page.locator('summary')).toContainText(['Myths, realities, and public-safe framing']);
    await expect(page.locator('#sp-compendium-unlocked')).toContainText('Aftercare, caring contacts, and dangerous transitions');
  });

});
