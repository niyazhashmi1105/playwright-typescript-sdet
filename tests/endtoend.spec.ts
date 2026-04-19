//import { test, expect } from '@playwright/test';
import { test, expect } from '../fixtures/my-fixture';
import { CSVUtils } from '../utils/csvutils';
import { ExcelUtils } from '../utils/excelutils';
import { GenericUtils } from '../utils/generaterandomletters';

test('E2E: User should navigate to create account and register successfully using Json File', async ({
  createAccountPage,
  dashboardPage,
  jsonData,
}) => {
  test.setTimeout(60 * 1000);
  const username = GenericUtils.generateRandomName(10);
  const email = GenericUtils.generateRandomName(3);
  await createAccountPage.doEnterFirstName(jsonData.firstName);
  await createAccountPage.doEnterLastName(jsonData.lastName);
  await createAccountPage.doEnterUsername(`test${username}`);
  await createAccountPage.doEnterEmail(`test${email}@gmail.com`);
  await createAccountPage.doEnterPassword(jsonData.password);
  await createAccountPage.doEnterConfirmPassword(jsonData.password);
  await createAccountPage.doClickPrivacyCheckBox();
  await createAccountPage.doClickAgreeCheckBox();
  await createAccountPage.doClickCreateAccountBtn();
  expect(await dashboardPage.waitForLogoutVisible());
  const logoutText = await dashboardPage.getLogoutText();
  expect(logoutText).toBe('Logout');
});

test('User should navigate to create account and register successfully using Faker library', async ({
  createAccountPage,
  dashboardPage,
  fakeUserData,
}) => {
  test.setTimeout(60 * 1000);

  console.log(fakeUserData.username);
  console.log(fakeUserData.email);
  console.log(fakeUserData.password);
  await createAccountPage.createAccount(fakeUserData);
  await dashboardPage.waitForLoaderToDisappear();
  await dashboardPage.waitForLogoutVisible();
  const logoutText = await dashboardPage.getLogoutText();
  expect(logoutText).toBe('Logout');
});

test('Validate All Error Messages on Create Account Page', async ({
  page,
  createAccountPage,
}) => {
  await createAccountPage.doClickCreateAccountBtn();
  await expect(page.locator('.mantine-Text-root')).toHaveCount(8);

  const isFirstName = await createAccountPage.getErrorMessage(
    'Please enter first name',
  );
  expect(isFirstName).toBeTruthy();

  const isLastName = await createAccountPage.getErrorMessage(
    'Please enter last name',
  );
  expect(isLastName).toBeTruthy();

  const isUserName = await createAccountPage.getErrorMessage(
    'Please enter username',
  );
  expect(isUserName).toBeTruthy();

  const isEmail = await createAccountPage.getErrorMessage(
    'Please enter email address',
  );
  expect(isEmail).toBeTruthy();

  const isPassword = await createAccountPage.getErrorMessage(
    'Password is required',
  );
  expect(isPassword).toBeTruthy();

  const isConfirmPassword = await createAccountPage.getErrorMessage(
    'Please re-enter your password',
  );
  expect(isConfirmPassword).toBeTruthy();

  const isPrivacy = await createAccountPage.getErrorMessage(
    'Please provide your consent to continue',
  );
  expect(isPrivacy).toBeTruthy();

  const isAgree = await createAccountPage.getErrorMessage(
    'Please provide your consent to continue',
  );
  expect(isAgree).toBeTruthy();
});

