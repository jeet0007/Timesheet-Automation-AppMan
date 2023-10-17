const env = require("../config/env");

module.exports = Login = async (page) => {
  const isLoggedIn = page.url() === "https://appmantimesheet.herokuapp.com/";
  if (!isLoggedIn) {
    console.log("Logging in...");
    await page.goto(`${env.timesheetUrl}/users/sign_in`, {
      waitForInitialPage: true,
    });
    await page.waitForXPath("/html/body/div/div/a");
    await page.click("xpath//html/body/div/div/a");

    await page.waitForFunction(
      "window.location.href == 'https://appmantimesheet.herokuapp.com/'",
      { timeout: 0 }
    );
    console.log("Logged in");
  }
};
// {
//     "ancestorOrigins": {},
//     "href": "https://appmantimesheet.herokuapp.com/",
//     "origin": "https://appmantimesheet.herokuapp.com",
//     "protocol": "https:",
//     "host": "appmantimesheet.herokuapp.com",
//     "hostname": "appmantimesheet.herokuapp.com",
//     "port": "",
//     "pathname": "/",
//     "search": "",
//     "hash": ""
// }
