import { expect, test } from '@playwright/test';

test.describe('Suicide Prevention Interactive Features', () => {

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

  test('Should pre-populate, edit, and save the active support map', async ({ page }) => {
    await page.click('#btn-sp-subtab-journal');

    const anchorInput = page.locator('#input-sp-anchor-person');
    const bufferInput = page.locator('#input-sp-buffer-contact');
    const envInput = page.locator('#input-sp-safe-environment');

    // Verify pre-populated values
    await expect(anchorInput).toHaveValue('Alice (555-0100)');
    await expect(bufferInput).toHaveValue('Bob (555-0200)');
    await expect(envInput).toHaveValue('Quiet park bench');

    // Edit support map inputs
    await anchorInput.fill('Charlie (555-0300)');
    await page.click('#btn-sp-save-support-map');

    // Verify toast confirmation or state save
    // Reload and check it persists
    await page.goto('/');
    await page.click('button[data-tab="suicideprevention"]');
    await page.click('#btn-sp-subtab-journal');
    await expect(anchorInput).toHaveValue('Charlie (555-0300)');
  });

  test('Should toggle supporter script library tabs', async ({ page }) => {
    await page.click('#btn-sp-subtab-journal');

    const displayArea = page.locator('#script-display-area');

    // Default tab should be Asking for Help
    await expect(displayArea).toContainText('Text Script 1 (Direct Request)');
    await expect(displayArea).toContainText('please help me contact 988');

    // Switch to Helping Someone
    await page.click('#btn-script-cat-helper');
    await expect(displayArea).toContainText('Text Script 1 (Reaching out)');
    await expect(displayArea).toContainText('We don\'t have to solve anything');

    // Switch to Preparing for Visit
    await page.click('#btn-script-cat-visit');
    await expect(displayArea).toContainText('Speaking Script 1 (To clinician/therapist)');
    await expect(displayArea).toContainText('I want to adjust my treatment plan');
  });

  test('Should render the 5th warning signs card (Means Safety) and log a reflection', async ({ page }) => {
    await page.click('#btn-sp-subtab-parables');

    const card = page.locator('#parable-card-means');
    await expect(card).toBeVisible();
    await expect(card).toContainText('V. Means Safety & Harm Reduction');
    await expect(card).toContainText('Unread');

    // Fill reflection and save
    await page.fill('#reflect-means', 'I will lock away my medications.');
    await page.click('#btn-sp-reflect-means');

    // Card should switch status to completed
    await expect(page.locator('#parable-badge-means')).toHaveText('Completed ✓');
  });

  test('Should render evidence base list and filter sources correctly', async ({ page }) => {
    await page.click('#btn-sp-subtab-evidence');

    const sourcesList = page.locator('#evidence-sources-list');
    const ideasList = page.locator('#evidence-ideas-list');

    // Check visibility of sources and ranked ideas
    await expect(sourcesList).toBeVisible();
    await expect(ideasList).toBeVisible();

    // Verify presence of major sources
    await expect(sourcesList).toContainText('CDC Suicide Data and Statistics');
    await expect(sourcesList).toContainText('Stanley-Brown Safety Planning Intervention');

    // Verify ideas stack
    await expect(ideasList).toContainText('#1 Immediate Crisis Routing');
    await expect(ideasList).toContainText('#20 Zero Speculative Pseudoscience');
    await expect(ideasList).toContainText('⚠️ RISK ALERT');

    // Check source counter shows 18 initially
    await expect(page.locator('#evidence-source-count')).toHaveText('18 Sources');

    // Filter by Official Anchor
    await page.click('#btn-source-filter-anchor');
    await expect(page.locator('#evidence-source-count')).toHaveText('4 Sources');

    // Filter by Wrote a Chapter
    await page.click('#btn-source-filter-chapter');
    await expect(page.locator('#evidence-source-count')).toHaveText('3 Sources');

    // Filter by Watchlist
    await page.click('#btn-source-filter-watchlist');
    await expect(page.locator('#evidence-source-count')).toHaveText('4 Sources');
  });

  test('Should test the No-Pressure Emergency Appendix (distortion calculation, mechanical load checklists, and contact ladder)', async ({ page }) => {
    // 1. Distortion calculation test
    await page.fill('#input-emer-feeling', 'Helplessness');
    
    // Set slider values in DOM
    await page.evaluate(() => {
      const intensity = document.getElementById('input-emer-intensity');
      const severity = document.getElementById('input-emer-severity');
      if (intensity) {
        intensity.value = '9';
        intensity.dispatchEvent(new Event('input'));
      }
      if (severity) {
        severity.value = '3';
        severity.dispatchEvent(new Event('input'));
      }
    });
    
    // Check labels updated
    await expect(page.locator('#label-emer-intensity')).toHaveText('9/10');
    await expect(page.locator('#label-emer-severity')).toHaveText('3/10');
    
    // Click compare
    await page.click('#btn-emer-calculate');
    await expect(page.locator('#emer-comparison-result')).toBeVisible();
    await expect(page.locator('#emer-comparison-result')).toContainText('Scale distortion detected');
    
    // 2. Mechanical relief checklist test
    await page.click('#btn-emer-tab-load');
    await expect(page.locator('#sp-emer-panel-load')).toBeVisible();
    
    // Check checkboxes
    const checkboxes = page.locator('.emer-relief-check');
    await expect(page.locator('#emer-relief-progress-label')).toContainText('0 / 5 checked');
    
    await checkboxes.nth(0).check();
    await expect(page.locator('#emer-relief-progress-label')).toContainText('1 / 5 checked');
    
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();
    await checkboxes.nth(3).check();
    await checkboxes.nth(4).check();
    await expect(page.locator('#emer-relief-progress-label')).toContainText('5 / 5 checked ✓ (Mechanical Load Reduced)');
    
    // 3. Contact ladder test
    await page.click('#btn-emer-tab-ladder');
    await expect(page.locator('#sp-emer-panel-ladder')).toBeVisible();
    await expect(page.locator('#emer-ladder-anchor')).toContainText('Alice (555-0100)');
    await expect(page.locator('#emer-ladder-buffer')).toContainText('Bob (555-0200)');
    await expect(page.locator('#emer-ladder-env')).toContainText('Quiet park bench');
    
    // 4. Supporter Quick Cues test
    await page.click('#btn-emer-tab-supporter');
    await expect(page.locator('#sp-emer-panel-supporter')).toBeVisible();
    await expect(page.locator('#sp-emer-panel-supporter')).toContainText('Do not debate worth');
  });
});
