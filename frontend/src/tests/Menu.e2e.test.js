import { test, expect } from '@playwright/test';

test.describe('Menu Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="employee_id"]', 'E001');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('should display new menu categories', async ({ page }) => {
    // Click menu button
    await page.click('button[aria-label="メニューを開く"]');
    
    // Verify new categories are visible
    const newCategories = [
      'EMGビジョン',
      '事業戦略会議',
      'コンプライアンス委員会',
      '開発本部',
      '広報企画部',
      '情報セキュリティ',
      '社内人材公募',
      '教育',
      '一覧',
      '発表・報告'
    ];

    for (const category of newCategories) {
      await expect(page.getByText(category)).toBeVisible();
    }
  });

  test('should navigate to EMG Vision corporate philosophy page', async ({ page }) => {
    // Click menu button
    await page.click('button[aria-label="メニューを開く"]');
    
    // Click EMG Vision category
    await page.click('text=EMGビジョン');
    
    // Click corporate philosophy item
    await page.click('text=企業理念');
    
    // Verify navigation
    await expect(page).toHaveURL('http://localhost:3000/emg-vision/corporate-philosophy');
    await expect(page.getByText('企業理念')).toBeVisible();
  });

  test('should navigate to Lists attendees page', async ({ page }) => {
    // Click menu button
    await page.click('button[aria-label="メニューを開く"]');
    
    // Click Lists category
    await page.click('text=一覧');
    
    // Click attendees item
    await page.click('text=出勤者');
    
    // Verify navigation
    await expect(page).toHaveURL('http://localhost:3000/lists/attendees');
    await expect(page.getByText('出勤者')).toBeVisible();
  });

  test('should search for new menu items', async ({ page }) => {
    // Click menu button
    await page.click('button[aria-label="メニューを開く"]');
    
    // Search for "セキュリティ"
    await page.fill('input[placeholder="メニューを検索..."]', 'セキュリティ');
    
    // Verify search results
    await expect(page.getByText('情報セキュリティ')).toBeVisible();
    await expect(page.getByText('EMGセキュリティ')).toBeVisible();
  });
});