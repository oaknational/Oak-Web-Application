const envVars = {
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
  clientAppBaseUrl: process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL,
  firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  releaseStage: process.env.NEXT_PUBLIC_RELEASE_STAGE,
};

type ConfigKey = keyof typeof envVars;

for (const [key, value] of Object.entries(envVars)) {
  /**
   * @TODO we decide which var is required, etc, and set defaults and validations
   */
  if (!value) {
    throw new Error(`No config value found for ${key}`);
  }
}

const configGet = (key: ConfigKey) => {
  const configValue = envVars[key];

  if (!configValue) {
    console.warn(`Tried to get config value for ${key}, but none was found`);
  }

  return configValue;
};

const config = {
  get: configGet,
};

export default config;
