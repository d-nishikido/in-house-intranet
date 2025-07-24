import { test, expect } from '@playwright/test';
import { testUsers, testAttendanceData, testLeaveData } from '../../fixtures/test-data';

test.describe('勤怠報告ページ - 機能テスト', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    
    await page.fill('input[type="email"]', testUsers.validUser.email);
    await page.fill('input[type="password"]', testUsers.validUser.password);
    await page.click('button[type="submit"]');
    
    // Wait for login to complete and navigate to attendance report
    await expect(page.locator(`h1:has-text("${testUsers.validUser.name}さんのページ")`)).toBeVisible();
    await page.goto('/attendance/report');
  });

  test('サマリーデータの正確な表示', async ({ page }) => {
    // Wait for summary data to load
    await expect(page.locator('text=出勤日数')).toBeVisible();
    
    // Verify summary values match test data
    const summaryCards = page.locator('.grid .bg-white.p-4');
    
    // Check total days
    await expect(summaryCards.nth(0)).toContainText(`${testAttendanceData.summary.totalDays}日`);
    
    // Check approved days
    await expect(summaryCards.nth(1)).toContainText(`${testAttendanceData.summary.approvedDays}日`);
    
    // Check pending days
    await expect(summaryCards.nth(2)).toContainText(`${testAttendanceData.summary.pendingDays}日`);
    
    // Check overtime hours
    await expect(summaryCards.nth(3)).toContainText(`${testAttendanceData.summary.totalOvertime}時間`);
  });

  test('勤怠記録テーブルのデータ検証', async ({ page }) => {
    // Wait for table to load
    await expect(page.locator('table tbody tr')).toHaveCount.greaterThan(0);
    
    // Get the first record from test data (most recent)
    const firstRecord = testAttendanceData.records[0];
    const firstRow = page.locator('tbody tr').first();
    
    // Verify first row data
    await expect(firstRow.locator('td').nth(0)).toContainText('2025/7/24');
    await expect(firstRow.locator('td').nth(1)).toContainText(firstRecord.checkInTime);
    
    if (firstRecord.checkOutTime) {
      await expect(firstRow.locator('td').nth(2)).toContainText(firstRecord.checkOutTime);
    } else {
      await expect(firstRow.locator('td').nth(2)).toContainText('-');
    }
    
    // Verify status badge
    if (firstRecord.status === 'pending') {
      await expect(firstRow.locator('.bg-yellow-100')).toContainText('承認待ち');
    } else if (firstRecord.status === 'approved') {
      await expect(firstRow.locator('.bg-green-100')).toContainText('承認済み');
    }
    
    // Verify notes
    if (firstRecord.notes) {
      await expect(firstRow.locator('td').nth(7)).toContainText(firstRecord.notes);
    }
  });

  test('勤務時間の計算機能', async ({ page }) => {
    // Wait for table to load
    await expect(page.locator('table tbody tr')).toHaveCount.greaterThan(0);
    
    // Find a completed work day row (with both check-in and check-out)
    const completedRows = page.locator('tbody tr').filter({
      has: page.locator('td:nth-child(3):not(:has-text("-"))')
    });
    
    // Verify at least one completed work day exists
    await expect(completedRows.first()).toBeVisible();
    
    // Check the second row (index 1) which should be 2025/7/23
    const secondRow = page.locator('tbody tr').nth(1);
    
    // Verify working hours calculation for standard work day (9:00-18:00 with 1h break = 8:00)
    await expect(secondRow.locator('td').nth(4)).toContainText('8:00');
    
    // Verify overtime hours display
    await expect(secondRow.locator('td').nth(5)).toContainText('0.00時間');
  });

  test('残業時間の正確な表示', async ({ page }) => {
    // Wait for table to load
    await expect(page.locator('table tbody tr')).toHaveCount.greaterThan(0);
    
    // Find the overtime record (2025/7/3 with 2.00 hours overtime)
    const overtimeRow = page.locator('tbody tr').filter({
      has: page.locator('td:first-child:has-text("2025/7/3")')
    });
    
    await expect(overtimeRow).toBeVisible();
    
    // Verify overtime hours
    await expect(overtimeRow.locator('td').nth(5)).toContainText('2.00時間');
    
    // Verify working hours calculation (8:45-19:00 with 1h break = 9:15)
    await expect(overtimeRow.locator('td').nth(4)).toContainText('9:15');
    
    // Verify status is pending
    await expect(overtimeRow.locator('.bg-yellow-100')).toContainText('承認待ち');
  });

  test('ステータスバッジの表示とスタイル', async ({ page }) => {
    // Wait for table to load
    await expect(page.locator('table tbody tr')).toHaveCount.greaterThan(0);
    
    // Check pending status badges
    const pendingBadges = page.locator('.bg-yellow-100.text-yellow-800:has-text("承認待ち")');
    await expect(pendingBadges).toHaveCount(testAttendanceData.summary.pendingDays);
    
    // Check approved status badges
    const approvedBadges = page.locator('.bg-green-100.text-green-800:has-text("承認済み")');
    await expect(approvedBadges).toHaveCount(testAttendanceData.summary.approvedDays);
  });

  test('日付フィルター機能の動作', async ({ page }) => {
    // Wait for initial data to load
    await expect(page.locator('tbody tr')).toHaveCount.greaterThan(0);
    const initialRowCount = await page.locator('tbody tr').count();
    
    // Apply a custom date range filter
    const startDateInput = page.locator('input[type="date"]').first();
    const endDateInput = page.locator('input[type="date"]').last();
    
    await startDateInput.fill(testAttendanceData.dateFilters.customRange.startDate);
    await endDateInput.fill(testAttendanceData.dateFilters.customRange.endDate);
    
    // Click search button
    await page.click('button:has-text("検索")');
    
    // Wait for filtered results
    await page.waitForTimeout(1000);
    
    // Verify filtered results show fewer records
    const filteredRowCount = await page.locator('tbody tr').count();
    expect(filteredRowCount).toBeLessThan(initialRowCount);
    
    // Verify only records within the date range are shown
    const visibleDates = await page.locator('tbody tr td:first-child').allTextContents();
    for (const dateText of visibleDates) {
      const date = new Date(dateText.replace('/', '-'));
      const startDate = new Date(testAttendanceData.dateFilters.customRange.startDate);
      const endDate = new Date(testAttendanceData.dateFilters.customRange.endDate);
      
      expect(date).toBeGreaterThanOrEqual(startDate);
      expect(date).toBeLessThanOrEqual(endDate);
    }
  });

  test('空のデータ期間での処理', async ({ page }) => {
    // Set date range with no data
    const startDateInput = page.locator('input[type="date"]').first();
    const endDateInput = page.locator('input[type="date"]').last();
    
    await startDateInput.fill(testAttendanceData.dateFilters.emptyRange.startDate);
    await endDateInput.fill(testAttendanceData.dateFilters.emptyRange.endDate);
    
    // Click search button
    await page.click('button:has-text("検索")');
    
    // Wait for search to complete
    await page.waitForTimeout(1000);
    
    // Verify empty state message is displayed
    await expect(page.locator('text=指定した期間の勤怠記録がありません')).toBeVisible();
    
    // Verify table headers are still present
    await expect(page.locator('th:has-text("日付")')).toBeVisible();
  });

  test('休憩時間の表示形式', async ({ page }) => {
    // Wait for table to load
    await expect(page.locator('table tbody tr')).toHaveCount.greaterThan(0);
    
    // Find a row with break times
    const rowWithBreak = page.locator('tbody tr').filter({
      has: page.locator('td:nth-child(4):has-text("12:00 - 13:00")')
    });
    
    await expect(rowWithBreak.first()).toBeVisible();
    
    // Verify break time format
    await expect(rowWithBreak.first().locator('td').nth(3)).toContainText('12:00 - 13:00');
  });

  test('デフォルト日付範囲の設定', async ({ page }) => {
    // Get current date to calculate expected default range
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const expectedStartDate = firstDay.toISOString().split('T')[0];
    const expectedEndDate = lastDay.toISOString().split('T')[0];
    
    // Verify default date values
    const startDateInput = page.locator('input[type="date"]').first();
    const endDateInput = page.locator('input[type="date"]').last();
    
    await expect(startDateInput).toHaveValue(expectedStartDate);
    await expect(endDateInput).toHaveValue(expectedEndDate);
  });

  test('テーブルの列ヘッダー確認', async ({ page }) => {
    const expectedHeaders = ['日付', '出勤時刻', '退勤時刻', '休憩時間', '勤務時間', '残業時間', 'ステータス', '備考'];
    
    for (const header of expectedHeaders) {
      await expect(page.locator(`th:has-text("${header}")`)).toBeVisible();
    }
  });

  test('レスポンシブデザインの確認', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify main elements are still visible
    await expect(page.locator('h1:has-text("勤怠報告")')).toBeVisible();
    await expect(page.locator('text=出勤日数')).toBeVisible();
    
    // Verify table container has horizontal scroll
    await expect(page.locator('.overflow-x-auto')).toBeVisible();
    
    // Verify filter controls are stacked on mobile
    const filterContainer = page.locator('.flex.flex-wrap.gap-4');
    await expect(filterContainer).toBeVisible();
    
    // Reset to desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('ナビゲーション機能', async ({ page }) => {
    // Verify back to home link works
    await page.click('a:has-text("← ホームに戻る")');
    
    // Should navigate to home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('h2:has-text("お知らせ")')).toBeVisible();
    
    // Navigate back to attendance report
    await page.click('a[href="/attendance/report"]');
    await expect(page).toHaveURL('/attendance/report');
    await expect(page.locator('h1:has-text("勤怠報告")')).toBeVisible();
  });

  test('データの時系列ソート確認', async ({ page }) => {
    // Wait for table to load
    await expect(page.locator('tbody tr')).toHaveCount.greaterThan(0);
    
    // Get all date values from the table
    const dateElements = page.locator('tbody tr td:first-child');
    const dates = await dateElements.allTextContents();
    
    // Convert to Date objects for comparison
    const dateObjects = dates.map(dateStr => new Date(dateStr.replace(/\//g, '-')));
    
    // Verify dates are in descending order (most recent first)
    for (let i = 0; i < dateObjects.length - 1; i++) {
      expect(dateObjects[i]).toBeGreaterThanOrEqual(dateObjects[i + 1]);
    }
  });
});

test.describe('勤怠報告ページ - エラーハンドリング', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', testUsers.validUser.email);
    await page.fill('input[type="password"]', testUsers.validUser.password);
    await page.click('button[type="submit"]');
    await expect(page.locator(`h1:has-text("${testUsers.validUser.name}さんのページ")`)).toBeVisible();
  });

  test('APIエラー時のエラーメッセージ表示', async ({ page }) => {
    // Block API requests to simulate server error
    await page.route('**/api/attendance/records/**', route => {
      route.abort();
    });
    
    await page.goto('/attendance/report');
    
    // Wait for error message to appear
    await expect(page.locator('text=勤怠記録の取得に失敗しました')).toBeVisible({ timeout: 10000 });
    
    // Verify that the page structure is still intact
    await expect(page.locator('h1:has-text("勤怠報告")')).toBeVisible();
    await expect(page.locator('h2:has-text("勤怠記録")')).toBeVisible();
  });

  test('認証失効時のリダイレクト', async ({ page }) => {
    // Clear authentication tokens
    await page.evaluate(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });
    
    // Try to access attendance report page
    await page.goto('/attendance/report');
    
    // Should be redirected to login page
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1:has-text("ログイン")')).toBeVisible();
  });
});