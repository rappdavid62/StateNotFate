import { expect, test } from '@playwright/test';

test('public homepage exists and communicates the project clearly', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBeTruthy();

  await expect(page.getByRole('heading', { name: /State Not Fate|Depression Project/i })).toBeVisible();
  await expect(page.getByText(/proof-based depression support/i)).toBeVisible();

  await expect(page.getByRole('link', { name: /learn/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /start|try the program/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /evidence|sources/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /contact|join/i })).toBeVisible();

  const bodyText = await page.locator('body').innerText();
  for (const phrase of [
    'good vibes',
    'just choose happiness',
    'miracle cure',
    'fix your life instantly'
  ]) {
    expect(bodyText.toLowerCase()).not.toContain(phrase);
  }
});
