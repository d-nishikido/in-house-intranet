import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly header: Locator;
  readonly subHeader: Locator;
  readonly announcementSection: Locator;
  readonly externalLinksSection: Locator;
  readonly documentStatusSection: Locator;
  readonly userNameDisplay: Locator;
  readonly dateDisplay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header');
    this.subHeader = page.locator('nav').filter({ hasText: '出席者' });
    this.announcementSection = page.locator('section').filter({ hasText: 'お知らせ' });
    this.externalLinksSection = page.locator('section').filter({ hasText: '外部システムリンク' });
    this.documentStatusSection = page.locator('section').filter({ hasText: '書類処理状況' });
    this.userNameDisplay = page.locator('text=/.*さんのページ/');
    this.dateDisplay = page.locator('text=/今日の日付:/');
  }

  async goto() {
    await this.page.goto('/');
  }

  async getAnnouncementTitles() {
    const announcements = await this.announcementSection.locator('h3').allTextContents();
    return announcements;
  }

  async clickAnnouncement(title: string) {
    await this.announcementSection.getByRole('heading', { name: title }).click();
  }

  async getExternalLinks() {
    const links = await this.externalLinksSection.locator('a').all();
    const linkData = [];
    for (const link of links) {
      linkData.push({
        text: await link.textContent(),
        href: await link.getAttribute('href')
      });
    }
    return linkData;
  }

  async getDocumentCounts() {
    const applications = await this.documentStatusSection.locator('text=/申請書.*件/').textContent();
    const approvals = await this.documentStatusSection.locator('text=/承認書類.*件/').textContent();
    const attendanceReports = await this.documentStatusSection.locator('text=/勤怠報告.*件/').textContent();
    
    return {
      applications: this.extractNumber(applications),
      approvals: this.extractNumber(approvals),
      attendanceReports: this.extractNumber(attendanceReports)
    };
  }

  private extractNumber(text: string | null): number {
    if (!text) return 0;
    const match = text.match(/(\d+)件/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async isUserLoggedIn() {
    return await this.userNameDisplay.isVisible();
  }

  async getUserName() {
    const text = await this.userNameDisplay.textContent();
    return text?.replace('さんのページ', '') || '';
  }
}