test('Validate All Fields Error Messages With Invalid Characters on Create Account Page', async ({
  createAccountPage,
}) => {
  //FirstName field validation
  await createAccountPage.doEnterFirstName('John!@#');
  await createAccountPage.clickOnLNameTextBox();
  const isFirstNameErrorPresent =
    await createAccountPage.waitForElementTobeVisible(
      'Please enter a valid first name',
    );
  expect(isFirstNameErrorPresent).toBeTruthy();

  //LastName field validation
  await createAccountPage.doEnterLastName('Doe%^&');
  await createAccountPage.clickOnUserNameTextBox();
  const isLastNameErrorPresent =
    await createAccountPage.waitForElementTobeVisible(
      'Please enter a valid last name',
    );
  expect(isLastNameErrorPresent).toBeTruthy();

  //UserName field validation
  await createAccountPage.doEnterUsername('test@#$');
  await createAccountPage.clickOnEmailTextBox();
  await createAccountPage.waitForElement(
    'text=Username can only have letters and numbers',
  );
  const isUserNameErrorPresent =
    await createAccountPage.waitForElementTobeVisible(
      'Username can only have letters and numbers',
    );
  expect(isUserNameErrorPresent).toBeTruthy();

  //UserName field validation #2
  await createAccountPage.doEnterUsername('test');
  await createAccountPage.clickOnEmailTextBox();
  await createAccountPage.waitForElement('text=Username is already taken');
  const isUserNameAlreadyTakenErrorPresent =
    await createAccountPage.waitForElementTobeVisible(
      'Username is already taken',
    );
  expect(isUserNameAlreadyTakenErrorPresent).toBeTruthy();

  //UserName field validation #3
  await createAccountPage.doEnterUsername('');
  await createAccountPage.clickOnEmailTextBox();
  await createAccountPage.waitForElement(
    'text=Username must be at least 2 characters',
  );
  const isUserNameBlankErrorPresent =
    await createAccountPage.waitForElementTobeVisible(
      'Username must be at least 2 characters',
    );
  expect(isUserNameBlankErrorPresent).toBeTruthy();

  //Email Field Validation
  await createAccountPage.doEnterEmail(`test_${Date.now()}`);
  await createAccountPage.clickOnPasswordTextBox();
  await createAccountPage.waitForElement(
    'text=Please enter valid email address',
  );
  const isEmailErrorPresent = await createAccountPage.waitForElementTobeVisible(
    'Please enter valid email address',
  );
  expect(isEmailErrorPresent).toBeTruthy();

  //Email Field Validation #2
  await createAccountPage.doEnterEmail('test@gmail.com');
  await createAccountPage.clickOnPasswordTextBox();
  await createAccountPage.waitForElement('text=Email is already taken');
  const isEmailAlreadyTakenErrorPresent =
    await createAccountPage.waitForElementTobeVisible('Email is already taken');
  expect(isEmailAlreadyTakenErrorPresent).toBeTruthy();

  //Password field validation #1
  await createAccountPage.doEnterPassword('P@123');
  await createAccountPage.clickOnConfirmPasswordTextBox();
  await createAccountPage.waitForElement(
    'text=Password must have a minimum of 12 characters',
  );
  const isPasswordLengthError =
    await createAccountPage.waitForElementTobeVisible(
      'Password must have a minimum of 12 characters',
    );
  expect(isPasswordLengthError).toBeTruthy();

  //Password field validation #2
  await createAccountPage.doEnterPassword('P@1234567890');
  await createAccountPage.clickOnConfirmPasswordTextBox();
  await createAccountPage.waitForElement(
    'text=Password must contain at least: 1 lower-case character',
  );
  const isPasswordLowerCaseError =
    await createAccountPage.waitForElementTobeVisible(
      'Password must contain at least: 1 lower-case character',
    );
  expect(isPasswordLowerCaseError).toBeTruthy();

  //Password field validation #3
  await createAccountPage.doEnterPassword('p@1234567890');
  await createAccountPage.clickOnConfirmPasswordTextBox();
  await createAccountPage.waitForElement(
    'text=Password must contain at least: 1 upper-case character',
  );
  const isPasswordUpperCaseError =
    await createAccountPage.waitForElementTobeVisible(
      'Password must contain at least: 1 upper-case character',
    );
  expect(isPasswordUpperCaseError).toBeTruthy();

  //Password field validation #4
  await createAccountPage.doEnterPassword('Pa1234567890');
  await createAccountPage.clickOnConfirmPasswordTextBox();
  await createAccountPage.waitForElement(
    'text=Password must contain at least: 1 symbol',
  );
  const isPasswordSymbolError =
    await createAccountPage.waitForElementTobeVisible(
      'Password must contain at least: 1 symbol',
    );
  expect(isPasswordSymbolError).toBeTruthy();

  //Confirmation Password field validation
  await createAccountPage.doEnterConfirmPassword('Password@123');
  await createAccountPage.doClickPrivacyCheckBox();
  await createAccountPage.doClickAgreeCheckBox();
  await createAccountPage.doClickCreateAccountBtn();
  await createAccountPage.waitForLoaderToDisappear();
  await createAccountPage.waitForElement('text=Passwords do not match');
  const isConfirmPasswordMatchError =
    await createAccountPage.waitForElementTobeVisible('Passwords do not match');
  expect(isConfirmPasswordMatchError).toBeTruthy();
});

