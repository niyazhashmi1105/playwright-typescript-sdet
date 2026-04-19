import { Page } from '@playwright/test';
import { BasePage } from './basepage';

export class DashBoardPage extends BasePage {
  private logoutBtn = 'button[data-testid="button-Logout"] p';
  constructor(page: Page) {
    super(page);
  }

  async getLogoutText() {
    await this.waitForElement(this.logoutBtn);
    return this.getText(this.logoutBtn);
  }

  async waitForLogoutVisible() {
    return await this.waitForElement(this.logoutBtn);
  }
}
