import { expect, test } from '@playwright/test';

test('suicide prevention appendix is public, interactive, and crisis-aware @critical', async ({ page }) => {
  const response = await page.goto('/suicide-prevention');
  expect(response?.ok()).toBeTruthy();

  await expect(page.getByRole('heading', { level: 1, name: /suicide prevention appendix/i })).toBeVisible();
  await expect(page.locator('section.source-card').filter({ hasText: /urgent support first/i }).getByText(/call 911 or your local emergency number/i)).toBeVisible();
  await expect(page.locator('section.source-card').filter({ hasText: /urgent support first/i }).getByText(/call or text 988/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /how prevention works/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /source atlas/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /perinatal/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /first 72 hours/i })).toBeVisible();

  const text = await page.locator('main').innerText();
  expect(text).not.toMatch(/graphic detail|method-specific/i);
  expect(text).toMatch(/public health|clinical care|community trust/i);
});
