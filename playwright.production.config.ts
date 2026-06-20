import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: false,
  globalTimeout: 8 * 60 * 1000, // 8 minutes — hard stop before the 10-min job limit
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'https://statenotfate.netlify.app',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
