// You need to specify the env variables in the .env file.
// See workspaces/google_cloud_functions/slack_build_reporter/.example.env

import dotenv from "dotenv";

/**
 * Run the function locally for development.
 */
import {
  createBuildStartedSlackMessage,
  createBuildCompleteSlackMessage,
} from "./create_slack_message";
import getSlackConfig from "./get_slack_config";
import sendMessage from "./send_message";

dotenv.config({ path: "./.env.local" });

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
const messageConfigProdCancelled = {
  siteName: "fake test app name",
  environmentType: "production",
  infoUrl: "https://example.com/build_url",
  repoUrlString: "https://github.com/oaknational/Oak-Web-Application",
  appVersion: "v1.23.0",
  buildStatus: "cancelled",
};
const messageConfigProdError = {
  siteName: "fake test app name",
  environmentType: "production",
  infoUrl: "https://example.com/build_url",
  repoUrlString: "https://github.com/oaknational/Oak-Web-Application",
  appVersion: "v1.23.0",
  buildStatus: "error",
};

const prodStart = createBuildStartedSlackMessage(
  messageConfigProdStart,
  "production",
);
const prodFinish = createBuildCompleteSlackMessage(
  messageConfigProdSuccess,
  "production",
);
const prodCancelled = createBuildCompleteSlackMessage(
  messageConfigProdCancelled,
  "production",
);
const prodError = createBuildCompleteSlackMessage(
  messageConfigProdError,
  "production",
);

const slackConfig = getSlackConfig();

(async function doTest() {
  let result;

  result = await sendMessage(prodStart, slackConfig);
  console.log("start", result);

  result = await sendMessage(prodFinish, slackConfig);
  console.log("success", result);

  result = await sendMessage(prodCancelled, slackConfig);
  console.log("success", result);

  result = await sendMessage(prodError, slackConfig);
  console.log("success", result);
})();
