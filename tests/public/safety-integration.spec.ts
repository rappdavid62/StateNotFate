import { expect, test } from '@playwright/test';

function baseState(overrides: Record<string, any> = {}) {
  const base = {
    isOnboarded: true,
    ratings: { sleep: 0, morning: 0, initiation: 0, clutter: 0, energy: 0, shame: 0, hygiene: 0, eating: 0, social: 0, meaning: 0 },
    safety: { suicide: 0, psychosis: 0, mania: 0 },
    customMantra: 'I am in a state, not a fate.',
    negativeBeliefs: '',
    worstTime: 'morning',
    stillWorks: '',
    mvd: ['Water', 'Food', 'Light'],
    reasonsLive: 'Family, projects, future possibilities.',
    safeContacts: 'Safe person',
    distractions: 'Walking, familiar audio.',
    linkedFiles: [],
    todayEnergy: 'medium',
    mantraCompletedToday: false,
    history: [],
    currentHopeLevel: 2,
    hopeProgress: 0,
    dominantPattern: 'Rhythm Collapse',
    phq9History: [],
    currentLayer: 0,
    activeMediaIndex: -1,
    playbackSpeed: 1,
    gratitudeJournal: [],
    thoughtCorrections: [],
    customTasks: [],
    securityPin: '',
    isLocked: false,
    userAnchors: [],
    firstUseDate: '',
    tomorrowAnchor: '',
    personalBests: { longestStreak: 0, mostAnchorsInDay: 0, fastestRestart: null },
    polarisUpgrade: false,
    polarisHistory: [],
    polarisRestartLogs: [],
    safetyJournal: [],
    polaris: {
      enabled: false,
      proof: { total: 0, today: 0, ledger: [] },
      resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
      day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
      anchors: { today: {} },
      quests: { daily: [] },
      profile: {}, questionnaire: {}, routing: {}
    }
  };

  return {
    ...base,
    ...overrides,
    ratings: { ...base.ratings, ...(overrides.ratings || {}) },
    safety: { ...base.safety, ...(overrides.safety || {}) }
  };
}

async function seed(page, state: any) {
  await page.goto('/');
  await page.evaluate((value) => {
    localStorage.setItem('state_not_fate_state', JSON.stringify(value));
  }, state);
  await page.goto('/');
}


test('bad-day deterioration never creates a suicide assessment or risk band @critical', async ({ page }) => {
  const imported: string[] = [];
  page.on('request', request => imported.push(request.url()));
  await seed(page, baseState({ currentHopeLevel: 0, ratings: { sleep: 4, social: 4, meaning: 4, shame: 4 } }));
  await page.click('button[data-energy="collapse"]');
  await expect(page.locator('#safety-checkin-card, #ideation-scale, #safety-assessment-modal, #safety-sp-risk-badge')).toHaveCount(0);
  await expect(page.locator('#crisis-modal')).not.toBeVisible();
  expect(imported.filter(url => /safety-detection|polaris-safety-integration|polaris-safety-routing/.test(url))).toEqual([]);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('state_not_fate_state')!).safetyAssessments)).toBeUndefined();
});

test('public crisis help needs no intake or PIN and retains support mode on return @critical', async ({ page }) => {
  await page.goto('/crisis');
  await expect(page.getByRole('link', { name: 'Call 988', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('state_not_fate_state'))).toBeNull();
  await page.goto('/');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('combobox').selectOption('US');
  await expect(dialog.getByRole('link', { name: /call 911/i })).toHaveAttribute('href', 'tel:911');
  await dialog.getByRole('button', { name: 'Return to my plan' }).click();
  await expect(dialog).not.toBeVisible();
});

test('locked private data stays private while routing and crisis links are available @critical', async ({ page }) => {
  await seed(page, baseState({ securityPin: '1234', safeContacts: 'PRIVATE CONTACT CONTENT' }));
  await page.getByRole('link', { name: 'Crisis Help — no PIN required', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).not.toContainText('PRIVATE CONTACT CONTENT');
  await dialog.getByRole('combobox').selectOption('CA');
  await expect(dialog.getByRole('link', { name: 'Call 988 — Canada', exact: true })).toBeVisible();
});

test('routing survives neutral messages, resource clicks, navigation and reload until explicit exit @critical', async ({ page }) => {
  await seed(page, baseState());
  await page.evaluate(() => (window as any).triggerCrisisOverlay());
  const dialog = page.getByRole('dialog');
  await page.evaluate(async () => {
    await (window as any).sendQuickPolarisPrompt('What is for dinner?');
    location.hash = '#/polaris';
  });
  await dialog.getByRole('combobox').selectOption('US');
  await dialog.getByRole('link', { name: 'Call 988 — United States', exact: true }).evaluate(link => link.addEventListener('click', event => event.preventDefault()));
  await dialog.getByRole('link', { name: 'Call 988 — United States', exact: true }).click();
  await expect(dialog).toBeVisible();
  await page.reload();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Return to my plan' }).click();
  await expect(dialog).not.toBeVisible();
  await page.reload();
  await expect(dialog).not.toBeVisible();
});

test('all ordinary proof and completion writers are blocked during routing @critical', async ({ page }) => {
  await seed(page, baseState());
  await page.evaluate(() => (window as any).triggerCrisisOverlay());
  const result = await page.evaluate(() => {
    const w = window as any;
    const before = localStorage.getItem('state_not_fate_state');
    const calls = ['toggleTask', 'logActionCompletion', 'logMissInHistory', 'evaluateDaySuccess', 'completeRuminationStopLoss', 'startSmallestAnchor', 'checkDragStep', 'togglePolarisAnchor', 'polarisFloorWin', 'polarisRestart', 'selectCollapseLane', 'verifyStartupDrag', 'completeStopLoss', 'submitCurrentModule'];
    calls.forEach(name => w[name]());
    return { before, after: localStorage.getItem('state_not_fate_state'), event: sessionStorage.getItem('snf_support_session_v1') };
  });
  expect(result.after).toBe(result.before);
  expect(JSON.parse(result.event!)).toEqual({ event: 'safety-routing-opened' });
  await page.evaluate(() => {
    (document.getElementById('reflect-chioran') as HTMLTextAreaElement).value = 'This must not earn progression during support';
    document.getElementById('btn-sp-reflect-chioran')!.click();
  });
  await page.getByRole('button', { name: 'Return to my plan' }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('state_not_fate_state')!).parablesCompleted)).toEqual({});
  await page.evaluate(() => (window as any).polarisFloorWin());
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('state_not_fate_state')!).polaris.proof.total)).toBe(1);
});

