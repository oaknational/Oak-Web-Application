const { getSecretNamesFromPublicConfig } = require("./helpers.cjs");
const googleSecretManager = require("./google_secret_manager/index.cjs");

/**
 * @description Takes the Oak public config and fetches secrets from the specified secret manager
 * @param {import("../fetch_config").OakConfig} oakConfig
 */
function fetchSecrets(oakConfig) {
  const secretNames = getSecretNamesFromPublicConfig(oakConfig);

  if (secretNames.length === 0) {
    return {};
  }

  if (
    oakConfig.googleSecretManager &&
    oakConfig.googleSecretManager.projectId
  ) {
    const { projectId } = oakConfig.googleSecretManager;

    console.log(
      `Fetching secrets from Google Secret Manager project: ${projectId}`,
    );
    /**
     * @todo currently this will throw if a secret is not found in the secret manager.
     * We proobably just want to return the found ones and hanfle missing ones later
     * as desired
     */
    return googleSecretManager.fetchSecrets({
      projectId,
      secretNames,
    });
  }

  console.warn(
    "Secrets have been specified in Oak config but no secret manager config found, eg. config.googleSecretManager.projectId",
  );

  return {};
}

module.exports = fetchSecrets;
