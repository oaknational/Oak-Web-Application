/**
 * Send a message to a Slack channel about a GCP Build job.
 *
 * Acorn Production builds against tags only.
 */

// This is for running in a cloud function, so send a one-off message, rather than starting a server.
// This means we can't use this model to listen for messages.
// For a more general set up with interactivity see https://api.slack.com/start/building/bolt-js .

// https://api.slack.com/start/building/bolt-js
const { App } = require("@slack/bolt");

/**
 * Send a message to a Slack channel via a Slack app.
 *
 * @param {string} slackMessage JSON string of Block Kit blocks to create a Slack message.
 * @param {object} slackConfig Necessary Slack app config.
 * @param {string} slackConfig.botToken The Slack app's bot token.
 * @param {string} slackConfig.signingSecret The Slack app's signing secret.
 * @param {string} slackConfig.channelId The Slack channel ID to report to. The app must be a member of the channel.
 */
module.exports = async function sendMessage(slackMessage, slackConfig) {
  const encodedBlocks = JSON.stringify(slackMessage.blocks);
  const shortText = slackMessage.shortText;

  // Configure the Slack app.
  const app = new App({
    token: slackConfig.botToken,
    signingSecret: slackConfig.signingSecret,
  });
  const channel = slackConfig.channelId;

  try {
    // Call the chat.postMessage method using the WebClient
    // https://api.slack.com/methods/chat.postMessage
    const result = await app.client.chat.postMessage({
      channel,
      text: shortText,
      blocks: encodedBlocks,
      unfurl_links: false,
    });

    return result;
  } catch (error) {
    console.error(error);
  }
};
