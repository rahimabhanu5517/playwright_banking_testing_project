class FindTransactionsPage {
  constructor(page) {
    this.page = page;
    this.findTransactionsLink = 'a[href="findtrans.htm"]';
    this.pageTitle = "div#formContainer > h1.title";
    this.accountDropdown = "#accountId";
    this.transactionAmountInput = "#amount";
    this.findByAmountButton = "#findByAmount";
    this.transactionTable = "table#transactionTable";
    this.debitColumn = "table#transactionTable td.debit";
    this.successFormTitle = "div#transactionSuccess h1.title";
  }

  async navigateToFindTransactions() {
    console.log("Navigating to 'Find Transactions'...");
    await this.page.click(this.findTransactionsLink);
  }

  async getPageTitle() {
    console.log("Asserting page title...");
    await this.page.waitForSelector(this.pageTitle, { state: "visible" });
    const actualTitle = await this.page.textContent(this.pageTitle);
    return actualTitle.trim();
  }

  async getDropdownValues(dropdownSelector) {
    await this.page.waitForSelector(dropdownSelector, { state: "visible" });
    await this.page.waitForFunction((selector) => {
      const dropdown = document.querySelector(selector);
      return dropdown && dropdown.options && dropdown.options.length > 0;
    }, dropdownSelector);
    const options = await this.page.locator(`${dropdownSelector} option`).allInnerTexts();
    return options.map((value) => value.trim());
  }

  async findByAmount(amount) {
    await this.page.fill(this.transactionAmountInput, amount);
    await this.page.click(this.findByAmountButton);
  }

  async getTransactionTableValues(columnSelector) {
    const columnDetails = [];
    await this.page.waitForSelector(this.transactionTable, {state: "visible"});
    const rows = this.page.locator(`${this.transactionTable} tbody tr`);
    const rowCount = await rows.count();
    console.log("Transaction table row count detected:", rowCount);
    const headers = await this.page.locator(`${this.transactionTable} thead th`).allInnerTexts();
    const debitColumnIndex =
      headers.findIndex((header) => header.includes("Debit")) + 1;
    if (debitColumnIndex === 0) {
      throw new Error("Could not find 'Debit (-)' column in the transaction table headers.");
    }
    console.log(`Debit column index detected: ${debitColumnIndex}`);
    for (let i = 0; i < rowCount; i++) {
      const columnElement = rows.nth(i).locator(`td:nth-child(${debitColumnIndex})`);
      const value = await columnElement.evaluate((node) => node.textContent?.trim() || "");
      if (value) {
        const cleanedValue = value.startsWith("$")
          ? value.replace("$", "")
          : value;
        columnDetails.push(cleanedValue);
      } else {
        console.log(`Row ${i + 1} does not contain the expected data in the 'Debit (-)' column.`);
      }
    }
    console.log("Extracted Transaction Table Values (Cleaned):", columnDetails);
    return columnDetails;
  }
}

module.exports = FindTransactionsPage;