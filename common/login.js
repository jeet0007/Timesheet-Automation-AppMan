const env = require("../config/env");

module.exports = Login = async (page) => {
  const isLoggedIn = page.url() === "https://appmantimesheet.herokuapp.com/";
  if (!isLoggedIn) {
    await page.goto(`${env.timesheetUrl}/users/sign_in`, {
      waitForInitialPage: true,
    });
    await page.waitForXPath("/html/body/div/div/a");
    await page.click("xpath//html/body/div/div/a");
    await page.waitForTimeout(3000);
    await page.waitForFunction(() => window.location.href === env.timesheetUrl, { timeout: 0, polling: 'mutation' });
  }
};
