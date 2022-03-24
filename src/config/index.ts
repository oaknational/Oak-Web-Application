const envVars = {
  firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  clientAppBaseUrl: process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL,
};

type ConfigKey = keyof typeof envVars;

const configGet = (key: ConfigKey) => {
  const configValue = envVars[key];

  if (!configValue) {
    /**
     * @TODO we should perform this check at build time, and validate formats eg urls
     */
    throw new Error(`No config value found for ${key}`);
  }

  return configValue;
};

const config = {
  get: configGet,
};

export default config;
