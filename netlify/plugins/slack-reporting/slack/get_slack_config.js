const SLACK_BOT_TOKEN = "SLACK_BOT_TOKEN";
const SLACK_SIGNING_SECRET = "SLACK_SIGNING_SECRET";
const SLACK_CHANNEL_ID_PRODUCTION = "SLACK_CHANNEL_ID_PRODUCTION";
const SLACK_CHANNEL_ID_PREVIEW = "SLACK_CHANNEL_ID_PREVIEW";
const slackConfigKeys = [
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_CHANNEL_ID_PRODUCTION,
  SLACK_CHANNEL_ID_PREVIEW,
];

function camelCase(s) {
  return s.toLowerCase().replace(/(_\w)/g, (_, m) => m[1].toUpperCase());
}

/**
 * An object of config strings for a Slack app.
 * @typedef {Object} SlackConfig
 * @property {string} botToken The Slack app's bot token.
 * @property {string} signingSecret The Slack app's signing secret.
 * @property {string} channelIdProduction The Slack channel ID for production builds to report to. The app must be a member of the channel.
 * @property {string} channelIdPreview The Slack channel ID for non-production builds to report to. The app must be a member of the channel.
 */
/**
 * Get Slack config from env variables
 * @returns {SlackConfig} The Slack app config.
 * @throws {TypeError} Throws if necessary env variables are undefined.
 */
module.exports = function getSlackConfig() {
  const missingValueLabel = "<-- MISSING VALUE";
  const slackConfigEntries = slackConfigKeys.map((key) => [
    camelCase(key.replace("SLACK_", "")),
    process.env[key] || missingValueLabel,
  ]);
  const slackConfig = Object.fromEntries(slackConfigEntries);
  // Only report prod builds for now,
  // in future may use the preview and branch builds as well.
  slackConfig.channelId = slackConfig.channelIdProduction;

  // If any of the Slack process.env values are missing then throw.
  if (slackConfigEntries.map((entry) => entry[1]).includes(missingValueLabel)) {
    throw new TypeError(`Please specify the following ENV variables:\n${slackConfigKeys.join(
      "\n",
    )}
  \nreceived:\n${JSON.stringify(slackConfig, null, 2)}`);
  }

  return slackConfig;
};
