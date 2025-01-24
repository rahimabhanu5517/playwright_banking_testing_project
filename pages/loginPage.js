const config = require("../config.json");
class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.usernameInput = 'input[name="username"]';
    this.passwordInput = 'input[name="password"]';
    this.loginButton = 'input[value="Log In"]';
    this.logoutLink = 'a[href="/logout.htm"]';
    this.accountsOverviewHeading = "h1.title";
  }
  // Method to perform login action
  async login(username, password) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
  // To check if the user is logged in
  async isLoggedIn() {
    await this.page.waitForSelector(this.accountsOverviewHeading);
    const headingText = await this.page.textContent(
      this.accountsOverviewHeading
    );
    return headingText === config.accountsOverviewText;
  }
}

module.exports = LoginPage;
