const fs = require("fs");
const path = require("path");
var appRoot = require("app-root-path");

module.exports = (error) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${error.stack || error.message}\n`;
  const logFilePath = path.join(appRoot.path, "error.txt");

  // Append the error message to the log file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    } else {
      console.log("Error logged:", error.message || error);
    }
  });
};
