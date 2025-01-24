const config = require("../config.json");

class HomePage {
  constructor(page) {
    this.page = page;

    // Locators
    this.solutionsLink = "ul.leftmenu li.Solutions";
    this.aboutUsLink = 'ul.leftmenu li a[href="about.htm"]';
    this.servicesLink = 'ul.leftmenu li a[href="services.htm"]';
    this.productsLink = 'ul.leftmenu li a[href="http://www.parasoft.com/jsp/products.jsp"]';
    this.locationsLink = 'ul.leftmenu li a[href="http://www.parasoft.com/jsp/pr/contacts.jsp"]';
    this.adminPageLink = 'ul.leftmenu li a[href="admin.htm"]';
  }

  // To check if all global navigation links are visible
  async checkGlobalNavLinks() {
    await this.page.waitForSelector(this.solutionsLink);
    await this.page.waitForSelector(this.aboutUsLink);
    await this.page.waitForSelector(this.servicesLink);
    await this.page.waitForSelector(this.productsLink);
    await this.page.waitForSelector(this.locationsLink);
    await this.page.waitForSelector(this.adminPageLink);
  }

  // To click on all navigation links and assert correct navigation
  async clickAndVerifyLinks() {
    await this.page.click(this.aboutUsLink);
    await this.page.waitForURL(/about.htm/);
    await this.page.goBack();

    await this.page.click(this.servicesLink);
    await this.page.waitForURL(/services.htm/);
    await this.page.goBack();

    await this.page.click(this.productsLink);
    await this.page.waitForURL(/products/);
    await this.page.goBack();

    await this.page.click(this.locationsLink);
    await this.page.waitForURL(/solutions/);
    await this.page.goBack();

    await this.page.click(this.adminPageLink);
    await this.page.waitForURL(/admin.htm/);
  }
}

module.exports = HomePage;
