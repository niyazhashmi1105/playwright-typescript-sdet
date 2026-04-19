import { Page, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToURL(url: string) {
    await this.page.goto(url);
  }

  getLocator(selector: string) {
    return this.page.locator(selector);
  }

  getLocatorByTestId(selector: string) {
    return this.page.locator(`[data-testid="${selector}"]`);
  }

  async clickByRole(role: any, name: string) {
    await this.page.getByRole(role as any, { name }).click();
  }
  async click(selector: string): Promise<void> {
    const element = this.getLocator(selector);
    await expect(element).toBeVisible();
    await element.click();
  }

  async clickByTestId(selector: string, index?: number) {
    const element = this.getLocatorByTestId(selector);
    const target = index !== undefined ? element.nth(index) : element.first();
    await expect(target).toBeVisible();
    await target.click();
  }

  async fill(selector: string, value: string): Promise<void> {
    const element = this.getLocator(selector);
    await expect(element).toBeVisible();
    await element.fill(value);
  }

  async fillByTestId(selector: string, value: string) {
    const element = this.getLocatorByTestId(selector);
    await expect(element).toBeVisible();
    await element.fill(value);
  }

  async check(selector: string) {
    const element = this.getLocator(selector);
    await expect(element).toBeVisible();
    await element.check();
  }

  async checkByTestId(selector: string) {
    const element = this.getLocatorByTestId(selector);
    await expect(element).toBeVisible();
    await element.check();
  }

  async getText(selector: string) {
    const element = this.getLocator(selector);
    await expect(element).toBeVisible();
    return await element.textContent();
  }

  async getAllTexts(selector: string) {
    const elements = this.getLocator(selector);
    const count = await elements.count();
    if (count === 0) {
      return [];
    }
    for (let i = 0; i < count; i++) {
      await elements.nth(i).waitFor({ state: 'visible' });
    }
    const texts = await elements.allInnerTexts();
    return texts.map((t) => t.trim());
  }

  async getTextByTestId(selector: string) {
    const element = this.getLocatorByTestId(selector);
    await expect(element).toBeVisible();
    return await element.textContent();
  }

  async waitForElement(selector: string) {
    return await this.page.locator(selector).waitFor({ state: 'visible' });
  }

  async waitForElementByTestId(selector: string) {
    await this.getLocatorByTestId(selector).waitFor({ state: 'visible' });
  }

  async getAllErrorMessages(errorSelector: string, expectedError: string) {
    const errorMessages = await this.getAllTexts(errorSelector);
    return errorMessages.includes(expectedError);
  }

  async waitForLoaderToDisappear() {
    const loader = this.page.locator('[data-testid="spinning-loader"]');
    if (await loader.isVisible()) {
      await loader.waitFor({ state: 'hidden' });
    }
  }
}
