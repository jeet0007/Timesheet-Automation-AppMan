const axios = require("axios");
const env = require("../config/env");

const instance = axios.create({
  baseURL: "https://appmantimesheet.herokuapp.com",
  headers: {
    Accept:
      "text/html, application/xhtml+xml, application/xml;q=0.9, image/avif, image/webp, image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Content-Type": "application/x-www-form-urlencoded",
    "Upgrade-Insecure-Requests": 1,
    "sec-ch-ua-platform": "macOS",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua":
      '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
    host: "appmantimesheet.herokuapp.com",
  },
  withCredentials: true,
});

const getDefaultValues = async (date, cookies) => {
  // get _timesheet_session cookie
  const timesheetSession = cookies.find(
    (cookie) => cookie.name === "_timesheet_session"
  );
  const response = await instance
    .get(`/tasks/new?date=${date}`, {
      headers: {
        Accept: "text/html, application/xhtml+xml",
        host: "appmantimesheet.herokuapp.com",
        Cookie: `_timesheet_session=${timesheetSession.value}`,
      },
    })
    .catch((e) => {
      console.log("Error while fetching default values", e?.response?.status);
    });
  if (!response) {
    return {};
  }
  const csrfToken = response.data.match(
    /<meta name="csrf-token" content="(.*)" \/>/
  )[1];
  const userId = response.data.match(
    /<input type="hidden" value="(.*)" name="(.*)" id="task_user_id" \/>/
  )[1];
  const project = response.data.match(
    /<option selected="selected" value="(.*)">(.*)<\/option>/
  )[1];
  return { csrfToken, userId, project };
};

const createNewTask = async (config, cookies) => {
  const timesheetSession = cookies.find(
    (cookie) => cookie.name === "_timesheet_session"
  );
  instance.defaults.headers.Cookie = `_timesheet_session=${timesheetSession.value}`;
  const { date, manhours, module, task, subTask, crNo, remark, project } =
    config || {};
  const {
    csrfToken,
    userId,
    project: defaultProject,
  } = await getDefaultValues(date, cookies);
  console.info(`Creating task for ${date}`);
  const formData = new URLSearchParams([
    ["authenticity_token", csrfToken],
    ["commit", "Create Task"],
    ["task[card_id]", crNo ? `${env.jiraUrl}/browse/${crNo}` : ""],
    ["task[charge_code]", ""],
    ["task[chargeable]", 0],
    ["task[leave_type_id]", 1],
    ["task[date]", date],
    ["task[hours]", manhours],
    ["task[module]", module || ""],
    ["task[name]", task || ""],
    ["task[project_id]", project || defaultProject || ""],
    ["task[remark]", remark || ""],
    ["task[requirement_id]", crNo],
    ["task[sub_task]", subTask || ""],
    ["task[user_id]", userId || ""],
  ]);
  return instance.post("/tasks", formData);
};

module.exports = {
  createNewTask,
};
