const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './parabank_tests',    
    timeout: 60000,
    retries:0, 
    use: {
        headless: false, 
        baseURL: 'https://parabank.parasoft.com/',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
});
