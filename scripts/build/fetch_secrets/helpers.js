/**
 * @description Takes a public config object and extracts the secret names as an array of strings
 * @param {import("../fetch_config").OakConfig} oakConfig
 */
function getSecretNamesFromPublicConfig(oakConfig) {
  return Object.values(oakConfig)
    .flatMap((subConfig) => subConfig.requiredSecrets)
    .filter(Boolean);
}

module.exports = {
  getSecretNamesFromPublicConfig,
};
