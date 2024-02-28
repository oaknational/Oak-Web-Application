const { getAppVersion, getIsPluginDisabled } = require("../lib");

const {
  createBuildStartedSlackMessage,
  createBuildCompleteSlackMessage,
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

  /**
   * We need to disable plugins for some custom builds.
   */
  const isDisabled = getIsPluginDisabled("PLUGIN_SLACK_DISABLED");

  return {
    onPreBuild: async ({ netlifyConfig, utils }) => {
      if (isDisabled) {
        return;
      }

      // Extract the data required to interact with the GitHub deployments rest API.
      const buildContext = netlifyConfig.build.environment.CONTEXT;
      const originalDeploymentUrl = process.env.DEPLOY_PRIME_URL;
      const sha = process.env.COMMIT_REF;
      const repoUrlString = process.env.REPOSITORY_URL;
      const siteName = process.env.SITE_NAME;
      const deployId = process.env.DEPLOY_ID;
      const infoUrl = `https://app.netlify.com/sites/${siteName}/deploys/${deployId}`;
      // For PR (preview) builds only.
      // const prMergeHead = process.env.BRANCH;

      const isProduction = buildContext === DEPLOY_CONTEXTS.production;

      // TO DO: if it's production, parse the commit message for the version.
      const productionAppVersion = getAppVersion();
      let appVersion = isProduction ? productionAppVersion : sha;

      // If it's a production build with no version number it's a cancelled merge commit,
      // do nothing.
      const willBeCancelled = isProduction && !productionAppVersion;

      // Modify the deployment URL so that CI tools using it can go straight
      // to the canonical URL without hitting the edge function redirect.
      // It's a bit fragile, but otherwise access token headers can get lost
      // in the redirect.
      const deploymentUrl = isProduction
        ? originalDeploymentUrl
        : originalDeploymentUrl.replace(
            "netlify.app",
            "netlify.thenational.academy",
          );

      // Custom plugin config
      const slackConfig = getSlackConfig();

      // Get the environment type from the build context,
      // override naming of preview deployments.

      let environmentType = buildContext;
      if (environmentType === DEPLOY_CONTEXTS.deployPreview) {
        environmentType = "deploy-preview";
      }

      // Store data for use in subsequent build steps.
      sharedInfo = {
        isProduction,
        willBeCancelled,
        siteName,
        environmentType,
        infoUrl,
        repoUrlString,
        appVersion,
        deploymentUrl,
        slackConfig,
      };

      // Early exits
      // Only report on production builds for now.
      if (!isProduction) {
        return;
      }
      // It's a merge commit on main, it will be cancelled, do nothing.
      if (willBeCancelled) {
        return;
      }

      // Construct the Slack message.
      const slackMessage = createBuildStartedSlackMessage({
        siteName,
        environmentType,
        infoUrl,
        repoUrlString,
        appVersion,
      });

      try {
        await sendMessage(slackMessage, slackConfig);
        // console.log("Slack call result:", result);
      } catch (error) {
        utils.build.failBuild("Failed to report build start to Slack", {
          error,
        });
      }
    },

    /**
     * Set deployment status failure.
     */
    onError: async ({ utils }) => {
      if (isDisabled) {
        return;
      }

      // Early exits
      // Only report on production builds for now.
      if (!sharedInfo.isProduction) {
        return;
      }
      // It's a merge commit on main, has been  be cancelled, do nothing.
      if (sharedInfo.willBeCancelled) {
        return;
      }

      const {
        siteName,
        environmentType,
        infoUrl,
        repoUrlString,
        appVersion,
        deploymentUrl,
        slackConfig,
      } = sharedInfo;
      const slackMessage = createBuildCompleteSlackMessage({
        siteName,
        environmentType,
        infoUrl,
        repoUrlString,
        appVersion,
        deploymentUrl,
        buildStatus: "error",
      });

      try {
        await sendMessage(slackMessage, slackConfig);
        // console.log("Slack call result:", result);
      } catch (error) {
        utils.build.failBuild("Failed to report build error to Slack", {
          error,
        });
      }
    },

    /**
     * Set deployment status success.
     */
    onSuccess: async ({ utils }) => {
      if (isDisabled) {
        return;
      }

      // Early exits
      // Only report on production builds for now.
      if (!sharedInfo.isProduction) {
        return;
      }

      const {
        siteName,
        environmentType,
        infoUrl,
        repoUrlString,
        appVersion,
        deploymentUrl,
        slackConfig,
      } = sharedInfo;
      const slackMessage = createBuildCompleteSlackMessage({
        siteName,
        environmentType,
        infoUrl,
        repoUrlString,
        appVersion,
        deploymentUrl,
        buildStatus: "success",
      });

      try {
        await sendMessage(slackMessage, slackConfig);
        // console.log("Slack call result:", result);
      } catch (error) {
        utils.build.failBuild("Failed to report build success to Slack", {
          error,
        });
      }
    },
  };
};
