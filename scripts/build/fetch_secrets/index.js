const { getSecretNamesFromPublicConfig } = require("./helpers");
const googleSecretManager = require("./google_secret_manager");

/**
 * @description Takes the Oak public config and fetches secrets from the specified secret manager
 * @param {import("../fetch_config").OakConfig} oakConfig
 */
function fetchSecrets(oakConfig) {
  const secretNames = getSecretNamesFromPublicConfig(oakConfig);

  if (secretNames.length === 0) {
    return {};
  }

  if (oakConfig.googleSecretManager.projectId) {
    const { projectId } = oakConfig.googleSecretManager;
    console.log(
      `Fetching secrets from Google Secret Manager project: ${projectId}`
    );
    return googleSecretManager.fetchSecrets({
      projectId,
      secretNames,
    });
  }

  throw new Error(
    "Secrets have been specified in Oak config but no secret manager config found, eg. config.googleSecretManager.projectId"
  );
}

module.exports = fetchSecrets;
