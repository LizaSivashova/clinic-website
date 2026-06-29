import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Relative paths resolve from process.cwd() = project root when running npm run test:e2e.
// .env holds server config; .env.playwright holds the plain admin password for E2E login.
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.playwright', override: false });

export default defineConfig({
  testDir: './e2e',
  // Run tests one at a time — they share the real SQLite database.
  fullyParallel: false,
  workers: 1,

  use: {
    baseURL: 'http://localhost:5173',
    // Save a trace on the first retry so you can inspect failures step-by-step.
    trace: 'on-first-retry',
    locale: 'he-IL',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Start both dev servers before running tests.
  // reuseExistingServer: true means "don't crash if already running".
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
