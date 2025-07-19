import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { HomePage } from '../../pages/home.page';
import { testUsers, navigationLinks } from '../../fixtures/test-data';

test.describe('Navigation functionality', () => {
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

  test('should display header navigation', async ({ page }) => {
    // Verify header is visible
    await expect(homePage.header).toBeVisible();
    
    // Verify calendar link
    const calendarLink = homePage.header.getByRole('link', { name: 'カレンダー' });
    await expect(calendarLink).toBeVisible();
    
    // Verify user menu or profile section
    await expect(homePage.userNameDisplay).toBeVisible();
  });

  test('should display sub-header navigation links', async ({ page }) => {
    // Verify sub-header is visible
    await expect(homePage.subHeader).toBeVisible();
    
    // Check each navigation link
    for (const navLink of navigationLinks.subHeader) {
      const link = homePage.subHeader.getByRole('link', { name: navLink.text });
      await expect(link).toBeVisible();
      
      // Verify href attribute
      if (navLink.href !== '#') {
        await expect(link).toHaveAttribute('href', navLink.href);
      }
    }
  });

  test('should navigate to attendees page', async ({ page }) => {
    const attendeesLink = homePage.subHeader.getByRole('link', { name: '出席者' });
    await attendeesLink.click();
    
    await expect(page).toHaveURL('/attendees');
    
    // Verify page content
    const pageHeading = page.getByRole('heading', { name: '出席者一覧' });
    await expect(pageHeading).toBeVisible();
  });

  test('should navigate to welfare committee page', async ({ page }) => {
    const welfareLink = homePage.subHeader.getByRole('link', { name: '福利厚生委員会' });
    await welfareLink.click();
    
    await expect(page).toHaveURL('/welfare');
    
    // Verify page content
    const pageHeading = page.getByRole('heading', { name: '福利厚生委員会' });
    await expect(pageHeading).toBeVisible();
  });

  test('should navigate to suggestion box page', async ({ page }) => {
    const suggestionsLink = homePage.subHeader.getByRole('link', { name: '目安箱' });
    await suggestionsLink.click();
    
    await expect(page).toHaveURL('/suggestions');
    
    // Verify page content
    const pageHeading = page.getByRole('heading', { name: '目安箱' });
    await expect(pageHeading).toBeVisible();
  });

  test('should navigate to bulletin board page', async ({ page }) => {
    const bulletinLink = homePage.subHeader.getByRole('link', { name: '掲示板' });
    await bulletinLink.click();
    
    await expect(page).toHaveURL('/bulletin');
    
    // Verify page content
    const pageHeading = page.getByRole('heading', { name: '掲示板' });
    await expect(pageHeading).toBeVisible();
  });

  test('should navigate to employee directory page', async ({ page }) => {
    const directoryLink = homePage.subHeader.getByRole('link', { name: '社員名簿' });
    await directoryLink.click();
    
    await expect(page).toHaveURL('/directory');
    
    // Verify page content
    const pageHeading = page.getByRole('heading', { name: '社員名簿' });
    await expect(pageHeading).toBeVisible();
  });

  test('should navigate to audit page', async ({ page }) => {
    const auditLink = homePage.subHeader.getByRole('link', { name: '監査ページ' });
    await auditLink.click();
    
    await expect(page).toHaveURL('/audit');
    
    // Verify page content
    const pageHeading = page.getByRole('heading', { name: '監査ページ' });
    await expect(pageHeading).toBeVisible();
  });

  test('should navigate to contact page', async ({ page }) => {
    const contactLink = homePage.subHeader.getByRole('link', { name: 'お問い合わせ' });
    await contactLink.click();
    
    await expect(page).toHaveURL('/contact');
    
    // Verify page content
    const pageHeading = page.getByRole('heading', { name: 'お問い合わせ' });
    await expect(pageHeading).toBeVisible();
  });

  test('should handle calendar link in header', async ({ page }) => {
    const calendarLink = homePage.header.getByRole('link', { name: 'カレンダー' });
    await calendarLink.click();
    
    // Verify navigation or modal opening
    // This might be a modal or external link, adjust based on implementation
    await expect(page).toHaveURL(/calendar|\/$/);
  });

  test('should maintain active state for current page', async ({ page }) => {
    // Navigate to a page
    const attendeesLink = homePage.subHeader.getByRole('link', { name: '出席者' });
    await attendeesLink.click();
    await page.waitForURL('/attendees');
    
    // Check if the link has active state
    await expect(attendeesLink).toHaveClass(/active|current/);
  });

  test('should handle breadcrumb navigation', async ({ page }) => {
    // Navigate to a sub-page
    const attendeesLink = homePage.subHeader.getByRole('link', { name: '出席者' });
    await attendeesLink.click();
    await page.waitForURL('/attendees');
    
    // Check for breadcrumb
    const breadcrumb = page.locator('[aria-label="breadcrumb"], .breadcrumb');
    await expect(breadcrumb).toBeVisible();
    
    // Should show Home > 出席者
    await expect(breadcrumb).toContainText('ホーム');
    await expect(breadcrumb).toContainText('出席者');
    
    // Click home breadcrumb
    const homeBreadcrumb = breadcrumb.getByRole('link', { name: 'ホーム' });
    await homeBreadcrumb.click();
    
    await expect(page).toHaveURL('/');
  });

  test('should handle back navigation', async ({ page }) => {
    // Navigate forward
    const attendeesLink = homePage.subHeader.getByRole('link', { name: '出席者' });
    await attendeesLink.click();
    await page.waitForURL('/attendees');
    
    // Navigate back
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Verify we're back on home page
    await expect(homePage.userNameDisplay).toBeVisible();
  });

  test('should handle 404 page for invalid routes', async ({ page }) => {
    // Navigate to invalid route
    await page.goto('/invalid-route');
    
    // Should show 404 page
    await expect(page).toHaveURL('/invalid-route');
    const notFoundHeading = page.getByRole('heading', { name: '404' });
    await expect(notFoundHeading).toBeVisible();
    
    // Should have link back to home
    const homeLink = page.getByRole('link', { name: 'ホームに戻る' });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    
    await expect(page).toHaveURL('/');
  });

  test('should handle external links properly', async ({ page }) => {
    // Test external links open in new tab/window
    const externalLink = homePage.externalLinksSection.getByRole('link', { name: 'Health Anshin Connect App' });
    
    // Check if link has target="_blank"
    await expect(externalLink).toHaveAttribute('target', '_blank');
    
    // Check if link has rel="noopener noreferrer" for security
    await expect(externalLink).toHaveAttribute('rel', /noopener|noreferrer/);
  });
});