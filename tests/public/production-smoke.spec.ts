import { test as base, expect, type Page } from '@playwright/test';

const destinations = [
  { path: '/', heading: 'State Not Fate' },
  { path: '/contact', heading: 'Contact / Join' },
  { path: '/crisis', heading: 'Crisis / Urgent Support' },
  { path: '/essays', heading: 'Core Essay Set' },
  { path: '/evidence', heading: 'Evidence / Sources' },
  { path: '/suicide-prevention', heading: 'Suicide Prevention Appendix' }
];
const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);
const assetTypes = new Set(['document', 'stylesheet', 'script', 'image', 'font', 'manifest']);

async function visitPublicPage(page: Page, path: string) {
  // The homepage imports safety modules after window.load. Wait for its actual
  // ready signal before leaving it, so navigation does not cancel those assets.
  const ready = path === '/'
    ? page.waitForEvent('console', {
      predicate: message => message.text() === 'Polaris Enhanced Safety modules loaded successfully.'
    })
    : Promise.resolve();
  const [response] = await Promise.all([page.goto(path, { waitUntil: 'load' }), ready]);
  return response;
}

// This suite only visits public pages and navigation links. It never submits a
// form or activates call/text/chat controls. The guard blocks non-read methods
// for this browser context; it is not a general security boundary for the site.
const test = base.extend<{ publicAudit: void }>({
  publicAudit: [async ({ context, page }, use) => {
    const problems: string[] = [];
    const observePage = (observedPage: Page) => {
      observedPage.on('pageerror', error => problems.push(`Runtime: ${error.message}`));
      observedPage.on('console', message => {
        if (message.type() === 'error') problems.push(`Console: ${message.text()}`);
      });
    };
    observePage(page);
    context.on('page', observePage);
    context.on('response', response => {
      if (response.status() >= 400 && assetTypes.has(response.request().resourceType())) {
        problems.push(`HTTP ${response.status()}: ${response.url()}`);
      }
    });
    context.on('requestfailed', request => {
      if (assetTypes.has(request.resourceType())) {
        problems.push(`Network: ${request.url()} (${request.failure()?.errorText})`);
      }
    });
    await context.route('**/*', async route => {
      const request = route.request();
      if (!safeMethods.has(request.method())) {
        problems.push(`Blocked ${request.method()}: ${request.url()}`);
        await route.abort('blockedbyclient');
        return;
      }
      await route.continue();
    });
    // Exercise network-delivered pages, not cached/offline PWA fallbacks.
    // Hide the feature too: the app expects register() to return a real worker,
    // whereas Playwright's blocked-registration stub resolves undefined.
    await context.addInitScript(() => {
      Reflect.deleteProperty(Navigator.prototype, 'serviceWorker');
    });
    await use();
    expect(problems, 'Public pages must not mutate data or report broken assets/runtime errors').toEqual([]);
  }, { auto: true }]
});

test.use({ serviceWorkers: 'block' });

test.describe('Public production smoke', { tag: '@production-safe' }, () => {
  for (const destination of destinations) {
    test(`@critical direct route ${destination.path} renders its own content`, async ({ page }) => {
      const response = await visitPublicPage(page, destination.path);
      expect(response?.ok(), `${destination.path} must return a successful response`).toBeTruthy();
      await expect(page.getByRole('heading', { level: 1, name: destination.heading, exact: true })).toBeVisible();
      const brokenImages = await page.locator('img').evaluateAll(images =>
        images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src)
      );
      expect(brokenImages, 'Rendered image assets must load').toEqual([]);
    });
  }

  for (const destination of destinations.filter(item => item.path !== '/')) {
    test(`@critical homepage navigation opens ${destination.path}`, async ({ page }) => {
      await visitPublicPage(page, '/');
      const link = page.getByRole('navigation', { name: 'Public site navigation' })
        .locator(`a[href="${destination.path}"]`);
      await expect(link).toBeVisible();
      await link.click();
      await page.waitForURL(url => url.pathname === destination.path, { waitUntil: 'load' });
      await expect(page.getByRole('heading', { level: 1, name: destination.heading, exact: true })).toBeVisible();
    });
  }

  test('@critical crisis guidance is visible and 988 controls have correct targets', async ({ page }) => {
    await page.goto('/crisis', { waitUntil: 'load' });
    const emergency = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'If there is immediate danger', exact: true })
    });
    await expect(emergency.getByText(/^Call 911 or your local emergency number now,/)).toBeVisible();
    const call = emergency.getByRole('link', { name: 'Call 988', exact: true });
    const text = emergency.getByRole('link', { name: 'Text 988', exact: true });
    await expect(call).toBeVisible();
    await expect(call).toHaveAttribute('href', 'tel:988');
    await expect(text).toBeVisible();
    await expect(text).toHaveAttribute('href', 'sms:988');
  });

  test('@critical prevention appendix leads with visible emergency and 988 guidance', async ({ page }) => {
    await page.goto('/suicide-prevention', { waitUntil: 'load' });
    const urgent = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'Urgent Support First', exact: true })
    });
    await expect(urgent.getByText(/If there is immediate danger, call 911 or your local emergency number\./)).toBeVisible();
    await expect(urgent.getByText(/call or text 988/)).toBeVisible();
  });
});
