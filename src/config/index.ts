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
] as const;

type ConfigKey = typeof CONFIG_KEYS[number];

const parseValue = (value: string | undefined) => {
  if (value === "undefined") {
    return undefined;
  }

  return value;
};

type ConfigValueArgs = {
  env: string;
  value: string | undefined;
  required?: boolean;
  availableInBrowser?: boolean;
  defaultValue?: string;
  nextDynamicValue?: boolean;
};

// Use a class so we can define default values.
class ConfigValue {
  env: string;
  required: boolean;
  availableInBrowser: boolean;
  default: string | undefined;
  nextDynamicValue: boolean;

  // Private-ish member field.
  _value: string | undefined;

  // Public getter.
  /**
   * Env value if present, else default value, else undefined.
   */
  get value() {
    const envValue = this._value;
    if (envValue && envValue.length > 0 && envValue !== "undefined") {
      return envValue;
    } else {
      return this.default;
    }
  }

  constructor({
    env,
    value,
    defaultValue,
    required = true,
    availableInBrowser = false,
    // Values constructed in next.config.js aren't available when this file is first read.
    nextDynamicValue = false,
  }: ConfigValueArgs) {
    this.env = env;
    // Infuriatingly, we can't access these dynamically because of Next.js magic string replacement.
    this._value = value;

    this.required = required;
    this.availableInBrowser = availableInBrowser;
    this.default = defaultValue;
    this.nextDynamicValue = nextDynamicValue;
  }
}

const envVars: Record<ConfigKey, ConfigValue> = {
  // Next.config.js dynamic values.
  releaseStage: new ConfigValue({
    // Need to repeat the accessor name because Next.js requires an explicit rather than dynamic access.
    // https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables
    env: "NEXT_PUBLIC_RELEASE_STAGE",
    value: process.env.NEXT_PUBLIC_RELEASE_STAGE,
    availableInBrowser: true,
    nextDynamicValue: true,
  }),
  appVersion: new ConfigValue({
    env: "NEXT_PUBLIC_APP_VERSION",
    value: process.env.NEXT_PUBLIC_APP_VERSION,
    availableInBrowser: true,
    nextDynamicValue: true,
  }),
  clientAppBaseUrl: new ConfigValue({
    env: "NEXT_PUBLIC_CLIENT_APP_BASE_URL",
    value: process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL,
    availableInBrowser: true,
    defaultValue: "http://localhost:3000",
    nextDynamicValue: true,
  }),
  // Everything else.
  firebaseApiKey: new ConfigValue({
    env: "NEXT_PUBLIC_FIREBASE_API_KEY",
    value: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    availableInBrowser: true,
  }),
  firebaseAuthDomain: new ConfigValue({
    env: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    value: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    availableInBrowser: true,
  }),
  firebaseProjectId: new ConfigValue({
    env: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    availableInBrowser: true,
  }),
  firebaseStorageBucket: new ConfigValue({
    env: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    value: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    availableInBrowser: true,
  }),
  firebaseMessagingSenderId: new ConfigValue({
    env: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    value: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    availableInBrowser: true,
  }),
  firebaseAppId: new ConfigValue({
    env: "NEXT_PUBLIC_FIREBASE_APP_ID",
    value: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    availableInBrowser: true,
  }),
  firebaseAdminDatabaseUrl: new ConfigValue({
    env: "FIREBASE_ADMIN_DATABASE_URL",
    value: process.env.FIREBASE_ADMIN_DATABASE_URL,
  }),
  graphqlApiUrl: new ConfigValue({
    env: "NEXT_PUBLIC_GRAPHQL_API_URL",
    value: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
    availableInBrowser: true,
  }),
  hasuraAdminSecret: new ConfigValue({
    env: "HASURA_ADMIN_SECRET",
    value: process.env.HASURA_ADMIN_SECRET,
  }),
  firebaseServiceAccount: new ConfigValue({
    env: "FIREBASE_SERVICE_ACCOUNT",
    value: process.env.FIREBASE_SERVICE_ACCOUNT,
  }),
  bugsnagApiKey: new ConfigValue({
    env: "NEXT_PUBLIC_BUGSNAG_API_KEY",
    value: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY,
    availableInBrowser: true,
  }),
};

const missingValues = [];
for (const [
  key,
  { env, value, required, nextDynamicValue, availableInBrowser },
] of Object.entries(envVars)) {
  /**
   * @TODO we decide which var is required, etc, and set defaults and validations
   */
  /**
   * @TODO separate into server-side and client-side checks.
   */
  if (required && !nextDynamicValue && availableInBrowser && !value) {
    missingValues.push({ key, env });
  }
}
if (missingValues.length > 0) {
  throw new Error(
    `The following config values are missing:\n${JSON.stringify(
      missingValues,
      null,
      2
    )}`
  );
}

const configGet = (key: ConfigKey) => {
  const configVar = envVars[key] || {};

  // Without parsing, undefined gets stringified as "undefined"
  const parsedValue = parseValue(configVar.value);

  if (parsedValue) {
    return parsedValue;
  }

  throw new Error(
    `Tried to get config value for ${key} (${
      configVar.env
    }), but none was found. Got:\n${JSON.stringify(configVar, null, 2)}`
  );
};

const config = {
  get: configGet,
};

export default config;
