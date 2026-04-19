import { Page } from '@playwright/test';
import { BasePage } from './basepage';
import { DashBoardPage } from './dashboardpage';

export class CreateAccountPage extends BasePage {
  private firstNameTextBox = 'text-input-First Name';
  private lastNameTextBox = 'text-input-Last Name';
  private userNameTextBox = 'text-input-Username';
  private emailTextBox = 'email-input-Email';
  private passwordTextBox = 'password-input-Password';
  private confirmPasswordTextBox = 'password-input-Password Confirmation';
  private privacyCheckBox = 'consentedToTerms';
  private agreeCheckBox = 'consentedToCallMessage';
  private createAccountBtn = 'button-default';
  private allErrors = '.mantine-Text-root';

  constructor(page: Page) {
    super(page);
  }

  async doEnterFirstName(fname: string) {
    await this.fillByTestId(this.firstNameTextBox, fname);
    return this;
  }

  async doEnterLastName(lname: string) {
    await this.fillByTestId(this.lastNameTextBox, lname);
    return this;
  }

  async doEnterUsername(user: string) {
    await this.fillByTestId(this.userNameTextBox, user);
    return this;
  }

  async doEnterEmail(email: string) {
    await this.fillByTestId(this.emailTextBox, email);
    return this;
  }
  async doEnterPassword(password: string) {
    await this.fillByTestId(this.passwordTextBox, password);
    return this;
  }
  async doEnterConfirmPassword(confirmPassword: string) {
    await this.fillByTestId(this.confirmPasswordTextBox, confirmPassword);
    return this;
  }

  async doClickPrivacyCheckBox() {
    await this.checkByTestId(this.privacyCheckBox);
    return this;
  }

  async doClickAgreeCheckBox() {
    await this.checkByTestId(this.agreeCheckBox);
    return this;
  }

  async doClickCreateAccountBtn() {
    await this.clickByTestId(this.createAccountBtn, 0);
    return new DashBoardPage(this.page);
  }

  async createAccount(userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) {
    await this.doEnterFirstName(userData.firstName);
    await this.doEnterLastName(userData.lastName);
    await this.doEnterUsername(userData.username);
    await this.doEnterEmail(userData.email);
    await this.doEnterPassword(userData.password);
    await this.doEnterConfirmPassword(userData.password);
    await this.doClickPrivacyCheckBox();
    await this.doClickAgreeCheckBox();
    await this.doClickCreateAccountBtn();
    return new DashBoardPage(this.page);
  }

  async getErrorMessage(expectedError: string) {
    return await this.getAllErrorMessages(this.allErrors, expectedError);
  }

  async clickOnLNameTextBox() {
    await this.clickByTestId(this.lastNameTextBox);
  }

  async clickOnUserNameTextBox() {
    await this.clickByTestId(this.userNameTextBox);
  }

  async clickOnEmailTextBox() {
    await this.clickByTestId(this.emailTextBox);
  }

  async clickOnPasswordTextBox() {
    await this.clickByTestId(this.passwordTextBox);
  }

  async clickOnConfirmPasswordTextBox() {
    await this.clickByTestId(this.confirmPasswordTextBox);
  }

  async waitForElementTobeVisible(expectedError: string) {
    return this.getAllErrorMessages(this.allErrors, expectedError);
  }
}
