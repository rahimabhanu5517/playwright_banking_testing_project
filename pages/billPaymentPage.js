class BillPaymentPage {
    constructor(page) {
        this.page = page;
        this.payeeNameInput = '#payeeName';
        this.addressInput = '#address';
        this.cityInput = '#city';
        this.stateInput = '#state';
        this.zipCodeInput = '#zipCode';
        this.phoneNumberInput = '#phoneNumber';
        this.accountNumberInput = '#accountNumber';
        this.amountInput = '#amount';
        this.payButton = 'input[value="Send Payment"]';
    }

    async payBill(paymentDetails) {
        await this.page.fill(this.payeeNameInput, paymentDetails.name);
        await this.page.fill(this.addressInput, paymentDetails.address);
        await this.page.fill(this.cityInput, paymentDetails.city);
        await this.page.fill(this.stateInput, paymentDetails.state);
        await this.page.fill(this.zipCodeInput, paymentDetails.zipCode);
        await this.page.fill(this.phoneNumberInput, paymentDetails.phoneNumber);
        await this.page.fill(this.accountNumberInput, paymentDetails.accountNumber);
        await this.page.fill(this.amountInput, paymentDetails.amount.toString());
        await this.page.click(this.payButton);
    }
}

module.exports = BillPaymentPage;
