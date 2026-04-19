import { Page } from '@playwright/test';
import { CreateAccountPage } from './createaccountpage';
import { BasePage } from './basepage';

export class LoginPage extends BasePage {
  private url: string = 'https://bolt.playrealbrokerage.com/login';
  private joinRealLink: string;

  constructor(page: Page) {
    super(page);
    this.joinRealLink = 'Join Real';
  }

  async navigateToWebsite() {
    await this.navigateToURL(this.url);
    return this;
  }

  async clickRealLink() {
    await this.clickByRole('link', this.joinRealLink);
    return new CreateAccountPage(this.page);
  }
}
