import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/loginpage';
import { CreateAccountPage } from '../pages/createaccountpage';
import { DashBoardPage } from '../pages/dashboardpage';
import { FakerUtils } from '../utils/faker';
import { JsonUtils } from '../utils/jsonutils';

type UserData = {
  firstName: string;
  lastName: string;
  password: string;
};

type MyFixtures = {
  loginPage: LoginPage;
  createAccountPage: CreateAccountPage;
  jsonData: UserData;
  fakeUserData: ReturnType<typeof FakerUtils.generateUserData>;
  dashboardPage: DashBoardPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToWebsite();
    await use(loginPage);
  },
  createAccountPage: async ({ loginPage }, use) => {
    const createAccountPage = await loginPage.clickRealLink();
    await use(createAccountPage);
  },

  jsonData: async ({}, use) => {
    const jsonData = JsonUtils.readJson('testdata/data.json');
    await use(jsonData);
  },

  fakeUserData: async ({}, use) => {
    const fakeUserData = FakerUtils.generateUserData();
    await use(fakeUserData);
  },

  dashboardPage: async ({ createAccountPage, fakeUserData }, use) => {
    const dashboardPage = await createAccountPage.createAccount(fakeUserData);
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
