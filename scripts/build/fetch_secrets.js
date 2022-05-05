// Import the Secret Manager client and instantiate it:
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const client = new SecretManagerServiceClient();

/**
 * @description Takes a secret name as given on creation of the secret
 * and returns the full name, including the path at which it is stored.
 * @param {string} projectId
 * @param {string} secretName
 */
const getFullSecretName = (projectId, secretName) =>
  `projects/${projectId}/secrets/${secretName}`;

/**
 * @typedef {Object} FetchSecretsProps
 * @property {string} projectId - Google Cloud projectId.
 * @property {string[]} secretNames - List of secret names to be fetched.
 * @param {FetchSecretsProps} props
 */
async function fetchSecrets({ projectId, secretNames }) {
  // List secrets
  const [allAvailableSecrets] = await client.listSecrets({
    parent: `projects/${projectId}`,
  });

  // Filter to find any requested secrets which aren't available
  const missingSecrets = secretNames.filter(
    (secretName) =>
      !allAvailableSecrets
        .map((secret) => secret.name)
        .includes(getFullSecretName(secretName))
  );
  if (missingSecrets.length > 0) {
    throw new Error(
      `Could not fetch secrets, as the following secrets could not be found: \n${missingSecrets.join(
        `\n`
      )}`
    );
  }

  const latestSecretValuePromises = secretNames.map(async (secretName) => {
    const fullSecretName = getFullSecretName(secretName);

    const [versions] = await client.listSecretVersions({
      parent: `${fullSecretName}`,
    });

    // We find the first enabled version, which is the latest
    const latestEnabledSecretVersion = versions.find(
      (version) => version.state === "ENABLED"
    );

    if (!latestEnabledSecretVersion) {
      throw new Error(
        `Could not fetch secrets, as there was no enabled version found for ${secretName}`
      );
    }

    const versionName = latestEnabledSecretVersion.name;

    const [version] = await client.accessSecretVersion({
      name: versionName,
    });

    // Extract the payload as a string.
    const payload = version.payload.data.toString();

    return { name: secretName, value: payload };
  });

  // Fetch all secret values in parallel
  return await Promise.all(latestSecretValuePromises);
}

module.exports = fetchSecrets;
