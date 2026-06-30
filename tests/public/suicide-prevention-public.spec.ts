import { expect, test } from '@playwright/test';

test.describe('Suicide Prevention Public Page', () => {
  test('should render the public appendix, crisis routing, and interactive guidance @advisory', async ({ page }) => {
    await page.goto('/suicide-prevention');

    await expect(page.getByRole('heading', { level: 1, name: 'Suicide Prevention Appendix' })).toBeVisible();
    await expect(page.getByText('call 911 or your local emergency number')).toBeVisible();
    await expect(page.getByText('call or text 988 for the Suicide and Crisis Lifeline')).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'CDC Suicide Data and Statistics' })).toBeVisible();
    await expect(page.getByText('Can do', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'How Prevention Works' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Care Transitions and Aftercare' })).toBeVisible();

    const architectureDisplay = page.locator('#public-architecture-display');
    await expect(architectureDisplay).toContainText('Public health and policy layer');
    await page.getByRole('button', { name: 'Clinical Care' }).click();
    await expect(architectureDisplay).toContainText('Healthcare settings matter because they can identify danger');

    const scenarioDisplay = page.locator('#public-scenario-display');
    await expect(scenarioDisplay).toContainText('I am struggling and I need the next right step');

    await page.getByRole('button', { name: 'I Am Helping Someone' }).click();
    await expect(scenarioDisplay).toContainText('Your job is connection, reality-testing, and handoff, not perfect words.');

    const settingDisplay = page.locator('#public-setting-display');
    await expect(settingDisplay).toContainText('Home and close relationships');

    await page.getByRole('button', { name: 'Primary Care' }).click();
    await expect(settingDisplay).toContainText('Many people disclose distress first in ordinary medical care, not specialty mental-health care.');

    const transitionDisplay = page.locator('#public-transition-display');
    await expect(transitionDisplay).toContainText('The first move is not inspiration. It is continuity.');
    await page.getByRole('button', { name: 'First 72 Hours' }).click();
    await expect(transitionDisplay).toContainText('This window is often fragile because people can feel ashamed');

    const populationDisplay = page.locator('#public-population-display');
    await expect(populationDisplay).toContainText('Belonging, family conflict, school context, digital life');
    await page.getByRole('button', { name: 'Perinatal' }).click();
    await expect(populationDisplay).toContainText('Severe depression, psychosis, mania, and parent-or-infant safety concerns');

    await expect(page.getByText('Do not build suicide risk scores')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'How State Not Fate Uses Sources' })).toBeVisible();
    await expect(page.getByText('Loose end', { exact: true })).toBeVisible();
  });
});
