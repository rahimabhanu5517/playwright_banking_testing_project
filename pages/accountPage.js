const config = require("../config.json");

class AccountPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.openNewAccountLink = 'a[href="openaccount.htm"]';
    this.pageTitle = "h1.title";
    this.accountTypeDropdown = "#type";
    this.fromAccountDropdown = "#fromAccountId";
    this.openAccountButton = 'input.button[value="Open New Account"]';
    this.successMessage = "#openAccountResult h1.title";
    this.newAccountNumberLink = "#newAccountId";
    this.accountsOverviewLink = 'a[href="overview.htm"]';
    this.accountTable = "#accountTable";
    this.accountTableRows = "#accountTable tbody tr";
    this.accountTableRowAcct = "td:first-child a";
    this.accountTableRowBal = "td:nth-child(2)";
  }

  // Navigate to "Open New Account" page
  async navigateToOpenAccountPage() {
    await this.page.click(this.openNewAccountLink);
    await this.page.waitForSelector(this.pageTitle);
  }

  // Open a new savings account
  async openSavingsAccount() {
    await this.page.selectOption(this.accountTypeDropdown, "1");
    await this.page.selectOption(this.fromAccountDropdown, { index: 0 });
    await this.page.click(this.openAccountButton);
    await this.page.waitForSelector(this.successMessage);
  }

  // Get the success message and new account number
  async getNewAccountDetails() {
    const successMessage = await this.page.textContent(this.successMessage);
    const accountNumber = await this.page.textContent(
      this.newAccountNumberLink
    );
    return {
      successMessage: successMessage.trim(),
      accountNumber: accountNumber.trim(),
    };
  }
  // Navigate to "Accounts Overview" page
  async navigateToAccountsOverview() {
    await this.page.click(this.accountsOverviewLink);
    await this.page.waitForSelector(this.accountTable);
  }
  // Validate account number in the accounts table
  async isAccountNumberPresent(accountNumber) {
    const rows = await this.page.$$(this.accountTableRows);
    for (const row of rows) {
      const cellText = await row.textContent();
      if (cellText.includes(accountNumber)) {
        return true;
      }
    }
    return false;
  }
  // Get the account overview details
  async getAllAccountDetails() {
    const accountDetails = [];
    await this.page.waitForSelector(this.accountTableRows, { timeout: 5000 });
    const rows = this.page.locator(this.accountTableRows);
    const rowCount = await rows.count();

    console.log("Row count detected:", rowCount);

    for (let i = 0; i < rowCount; i++) {
      const accountNumberElement = rows
        .nth(i)
        .locator(this.accountTableRowAcct);
      const isVisible = await accountNumberElement.isVisible();
      let accountNumber = null;
      if (isVisible) {
        accountNumber = await accountNumberElement.innerText();
      } else {
        console.log(`Row ${i + 1} does not contain an account number.`);
      }
      const balanceElement = rows.nth(i).locator(this.accountTableRowBal);
      const balance = await balanceElement.innerText();
      if (accountNumber) {
        accountDetails.push({ accountNumber, balance });
      }
    }
    console.log("Extracted Account Details:", accountDetails);
    return accountDetails;
  }
}

module.exports = AccountPage;
