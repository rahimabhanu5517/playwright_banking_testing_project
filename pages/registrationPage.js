class RegistrationPage {
  constructor(page) {
    this.page = page;
    // Locators
    this.registerLink = 'a[href="register.htm"]';
    this.firstNameInput = "#customer\\.firstName";
    this.lastNameInput = "#customer\\.lastName";
    this.addressInput = "#customer\\.address\\.street";
    this.cityInput = "#customer\\.address\\.city";
    this.stateInput = "#customer\\.address\\.state";
    this.zipCodeInput = "#customer\\.address\\.zipCode";
    this.phoneInput = "#customer\\.phoneNumber";
    this.ssnInput = "#customer\\.ssn";
    this.usernameInput = "#customer\\.username";
    this.passwordInput = "#customer\\.password";
    this.repeatedPasswordInput = "#repeatedPassword";
    this.registerButton = 'input.button[value="Register"]';
    this.successMessage = "#rightPanel p";
  }
  async navigateToRegisterPage() {
    await this.page.click(this.registerLink);
  }
  async fillAndSubmitRegistrationForm(user) {
    await this.page.fill(this.firstNameInput, user.firstName);
    await this.page.fill(this.lastNameInput, user.lastName);
    await this.page.fill(this.addressInput, user.address);
    await this.page.fill(this.cityInput, user.city);
    await this.page.fill(this.stateInput, user.state);
    await this.page.fill(this.zipCodeInput, user.zipCode);
    await this.page.fill(this.phoneInput, user.phone);
    await this.page.fill(this.ssnInput, user.ssn);
    await this.page.fill(this.usernameInput, user.username);
    await this.page.fill(this.passwordInput, user.password);
    await this.page.fill(this.repeatedPasswordInput, user.password);
    await this.page.click(this.registerButton);
  }
  async getSuccessMessage() {
    return await this.page.textContent(this.successMessage);
  }
}

module.exports = RegistrationPage;
