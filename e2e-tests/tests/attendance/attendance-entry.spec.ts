import { test, expect } from '@playwright/test';
import { testUsers } from '../../fixtures/test-data';

test.describe('勤怠報告入力ページ', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    
    // Wait for login form to be visible
    await page.waitForSelector('#email', { timeout: 10000 });
    
    await page.fill('#email', testUsers.validUser.email);
    await page.fill('#password', testUsers.validUser.password);
    await page.click('button[type="submit"]');
    
    // Wait for login to complete and navigate to attendance entry
    await page.waitForURL('/');
    await page.goto('/attendance/entry');
  });

  test('ページの基本要素が表示される', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1:has-text("勤怠報告入力")')).toBeVisible();
    
    // Verify form elements
    await expect(page.locator('input[name="date"]')).toBeVisible();
    await expect(page.locator('input[name="checkInTime"]')).toBeVisible();
    await expect(page.locator('input[name="checkOutTime"]')).toBeVisible();
    await expect(page.locator('input[name="breakStartTime"]')).toBeVisible();
    await expect(page.locator('input[name="breakEndTime"]')).toBeVisible();
    await expect(page.locator('textarea[name="notes"]')).toBeVisible();
    
    // Verify buttons
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('a:has-text("キャンセル")')).toBeVisible();
  });

  test('デフォルト値が正しく設定される', async ({ page }) => {
    // Check default date (today)
    const today = new Date().toISOString().split('T')[0];
    await expect(page.locator('input[name="date"]')).toHaveValue(today);
    
    // Check default break times
    await expect(page.locator('input[name="breakStartTime"]')).toHaveValue('12:00');
    await expect(page.locator('input[name="breakEndTime"]')).toHaveValue('13:00');
  });

  test('勤務時間の自動計算が正しく動作する', async ({ page }) => {
    // Input times
    await page.fill('input[name="checkInTime"]', '09:00');
    await page.fill('input[name="checkOutTime"]', '18:00');
    
    // Wait for calculation
    await page.waitForTimeout(500);
    
    // Verify calculated working hours (9:00-18:00 with 1h break = 8:00)
    await expect(page.locator('text=勤務時間:').locator('..').locator('span.font-semibold')).toContainText('8:00');
    
    // Verify overtime hours (8 hours is standard, so 0 overtime)
    await expect(page.locator('text=残業時間:').locator('..').locator('span.font-semibold')).toContainText('0時間');
  });

  test('残業時間の計算が正しく動作する', async ({ page }) => {
    // Input times with overtime
    await page.fill('input[name="checkInTime"]', '09:00');
    await page.fill('input[name="checkOutTime"]', '20:00');
    
    // Wait for calculation
    await page.waitForTimeout(500);
    
    // Verify calculated working hours (9:00-20:00 with 1h break = 10:00)
    await expect(page.locator('text=勤務時間:').locator('..').locator('span.font-semibold')).toContainText('10:00');
    
    // Verify overtime hours (10 - 8 = 2 hours overtime)
    await expect(page.locator('text=残業時間:').locator('..').locator('span.font-semibold')).toContainText('2時間');
  });

  test('入力検証が正しく動作する', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show required field validation
    await expect(page.locator('text=出勤時刻を入力してください')).toBeVisible();
  });

  test('退勤時刻が出勤時刻より早い場合のエラー', async ({ page }) => {
    await page.fill('input[name="checkInTime"]', '18:00');
    await page.fill('input[name="checkOutTime"]', '09:00');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=退勤時刻は出勤時刻より後の時間を入力してください')).toBeVisible();
  });

  test('フォーム送信が成功する', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/attendance/records', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          employee_id: 1,
          date: '2025-07-24',
          check_in_time: '09:00',
          check_out_time: '18:00',
          break_start_time: '12:00',
          break_end_time: '13:00',
          overtime_hours: 0,
          notes: 'テスト入力',
          status: 'pending'
        })
      });
    });

    // Fill form
    await page.fill('input[name="checkInTime"]', '09:00');
    await page.fill('input[name="checkOutTime"]', '18:00');
    await page.fill('textarea[name="notes"]', 'テスト入力');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify success message
    await expect(page.locator('text=勤怠報告が正常に送信されました')).toBeVisible();
  });

  test('ナビゲーションリンクが正しく動作する', async ({ page }) => {
    // Test cancel link
    await page.click('a:has-text("キャンセル")');
    await expect(page).toHaveURL('/attendance/report');
    
    // Go back to entry page
    await page.goto('/attendance/entry');
    
    // Test back to home link
    await page.click('a:has-text("← ホームに戻る")');
    await expect(page).toHaveURL('/');
  });

  test('レスポンシブデザインの確認', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify main elements are still visible
    await expect(page.locator('h1:has-text("勤怠報告入力")')).toBeVisible();
    await expect(page.locator('input[name="checkInTime"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Reset to desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe('勤怠報告入力ページ - ホームページからのアクセス', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', testUsers.validUser.email);
    await page.fill('input[type="password"]', testUsers.validUser.password);
    await page.click('button[type="submit"]');
    await expect(page.locator(`h1:has-text("${testUsers.validUser.name}さんのページ")`)).toBeVisible();
  });

  test('ホームページから勤怠報告入力にアクセスできる', async ({ page }) => {
    // Should be on home page
    await expect(page).toHaveURL('/');
    
    // Find and click attendance entry link
    await page.click('a:has-text("勤怠報告入力")');
    
    // Should navigate to attendance entry page
    await expect(page).toHaveURL('/attendance/entry');
    await expect(page.locator('h1:has-text("勤怠報告入力")')).toBeVisible();
  });
});