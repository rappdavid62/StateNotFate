import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('global readiness and accessibility baseline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('lang', /.+/);

  await page.keyboard.press('Tab');
  const focusedName = await page.evaluate(() => document.activeElement?.textContent || document.activeElement?.getAttribute('aria-label') || '');
  expect(focusedName.trim().length).toBeGreaterThan(0);

  const primaryLinks = page.locator('a, button').filter({ hasText: /\S/ });
  expect(await primaryLinks.count()).toBeGreaterThan(0);

  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  expect(imagesWithoutAlt).toBe(0);

  const results = await new AxeBuilder({ page }).analyze();
  const seriousOrCritical = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
  expect(seriousOrCritical).toEqual([]);

  const publicText = (await page.locator('[data-public-site]').allInnerTexts()).join(' ');
  expect(publicText).toMatch(/local emergency number|local crisis line/i);
  expect(publicText).not.toMatch(/all users are in the U\.S\./i);

  await expect(page.getByRole('navigation')).toBeVisible();
});
