import { expect, test } from '@playwright/test';

test('join/contact infrastructure works without collecting sensitive mental-health data', async ({ page }) => {
  await page.goto('/contact');

  await expect(page.getByRole('heading', { name: /contact|join/i })).toBeVisible();
  await expect(page.getByText(/do not submit emergency or crisis information/i)).toBeVisible();

  const email = page.getByLabel(/email/i);
  await email.fill('not-an-email');
  await page.getByRole('button', { name: /submit|send|join/i }).click();
  await expect(page.getByText(/enter a valid email/i)).toBeVisible();

  await email.fill('person@example.com');
  await page.getByLabel(/interest/i).selectOption('clinician-researcher');
  await page.getByRole('button', { name: /submit|send|join/i }).click();
  await expect(page.getByText(/not connected yet/i)).toBeVisible();

  const requiredFieldNames = await page.locator('form [required]').evaluateAll((fields) =>
    fields.map((field) => field.getAttribute('name') || field.getAttribute('id') || '')
  );
  expect(requiredFieldNames.join(' ')).not.toMatch(/diagnosis|medication|trauma|suicidal|ideation/i);
});
