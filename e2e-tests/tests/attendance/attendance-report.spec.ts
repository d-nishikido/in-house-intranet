const { test, expect } = require('@playwright/test');

test.describe('勤怠報告ページ', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[type="email"]', 'tanaka@company.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await expect(page.locator('h1:has-text("田中太郎さんのページ")')).toBeVisible();
  });

  test('勤怠報告ページへのナビゲーション', async ({ page }) => {
    // Navigate to attendance report page
    await page.click('a[href="/attendance/report"]');
    
    // Verify URL and page title
    await expect(page).toHaveURL('/attendance/report');
    await expect(page.locator('h1:has-text("勤怠報告")')).toBeVisible();
    
    // Verify back to home link exists
    await expect(page.locator('a:has-text("← ホームに戻る")')).toBeVisible();
  });

  test('サマリーカードの表示', async ({ page }) => {
    await page.goto('http://localhost:3000/attendance/report');
    
    // Wait for summary cards to load
    await expect(page.locator('text=出勤日数')).toBeVisible();
    await expect(page.locator('text=承認済み')).toBeVisible();
    await expect(page.locator('text=承認待ち')).toBeVisible();
    await expect(page.locator('text=残業時間')).toBeVisible();
    
    // Verify summary values are displayed
    await expect(page.locator('text=8日')).toBeVisible(); // Total days
    await expect(page.locator('text=6日')).toBeVisible(); // Approved days
    await expect(page.locator('text=2日')).toBeVisible(); // Pending days
    await expect(page.locator('text=2.50時間')).toBeVisible(); // Overtime hours
  });

  test('勤怠記録テーブルの表示', async ({ page }) => {
    await page.goto('http://localhost:3000/attendance/report');
    
    // Wait for table to load
    await expect(page.locator('h2:has-text("勤怠記録")')).toBeVisible();
    
    // Verify table headers
    const headers = ['日付', '出勤時刻', '退勤時刻', '休憩時間', '勤務時間', '残業時間', 'ステータス', '備考'];
    for (const header of headers) {
      await expect(page.locator(`th:has-text("${header}")`)).toBeVisible();
    }
    
    // Verify at least one attendance record is displayed
    await expect(page.locator('tbody tr')).toHaveCount.greaterThan(0);
    
    // Verify specific data in first row (most recent record)
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow.locator('td').nth(0)).toContainText('2025/7/24');
    await expect(firstRow.locator('td').nth(1)).toContainText('09:00');
    await expect(firstRow.locator('td').nth(6)).toContainText('承認待ち');
    await expect(firstRow.locator('td').nth(7)).toContainText('勤務中');
  });

  test('ステータスバッジの表示', async ({ page }) => {
    await page.goto('http://localhost:3000/attendance/report');
    
    // Wait for table to load
    await expect(page.locator('tbody tr')).toHaveCount.greaterThan(0);
    
    // Verify status badges are displayed correctly
    await expect(page.locator('.bg-yellow-100:has-text("承認待ち")')).toBeVisible();
    await expect(page.locator('.bg-green-100:has-text("承認済み")')).toBeVisible();
  });

  test('日付フィルター機能', async ({ page }) => {
    await page.goto('http://localhost:3000/attendance/report');
    
    // Wait for initial data to load
    await expect(page.locator('tbody tr')).toHaveCount.greaterThan(0);
    
    // Verify date inputs are present and have default values
    const startDateInput = page.locator('input[type="date"]').first();
    const endDateInput = page.locator('input[type="date"]').last();
    
    await expect(startDateInput).toBeVisible();
    await expect(endDateInput).toBeVisible();
    
    // Verify default date values (current month)
    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const expectedStartDate = firstDay.toISOString().split('T')[0];
    const expectedEndDate = lastDay.toISOString().split('T')[0];
    
    await expect(startDateInput).toHaveValue(expectedStartDate);
    await expect(endDateInput).toHaveValue(expectedEndDate);
    
    // Test date filter functionality
    await startDateInput.fill('2025-07-01');
    await endDateInput.fill('2025-07-03');
    await page.click('button:has-text("検索")');
    
    // Wait for filtered results
    await page.waitForTimeout(1000);
    
    // Verify that results are filtered (should show fewer records)
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount.greaterThan(0);
  });

  test('勤務時間の計算表示', async ({ page }) => {
    await page.goto('http://localhost:3000/attendance/report');
    
    // Wait for table to load
    await expect(page.locator('tbody tr')).toHaveCount.greaterThan(0);
    
    // Find a completed work day (with check-in and check-out times)
    const completedRow = page.locator('tbody tr:has(td:nth-child(3):not(:has-text("-")))').first();
    
    // Verify working hours are calculated and displayed
    await expect(completedRow.locator('td').nth(4)).not.toContainText('-');
    
    // Verify overtime hours are displayed
    await expect(completedRow.locator('td').nth(5)).toContainText('時間');
  });

  test('空のデータ状態の処理', async ({ page }) => {
    await page.goto('http://localhost:3000/attendance/report');
    
    // Set date range with no data
    await page.fill('input[type="date"]:first-of-type', '2025-01-01');
    await page.fill('input[type="date"]:last-of-type', '2025-01-02');
    await page.click('button:has-text("検索")');
    
    // Wait for search to complete
    await page.waitForTimeout(1000);
    
    // Verify empty state message
    await expect(page.locator('text=指定した期間の勤怠記録がありません')).toBeVisible();
  });

  test('レスポンシブデザイン - モバイルビュー', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:3000/attendance/report');
    
    // Verify page elements are still visible and accessible on mobile
    await expect(page.locator('h1:has-text("勤怠報告")')).toBeVisible();
    await expect(page.locator('text=出勤日数')).toBeVisible();
    
    // Verify table is horizontally scrollable
    await expect(page.locator('.overflow-x-auto')).toBeVisible();
  });

  test('ホームページへの戻りリンク', async ({ page }) => {
    await page.goto('http://localhost:3000/attendance/report');
    
    // Click back to home link
    await page.click('a:has-text("← ホームに戻る")');
    
    // Verify navigation to home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('h2:has-text("お知らせ")')).toBeVisible();
  });

  test('認証が必要なページのアクセス制御', async ({ page }) => {
    // Clear authentication
    await page.evaluate(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });
    
    // Try to access attendance report page without authentication
    await page.goto('http://localhost:3000/attendance/report');
    
    // Should be redirected to login page
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1:has-text("ログイン")')).toBeVisible();
  });

  test('エラー処理 - APIエラー時の表示', async ({ page }) => {
    // Block API requests to simulate server error
    await page.route('**/api/attendance/**', route => {
      route.abort();
    });
    
    await page.goto('http://localhost:3000/attendance/report');
    
    // Wait for error message to appear
    await expect(page.locator('text=勤怠記録の取得に失敗しました')).toBeVisible({ timeout: 5000 });
  });
});