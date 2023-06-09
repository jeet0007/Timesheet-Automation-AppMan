const puppeteer = require("puppeteer");
const commandLineArgs = require("command-line-args");

const Login = require("./common/login");
const env = require("./config/env");
const { addNewTask } = require("./common/task");
const { readFileData } = require("./common/input");

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
  const pages = await browser.pages();

  pages[0].close();

  await page.goto(env.timesheetUrl);
  await Login(page);
  if (options && options.file) {
    const tasks = readFileData(options.file, "utf8");
    for (const config of tasks) {
      await addNewTask(page, config);
    }
  } else {
    if (Object.keys(options).length > 0) await addNewTask(page, options);
  }
  await browser.close();
})();
