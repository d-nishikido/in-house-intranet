import { test, expect } from '@playwright/test';

test.describe('勤怠報告ページ - 基本テスト', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[type="email"]', 'tanaka@company.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await expect(page.locator('h1:has-text("田中太郎さんのページ")')).toBeVisible();
  });

  test('勤怠報告ページの基本表示', async ({ page }) => {
    // Navigate to attendance report page
    await page.click('a[href="/attendance/report"]');
    
    // Verify page loads correctly
    await expect(page).toHaveURL('/attendance/report');
    await expect(page.locator('h1:has-text("勤怠報告")')).toBeVisible();
    
    // Verify summary section exists
    await expect(page.locator('text=出勤日数')).toBeVisible();
    await expect(page.locator('text=承認済み')).toBeVisible();
    
    // Verify table exists
    await expect(page.locator('h2:has-text("勤怠記録")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });
});