import { chromium } from '@playwright/test';
import * as fs from 'fs';

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.error(`[Browser PageError]:`, err.stack || err.message || err);
  });

  console.log("Navigating to page first time...");
  await page.goto('http://127.0.0.1:4173/');
  
  console.log("Setting localStorage...");
  await page.evaluate(() => {
    localStorage.setItem('state_not_fate_state', JSON.stringify({
      isOnboarded: true,
      ratings: {
        sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2
      },
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
      reasonsLive: "Family, projects, future possibilities.",
      safeContacts: "David (555-0192)",
      distractions: "Walking, listening to audio, box breathing.",
      linkedFiles: [],
      todayEnergy: "medium",
      mantraCompletedToday: false,
      history: [],
      currentHopeLevel: 1,
      hopeProgress: 0,
      dominantPattern: "Rhythm Collapse",
      phq9History: [],
      currentLayer: 0,
      activeMediaIndex: -1,
      playbackSpeed: 1.0,
      gratitudeJournal: [],
      thoughtCorrections: [],
      customTasks: [],
      securityPin: "",
      isLocked: false,
      userAnchors: [],
      firstUseDate: '',
      tomorrowAnchor: '',
      personalBests: { longestStreak: 0, mostAnchorsInDay: 0, fastestRestart: null },
      polarisUpgrade: false,
      polarisHistory: [],
      polarisRestartLogs: [],
      polaris: {
        enabled: false,
        proof: { total: 0, today: 0, ledger: [] },
        resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' },
        day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false },
        anchors: {
          today: {}
        },
        quests: { daily: [] },
        profile: {},
        questionnaire: {},
        routing: {}
      }
    }));
  });

  console.log("Reloading page to apply state...");
  await page.goto('http://127.0.0.1:4173/');
  
  console.log("Taking screenshot after page load...");
  await page.screenshot({ path: 'screenshot-after-load.png' });
  
  console.log("Attempting to click button[data-energy=\"medium\"]...");
  try {
    // Wait up to 5 seconds
    await page.click('button[data-energy="medium"]', { timeout: 5000 });
    console.log("Click succeeded!");
  } catch (e) {
    console.error("Click failed:", e.message);
    await page.screenshot({ path: 'screenshot-failed-click.png' });
  }

  await browser.close();
  console.log("Done.");
})();
