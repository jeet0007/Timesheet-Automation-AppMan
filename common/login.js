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
      if (env.email) {
      await page.waitForSelector("#identifierId");
      await page.type("#identifierId", env.email);
      await page.waitForTimeout(1000);
        await page.keyboard.press("Enter");
      }
      await page.waitForSelector('#password input[type="password"]', {
        visible: true,
      });
      if (env.password) {
        await page.type('#password input[type="password"]', env.password, {
          delay: 5,
        });
        await page.keyboard.press("Enter");
      }
      await page.waitForFunction(
        () => window.location.href === env.timesheetUrl
        , 10000);
    } catch (error) {
      console.error(error);
    }
  }
};
