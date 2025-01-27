class BillPaymentPage {
  constructor(page) {
    this.page = page;
    this.payBillLink = 'a[href="billpay.htm"]';
    this.pageTitle = "h1.title";
    this.payeeNameInput = 'input[name="payee.name"]';
    this.addressInput = 'input[name="payee.address.street"]';
    this.cityInput = 'input[name="payee.address.city"]';
    this.stateInput = 'input[name="payee.address.state"]';
    this.zipCodeInput = 'input[name="payee.address.zipCode"]';
    this.phoneNumberInput = 'input[name="payee.phoneNumber"]';
    this.accountNumberInput = 'input[name="payee.accountNumber"]';
    this.verifyAccountInput = 'input[name="verifyAccount"]';
    this.amountInput = 'input[name="amount"]';
    this.fromAccountDropdown = 'select[name="fromAccountId"]';
    this.sendPaymentButton = 'input.button[value="Send Payment"]';
    this.successPageTitle = "h1.title:has-text('Bill Payment Complete')";
    this.successMessage = "#billpayResult";
  }
  async navigateToBillPay() {
    await this.page.click(this.payBillLink);
    await this.page.waitForSelector(this.pageTitle, { state: "visible" });
  }
  async assertPageTitle(expectedTitle) {
    const title = await this.page.textContent(this.pageTitle);
    expect(title.trim()).toBe(expectedTitle);
  }
  async fillBillPayForm(data) {
    await this.page.fill(this.payeeNameInput, data.payeeName);
    await this.page.fill(this.addressInput, data.address);
    await this.page.fill(this.cityInput, data.city);
    await this.page.fill(this.stateInput, data.state);
    await this.page.fill(this.zipCodeInput, data.zipCode);
    await this.page.fill(this.phoneNumberInput, data.phoneNumber);
    await this.page.fill(this.accountNumberInput, data.accountNumber);
    await this.page.fill(this.verifyAccountInput, data.verifyAccount);
    await this.page.fill(this.amountInput, data.amount);
  }
  async clickSendPayment() {
    await this.page.click(this.sendPaymentButton);
  }
  async assertSuccessPageTitle(expectedTitle) {
    await this.page.waitForSelector(this.successPageTitle, {
      state: "visible",
    });
    const title = await this.page.textContent(this.successPageTitle);
    expect(title.trim()).toBe(expectedTitle);
  }
  async assertSuccessMessage(data) {
    const successMessage = await this.page.textContent(this.successMessage);
    expect(successMessage).toContain(data.payeeName);
    expect(successMessage).toContain(data.amount);
    expect(successMessage).toContain(data.fromAccountId);
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
}
module.exports = BillPaymentPage;
