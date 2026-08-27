import { expect, test } from '@playwright/test';

test('public presence SEO/performance skeleton exists @advisory', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      const url = message.location()?.url || '';
      if (url.includes('openai-api-key.txt')) return;
      errors.push(message.text());
    }
  });

  const started = Date.now();
  const response = await page.goto('/');
  const elapsed = Date.now() - started;

  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/State,? Not Fate|Depression Project/i);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /depression/i);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /State Not Fate/i);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /depression/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/$/);
  expect(errors).toEqual([]);
  expect(elapsed).toBeLessThan(10000);

  expect((await page.goto('/robots.txt'))?.ok()).toBeTruthy();
  await expect(page.locator('body')).toContainText('Sitemap');

  expect((await page.goto('/sitemap.xml'))?.ok()).toBeTruthy();
  await expect(page.locator('body')).toContainText('/evidence');
  await expect(page.locator('body')).toContainText('/essays');

  expect((await page.goto('/essays'))?.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/Essays/i);

  const notFound = await page.goto('/missing-page-for-public-test');
  expect(notFound?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible();
});
