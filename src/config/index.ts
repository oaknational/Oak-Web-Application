const CONFIG_KEYS = [
  "firebaseApiKey",
  "firebaseAuthDomain",
  "firebaseProjectId",
  "firebaseStorageBucket",
  "firebaseMessagingSenderId",
  "firebaseAppId",
  "clientAppBaseUrl",
  "graphqlApiUrl",
  "hasuraAdminSecret",
  "firebaseAdminDatabaseUrl",
  "firebaseAdminPrivateKeyId",
  "firebaseAdminPrivateKey",
  "firebaseAdminClientId",
  "firebaseAdminClientEmail",
  "firebaseAdminX509CertUrl",
] as const;

type ConfigKey = typeof CONFIG_KEYS[number];

type EnvVar = {
  value: string | undefined;
  required: boolean;
  availableInBrowser: boolean;
  default: string | null;
};

const envVars: Record<ConfigKey, EnvVar> = {
  firebaseApiKey: {
    value: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  firebaseAuthDomain: {
    value: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  firebaseProjectId: {
    value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  firebaseStorageBucket: {
    value: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  firebaseMessagingSenderId: {
    value: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  firebaseAppId: {
    value: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  firebaseAdminDatabaseUrl: {
    value: process.env.FIREBASE_ADMIN_DATABASE_URL,
    required: true,
    availableInBrowser: false,
    default: null,
  },
  clientAppBaseUrl: {
    value: process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL,
    required: true,
    availableInBrowser: true,
    default: "http://localhost:3000",
  },
  graphqlApiUrl: {
    value: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  hasuraAdminSecret: {
    value: process.env.HASURA_ADMIN_SECRET,
    required: true,
    availableInBrowser: false,
    default: null,
  },
  firebaseAdminPrivateKeyId: {
    value: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    required: true,
    availableInBrowser: false,
    default: null,
  },
  firebaseAdminPrivateKey: {
    value: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    required: true,
    availableInBrowser: false,
    default: null,
  },
  firebaseAdminClientEmail: {
    value: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    required: true,
    availableInBrowser: false,
    default: null,
  },
  firebaseAdminClientId: {
    value: process.env.FIREBASE_ADMIN_CLIENT_ID,
    required: true,
    availableInBrowser: false,
    default: null,
  },
  firebaseAdminX509CertUrl: {
    value: process.env.FIREBASE_ADMIN_X509_CERT_URL,
    required: true,
    availableInBrowser: false,
    default: null,
  },
};

for (const [key, { value, required, availableInBrowser }] of Object.entries(
  envVars
)) {
  /**
   * @TODO we decide which var is required, etc, and set defaults and validations
   */
  if (required && availableInBrowser && !value) {
    throw new Error(`No config value found for ${key}`);
  }
}

const configGet = (key: ConfigKey) => {
  const { value, default: defaultValue } = envVars[key] || {};

  if (value) {
    return value;
  }

  if (defaultValue) {
    return defaultValue;
  }

  throw new Error(`Tried to get config value for ${key}, but none was found`);
};

const config = {
  get: configGet,
};

export default config;
