class TransferFundsPage {
  constructor(page) {
    this.page = page;
    this.transferFund = 'a[href="transfer.htm"]'
    this.pageTitle = "h1.title";
    this.fromAccountDropdown = "#fromAccountId";
    this.toAccountDropdown = "#toAccountId";
    this.amountInput = "#amount";
    this.transferButton = '#transferForm input[type="submit"]';
    this.transferCompleteHeader = "h1.title:has-text('Transfer Complete!')";
  }
  // Navigate to the Transfer Funds page
  async navigateToTransferFunds() {
    const transferFundsLink = this.page.locator(this.transferFund);
    await transferFundsLink.click();
  }
  // Assert the Transfer Funds page title
  async validateTransferFundsPageTitle(expectedTitle) {
    const pageTitle = await this.page.textContent(this.pageTitle);
    console.log("Page Title:", pageTitle);
    if (pageTitle.trim() !== expectedTitle) {
      throw new Error(
        `Expected title: ${expectedTitle}, but got: ${pageTitle.trim()}`
      );
    }
  }
  async getDropdownValues(dropdownSelector) {
    await this.page.waitForSelector(dropdownSelector, { state: "visible" });
    await this.page.waitForFunction((selector) => {
      const dropdown = document.querySelector(selector);
      return dropdown && dropdown.options && dropdown.options.length > 0;
    }, dropdownSelector);
    const options = await this.page
      .locator(`${dropdownSelector} option`)
      .allInnerTexts();
    return options.map((value) => value.trim());
  }
  // Method to fill the transfer form
  async fillTransferDetails(fromAccount, amount) {
    await this.page.selectOption(this.fromAccountDropdown, {
      label: fromAccount,
    });
    await this.page.fill(this.amountInput, amount);
    await this.page.selectOption(this.toAccountDropdown, { index: 0 });
  }
  async submitTransfer() {
    await this.page.waitForSelector(this.transferButton, { state: "visible" });
    await this.page.click(this.transferButton);
    console.log("Transfer button clicked.");
  }
  // Validate transfer success
  async getTransferSuccessTitle() {
    await this.page.waitForSelector(this.transferCompleteHeader, {
      state: "visible",
      timeout: 10000,
    });
    const title = await this.page.textContent(this.transferCompleteHeader);
    return title.trim();
  }
}
module.exports = TransferFundsPage;
