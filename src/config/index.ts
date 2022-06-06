import seoConfig from "../../next-seo.config";

const CONFIG_KEYS = [
  "firebaseConfigApiHost",
  "firebaseConfigTokenApiHost",
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
  "searchApiUrl",
] as const;

type ConfigKey = typeof CONFIG_KEYS[number];

type EnvVar = {
  value: string | undefined;
  required: boolean;
  availableInBrowser: boolean;
  default: string | null;
  // useful for messaging in case if missing vars
  envName: string;
  description?: string;
};

const parseValue = (value: string | undefined) => {
  if (value === "undefined") {
    return undefined;
  }

  return value;
};

const envVars: Record<ConfigKey, EnvVar> = {
  firebaseConfigApiHost: {
    value: process.env.NEXT_PUBLIC_FIREBASE_API_HOST,
    envName: "NEXT_PUBLIC_FIREBASE_API_HOST",
    required: true,
    availableInBrowser: true,
    default: "identitytoolkit.googleapis.com",
    description: "Used for proxying firebase auth, for zero-rating",
  },
  firebaseConfigTokenApiHost: {
    value: process.env.NEXT_PUBLIC_FIREBASE_TOKEN_API_HOST,
    envName: "NEXT_PUBLIC_FIREBASE_TOKEN_API_HOST",
    required: true,
    availableInBrowser: true,
    default: "securetoken.googleapis.com",
    description: "Used for proxying firebase auth, for zero-rating",
  },
  firebaseApiKey: {
    value: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    envName: "NEXT_PUBLIC_FIREBASE_API_KEY",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  firebaseAuthDomain: {
    value: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    envName: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  firebaseProjectId: {
    value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    envName: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  firebaseStorageBucket: {
    value: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    envName: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  firebaseMessagingSenderId: {
    value: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    envName: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  firebaseAppId: {
    value: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    envName: "NEXT_PUBLIC_FIREBASE_APP_ID",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  firebaseAdminDatabaseUrl: {
    value: process.env.FIREBASE_ADMIN_DATABASE_URL,
    envName: "FIREBASE_ADMIN_DATABASE_URL",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  clientAppBaseUrl: {
    value: process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL,
    envName: "NEXT_PUBLIC_CLIENT_APP_BASE_URL",
    required: true,
    availableInBrowser: true,
    default: "http://localhost:3000",
  },
  graphqlApiUrl: {
    value: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
    envName: "NEXT_PUBLIC_GRAPHQL_API_URL",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  hasuraAdminSecret: {
    value: process.env.HASURA_ADMIN_SECRET,
    envName: "HASURA_ADMIN_SECRET",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  firebaseServiceAccount: {
    value: process.env.FIREBASE_SERVICE_ACCOUNT,
    envName: "FIREBASE_SERVICE_ACCOUNT",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  releaseStage: {
    value: process.env.NEXT_PUBLIC_RELEASE_STAGE,
    envName: "NEXT_PUBLIC_RELEASE_STAGE",
    required: true,
    availableInBrowser: true,
    default: "development",
  },
  appVersion: {
    value: process.env.NEXT_PUBLIC_APP_VERSION,
    envName: "NEXT_PUBLIC_APP_VERSION",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  bugsnagApiKey: {
    value: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY,
    envName: "NEXT_PUBLIC_BUGSNAG_API_KEY",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appName: {
    value: seoConfig.NEXT_PUBLIC_APP_NAME,
    envName: "NEXT_PUBLIC_APP_NAME",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appDescription: {
    value: seoConfig.NEXT_PUBLIC_APP_DESCRIPTION,
    envName: "NEXT_PUBLIC_APP_DESCRIPTION",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appLocale: {
    value: seoConfig.NEXT_PUBLIC_APP_LOCALE,
    envName: "NEXT_PUBLIC_APP_LOCALE",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appUrl: {
    value: seoConfig.NEXT_PUBLIC_APP_URL,
    envName: "NEXT_PUBLIC_APP_URL",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appLogo: {
    value: seoConfig.NEXT_PUBLIC_APP_LOGO,
    envName: "NEXT_PUBLIC_APP_LOGO",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appSocialSharingImg: {
    value: seoConfig.NEXT_PUBLIC_APP_SOCIAL_SHARING_IMG,
    envName: "NEXT_PUBLIC_APP_SOCIAL_SHARING_IMG",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appFacebook: {
    value: seoConfig.NEXT_PUBLIC_APP_FACEBOOK,
    envName: "NEXT_PUBLIC_APP_FACEBOOK",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appTwitter: {
    value: seoConfig.NEXT_PUBLIC_APP_TWITTER,
    envName: "NEXT_PUBLIC_APP_TWITTER",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  appTwitterHandle: {
    value: seoConfig.NEXT_PUBLIC_APP_TWITTER_HANDLE,
    envName: "NEXT_PUBLIC_APP_TWITTER_HANDLE",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  searchApiUrl: {
    value: process.env.NEXT_PUBLIC_SEARCH_API_URL,
    envName: "NEXT_PUBLIC_SEARCH_API_URL",
    required: true,
    availableInBrowser: true,
    default: null,
  },
};

for (const [
  ,
  {
    value: envValue,
    required,
    availableInBrowser,
    default: defaultValue,
    envName,
  },
] of Object.entries(envVars)) {
  const isBrowser = typeof window !== "undefined";
  const shouldBePresent = required && (isBrowser ? availableInBrowser : true);
  const isPresent = Boolean(envValue || defaultValue);

  /**
   * @TODO we decide which var is required, etc, and set defaults and validations
   */
  if (shouldBePresent && !isPresent) {
    console.error(`- - - WARNING no config value found for required env var:
- - - ${envName}`);
  }
}

const configGet = (key: ConfigKey) => {
  const { value, default: defaultValue, envName } = envVars[key] || {};

  // Without parsing, undefined gets stringified as "undefined"
  const parsedValue = parseValue(value);

  if (parsedValue) {
    return parsedValue;
  }

  if (defaultValue) {
    return defaultValue;
  }

  throw new Error(
    `configGet('${key}') failed because there is no env value ${envName}`
  );
};

const config = {
  get: configGet,
};

export default config;
