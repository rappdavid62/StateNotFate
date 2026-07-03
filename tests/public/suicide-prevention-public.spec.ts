import { expect, test } from '@playwright/test';

test.describe('Suicide Prevention Public Page', () => {
  test('should render the public appendix, crisis routing, and interactive guidance @advisory', async ({ page }) => {
    await page.goto('/suicide-prevention');

    await expect(page.getByRole('heading', { level: 1, name: 'Suicide Prevention Appendix' })).toBeVisible();
    await expect(page.getByText('call 911 or your local emergency number')).toBeVisible();
    await expect(page.getByText('call or text 988 for the Suicide and Crisis Lifeline')).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'CDC Suicide Data and Statistics' })).toBeVisible();
    await expect(page.getByText('Can do', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Choose the kind of help or explanation you need' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'How Prevention Works' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Care Transitions and Aftercare' })).toBeVisible();

    const roleDisplay = page.locator('#public-role-path-display');
    await expect(roleDisplay).toContainText('Official crisis-routing anchor');
    await expect(roleDisplay).toContainText('call or text 988 in the U.S.');
    await page.locator('[aria-label="Role-based entry paths"]').getByRole('button', { name: 'I Am Helping Someone' }).click();
    await expect(roleDisplay).toContainText('Official guidance + supporter framing');
    await expect(roleDisplay).toContainText('connection first, certainty second');

    const architectureDisplay = page.locator('#public-architecture-display');
    await expect(architectureDisplay).toContainText('Official guidance + framework logic');
    await expect(architectureDisplay).toContainText('Public health and policy layer');
    await expect(architectureDisplay).toContainText('upstream prevention means safer environments before crisis peaks');
    await page.getByRole('button', { name: 'Clinical Care' }).click();
    await expect(architectureDisplay).toContainText('Official guidance + clinical workflow');
    await expect(architectureDisplay).toContainText('Healthcare settings matter because they can identify danger');
    await expect(architectureDisplay).toContainText('care transitions are part of prevention');

    const scenarioDisplay = page.locator('#public-scenario-display');
    await expect(scenarioDisplay).toContainText('Crisis-routing logic + project synthesis');
    await expect(scenarioDisplay).toContainText('I am struggling and I need the next right step');
    await expect(scenarioDisplay).toContainText('one grounding step, one live human, one safety move');
    await page.locator('[aria-label="Public suicide prevention scenarios"]').getByRole('button', { name: 'I Am Helping Someone' }).click();
    await expect(scenarioDisplay).toContainText('Official guidance + supporter framing');
    await expect(scenarioDisplay).toContainText('Your job is connection, reality-testing, and handoff, not perfect words.');
    await expect(scenarioDisplay).toContainText('connection first, certainty second');

    const settingDisplay = page.locator('#public-setting-display');
    await expect(settingDisplay).toContainText('Safety-planning + home support framing');
    await expect(settingDisplay).toContainText('Home and close relationships');
    await expect(settingDisplay).toContainText('one shared phrase, one contact ladder, one safer place to be');
    await page.getByRole('button', { name: 'Primary Care' }).click();
    await expect(settingDisplay).toContainText('Official guidance + non-specialist care');
    await expect(settingDisplay).toContainText('Many people disclose distress first in ordinary medical care, not specialty mental-health care.');
    await expect(settingDisplay).toContainText('a referral without continuity is not the same thing as support');

    const transitionDisplay = page.locator('#public-transition-display');
    await expect(transitionDisplay).toContainText('Aftercare + continuity framing');
    await expect(transitionDisplay).toContainText('The first move is not inspiration. It is continuity.');
    await expect(transitionDisplay).toContainText('do not let the person leave with only memory carrying the next step');
    await page.getByRole('button', { name: 'First 72 Hours' }).click();
    await expect(transitionDisplay).toContainText('Aftercare + caring-contact logic');
    await expect(transitionDisplay).toContainText('This window is often fragile because people can feel ashamed');
    await expect(transitionDisplay).toContainText('brief repeated outreach beats silence');

    const populationDisplay = page.locator('#public-population-display');
    await expect(populationDisplay).toContainText('Belonging, family conflict, school context, digital life');
    await page.getByRole('button', { name: 'Perinatal' }).click();
    await expect(populationDisplay).toContainText('Severe depression, psychosis, mania, and parent-or-infant safety concerns');
    await expect(populationDisplay).toContainText('Official guidance + project synthesis');
    await expect(populationDisplay).toContainText('intrusive thoughts and active danger must not be treated as the same thing');
    await page.locator('[aria-label="Population-aware prevention views"]').getByRole('button', { name: 'Disability / Neurodivergence' }).click();
    await expect(populationDisplay).toContainText('Accessibility is part of prevention');
    await expect(populationDisplay).toContainText('use the person\'s clearest communication method');

    const scriptDisplay = page.locator('#public-script-display');
    await expect(scriptDisplay).toContainText('The aim is to create contact, not to force a giant confession.');
    await page.getByRole('button', { name: 'Ask Directly' }).click();
    await expect(scriptDisplay).toContainText('Are you having thoughts about killing yourself or not being safe right now?');

    await expect(page.getByText('Quick map: what kind of signal am I looking at?')).toBeVisible();
    await expect(page.getByText('Quick map: what helps in the next 10 minutes, day, and week?')).toBeVisible();
    const communityDisplay = page.locator('#public-community-display');
    await expect(communityDisplay).toContainText('discipline, suspicion, or forced toughness');
    await expect(communityDisplay).toContainText('Community routing support');
    await expect(communityDisplay).toContainText('Source footing: NAMI Community and Culture pages');
    await page.locator('[aria-label="Community support path examples"]').getByRole('button', { name: 'Work / Financial Strain' }).click();
    await expect(communityDisplay).toContainText('Job collapse and money fear can become identity collapse');
    await expect(communityDisplay).toContainText('help sort the next 24 hours from the whole life problem');
    await expect(page.getByText('Helper compare blocks: common miss vs better move')).toBeVisible();
    await expect(page.getByText('Route examples by setting')).toBeVisible();
    await expect(page.getByText('Evidence glossary: why these route cards are framed this way')).toBeVisible();
    await expect(page.getByText('Why SNF avoids scoring people')).toBeVisible();
    const playbookDisplay = page.locator('#public-playbook-display');
    await expect(playbookDisplay).toContainText('Home and close-relationship playbook');
    await expect(playbookDisplay).toContainText('Official guidance + safety-planning logic');
    await page.locator('[aria-label="Setting playbooks"]').getByRole('button', { name: 'Work / School' }).click();
    await expect(playbookDisplay).toContainText('These settings often notice function collapse before they hear the deeper story');
    await expect(playbookDisplay).toContainText('take care of yourself');
    await expect(page.getByText('Postvention after a suicide death or crisis shockwave')).toBeVisible();
    await expect(page.getByText('Safe messaging and responsible public language')).toBeVisible();

    await expect(page.getByText('Do not build suicide risk scores')).toBeVisible();
    await expect(page.getByText('A suicide-risk score')).toBeVisible();
    await expect(page.getByText('Useful educational signals')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'How State Not Fate Uses Sources' })).toBeVisible();
    await expect(page.getByText('Loose end', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'SAVE Media Recommendations' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'NAMI Mental Health at Work' })).toBeVisible();
  });
});