import { chromium } from '@playwright/test';

async function run() {
  console.log('Testing https://statenotfatebeta.netlify.app ...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleLogs.push(`[ERROR] ${err.message}`));

  const response = await page.goto('https://statenotfatebeta.netlify.app', { waitUntil: 'networkidle' });
  console.log('Status code:', response.status());

  const computedStyles = await page.evaluate(() => {
    const body = document.body;
    const computed = window.getComputedStyle(body);
    const cssVars = {
      bgPrimary: computed.getPropertyValue('--bg-primary').trim(),
      fontSans: computed.getPropertyValue('--font-sans').trim(),
      fontFuturistic: computed.getPropertyValue('--font-futuristic').trim(),
      accentTeal: computed.getPropertyValue('--accent-teal').trim(),
      accentRed: computed.getPropertyValue('--accent-red').trim()
    };
    return {
      backgroundColor: computed.backgroundColor,
      fontFamily: computed.fontFamily,
      cssVars,
      title: document.title,
      h1Text: document.querySelector('h1')?.innerText,
      cssLink: document.querySelector('link[rel="stylesheet"]')?.href
    };
  });

  console.log('Computed styles and DOM:', JSON.stringify(computedStyles, null, 2));
  console.log('Console logs count:', consoleLogs.length);
  if (consoleLogs.length > 0) {
    console.log('Console logs (first 10):', consoleLogs.slice(0, 10));
  }

  await page.screenshot({ path: 'beta-stress-test.png', fullPage: true });
  console.log('Screenshot saved to beta-stress-test.png');

  console.log('Testing local file:///C:/Users/rappd/OneDrive/Desktop/SNF_Deploy/index.html ...');
  await page.goto('file:///C:/Users/rappd/OneDrive/Desktop/SNF_Deploy/index.html', { waitUntil: 'load' });
  await page.screenshot({ path: 'local-preview.png', fullPage: true });
  console.log('Local preview screenshot saved to local-preview.png');

  await browser.close();
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
