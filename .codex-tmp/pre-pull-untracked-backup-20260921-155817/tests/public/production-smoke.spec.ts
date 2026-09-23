import { expect, test } from '@playwright/test';

const publicRoutes = [
  '/',
  '/contact',
  '/crisis',
  '/essays',
  '/evidence',
  '/suicide-prevention'
] as const;

const safeRequestMethods = new Set(['GET', 'HEAD', 'OPTIONS']);

test.describe('read-only production smoke @production-safe', () => {
  let unsafeRequests: string[];
  let pageErrors: string[];
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    unsafeRequests = [];
    pageErrors = [];
    consoleErrors = [];

    await page.route('**/*', async (route) => {
      const request = route.request();
      if (!safeRequestMethods.has(request.method())) {
        unsafeRequests.push(`${request.method()} ${request.url()}`);
        await route.abort('blockedbyclient');
        return;
      }

      await route.continue();
    });

    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
  });

  test.afterEach(() => {
    expect(unsafeRequests, 'The production smoke suite must never send a mutating request.').toEqual([]);
    expect(pageErrors, 'The rendered page must not raise unhandled errors.').toEqual([]);
    expect(consoleErrors, 'The rendered page must not log console errors.').toEqual([]);
  });

  test('all primary public routes return a meaningful rendered page @critical @production-safe', async ({ page }) => {
    for (const route of publicRoutes) {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response, `${route} should return a response`).not.toBeNull();
      expect(response?.ok(), `${route} should return HTTP success`).toBeTruthy();

      const bodyText = await page.locator('body').innerText();
      expect(bodyText.trim().length, `${route} should render meaningful content`).toBeGreaterThan(80);
    }
  });

  for (const target of publicRoutes.slice(1)) {
    test(`homepage navigation reaches ${target} @critical @production-safe`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      const navigation = page.getByRole('navigation');
      const link = navigation.locator(`a[href="${target}"]`).first();
      await expect(link, `navigation should include ${target}`).toBeVisible();

      await Promise.all([
        page.waitForURL((url) => url.pathname === target, { waitUntil: 'domcontentloaded' }),
        link.click({ noWaitAfter: true })
      ]);
      expect(new URL(page.url()).pathname).toBe(target);
    });
  }

  test('public crisis and prevention pages expose emergency-routing language @critical @production-safe', async ({ page }) => {
    await page.goto('/crisis');
    await expect(page.getByRole('link', { name: /call 988/i })).toBeVisible();
    await expect(page.locator('body')).toContainText(/911/);
    await expect(page.locator('body')).toContainText(/local emergency number|emergency service/i);

    await page.goto('/suicide-prevention');
    await expect(page.getByText(/call 911 or your local emergency number/i)).toBeVisible();
    await expect(page.locator('body')).toContainText(/call or text 988/i);
  });
});
