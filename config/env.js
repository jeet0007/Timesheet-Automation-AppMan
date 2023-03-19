// Export env from this file
require("dotenv").config();
module.exports = Env = {
  TimesheetUrl: "https://appmantimesheet.herokuapp.com",
  email: process.env.EMAIL || "example.com",
  password: process.env.PASSWORD || "",
  jiraUrl: process.env.JIRA_URL || "https://agentmate.atlassian.net"
};
