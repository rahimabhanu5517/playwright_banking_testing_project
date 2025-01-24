const { test, expect } = require("@playwright/test");
const RegistrationPage = require("../../pages/registrationPage");
const LoginPage = require("../../pages/loginPage");
const HomePage = require("../../pages/homePage");
const AccountPage = require("../../pages/accountPage");
const TransferFundsPage = require("../../pages/transferFundsPage");
const config = require("../../config.json");
let registeredUser;
let newAccountNumber;

test("Navigate to Para Bank application", async ({ page }) => {
  await page.goto(config.baseURL);
  const title = await page.title();
  expect(title).toContain(config.expectedTitle);
});

test.only("Register a new user", async ({ page }) => {
  const registrationPage = new RegistrationPage(page);
  await page.goto(config.baseURL);
  await registrationPage.navigateToRegisterPage();
  const user = {
    firstName: config.defaultUser.firstName,
    lastName: config.defaultUser.lastName,
    address: config.defaultUser.address,
    city: config.defaultUser.city,
    state: config.defaultUser.state,
    zipCode: config.defaultUser.zipCode,
    phone: config.defaultUser.phone,
    ssn: config.defaultUser.ssn,
    username: `${config.defaultUser.usernamePrefix}${Date.now()}`, // Dynamic username
    password: config.defaultUser.password,
  };
  registeredUser = user;
  console.log(`New User Name: ${registeredUser}`);
  await registrationPage.fillAndSubmitRegistrationForm(user);
  const successMessage = await registrationPage.getSuccessMessage();
  expect(successMessage).toBe(config.registrationSuccessMessage);
});
test.only("Login to the application with the created user", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await page.goto(config.baseURL);
  const username = registeredUser.username;
  const password = registeredUser.password;
  await loginPage.login(username, password);
  const headingText = await page.textContent(loginPage.accountsOverviewHeading);
  expect(headingText.trim()).toBe(config.accountsOverviewText);
});
test("Verify Global navigation menu after login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const username = registeredUser.username;
  const password = registeredUser.password;
  await page.goto(config.baseURL);
  await loginPage.login(username, password);
  await homePage.checkGlobalNavLinks();
  await homePage.clickAndVerifyLinks();
});
test.only("Create a savings account", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);
  await page.goto(config.baseURL);
  await loginPage.login(registeredUser.username, config.defaultUser.password);
  await accountPage.navigateToOpenAccountPage();
  const pageTitle = await page.textContent(accountPage.pageTitle);
  expect(pageTitle.trim()).toBe(config.openNewAccountText);
  await accountPage.openSavingsAccount();
  const { successMessage, accountNumber } =
    await accountPage.getNewAccountDetails();
  expect(successMessage).toBe(config.openAccountSuccessTitle);
  newAccountNumber = accountNumber;
  console.log(`New Savings Account Number: ${newAccountNumber}`);
  test
    .info()
    .annotations.push({ type: "accountNumber", description: newAccountNumber });
});
module.exports = { newAccountNumber };
test.only("Validate account and balance in Accounts Overview", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);
  await page.goto(config.baseURL);
  await loginPage.login(registeredUser.username, config.defaultUser.password);
  await accountPage.navigateToAccountsOverview();
  const pageTitle = await page.textContent(accountPage.pageTitle);
  expect(pageTitle.trim()).toBe(config.accountsOverviewText);
  console.log(`New Account Number: ${newAccountNumber}`);
  const accountDetails = await accountPage.getAllAccountDetails();
  console.log("Accounts in Overview:", accountDetails);
  const matchingAccount = accountDetails.find(
    (account) => account.accountNumber.trim() === newAccountNumber
  );
  expect(matchingAccount).toBeTruthy();
  console.log(
    `Account number ${newAccountNumber} found with balance: ${matchingAccount.balance}`
  );
});
test.only("Transfer funds from newly created account", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transferFundsPage = new TransferFundsPage(page);
  await page.goto(config.baseURL);
  await loginPage.login(registeredUser.username, config.defaultUser.password);
  await transferFundsPage.navigateToTransferFunds();
  const pageTitle = await page.textContent(transferFundsPage.pageTitle);
  console.log("Page Title:", pageTitle);
  expect(pageTitle.trim()).toBe(config.transferFundsText);
  const fromAccountValues = await transferFundsPage.getDropdownValues(
    transferFundsPage.fromAccountDropdown
  );
  console.log("From Account Dropdown Values:", fromAccountValues);
  let fromAccountToSelect;
  for (const account of fromAccountValues) {
    if (account.trim() === newAccountNumber) {
      fromAccountToSelect = account;
      break;
    }
  }
  if (!fromAccountToSelect) {
    throw new Error("No matching 'From Account' found for the transfer.");
  }
  console.log(`Selected From Account: ${fromAccountToSelect}`);
  await transferFundsPage.fillTransferDetails(
    fromAccountToSelect,
    config.transferAmount
  );
  await transferFundsPage.submitTransfer();
  const successTitle = await transferFundsPage.getTransferSuccessTitle();
  console.log("Success Page Title:", successTitle.trim());
  expect(successTitle.trim()).toBe(config.transferSuccessText);
  console.log("Transfer completed successfully.");
});
