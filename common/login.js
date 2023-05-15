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
    try {
      await page.waitForSelector("#identifierId");
      await page.type("#identifierId", env.email);
      await page.waitForTimeout(1000);
      await page.keyboard.press("Enter");
      await page.waitForSelector('#password input[type="password"]', {
        visible: true,
      });
      await page.waitForFunction(
        () => window.location.href === env.timesheetUrl
      );
    } catch (error) {
      console.error(error);
    }
  }
};