test('standalone Polaris cannot award proof, XP or quests during the same support session @critical', async ({ page }) => {
  await page.goto('/crisis');
  await page.goto('/polaris/');
  await expect(page.getByRole('dialog')).toBeVisible();
  const result = await page.evaluate(() => {
    const w = window as any;
    const before = JSON.stringify(w.POLARIS_25.state);
    ['addXP', 'completeGamifiedTask', 'toggleAnchor', 'logFloorWin', 'toggleQuest', 'saveSystemsAudit', 'restartToday'].forEach(name => w[name]());
    return { before, after: JSON.stringify(w.POLARIS_25.state) };
  });
  expect(result.after).toBe(result.before);
});

test('disclosures route before chat persistence or model transport; contacts render as text @critical', async ({ page }) => {
  const modelRequests: string[] = [];
  page.on('request', request => { if (request.url().includes('api.openai.com')) modelRequests.push(request.url()); });
  await seed(page, baseState({ safeContacts: '<img src=x onerror="window.contactExecuted=true"> Alex' }));
  await page.evaluate(async () => (window as any).sendQuickPolarisPrompt('I cannot stay safe'));
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('#snf-support-contacts')).toContainText('<img');
  await expect(dialog.locator('#snf-support-contacts img')).toHaveCount(0);
  await page.evaluate(async () => (window as any).sendQuickPolarisPrompt('Suggest next move'));
  expect(modelRequests).toEqual([]);
  const saved = await page.evaluate(() => localStorage.getItem('state_not_fate_state'));
  expect(saved).not.toContain('I cannot stay safe');
  expect(await page.evaluate(() => (window as any).contactExecuted)).toBeUndefined();
});

test('a reply in flight is discarded even after the user leaves support routing @critical', async ({ page }) => {
  let release: () => Promise<void>;
  let requested = false;
  await page.route('https://api.openai.com/v1/chat/completions', async route => {
    requested = true;
    await new Promise<void>(resolve => { release = async () => { await route.fulfill({ json: { choices: [{ message: { content: 'UNSAFE STALE COACHING' } }] } }); resolve(); }; });
  });
  await seed(page, baseState());
  await page.evaluate(() => { (window as any).pendingReply = (window as any).callPolarisLLM('hello', 'test-placeholder'); });
  await expect.poll(() => requested).toBe(true);
  await page.evaluate(() => (window as any).triggerCrisisOverlay());
  await page.getByRole('button', { name: 'Return to my plan' }).click();
  await release!();
  expect(await page.evaluate(() => (window as any).pendingReply)).toBe('');
});

test('support remains usable when browser storage is unavailable @critical', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('storage disabled'); } });
  });
  await page.goto('/');
  await page.evaluate(() => (window as any).SNFSafety.open());
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('combobox').selectOption('US');
  await expect(page.getByRole('link', { name: 'Call 988 — United States', exact: true })).toBeVisible();
});

test('offline reload and the public crisis route keep support available @critical', async ({ page, context }) => {
  await seed(page, baseState());
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await page.evaluate(() => (window as any).triggerCrisisOverlay());
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.goto('/crisis');
  await expect(page.getByRole('heading', { name: 'Crisis / Urgent Support' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Call 988', exact: true })).toBeVisible();
});


test('public support options expose resources and script; Escape is an explicit exit @critical', async ({ page }) => {
  await seed(page, baseState({ safeContacts: 'Alex — saved trusted person' }));
  await page.goto('/crisis');
  await page.getByRole('link', { name: 'Open support options, contacts and help request' }).click();
  await expect(page.locator('#snf-support-contacts')).toHaveText('Alex — saved trusted person');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#snf-support-script')).toContainText('Can you call me');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(await page.evaluate(() => (window as any).SNFSafety.isActive())).toBe(false);
});

test('a failed routing script leaves visible public crisis help and blocks ordinary rewards @critical', async ({ page }) => {
  await page.route('**/src/safety-routing.js', route => route.abort());
  await seed(page, baseState({ securityPin: '1234' }));
  const link = page.getByRole('link', { name: 'Crisis Help — no PIN required', exact: true });
  await expect(link).toBeVisible();
  await page.evaluate(() => (window as any).polarisFloorWin());
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('state_not_fate_state')!).polaris.proof.total)).toBe(0);
  await link.click();
  await expect(page.getByRole('link', { name: 'Call 988', exact: true })).toBeVisible();
});


test('Back from public crisis help retains routing; a new tab starts a new session @critical', async ({ page, context }) => {
  await seed(page, baseState());
  await page.goto('/crisis');
  await page.goBack();
  await expect(page.getByRole('dialog')).toBeVisible();
  const freshTab = await context.newPage();
  await freshTab.goto('/');
  await expect(freshTab.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('dialog')).toBeVisible();
  await freshTab.close();
});
