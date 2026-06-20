import { expect, test } from '@playwright/test';

// Helper to format date relative to today
function getRelativeDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

test('Smart Re-Entry Card - Missed Yesterday Message @advisory', async ({ page }) => {
  await page.goto('/');

  // Set state for missed yesterday
  await page.evaluate((yesterday) => {
    localStorage.setItem('state_not_fate_state', JSON.stringify({
      isOnboarded: true,
      ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
      safety: { suicide: 0, psychosis: 0, mania: 0 },
      customMantra: "I am in a state, not a fate.",
      negativeBeliefs: "",
      worstTime: "morning",
      stillWorks: "",
      mvd: [
        "Wake on workdays by 7:30am, drink water, take morning medication.",
        "Brush teeth, eat a simple protein block before energy crash.",
        "Stand outside for 2 minutes in daylight, keep tomorrow's clothes pre-positioned."
      ],
      todayEnergy: "medium",
      history: [
        { date: yesterday, energy: "medium", completed: [], floorCompleted: false, missed: true }
      ],
      lastVisitDate: yesterday,
      reEntry: {
        lastSeenDate: null,
        missedDays: 0,
        lastMessageType: null
      }
    }));
  }, getRelativeDateStr(1));

  // Reload page to apply state
  await page.goto('/');

  // Navigate to Dashboard tab
  await page.click('button[data-tab="dashboard"]');

  // Verify the reentry card is visible and displays the missed yesterday message
  const card = page.locator('#reentry-card-container');
  await expect(card).toBeVisible();
  await expect(card).toContainText('You missed a day. That is data, not a verdict. Restart with one small anchor.');

  // Click "Start smallest anchor" button
  const startBtn = card.locator('button:has-text("Start smallest anchor")');
  await startBtn.click();

  // Verify first anchor task is checked
  const firstTaskItem = page.locator('.task-item').first();
  await expect(firstTaskItem).toHaveClass(/checked/);
});

test('Smart Re-Entry Card - Away Multiple Days Message @advisory', async ({ page }) => {
  await page.goto('/');

  // Set state for 3 days ago
  await page.evaluate((threeDaysAgo) => {
    localStorage.setItem('state_not_fate_state', JSON.stringify({
      isOnboarded: true,
      ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
      safety: { suicide: 0, psychosis: 0, mania: 0 },
      customMantra: "I am in a state, not a fate.",
      negativeBeliefs: "",
      worstTime: "morning",
      stillWorks: "",
      mvd: [
        "Wake on workdays by 7:30am, drink water, take morning medication.",
        "Brush teeth, eat a simple protein block before energy crash.",
        "Stand outside for 2 minutes in daylight, keep tomorrow's clothes pre-positioned."
      ],
      todayEnergy: "medium",
      history: [
        { date: threeDaysAgo, energy: "medium", completed: ["Wake on workdays by 7:30am, drink water, take morning medication."], floorCompleted: false }
      ],
      lastVisitDate: threeDaysAgo,
      reEntry: {
        lastSeenDate: null,
        missedDays: 0,
        lastMessageType: null
      }
    }));
  }, getRelativeDateStr(3));

  // Reload page
  await page.goto('/');
  await page.click('button[data-tab="dashboard"]');

  // Verify away multiple days message
  const card = page.locator('#reentry-card-container');
  await expect(card).toContainText('You were away for a bit. No penalty. The system resumes at the smallest useful step.');
});

test('Smart Re-Entry Card - Low/Collapse Energy Override @advisory', async ({ page }) => {
  await page.goto('/');

  // Set state with todayEnergy = collapse
  await page.evaluate((yesterday) => {
    localStorage.setItem('state_not_fate_state', JSON.stringify({
      isOnboarded: true,
      ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
      safety: { suicide: 0, psychosis: 0, mania: 0 },
      customMantra: "I am in a state, not a fate.",
      negativeBeliefs: "",
      worstTime: "morning",
      stillWorks: "",
      mvd: [
        "Wake on workdays by 7:30am, drink water, take morning medication.",
        "Brush teeth, eat a simple protein block before energy crash.",
        "Stand outside for 2 minutes in daylight, keep tomorrow's clothes pre-positioned."
      ],
      todayEnergy: "collapse",
      history: [
        { date: yesterday, energy: "medium", completed: [], floorCompleted: false, missed: true }
      ],
      lastVisitDate: yesterday,
      reEntry: {
        lastSeenDate: null,
        missedDays: 0,
        lastMessageType: null
      }
    }));
  }, getRelativeDateStr(1));

  // Reload page
  await page.goto('/');
  await page.click('button[data-tab="dashboard"]');

  // Verify low energy override message is shown
  const card = page.locator('#reentry-card-container');
  await expect(card).toContainText('Low energy changes the plan. It does not cancel the day. Use Floor Wins Mode.');
});
