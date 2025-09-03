import { OakConfig } from "../fetch_config/config_types.js";

import { getSecretNamesFromPublicConfig } from "./helpers.js";
import { fetchSecrets as gFetchSecrets } from "./google_secret_manager/index.js";

type Secrets = Record<string, string>;

/**
 * Takes the Oak public config and fetches secrets from the specified secret manager
 *
 * @param oakConfig
 */
async function fetchSecrets(oakConfig: OakConfig): Promise<Secrets> {
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
     * We probably just want to return the found ones and handle missing ones later
     * as desired
     */
    return gFetchSecrets({
      projectId,
      secretNames,
    });
  }

  console.warn(
    "Secrets have been specified in Oak config but no secret manager config found, eg. config.googleSecretManager.projectId",
  );

  return {};
}

export default fetchSecrets;
