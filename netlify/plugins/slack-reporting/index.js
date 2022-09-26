const {
  createBuildStartedSlackMessage,
} = require("./slack/create_slack_message");
const getSlackConfig = require("./slack/get_slack_config");
const sendMessage = require("./slack/send_message");

module.exports = function slackBuildReporterPlugin() {
  let sharedInfo = {};

  /**
   * Enum for Netlify deploy context values.
   * @readonly
   * @enum {string}
   */
  const DEPLOY_CONTEXTS = {
    production: "production",
    deployPreview: "deploy-preview",
    branchDeploy: "branch-deploy",
    dev: "dev",
  };

  return {
    onPreBuild: async ({ netlifyConfig, utils }) => {
      // Extract the data required to interact with the GitHub deployments rest API.
      const buildContext = netlifyConfig.build.environment.CONTEXT;
      const originalDeploymentUrl = process.env.DEPLOY_PRIME_URL;
      const headBranchRef = process.env.HEAD;
      const sha = process.env.COMMIT_REF;
      const repoUrlString = process.env.REPOSITORY_URL;
      const siteName = process.env.SITE_NAME;
      const deployId = process.env.DEPLOY_ID;
      const infoUrl = `https://app.netlify.com/sites/${siteName}/deploys/${deployId}`;
      // For PR (preview) builds only.
      // const prMergeHead = process.env.BRANCH;

      const isProduction = buildContext === DEPLOY_CONTEXTS.production;

      // TO DO: if it's production, parse the commit message for the version.
      let appVersion = "made up app version";

      // Modify the deployment URL so that CI tools using it can go straight
      // to the canonical URL without hitting the edge function redirect.
      // It's a bit fragile, but otherwise access token headers can get lost
      // in the redirect.
      const deploymentUrl = isProduction
        ? originalDeploymentUrl
        : originalDeploymentUrl.replace(
            "netlify.app",
            "netlify.thenational.academy"
          );

      // Custom plugin config
      const slackConfig = getSlackConfig();

      // Store the deployment data for use in subsequent build steps.
      sharedInfo = {
        buildContext,
        deploymentUrl,
        headBranchRef,
        sha,
        repoUrlString,
        siteName,
        infoUrl,
        slackConfig,
      };

      // Get PR number (only used in creating comments).
      // const prNumber = prMergeHead.split("/")[1];

      // Get the environment type from the build context,
      // override naming of preview deployments.

      let environmentType = buildContext;
      if (environmentType === DEPLOY_CONTEXTS.deployPreview) {
        environmentType = "deploy-preview";
      }

      const messageConfig = {
        siteName,
        environmentType,
        infoUrl,
        repoUrlString,
        appVersion: isProduction ? appVersion : sha,
      };
      const slackMessage = createBuildStartedSlackMessage(
        messageConfig,
        environmentType
      );

      try {
        const result = await sendMessage(slackMessage, slackConfig);

        console.log("*** result");
        console.log(result);
      } catch (error) {
        utils.build.failBuild("Failed to report build start to Slack", {
          error,
        });
      }
    },

    /**
     * Set deployment status failure.
     */
    onError: async () => {
      console.log(sharedInfo);
    },

    /**
     * Set deployment status success.
     */
    onSuccess: async () => {},
  };
};
