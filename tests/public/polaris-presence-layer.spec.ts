import { expect, test } from '@playwright/test';

function polarisState(overrides: Record<string, unknown> = {}) {
  return {
    isOnboarded: true,
    ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
    safety: { suicide: 0, psychosis: 0, mania: 0 },
    customMantra: 'I am in a state, not a fate.',
    mvd: ['Drink water'],
    todayEnergy: 'collapse',
    currentHopeLevel: 1,
    dominantPattern: 'Rhythm Collapse',
    polarisUpgrade: true,
    polaris: {
      enabled: true,
      openaiApiKey: null,
      chatHistory: [],
      proof: { total: 1, today: 0, ledger: [] },
      resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
      day: { currentState: 'collapse', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: true },
      anchors: { today: {} },
      quests: { daily: [] },
      profile: { companionSkin: '🦄' }
    },
    ...overrides
  };
}

test('Polaris layer speaks locally without a key and keeps Safe Box / 988 @advisory', async ({ page }) => {
  await page.goto('/');
  await page.evaluate((state) => {
    localStorage.setItem('state_not_fate_state', JSON.stringify(state));
  }, polarisState());
  await page.goto('/');

  await page.locator('#screen-dashboard button[data-tab="polaris"]').first().click();

  const content = page.locator('#polaris-content');
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('data-energy', 'collapse');
  await expect(content).toHaveAttribute('data-companion-theme', '🦄');
  await expect(page.locator('#polaris-message-text')).toContainText(/Floor Wins Mode|Strange Signal/);
  await expect(page.locator('#polaris-chat-messages')).toContainText(/Strange Signal|Floor Wins Mode/);
  await expect(page.locator('#polaris-chat-messages')).not.toContainText('functional alignment');
  await expect(page.locator('#polaris-chat-input')).toHaveAttribute('placeholder', /actually going on/i);

  await page.locator('#polaris-chat-input').fill('What should I do?');
  await page.locator('#polaris-chat-input').press('Enter');
  await expect(page.locator('#polaris-chat-messages')).toContainText(/Local voice is on/);
  await expect(page.locator('#polaris-chat-messages')).not.toContainText('ERROR: OpenAI API Key not configured');

  await page.locator('#screen-dashboard button[data-tab="safebox"]').first().click();
  await expect(page.locator('#tab-safebox')).toBeVisible();
  await expect(page.locator('.snf-ui-587')).toContainText('988');
});
