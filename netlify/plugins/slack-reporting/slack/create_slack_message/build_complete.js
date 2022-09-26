const validateConfig = require("./validate_config");

/**
 * Construct a "build complete" Slack message using Block Kit format.
 * https://api.slack.com/block-kit
 * Handles success and failure states.
 *
 * Note, this is currently set up for builds triggered from tags only.
 *
 * @param {object} config
 * @param {string} config.siteName The name of the site being built on Netlify.
 * @param {string} config.environmentType The name of the build environment, e.g. "production", "staging"
 * @param {string} config.infoUrl Netlify build log URL.
 * @param {string} config.repoUrlString The source repo on Github.
 * @param {string} config.appVersion The app version for production builds, the commit sha otherwise.
 * @param {string} config.deploymentUrl The deployment URL
 * @param {string} config.buildStatus Success, Error, Cancelled, etc.
 *
 * @returns {object} An object with an array of Block Kit blocks defining a Slack message, and short text message for system messages.
 *
 * @throws {TypeError} Throws is config values are undefined.
 */
function createSlackBuildCompleteMessage(config, buildEnvironment) {
  const {
    siteName,
    environmentType,
    infoUrl,
    repoUrlString,
    appVersion,
    deploymentUrl,
    buildStatus,
  } = config;

  // Only reporting production builds for now.
  if (buildEnvironment === "production") {
    // Throw if any config values are missing.
    validateConfig(
      [
        siteName,
        environmentType,
        infoUrl,
        repoUrlString,
        appVersion,
        deploymentUrl,
        buildStatus,
      ],
      config
    );

    const buildIcons = {
      success: ":white_check_mark:",
      error: ":x:",
      cancelled: ":heavy_multiplication_x:",
    };

    const shortText = `${siteName} production deployment ${buildStatus}`;
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${siteName} production deployment ${buildStatus}*`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: `${
            buildIcons[buildStatus] || ":grey_question:"
          } ${buildStatus}`,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Release*\n<${repoUrlString}/releases/tag/${appVersion}|${appVersion}>`,
          },
          {
            type: "mrkdwn",
            text: `(<${infoUrl}|build log>)`,
          },
        ],
      },
    ];
    return {
      shortText,
      blocks,
    };
  }
}

module.exports = createSlackBuildCompleteMessage;
