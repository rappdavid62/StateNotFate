import { expect, test } from '@playwright/test';

test('scope, safety, and professional-care boundaries are visible @critical', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText(/adjunctive support/i)).toBeVisible();
  await expect(page.getByText(/not a replacement for professional care/i)).toBeVisible();

  const publicText = (await page.locator('[data-public-site]').allInnerTexts()).join(' ');
  expect(publicText).not.toMatch(/\bdiagnose\b/i);
  expect(publicText).not.toMatch(/\bcure\b/i);
  expect(publicText).not.toMatch(/replace (therapy|medical care|professional care)/i);

  await page.goto('/crisis');
  await expect(page.getByRole('heading', { name: /crisis|urgent support/i })).toBeVisible();
  await expect(page.getByText(/call your local emergency number/i)).toBeVisible();
  await expect(page.getByText(/local crisis line/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /call 988/i })).toBeVisible();

  const crisisText = await page.locator('body').innerText();
  expect(crisisText.length).toBeLessThan(4500);
});
