import { expect, test } from '@playwright/test';

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function savedReturnState() {
  const yesterday = daysAgo(1);
  return {
    isOnboarded: true,
    customMantra: 'SAVED_MANTRA_KEEP_ME',
    mvd: ['Wake on workdays by 7:30am, drink water, take morning medication.', 'Brush teeth'],
    todayEnergy: 'medium',
    history: [{ date: yesterday, energy: 'medium', completed: [], floorCompleted: false, missed: true }],
    lastVisitDate: yesterday,
    ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
    userAnchors: [{ id: 'saved-anchor', text: 'Saved anchor stays', isGeneric: false }],
    polarisUpgrade: true,
    polaris: {
      enabled: true,
      proof: { total: 4, today: 0, ledger: [{ id: 'kept', source: 'anchor', points: 1, label: 'Kept proof' }] },
      day: { currentState: 'medium', lastCheckInDate: yesterday, difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
      anchors: { today: { 'saved-anchor': false } },
      profile: { companionSkin: '🦊' }
    }
  };
}

test('first visit has one action, a skippable check-in, and support without intake @critical', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#screen-welcome');

  const welcome = page.locator('#screen-welcome');
  await expect(welcome).toBeVisible();
  await expect(page.locator('#btn-welcome-next')).toHaveText('Put both feet on the floor and stand once');
  await expect(page.locator('#screen-welcome .btn-primary')).toHaveCount(1);
  await expect(page.locator('#screen-intake')).toBeHidden();

  const support = welcome.locator('a[data-open-support]');
  await expect(support).toBeVisible();
  await expect(support).toHaveAttribute('href', '/crisis');

  await page.locator('#btn-welcome-skip').click();
  await expect(page.locator('#welcome-checkin-status')).toContainText('Check-in skipped');
  await expect(page.locator('#btn-welcome-next')).toBeEnabled();
  await expect(page.locator('#screen-intake')).toBeHidden();

  await support.click();
  await expect(page.locator('#crisis-modal')).toBeVisible();
  await expect(page.locator('#screen-intake')).toBeHidden();
  await page.locator('#btn-crisis-dismiss').click();
  await expect(page.locator('#crisis-modal')).toBeHidden();

  await page.locator('#btn-welcome-change').click();
  await expect(page.locator('#btn-start-intake')).toBeVisible();
  await expect(page.locator('#welcome-alternates')).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('course controls are reachable from the keyboard on a narrow screen @critical', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/#screen-welcome');
  await page.locator('#screen-welcome a[data-open-support]').focus();

  const seen: string[] = [];
  for (let i = 0; i < 12; i += 1) {
    const label = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el ? (el.id || el.textContent || '').trim() : '';
    });
    seen.push(label);
    await page.keyboard.press('Tab');
  }

  expect(seen.some((label) => label.includes('Support'))).toBe(true);
  expect(seen).toContain('btn-welcome-skip');
  expect(seen).toContain('btn-welcome-next');
  expect(seen).toContain('btn-welcome-resume');
  expect(seen).toContain('btn-welcome-change');

  await page.locator('#btn-welcome-change').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#btn-welcome-change')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#welcome-alternates button').first()).toBeFocused();
  await expect(page.locator('#btn-start-intake')).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('return visit keeps saved local data and can skip check-in @critical', async ({ page }) => {
  const original = savedReturnState();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate((state) => {
    localStorage.setItem('state_not_fate_state', JSON.stringify(state));
  }, original);
  await page.goto('/');

  const card = page.locator('#reentry-card-container');
  await expect(card).toBeVisible();
  await expect(card).toContainText('You missed a day. That is data, not a verdict. Restart with one small anchor.');
  await expect(card.locator('#btn-course-next-anchor')).toHaveText(/Start smallest anchor/);
  await expect(card.locator('a[data-open-support]')).toBeVisible();
  await expect(page.locator('#screen-intake')).toBeHidden();

  await card.locator('[data-course-skip]').click();
  const afterSkip = await page.evaluate(() => JSON.parse(localStorage.getItem('state_not_fate_state') || '{}'));
  expect(afterSkip.customMantra).toBe(original.customMantra);
  expect(afterSkip.history).toEqual(original.history);
  expect(afterSkip.userAnchors).toEqual(original.userAnchors);
  expect(afterSkip.polaris.proof.total).toBe(4);
  expect(afterSkip.polaris.proof.ledger[0].label).toBe('Kept proof');
  expect(afterSkip.polaris.routing.checkInSkippedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  await expect(page.locator('#screen-intake')).toBeHidden();

  await card.locator('[data-course-change]').click();
  await expect(page.locator('#return-alternates')).toBeVisible();
  await page.locator('[data-course-polaris]').click();
  await expect(page.locator('#polaris-content')).toBeVisible();
  await expect(page.locator('#reentry-card-container')).toBeVisible();
});
