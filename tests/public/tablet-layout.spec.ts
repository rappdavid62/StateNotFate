import { expect, test } from '@playwright/test';

test('dashboard remains usable at tablet width @critical', async ({ page }) => {
  await page.setViewportSize({ width: 960, height: 1200 });
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('state_not_fate_state', JSON.stringify({
    isOnboarded: true,
    securityPin: '',
    ratings: { sleep:3, morning:2, initiation:2, clutter:1, energy:2, shame:1, hygiene:1, eating:1, social:1, meaning:2 },
    safety: { suicide:0, psychosis:0, mania:0 },
    customMantra: 'I am in a state, not a fate.',
    mvd: ['Drink water.', 'Eat something.', 'Step outside.'],
    history: [],
    polaris: { enabled:true, proof:{ total:10, today:1, ledger:[] }, resilience:{ current:0, longest:0, missedDays:0, lastCompletedDate:'' }, day:{ currentState:'medium', lastCheckInDate:'', difficulty:'easy', pacing:'slow', futureNarrowingActive:false, floorWinsMode:false }, anchors:{ today:{} }, quests:{ daily:[] } }
  })));
  await page.reload();
  await page.goto('/#/dashboard');
  await expect(page.locator('#screen-dashboard')).toBeVisible();
  await expect(page.locator('#tab-dashboard')).toBeVisible();
  const layout = await page.evaluate(() => {
    const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
    const app = rect('.app-container');
    const sidebar = rect('.sidebar-nav');
    const main = rect('.snf-ui-37');
    const grid = getComputedStyle(document.querySelector('.dashboard-grid')!).gridTemplateColumns;
    return { appX:app.x, appWidth:app.width, sidebarWidth:sidebar.width, mainWidth:main.width, grid, scrollWidth:document.documentElement.scrollWidth, viewport:innerWidth };
  });

  expect(layout.appX).toBeLessThan(1);
  expect(layout.appWidth).toBeGreaterThanOrEqual(959);
  expect(layout.sidebarWidth).toBeGreaterThanOrEqual(200);
  expect(layout.mainWidth).toBeGreaterThanOrEqual(700);
  expect(layout.grid.trim().split(/\s+/)).toHaveLength(1);
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewport);

  await page.setViewportSize({ width: 720, height: 1100 });
  await expect(page.locator('.sidebar-nav')).toBeHidden();
  await expect(page.locator('.bottom-nav')).toBeVisible();
  const mobile = await page.evaluate(() => ({
    mainWidth: document.querySelector('.snf-ui-37')!.getBoundingClientRect().width,
    scrollWidth: document.documentElement.scrollWidth,
    viewport: innerWidth
  }));
  expect(mobile.mainWidth).toBeGreaterThanOrEqual(719);
  expect(mobile.scrollWidth).toBeLessThanOrEqual(mobile.viewport);
});
