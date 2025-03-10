// Import the Secret Manager client and instantiate it:
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const { getFullSecretName } = require("./helpers.cjs");

/**
 * Verify credentials exist and return secret manager client
 */
const getClient = () => {
  if (!process.env.GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT) {
    throw new Error("Please set env for GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT");
  }

  console.log("Parsing GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT value");
  const serviceAccount = JSON.parse(
    process.env.GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT,
  );

  return new SecretManagerServiceClient({
    credentials: serviceAccount,
  });
};

/**
 * @typedef {Object} FetchSecretsProps
 * @property {string} projectId - Google Cloud projectId.
 * @property {string[]} secretNames - List of secret names to be fetched.
 * @param {FetchSecretsProps} props
 * @typedef {Object.<string, string>} Secrets
 * @returns {Promise<Secrets>}
 */
async function fetchSecrets({ projectId, secretNames }) {
  const client = getClient();

  // List secrets
  const [allAvailableSecrets] = await client.listSecrets({
    parent: `projects/${projectId}`,
  });

  // Filter to find any requested secrets which aren't available
  const missingSecrets = secretNames.filter(
    (secretName) =>
      !allAvailableSecrets
        .map((secret) => secret.name)
        .includes(getFullSecretName(projectId, secretName)),
  );

  if (missingSecrets.length > 0) {
    const message = `Oak.google_secret_manager the following secrets could not be found:\n${missingSecrets.join(
      "\n",
    )}`;
    console.warn(message);
  }

  const latestSecretValuePromises = secretNames.map(async (secretName) => {
    const fullSecretName = getFullSecretName(projectId, secretName);

    const [versions] = await client.listSecretVersions({
      parent: `${fullSecretName}`,
    });

    // We find the first enabled version, which is the latest
    const latestEnabledSecretVersion = versions.find(
      (version) => version.state === "ENABLED",
    );

    if (!latestEnabledSecretVersion) {
      const message = `Oak.google_secret_manager: no enabled version found for ${secretName}`;
      console.warn(message);
      return [secretName, null];
    }

    const versionName = latestEnabledSecretVersion.name;

    const [version] = await client.accessSecretVersion({
      name: versionName,
    });

    // Extract the payload as a string.
    const secretValue = version.payload.data.toString();

    return [secretName, secretValue];
  });

  // Fetch all secret values in parallel
  // @todo use correct settings for uslint so Promise is allowed
  // eslint-disable-next-line no-undef
  const secrets = await Promise.all(latestSecretValuePromises);

  return Object.fromEntries(secrets);
}

module.exports = { fetchSecrets };
