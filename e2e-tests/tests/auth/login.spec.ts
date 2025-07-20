import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { HomePage } from '../../pages/home.page';
import { testUsers } from '../../fixtures/test-data';

test.describe('Login functionality', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  test('should display login form', async ({ page }) => {
    await loginPage.goto();
    
    // Verify page title
    await expect(loginPage.pageTitle).toBeVisible();
    
    // Verify form elements are visible
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    
    // Verify placeholders
    await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'メールアドレス');
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'パスワード');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.goto();
    
    // Enter valid credentials
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    
    // Wait for navigation
    await page.waitForURL('/');
    
    // Verify successful login
    await expect(homePage.userNameDisplay).toContainText(testUsers.validUser.name);
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await loginPage.goto();
    
    // Enter invalid credentials
    await loginPage.login(testUsers.invalidUser.email, testUsers.invalidUser.password);
    
    // Verify error message is displayed
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('メールアドレスまたはパスワードが正しくありません');
    
    // Verify still on login page
    await expect(page).toHaveURL('/login');
  });

  test('should validate required fields', async ({ page }) => {
    await loginPage.goto();
    
    // Click login without entering credentials
    await loginPage.loginButton.click();
    
    // Check HTML5 validation
    const emailValidity = await loginPage.emailInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing);
    const passwordValidity = await loginPage.passwordInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing);
    
    expect(emailValidity).toBeTruthy();
    expect(passwordValidity).toBeTruthy();
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
    // Try to access home page directly
    await page.goto('/');
    
    // Should be redirected to login
    await expect(page).toHaveURL('/login');
    await expect(loginPage.pageTitle).toBeVisible();
  });

  test('should maintain session after login', async ({ page, context }) => {
    await loginPage.goto();
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    
    // Wait for successful login
    await page.waitForURL('/');
    
    // Open new page in same context
    const newPage = await context.newPage();
    await newPage.goto('/');
    
    // Should still be logged in
    const newHomePage = new HomePage(newPage);
    await expect(newHomePage.userNameDisplay).toContainText(testUsers.validUser.name);
    
    await newPage.close();
  });

  test('should handle logout functionality', async ({ page }) => {
    // First login
    await loginPage.goto();
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    await page.waitForURL('/');
    
    // Find and click logout button
    const logoutButton = page.getByRole('button', { name: 'ログアウト' });
    await logoutButton.click();
    
    // Should be redirected to login page
    await expect(page).toHaveURL('/login');
    await expect(loginPage.pageTitle).toBeVisible();
  });
});