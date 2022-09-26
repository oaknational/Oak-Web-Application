// You need to specify the env variables in the .env file.
// See workspaces/google_cloud_functions/slack_build_reporter/.example.env
require("dotenv").config({ path: "./.env.local" });

/**
 * Run the function locally for development.
 */
const {
  createBuildStartedSlackMessage,
  // createBuildCompleteSlackMessage,
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
// const messageConfigProdFinish = {
//   appName: "fake app",
//   buildId: "1234",
//   buildRepo: "https://github.com/oaknational/Leaf/",
//   buildStatus: "Success",
//   buildSuccess: true,
//   tagName: "v99.9999",
// };
// const messageConfigStagStart = {
//   appName: "fake app",
//   buildId: "1234",
//   buildRepo: "https://github.com/oaknational/Leaf/",
//   buildStatus: "Working",
//   buildSuccess: true,
// };
// const messageConfigStagFinish = {
//   appName: "fake app",
//   buildId: "1234",
//   buildRepo: "https://github.com/oaknational/Leaf/",
//   buildStatus: "Success",
//   buildSuccess: true,
// };
// const messageConfigStagFail = {
//   appName: "fake app",
//   buildId: "1234",
//   buildRepo: "https://github.com/oaknational/Leaf/",
//   buildStatus: "Error",
//   buildSuccess: false,
// };

const prodStart = createBuildStartedSlackMessage(
  messageConfigProdStart,
  "production"
);
// const prodFinish = createBuildCompleteSlackMessage(
//   messageConfigProdFinish,
//   "production"
// );
// const stagStart = createBuildStartedSlackMessage(
//   messageConfigStagStart,
//   "staging"
// );
// const stagFinish = createBuildCompleteSlackMessage(
//   messageConfigStagFinish,
//   "staging"
// );
// const stagFail = createBuildCompleteSlackMessage(
//   messageConfigStagFail,
//   "staging"
// );

const slackConfig = getSlackConfig();

(async function doTest() {
  const result = await sendMessage(prodStart, slackConfig);
  console.log(result);
})();

// sendMessage(prodFinish, slackConfigProd);
// sendMessage(stagStart, slackConfigStag);
// sendMessage(stagFinish, slackConfigStag);
// sendMessage(stagFail, slackConfigStag);
