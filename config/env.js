// Export env from this file
require("dotenv").config();
module.exports = Env = {
  timesheetUrl: "https://appmantimesheet.herokuapp.com",
  jiraUrl: process.env.JIRA_URL || "https://agentmate.atlassian.net",
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
};