test('E2E: User should navigate to create account and register successfully using CSV File', async ({
  createAccountPage,
  dashboardPage,
}) => {
  test.setTimeout(60 * 1000);
  const username = GenericUtils.generateRandomName(10);
  const email = GenericUtils.generateRandomName(3);
  const userDetails = CSVUtils.readCSv('testdata/data-csv.csv');
  await createAccountPage.doEnterFirstName(userDetails[0].firstName);
  await createAccountPage.doEnterLastName(userDetails[0].lastName);
  await createAccountPage.doEnterUsername(`test${username}`);
  await createAccountPage.doEnterEmail(`test${email}@gmail.com`);
  await createAccountPage.doEnterPassword(userDetails[0].password);
  await createAccountPage.doEnterConfirmPassword(userDetails[0].password);
  await createAccountPage.doClickPrivacyCheckBox();
  await createAccountPage.doClickAgreeCheckBox();
  await createAccountPage.doClickCreateAccountBtn();
  expect(await dashboardPage.waitForLogoutVisible());
  const logoutText = await dashboardPage.getLogoutText();
  expect(logoutText).toBe('Logout');
});

test('E2E: User should navigate to create account and register successfully using Excel File', async ({
  createAccountPage,
  dashboardPage,
}) => {
  test.setTimeout(60 * 1000);
  const username = GenericUtils.generateRandomName(10);
  const email = GenericUtils.generateRandomName(3);
  const userDetails = ExcelUtils.readExcel('testdata/excel.xlsx', 'Sheet1');
  //console.log(userDetails);
  await createAccountPage.doEnterFirstName(userDetails[0].firstName);
  await createAccountPage.doEnterLastName(userDetails[0].lastName);
  await createAccountPage.doEnterUsername(`test${username}`);
  await createAccountPage.doEnterEmail(`test${email}@gmail.com`);
  await createAccountPage.doEnterPassword(userDetails[0].password);
  await createAccountPage.doEnterConfirmPassword(userDetails[0].password);
  await createAccountPage.doClickPrivacyCheckBox();
  await createAccountPage.doClickAgreeCheckBox();
  await createAccountPage.doClickCreateAccountBtn();
  expect(await dashboardPage.waitForLogoutVisible());
  const logoutText = await dashboardPage.getLogoutText();
  expect(logoutText).toBe('Logout');
});

test('Login with Valid Users', async ({
  page,
  createAccountPage,
  dashboardPage,
  fakeUserData,
}) => {
  // console.log(fakeUserData.username)
  // console.log(fakeUserData.email)
  // console.log(fakeUserData.password)
  // await createAccountPage.createAccount(fakeUserData);
  // await dashboardPage.waitForLoaderToDisappear()
  // await dashboardPage.waitForLogoutVisible()
  // const logoutText = await dashboardPage.getLogoutText()
  // expect(logoutText).toBe('Logout')

  await page.goto('https://app.playonereal.com/agent-login');
  await page
    .getByPlaceholder('Enter username or email')
    .fill('testwzwrsq38565');
  await page.getByPlaceholder('Password').fill('P@WdozCedPika1');
  await page.getByTestId('button-Login').click();
  await expect(page.getByTestId('button-Logout')).toHaveText('Logout');
  // await page.getByTestId('button-default').click();
  // await page.locator('div').filter({ hasText: /^USA$/ }).nth(3).click();
  // await page.getByTestId('button-default').click();
  // await page.getByTestId('text-input-Mobile Number').fill('345678-9021')
  // await page.getByRole('button', { name: 'Next' }).click();
  // const formattedDate = new Date().toLocaleDateString('en-US', {
  //     month: '2-digit',
  //     day: '2-digit',
  //     year: 'numeric'
  // });
  // console.log(formattedDate);
  await page.getByTestId('date-input-Date of Birth').fill('04/16/1995');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^No, I don't have a sponsor$/ })
    .nth(3)
    .click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  //await page.pause();
});
