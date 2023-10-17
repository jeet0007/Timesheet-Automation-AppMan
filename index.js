const puppeteer = require("puppeteer");
const commandLineArgs = require("command-line-args");

const Login = require("./common/login");
const env = require("./config/env");
const { addNewTask } = require("./common/task");
const { readFileData } = require("./common/input");
const { createNewTask } = require("./services/timesheet");

const optionDefinitions = [
  { name: "task", alias: "t", type: String },
  { name: "date", alias: "d", type: String },
  { name: "manhours", alias: "M", type: Number },
  { name: "project", alias: "p", type: Number },
  { name: "module", alias: "m", type: String },
  { name: "subTask", alias: "s", type: String },
  { name: "crNo", alias: "c", type: String },
  { name: "file", alias: "f", type: String },
];
const options = commandLineArgs(optionDefinitions);

(async () => {
  const userDir = __dirname.split("/").slice(0, 3).join("/");
  const browser = await puppeteer.launch({
    headless: false,
    waitForInitialPage: true,
    args: [
      `--user-data-dir=${userDir}/Library/Application Support/Google/Chrome/Profile 1 `,
    ],
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0); 
  const pages = await browser.pages();
  const session = await page.target().createCDPSession();
  const { windowId } = await session.send("Browser.getWindowForTarget");
  pages[0].close();
  await page.goto(env.timesheetUrl);
  await Login(page);
  await session.send("Browser.setWindowBounds", {
    windowId,
    bounds: { windowState: "minimized" },
  });
  if (options && options.file) {
    const tasks = readFileData(options.file, "utf8");
    const client = await page.target().createCDPSession();
    const cookies = (await client.send('Network.getAllCookies')).cookies;
    const promises = tasks.map((config) =>
      createNewTask(config, cookies)
        .then(() => console.log(config?.task, "added successfully"))
        .catch(() => console.log(config?.task, "failed to add"))
    );
    await Promise.allSettled(promises);
  } else if (Object.keys(options).length > 0) {
    await addNewTask(page, options);
  } else {
    console.log("Please provide input");
  }
  await browser.close();
})();
