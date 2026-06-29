import { test, expect, type Page } from '@playwright/test';

const ADMIN_USERNAME = process.env.PLAYWRIGHT_ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? '';

async function loginAndGoToSettings(page: Page) {
  await page.goto('/admin/login');
  await page.getByPlaceholder('admin').fill(ADMIN_USERNAME);
  await page.getByPlaceholder('••••••••').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'התחברות' }).click();
  await page.waitForURL('/admin', { timeout: 8000 });
  await page.getByRole('button', { name: 'הגדרות' }).click();
  await expect(page.getByText('התראות במייל')).toBeVisible();
}

test.describe('Settings — notification email', () => {

  test('saves a new notification email and shows success message', async ({ page }) => {
    await loginAndGoToSettings(page);

    const emailInput = page.getByPlaceholder('demo@example.com');
    await emailInput.clear();
    await emailInput.fill('new-notify@test.com');
    await page.getByRole('button', { name: 'שמירת הגדרות' }).click();

    await expect(page.getByText('ההגדרות נשמרו')).toBeVisible({ timeout: 5000 });
  });

  test('changed email persists across page reload', async ({ page }) => {
    await loginAndGoToSettings(page);

    const emailInput = page.getByPlaceholder('demo@example.com');
    await emailInput.clear();
    await emailInput.fill('reload-check@test.com');
    await page.getByRole('button', { name: 'שמירת הגדרות' }).click();
    await expect(page.getByText('ההגדרות נשמרו')).toBeVisible({ timeout: 5000 });

    // Log back in — the value is persisted in SQLite, not just React state
    await loginAndGoToSettings(page);
    await expect(page.getByPlaceholder('demo@example.com')).toHaveValue('reload-check@test.com');
  });
});
