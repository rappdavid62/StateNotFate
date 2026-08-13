import { expect, test } from '@playwright/test';

test.describe('beta channel gating @critical', () => {
  test('shows BETA chip and build stamp when channel=beta', async ({ page }) => {
    await page.goto('/?channel=beta');
    await expect(page.locator('#beta-channel-banner')).toBeVisible();
    await expect(page.locator('.beta-chip').first()).toBeVisible();
    await expect(page.locator('#beta-build-stamp')).toContainText(/Build · 20260812 · .+ · beta/);
    await expect(page.locator('html')).toHaveAttribute('data-snf-channel', 'beta');
    await expect(page.locator('html')).toHaveAttribute('data-build-id', /20260812-.+-beta/);
  });

  test('hides BETA chrome without beta channel on non-beta host', async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.removeItem('SNF_CHANNEL'); } catch (e) {}
    });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-snf-channel', 'production');
    await expect(page.locator('#beta-channel-banner')).toBeHidden();
  });

  test('production hostname hard-gate ignores channel query', async ({ page }) => {
    await page.goto('/');
    const channel = await page.evaluate(() => window.resolveSnfChannel({
      hostname: 'statenotfate.netlify.app',
      search: '?channel=beta',
      storage: {
        getItem: () => 'beta',
        setItem: () => {}
      }
    }));
    expect(channel).toBe('production');
  });
});

test.describe('lock screen crisis exits', () => {
  test('Help is never locked with 988 / 741741 / 911 / Safe Box without PIN', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const state = {
        isOnboarded: true,
        securityPin: '1234',
        isLocked: true,
        customMantra: 'State is information. I restart without punishment.',
        mvd: ['Water', 'Protein', 'Light'],
        history: [],
        ratings: {},
        safety: { suicide: 0, psychosis: 0, mania: 0 },
        todayEnergy: 'medium'
      };
      localStorage.setItem('state_not_fate_state', JSON.stringify(state));
    });
    await page.goto('/');
    await expect(page.locator('#screen-lock')).toBeVisible();
    await expect(page.getByText(/Help is never locked/i)).toBeVisible();
    await expect(page.locator('#screen-lock a[href="tel:988"]')).toBeVisible();
    await expect(page.locator('#screen-lock a[href="sms:741741?body=HOME"]')).toBeVisible();
    await expect(page.locator('#screen-lock a[href="tel:911"]')).toBeVisible();
    await expect(page.locator('#lock-help-safebox')).toBeVisible();
  });
});

test.describe('collapse-first + rail safety (beta)', () => {
  test('collapse energy shows single next-action home on beta', async ({ page }) => {
    await page.goto('/?channel=beta');
    await page.evaluate(() => {
      const state = {
        isOnboarded: true,
        securityPin: '',
        isLocked: false,
        customMantra: 'State is information. I restart without punishment.',
        mvd: ['Water', 'Protein', 'Light'],
        history: [],
        ratings: {},
        safety: { suicide: 0, psychosis: 0, mania: 0 },
        todayEnergy: 'collapse',
        polarisUpgrade: true
      };
      localStorage.setItem('state_not_fate_state', JSON.stringify(state));
      sessionStorage.removeItem('snfShowFullMainFrame');
    });
    await page.goto('/?channel=beta#/dashboard');
    await expect(page.locator('#collapse-first-home')).toBeVisible();
    await expect(page.getByRole('button', { name: /Show full Main Frame/i })).toBeVisible();
    await expect(page.locator('#collapse-first-home').getByText(/Help is never locked/i)).toBeVisible();
  });

  test('Reset Intake and Lock App live in Settings danger zone with confirm', async ({ page }) => {
    await page.goto('/?channel=beta');
    await page.evaluate(() => {
      localStorage.setItem('state_not_fate_state', JSON.stringify({
        isOnboarded: true,
        securityPin: '1234',
        isLocked: false,
        customMantra: 'State is information. I restart without punishment.',
        mvd: ['Water', 'Protein', 'Light'],
        history: [],
        ratings: {},
        safety: { suicide: 0, psychosis: 0, mania: 0 },
        todayEnergy: 'medium',
        polarisUpgrade: true
      }));
    });
    await page.goto('/?channel=beta#/settings');
    await expect(page.locator('#tab-settings')).toBeVisible();
    await expect(page.locator('#settings-danger-zone')).toBeVisible();
    await expect(page.locator('#btn-settings-lock')).toBeVisible();
    await expect(page.locator('#btn-settings-reset')).toBeVisible();
    await expect(page.locator('#btn-tab-lock')).toHaveCount(0);
    await expect(page.locator('#btn-tab-reset')).toHaveCount(0);

    await page.locator('#btn-settings-reset').click();
    await expect(page.locator('#danger-confirm-modal')).toHaveClass(/active/);
    await page.locator('#btn-danger-confirm-cancel').click();
    await expect(page.locator('#danger-confirm-modal')).not.toHaveClass(/active/);
  });
});

test.describe('P1 polish', () => {
  test('manifest includes maskable PWA icons', async ({ request }) => {
    const res = await request.get('/manifest.json');
    expect(res.ok()).toBeTruthy();
    const manifest = await res.json();
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    expect(manifest.icons.some((i: { src: string }) => i.src.includes('icon-192'))).toBeTruthy();
    expect(manifest.icons.some((i: { src: string }) => i.src.includes('icon-512'))).toBeTruthy();
    expect(manifest.icons.some((i: { purpose?: string }) => (i.purpose || '').includes('maskable'))).toBeTruthy();
    expect(manifest.description.toLowerCase()).toContain('offline');
  });

  test('no specialty tofu glyph and neutral default mantra in source HTML', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html).not.toContain('🜁');
    expect(html).toContain('State is information. I restart without punishment.');
    expect(html.toLowerCase()).not.toContain('handsome, confident, charismatic man');
  });
});
