import { OakConfig } from "../fetch_config/config_types";

/**
 * Takes a public config object and extracts the secret names as an array of strings
 */
export function getSecretNamesFromPublicConfig(oakConfig: OakConfig) {
  return Object.values(oakConfig)
    .flatMap((subConfig) => {
      if ("requiredSecrets" in subConfig) {
        return subConfig.requiredSecrets;
      }
      // Needs to evaluate to falsy.
      return "";
    })
    .filter(Boolean);
}
