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
  "firebaseServiceAccount",
  "releaseStage",
  "appVersion",
  "bugsnagApiKey",
  "appName",
  "appDescription",
  "appLocale",
  "appUrl",
  "appLogo",
  "appSocialSharingImg",
  "appFacebook",
  "appTwitter",
  "appTwitterHandle",
] as const;

type ConfigKey = typeof CONFIG_KEYS[number];

type EnvVar = {
  value: string | undefined;
  required: boolean;
  availableInBrowser: boolean;
  default: string | null;
};

const parseValue = (value: string | undefined) => {
  if (value === "undefined") {
    return undefined;
  }

  return value;
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
  firebaseServiceAccount: {
    value: process.env.FIREBASE_SERVICE_ACCOUNT,
    required: true,
    availableInBrowser: false,
    default: null,
  },
  releaseStage: {
    value: process.env.NEXT_PUBLIC_RELEASE_STAGE,
    required: true,
    availableInBrowser: true,
    default: "development",
  },
  appVersion: {
    value: process.env.NEXT_PUBLIC_APP_VERSION,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  bugsnagApiKey: {
    value: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appName: {
    value: process.env.NEXT_PUBLIC_APP_NAME,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appDescription: {
    value: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appLocale: {
    value: process.env.NEXT_PUBLIC_APP_LOCALE,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appUrl: {
    value: process.env.NEXT_PUBLIC_APP_URL,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appLogo: {
    value: process.env.NEXT_PUBLIC_APP_LOGO,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appSocialSharingImg: {
    value: process.env.NEXT_PUBLIC_APP_SOCIAL_SHARING_IMG,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appFacebook: {
    value: process.env.NEXT_PUBLIC_APP_FACEBOOK,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appTwitter: {
    value: process.env.NEXT_PUBLIC_APP_TWITTER,
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appTwitterHandle: {
    value: process.env.NEXT_PUBLIC_APP_TWITTER_HANDLE,
    required: true,
    availableInBrowser: true,
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

  // Without parsing, undefined gets stringified as "undefined"
  const parsedValue = parseValue(value);

  if (parsedValue) {
    return parsedValue;
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
