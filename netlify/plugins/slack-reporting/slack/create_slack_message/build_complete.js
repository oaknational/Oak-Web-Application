const { capitalCase } = require("change-case");

const validateConfig = require("./validate_config");

/**
 * List of expected config keys.
 *
 * Keep this up to date if you want the function to spot missing keys.
 */
const configKeysProduction = [
  "appName",
  "buildId",
  "buildRepo",
  "buildStatus",
  "buildSuccess",
  "tagName",
];
const configKeysStaging = [
  "appName",
  "buildId",
  "buildRepo",
  "buildStatus",
  "buildSuccess",
];

/**
 * Construct a "build complete" Slack message using Block Kit format.
 * https://api.slack.com/block-kit
 * Handles success and failure states.
 *
 * Note, this is currently set up for builds triggered from tags only.
 *
 * @param {object} config
 * @param {string} config.appName The name of the app being reported on.
 * @param {string} config.buildId The Cloud Build build ID for the build being reported on.
 * @param {string} config.buildRepo The source repo on Github.
 * @param {string} config.buildStatus Descriptive build status.
 * @param {boolean} config.buildSuccess Boolean build success state.
 * @param {string} [config.tagName] The name of the Git tag that triggered the build.
 * @param {string} buildEnvironment The name of the build environment, e.g. "production", "staging"
 *
 * @returns {object} An object with an array of Block Kit blocks defining a Slack message, and short text message for system messages.
 *
 * @throws {TypeError} Throws is config values are undefined.
 */
function createSlackBuildCompleteMessage(config, buildEnvironment) {
  if (buildEnvironment === "production") {
    // Throw if any config values are missing.
    validateConfig(configKeysProduction, config);
    const shortText = `${capitalCase(config.appName)} production deployment ${
      config.buildSuccess ? "success" : "failure"
    }`;
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${capitalCase(
            config.appName
          )} production deployment complete*`,
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
            config.buildSuccess ? ":white_check_mark:" : ":x:"
          } ${config.buildStatus.toLowerCase()}`,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Release*\n<${config.buildRepo}/releases/tag/${config.tagName}|${config.tagName}>`,
          },
          {
            type: "mrkdwn",
            text: `*Build log*\n<https://console.cloud.google.com/cloud-build/builds;region=global/${
              config.buildId
            }?project=oak-national-academy&supportedpurview=project|...${config.buildId.substr(
              -6
            )}>`,
          },
        ],
      },
    ];
    return {
      shortText,
      blocks,
    };
  } else if (buildEnvironment === "staging") {
    // Throw if any config values are missing.
    validateConfig(configKeysStaging, config);
    const shortText = `${capitalCase(config.appName)} staging deployment ${
      config.buildSuccess ? "success" : "failure"
    }`;
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${capitalCase(
            config.appName
          )}*: staging deployment complete. ${
            config.buildSuccess ? ":white_check_mark:" : ":x:"
          } ${config.buildStatus.toLowerCase()} (<https://console.cloud.google.com/cloud-build/builds;region=global/${
            config.buildId
          }?project=oak-national-academy&supportedpurview=project|*build log*>)`,
        },
      },
    ];
    return {
      shortText,
      blocks,
    };
  }
}

module.exports = createSlackBuildCompleteMessage;
