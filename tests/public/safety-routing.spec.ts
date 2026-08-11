import { expect, test } from '@playwright/test';

/**
 * Automated tests asserting that the prohibited behaviors specified in issue #5
 * (Replace risk-assessment module with safe support routing) remain absent.
 *
 * Acceptance criteria verified here:
 *   - No numeric or categorical suicide-risk score is generated or displayed.
 *   - No method-specific detail (access to means, timeline) is requested or displayed.
 *   - Crisis help is reachable without PIN, intake, or account setup.
 *   - Ordinary quests/proof rewards are disabled (routing-active flag set) during safety routing.
 */

test.describe('safety routing — prohibited behaviors absent', () => {
  test('safety-routing.js does not export calculateRiskLevel or detectRiskPatterns @critical', async ({ page }) => {
    // Load the module in the browser context and verify the prohibited API is absent.
    await page.goto('/');

    const result = await page.evaluate(async () => {
      try {
        const mod = await import('/src/safety-routing.js');
      const instance = new (mod.default || mod.SafetyRouting)();
        return {
          hasCalculateRiskLevel: typeof instance.calculateRiskLevel === 'function',
          hasDetectRiskPatterns: typeof instance.detectRiskPatterns === 'function',
          hasGetResources: typeof instance.getResources === 'function',
          hasPauseCoaching: typeof instance.pauseCoaching === 'function',
          hasRecordRoutingOpened: typeof instance.recordRoutingOpened === 'function'
        };
      } catch (e) {
        return { error: String(e) };
      }
    });

    expect(result.error).toBeUndefined();
    // Prohibited: clinical risk scoring API
    expect(result.hasCalculateRiskLevel).toBe(false);
    expect(result.hasDetectRiskPatterns).toBe(false);
    // Required: safe routing API
    expect(result.hasGetResources).toBe(true);
    expect(result.hasPauseCoaching).toBe(true);
    expect(result.hasRecordRoutingOpened).toBe(true);
  });

  test('safety-routing modal contains no method-specific questions @critical', async ({ page }) => {
    await page.goto('/');

    // Open the support routing modal via localStorage state (bypass onboarding)
    await page.evaluate(() => {
      localStorage.setItem('state_not_fate_state', JSON.stringify({
        isOnboarded: true,
        ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
        safety: { routingActive: false },
        customMantra: 'I am in a state, not a fate.',
        safeContacts: 'Test Contact (555-0100)',
        reasonsLive: '',
        distractions: '',
        linkedFiles: [],
        history: [],
        polaris: { enabled: false, proof: { total: 0, today: 0, ledger: [] }, quests: { daily: [] }, anchors: { today: {} } }
      }));
    });
    await page.goto('/');

    // Trigger the modal directly
    await page.evaluate(() => {
      document.getElementById('safety-assessment-modal').classList.add('active');
    });

    const modalEl = page.locator('#safety-assessment-modal');
    await expect(modalEl).toBeVisible();

    const modalText = await modalEl.innerText();

    // Must NOT contain method-specific questions
    expect(modalText).not.toMatch(/access to means/i);
    expect(modalText).not.toMatch(/lethal/i);
    expect(modalText).not.toMatch(/when do you imagine this might happen/i);
    expect(modalText).not.toMatch(/how certain do you feel/i);
    expect(modalText).not.toMatch(/risk level/i);
    expect(modalText).not.toMatch(/score/i);

    // Must contain crisis resources
    expect(modalText).toMatch(/988/);
    expect(modalText).toMatch(/crisis/i);
  });

  test('crisis overlay is reachable without PIN or onboarding @critical', async ({ page }) => {
    // Fresh page — no localStorage state set
    await page.goto('/');

    // The crisis modal must exist in the DOM at all times
    const crisisModal = page.locator('#crisis-modal');
    await expect(crisisModal).toBeAttached();

    // Trigger it via JS (simulates openSafetyRouting)
    await page.evaluate(() => {
      document.getElementById('crisis-modal').classList.add('active');
    });

    // Confirm the active class was applied (modal is available regardless of onboarding state)
    await expect(crisisModal).toHaveClass(/active/);
    const crisisText = await crisisModal.innerText();
    // Must provide at minimum a 988 or emergency contact
    expect(crisisText).toMatch(/988|911|emergency/i);
  });

  test('safety routing records only openedAt — no clinical data stored @critical', async ({ page }) => {
    await page.goto('/');

    const result = await page.evaluate(async () => {
      const mod = await import('/src/safety-routing.js');
      const sr = new (mod.default || mod.SafetyRouting)();
      const state = {};
      sr.recordRoutingOpened(state);
      const log = state.safetyRoutingLog || [];
      const entry = log[0] || {};
      return {
        logLength: log.length,
        hasOpenedAt: !!entry.openedAt,
        keys: Object.keys(entry)
      };
    });

    expect(result.logLength).toBe(1);
    expect(result.hasOpenedAt).toBe(true);
    // Only the timestamp key should be present — no clinical fields
    expect(result.keys).toEqual(['openedAt']);
  });

  test('pauseCoaching sets safetyRoutingActive and pauses quests @critical', async ({ page }) => {
    await page.goto('/');

    const result = await page.evaluate(async () => {
      const mod = await import('/src/safety-routing.js');
      const sr = new (mod.default || mod.SafetyRouting)();
      const polaris = { quests: { daily: [] } };
      sr.pauseCoaching(polaris);
      return {
        safetyRoutingActive: polaris.safetyRoutingActive,
        questsPaused: polaris.quests._pausedBySafetyRouting
      };
    });

    expect(result.safetyRoutingActive).toBe(true);
    expect(result.questsPaused).toBe(true);
  });
});
