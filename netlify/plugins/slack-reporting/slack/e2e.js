// You need to specify the env variables in the .env file.
// See workspaces/google_cloud_functions/slack_build_reporter/.example.env
require("dotenv").config({ path: "./.env.local" });

/**
 * Run the function locally for development.
 */
const {
  createBuildStartedSlackMessage,
  createBuildCompleteSlackMessage,
} = require("./create_slack_message");
const getSlackConfig = require("./get_slack_config");
const sendMessage = require("./send_message");

const messageConfigProdStart = {
  siteName: "fake test app name",
  environmentType: "production",
  infoUrl: "https://example.com/build_url",
  repoUrlString: "https://github.com/oaknational/Oak-Web-Application",
  appVersion: "v1.23.0",
};
const messageConfigProdSuccess = {
  siteName: "fake test app name",
  environmentType: "production",
  infoUrl: "https://example.com/build_url",
  repoUrlString: "https://github.com/oaknational/Oak-Web-Application",
  appVersion: "v1.23.0",
  buildStatus: "success",
  deploymentUrl: "https://example.com/deployment_url",
};

const prodStart = createBuildStartedSlackMessage(
  messageConfigProdStart,
  "production"
);
const prodFinish = createBuildCompleteSlackMessage(
  messageConfigProdSuccess,
  "production"
);

const slackConfig = getSlackConfig();

(async function doTest() {
  let result;

  result = await sendMessage(prodStart, slackConfig);
  console.log("start", result);

  result = await sendMessage(prodFinish, slackConfig);
  console.log("success", result);
})();
