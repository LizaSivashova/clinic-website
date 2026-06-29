import { test, expect } from '@playwright/test';

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#zt-contact').scrollIntoViewIfNeeded();
  });

  test('email field is present in the form (regression guard for the missing-email bug)', async ({ page }) => {
    // This test would have failed before the bug fix — it proves the field exists.
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible();
  });

  test('browser blocks submission when a required field is empty', async ({ page }) => {
    // Click submit without filling anything — HTML5 `required` attributes
    // prevent submission and focus the first empty field.
    await page.getByRole('button', { name: 'שליחת הפנייה' }).click();
    // The name input should be focused (browser puts focus on the first failing field)
    await expect(page.getByPlaceholder('השם שלך')).toBeFocused();
    // The success state must NOT appear
    await expect(page.getByText('הפנייה נשלחה')).not.toBeVisible();
  });

  test('valid submission shows success confirmation', async ({ page }) => {
    await page.getByPlaceholder('השם שלך').fill('בדיקת E2E');
    await page.getByPlaceholder('050-0000000').fill('050-1234567');
    await page.getByPlaceholder('your@email.com').fill('e2e@test.com');
    // Topic defaults to first option — no change needed
    await page.getByPlaceholder('מה מביא אתכם לפנות?').fill('בדיקה אוטומטית');
    await page.getByRole('button', { name: 'שליחת הפנייה' }).click();

    await expect(page.getByText('הפנייה נשלחה')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('תודה שפניתם')).toBeVisible();
  });

  test('"send another" resets the form to empty', async ({ page }) => {
    await page.getByPlaceholder('השם שלך').fill('איפוס טופס');
    await page.getByPlaceholder('050-0000000').fill('052-1112222');
    await page.getByPlaceholder('your@email.com').fill('reset@test.com');
    await page.getByRole('button', { name: 'שליחת הפנייה' }).click();
    await expect(page.getByText('הפנייה נשלחה')).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: 'שליחת פנייה נוספת' }).click();
    await expect(page.getByPlaceholder('השם שלך')).toHaveValue('');
    await expect(page.getByPlaceholder('your@email.com')).toHaveValue('');
  });
});
