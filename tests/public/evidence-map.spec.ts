import { expect, test } from '@playwright/test';

test('evidence/source path exists and separates claim strength @advisory', async ({ page }) => {
  const response = await page.goto('/evidence');
  expect(response?.ok()).toBeTruthy();

  await expect(page.getByRole('heading', { level: 1, name: /evidence|sources/i })).toBeVisible();

  for (const label of ['evidence', 'inference', 'hypothesis', 'opinion', 'personal testimony', 'public claim']) {
    await expect(page.getByText(new RegExp(label, 'i')).first()).toBeVisible();
  }

  await expect(page.locator('[data-source-card]').first()).toBeVisible();
  await expect(page.getByText(/still being developed and evaluated/i)).toBeVisible();

  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/clinically proven to (treat|cure|reverse)/i);
});
