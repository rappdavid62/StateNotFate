import { expect, test } from '@playwright/test';

test('education reader stays public, nonclinical, and source-governed @critical', async ({ page }) => {
  const response = await page.goto('/education-reader.html');
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/Suicide Compendium Education Reader v3\.0/i);

  await expect(page.getByText(/Call\/Text:/i)).toBeVisible();
  await expect(page.getByRole('link', { name: '988', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '911', exact: true })).toBeVisible();
  await expect(page.getByText(/Educational Research Literacy Document/i)).toBeVisible();
  await expect(page.getByText(/18 Units/i)).toBeVisible();

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).not.toMatch(/20:1|30:1|100:1/);
  expect(bodyText).toMatch(/should not be collapsed into a single attempts-to-deaths ratio/i);
  expect(bodyText).toMatch(/not provide clinical care, therapy, medical diagnosis, or personal risk calculation/i);

  const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(n => n.id));
  expect(new Set(ids).size).toBe(ids.length);
});
