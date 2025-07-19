import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { HomePage } from '../../pages/home.page';
import { testUsers, testExternalLinks } from '../../fixtures/test-data';

test.describe('Home page functionality', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    
    // Login before each test
    await loginPage.goto();
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    await page.waitForURL('/');
  });

  test('should display user information in header', async ({ page }) => {
    // Verify user name is displayed
    await expect(homePage.userNameDisplay).toBeVisible();
    const userName = await homePage.getUserName();
    expect(userName).toBe(testUsers.validUser.name);
    
    // Verify date is displayed
    await expect(homePage.dateDisplay).toBeVisible();
    const dateText = await homePage.dateDisplay.textContent();
    expect(dateText).toContain('今日の日付:');
  });

  test('should display announcement section', async ({ page }) => {
    // Verify announcement section exists
    await expect(homePage.announcementSection).toBeVisible();
    
    // Verify section title
    const sectionTitle = homePage.announcementSection.getByRole('heading', { name: 'お知らせ' });
    await expect(sectionTitle).toBeVisible();
    
    // Verify at least one announcement is displayed
    const announcements = await homePage.getAnnouncementTitles();
    expect(announcements.length).toBeGreaterThan(0);
  });

  test('should navigate to announcement detail page', async ({ page }) => {
    // Get first announcement title
    const announcements = await homePage.getAnnouncementTitles();
    expect(announcements.length).toBeGreaterThan(0);
    
    const firstAnnouncementTitle = announcements[0];
    
    // Click on announcement
    await homePage.clickAnnouncement(firstAnnouncementTitle);
    
    // Verify navigation to detail page
    await expect(page).toHaveURL(/\/announcements\/\d+/);
    
    // Verify announcement title is displayed on detail page
    const detailTitle = page.getByRole('heading', { name: firstAnnouncementTitle });
    await expect(detailTitle).toBeVisible();
  });

  test('should display external system links', async ({ page }) => {
    // Verify external links section exists
    await expect(homePage.externalLinksSection).toBeVisible();
    
    // Verify section title
    const sectionTitle = homePage.externalLinksSection.getByRole('heading', { name: '外部システムリンク' });
    await expect(sectionTitle).toBeVisible();
    
    // Get all external links
    const links = await homePage.getExternalLinks();
    
    // Verify expected links are present
    expect(links.length).toBe(testExternalLinks.length);
    
    // Verify each link
    for (let i = 0; i < testExternalLinks.length; i++) {
      const expectedLink = testExternalLinks[i];
      const actualLink = links.find(link => link.text?.includes(expectedLink.name));
      
      expect(actualLink).toBeDefined();
      expect(actualLink?.href).toBe(expectedLink.url);
    }
  });

  test('should display document processing status', async ({ page }) => {
    // Verify document status section exists
    await expect(homePage.documentStatusSection).toBeVisible();
    
    // Verify section title
    const sectionTitle = homePage.documentStatusSection.getByRole('heading', { name: '書類処理状況' });
    await expect(sectionTitle).toBeVisible();
    
    // Get document counts
    const counts = await homePage.getDocumentCounts();
    
    // Verify counts are numbers
    expect(counts.applications).toBeGreaterThanOrEqual(0);
    expect(counts.approvals).toBeGreaterThanOrEqual(0);
    expect(counts.attendanceReports).toBeGreaterThanOrEqual(0);
  });

  test('should have functional links in document status section', async ({ page }) => {
    // Check for attendance report link
    const attendanceReportLink = homePage.documentStatusSection.getByRole('link', { name: '勤怠報告' });
    await expect(attendanceReportLink).toBeVisible();
    
    // Click attendance report link
    await attendanceReportLink.click();
    
    // Verify navigation
    await expect(page).toHaveURL('/attendance/report');
    
    // Go back
    await page.goBack();
    
    // Check for work schedule link
    const workScheduleLink = homePage.documentStatusSection.getByRole('link', { name: '勤務予定設定' });
    await expect(workScheduleLink).toBeVisible();
  });

  test('should handle responsive layout', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(homePage.header).toBeVisible();
    await expect(homePage.subHeader).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(homePage.header).toBeVisible();
    await expect(homePage.subHeader).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(homePage.header).toBeVisible();
    // Sub-header might be in hamburger menu on mobile
  });

  test('should maintain data after page refresh', async ({ page }) => {
    // Get initial data
    const initialUserName = await homePage.getUserName();
    const initialAnnouncements = await homePage.getAnnouncementTitles();
    
    // Refresh page
    await page.reload();
    
    // Verify data persists
    const refreshedUserName = await homePage.getUserName();
    const refreshedAnnouncements = await homePage.getAnnouncementTitles();
    
    expect(refreshedUserName).toBe(initialUserName);
    expect(refreshedAnnouncements).toEqual(initialAnnouncements);
  });
});