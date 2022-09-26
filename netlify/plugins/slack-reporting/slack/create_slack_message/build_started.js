const validateConfig = require("./validate_config");

/**
 * Construct a "build started" Slack message using Block Kit format.
 * https://api.slack.com/block-kit
 *
 * @param {object} config
 * @param {string} config.siteName The name of the site being built on Netlify.
 * @param {string} config.environmentType The name of the build environment, e.g. "production", "staging"
 * @param {string} config.infoUrl Netlify build log URL.
 * @param {string} config.repoUrlString The source repo on Github.
 * @param {string} config.appVersion The app version for production builds, the commit sha otherwise.
 *
 * @returns {object} An object with an array of Block Kit blocks defining a Slack message, and short text message for system messages.
 *
 * @throws {TypeError} Throws is config values are undefined.
 */
function createBuildStartedSlackMessage(config) {
  const { siteName, environmentType, infoUrl, repoUrlString, appVersion } =
    config;

  // Production builds.
  if (environmentType === "production") {
    // Throw if any config values are missing.
    validateConfig(
      ["siteName", "environmentType", "infoUrl", "repoUrlString", "appVersion"],
      config
    );

    const shortText = `${siteName}: production deployment started`;

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${siteName}* (<${repoUrlString}/releases/tag/${appVersion}|${appVersion}>): production deployment started (<${infoUrl}|*build log*>)`,
        },
      },
    ];
    return {
      shortText,
      blocks,
    };
    // Various types of dev build.
  } else {
    console.log("Only reporting production builds for now");
  }
}

module.exports = createBuildStartedSlackMessage;
