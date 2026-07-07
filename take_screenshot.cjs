const { chromium } = require('@playwright/test');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    // Set localStorage state to bypass onboarding and set up polaris
    await page.goto('http://127.0.0.1:4173/');
    await page.evaluate(() => {
        localStorage.setItem('state_not_fate_state', JSON.stringify({
            isOnboarded: true,
            ratings: { sleep: 3, morning: 2, initiation: 2, clutter: 1, energy: 2, shame: 1, hygiene: 1, eating: 1, social: 1, meaning: 2 },
            safety: { suicide: 0, psychosis: 0, mania: 0 },
            customMantra: "I am in a state, not a fate.",
            mvd: ["Wake up on time.", "Drink water.", "Stand outside."],
            history: [],
            polaris: { enabled: true, proof: { total: 10, today: 10, ledger: [] }, resilience: { current: 0, longest: 0, missedDays: 0, lastCompletedDate: '' }, day: { currentState: 'medium', lastCheckInDate: '', difficulty: 'easy', pacing: 'slow', floorWinsMode: false }, anchors: { today: {} }, quests: { daily: [] } },
            supportMap: { anchorPerson: "Alice (555-0100)", bufferContact: "Bob (555-0200)", safeEnvironment: "Quiet park bench" }
        }));
    });

    await page.goto('http://127.0.0.1:4173/');
    await page.waitForTimeout(2000); // Wait for rendering
    await browser.close();
})();
