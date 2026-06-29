import { test, expect } from '@playwright/test';

// Credentials are loaded from .env.playwright (git-ignored).
// Copy .env.playwright.example and fill in the real admin password.
const ADMIN_USERNAME = process.env.PLAYWRIGHT_ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? '';

test.describe('Admin login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
  });

  test('wrong password shows Hebrew error message and stays on login page', async ({ page }) => {
    await page.getByPlaceholder('admin').fill(ADMIN_USERNAME);
    await page.getByPlaceholder('••••••••').fill('definitely-wrong-password');
    await page.getByRole('button', { name: 'התחברות' }).click();

    // AdminLogin sets an error state and shows this message
    await expect(page.getByText('פרטי התחברות שגויים.')).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL('/admin/login');
  });

  test('correct credentials redirect to /admin dashboard', async ({ page }) => {
    await page.getByPlaceholder('admin').fill(ADMIN_USERNAME);
    await page.getByPlaceholder('••••••••').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'התחברות' }).click();

    await expect(page).toHaveURL('/admin', { timeout: 8000 });
    await expect(page.getByText('סקירה')).toBeVisible();
  });

  test('unauthenticated visit to /admin redirects away from the dashboard', async ({ page }) => {
    // RequireAuth sends the user back to / when there is no access token.
    await page.goto('/admin');
    await expect(page).toHaveURL('/');
  });
});
