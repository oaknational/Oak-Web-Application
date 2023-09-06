/**
 * Validate the config used to generate a Slack message.
 *
 * Checks that a list of keys are present and have values other than undefined or null.
 *
 * @param {array} configKeys The config keys to check against.
 * @param {object} config The config to validate.
 *
 * @throws {TypeError} Throws if the config has missing values.
 */
module.exports = function validateConfig(configKeys, config) {
  const checkedConfig = {};
  const missingValueLabel = "<-- MISSING VALUE";
  configKeys.forEach(
    (key) => (checkedConfig[key] = config[key] ?? missingValueLabel),
  );
  if (Object.values(checkedConfig).includes(missingValueLabel)) {
    throw new TypeError(
      `Please specify the following message config values:\n${configKeys.join(
        "\n",
      )}
      \nreceived:\n${JSON.stringify(checkedConfig, undefined, 2)}`,
    );
  }
};
