import { chromium } from '@playwright/test';

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

  console.log("Navigating to page...");
  try {
    await page.goto('http://127.0.0.1:4173/');
    
    // Set state in localStorage
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
        mvd: ["Wake up.", "Drink water.", "Stand outside."],
        reasonsLive: "Family",
        safeContacts: "David",
        distractions: "Walking",
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
          anchors: { today: {} },
          quests: { daily: [] }
        }
      }));
    });

    console.log("Reloading page to apply state...");
    await page.goto('http://127.0.0.1:4173/');
    await page.waitForTimeout(3000);

    // Query active screen
    const visibility = await page.evaluate(() => {
      const screens = {
        welcome: !document.getElementById('screen-welcome').classList.contains('hidden'),
        dashboard: !document.getElementById('screen-dashboard').classList.contains('hidden'),
        lock: !document.getElementById('screen-lock').classList.contains('hidden'),
        stateSelector: !document.getElementById('screen-state-selector').classList.contains('hidden'),
        profileDepth: !document.getElementById('screen-profile-depth').classList.contains('hidden'),
        intake: !document.getElementById('screen-intake').classList.contains('hidden'),
      };
      return screens;
    });
    console.log("Active screens state:", visibility);

  } catch (e) {
    console.error("Navigation failed:", e);
  }
  
  await browser.close();
  console.log("Done.");
})();
