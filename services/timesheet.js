const axios = require('axios');
const moment = require('moment');
const env = require("../config/env");


const instance = axios.create({
    baseURL: 'https://appmantimesheet.herokuapp.com',
    headers: {
        Accept: 'text/html, application/xhtml+xml, application/xml;q=0.9, image/avif, image/webp, image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Upgrade-Insecure-Requests': 1,
        'sec-ch-ua-platform': "macOS",
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
        'host': 'appmantimesheet.herokuapp.com',
    },
    withCredentials: true,
});

const getCsrfToken = async (date) => {
    const response = await instance.get(`/tasks/new?date=${date}`);
    const csrfToken = response.data.match(/<meta name="csrf-token" content="(.*)" \/>/)[1];
    const userId = response.data.match(/<input type="hidden" value="(.*)" name="(.*)" id="task_user_id" \/>/)[1];
    return { csrfToken, userId };
};

const createNewTask = async (config, cookies) => {
  instance.defaults.headers.common["Cookie"] = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const formData = new URLSearchParams();
  const { date, manhours, module, task, subTask, crNo, remark, project } =
    config || {};
  const { csrfToken, userId } = await getCsrfToken(date);
  console.log(config);
  formData.append("authenticity_token", csrfToken);
  formData.append("commit", "Create Task");
  formData.append("task[card_id]", crNo ? `${env.jiraUrl}/browse/${crNo}` : "");
  formData.append("task[charge_code]", "");
  formData.append("task[chargeable]", 0);
  formData.append("task[leave_type_id]", 1);
  formData.append("task[date]", date);
  formData.append("task[hours]", manhours);
  formData.append("task[module]", module || "");
  formData.append("task[name]", task || "");
  formData.append("task[project_id]", project || "");
  formData.append("task[remark]", remark || "");
  formData.append("task[requirement_id]", crNo);
  formData.append("task[sub_task]", subTask || "");
  formData.append("task[user_id]", userId || "");
  const response = await instance.post("/tasks", formData).catch((err) => {
    console.warn(err);
  });
  if (response?.status !== 200) {
    throw new Error(`Failed to create task ${JSON.stringify(config)}`);
  }
};

module.exports = {
    createNewTask,
};