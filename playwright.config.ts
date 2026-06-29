import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));

// Load the project's .env for JWT_SECRET etc., then overlay .env.playwright
// for the plain-text admin password used by E2E login tests.
dotenv.config({ path: path.join(here, '.env') });
dotenv.config({ path: path.join(here, '.env.playwright'), override: false });

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
