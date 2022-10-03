import seoConfig from "../../next-seo.config";
import isBrowser from "../utils/isBrowser";

type EnvValue = string | number;

type EnvVar = {
  value: EnvValue | undefined;
  required: boolean;
  availableInBrowser: boolean;
  default: string | null;
  // useful for messaging in case if missing vars
  envName: string;
  description?: string;
  allowedValues?: EnvValue[];
};

const parseValue = <T extends EnvValue>(value: T | undefined) => {
  if (value === "undefined") {
    return undefined;
  }

  return value;
};

/**
 * Ensure the object u passed satisfies T, but
 * return the inferred type of U.
 *
 * Provides an alternative to envVars: Record<string, EnvVar> = {...}
 * which would make the return type too loose (the record), and break
 * the keyof check for ConfigKey
 */
const satisfies =
  <T>() =>
  <U extends T>(u: U) =>
    u;

type ConfigKey = keyof typeof envVars;

const envVars = satisfies<Record<string, EnvVar>>()({
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
  hubspotPortalId: {
    value: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID,
    envName: "NEXT_PUBLIC_HUBSPOT_PORTAL_ID",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  hubspotNewsletterFormId: {
    value: process.env.NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID,
    envName: "NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  hubspotFallbackFormId: {
    value: process.env.NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID,
    envName: "NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  hubspotScriptDomain: {
    value: process.env.NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN,
    envName: "NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  posthogApiKey: {
    value: process.env.NEXT_PUBLIC_POSTHOG_API_KEY,
    envName: "NEXT_PUBLIC_POSTHOG_API_KEY",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  posthogApiHost: {
    value: process.env.NEXT_PUBLIC_POSTHOG_API_HOST,
    envName: "NEXT_PUBLIC_POSTHOG_API_HOST",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  sanityProjectId: {
    value: process.env.SANITY_PROJECT_ID,
    envName: "SANITY_PROJECT_ID",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  sanityDataset: {
    value: process.env.SANITY_DATASET,
    envName: "SANITY_DATASET",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  sanityDatasetTag: {
    value: process.env.SANITY_DATASET_TAG,
    envName: "SANITY_DATASET_TAG",
    required: false,
    availableInBrowser: false,
    default: "default", // Literally 'default', not a typo
  },
  sanityUseCDN: {
    value: process.env.SANITY_USE_CDN,
    envName: "SANITY_USE_CDN",
    required: false,
    availableInBrowser: false,
    default: "true",
  },
  sanityGraphqlApiSecret: {
    value: process.env.SANITY_AUTH_SECRET,
    envName: "SANITY_AUTH_SECRET",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  sanityPreviewSecret: {
    value: process.env.SANITY_PREVIEW_SECRET,
    envName: "SANITY_PREVIEW_SECRET",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  sanityRevalidateSeconds: {
    value: process.env.SANITY_REVALIDATE_SECONDS
      ? parseInt(process.env.SANITY_REVALIDATE_SECONDS, 10)
      : undefined,
    envName: "SANITY_REVALIDATE_SECONDS",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  sanityAssetCDNHost: {
    /**
     * Domain without 'https://', eg: "cdn.sanity.io"
     */
    value: process.env.SANITY_ASSET_CDN_HOST,
    envName: "SANITY_API_HOST",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  gleapApiKey: {
    value: process.env.NEXT_PUBLIC_GLEAP_API_KEY,
    envName: "NEXT_PUBLIC_GLEAP_API_KEY",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  gleapApiUrl: {
    value: process.env.NEXT_PUBLIC_GLEAP_API_URL,
    envName: "NEXT_PUBLIC_GLEAP_API_URL",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  gleapWidgetUrl: {
    value: process.env.NEXT_PUBLIC_GLEAP_WIDGET_URL,
    envName: "NEXT_PUBLIC_GLEAP_WIDGET_URL",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  pingdomUptimeId: {
    value: process.env.PINGDOM_UPTIME_ID,
    envName: "PINGDOM_UPTIME_ID",
    required: true,
    availableInBrowser: false,
    // The old ID, already configured for all sites in Pingdom.
    default:
      "d6-7d-b6-4b-74-15-da-2e-2c-3c-00-34-3b-5f-f5-44-03-0f-fc-9f-c9-ce-16-7c-97-42-16-ab-1a-2e-82-5d",
  },
  axeA11yLogging: {
    value: process.env.NEXT_PUBLIC_AXE_A11Y_LOGGING,
    envName: "NEXT_PUBLIC_AXE_A11Y_LOGGING",
    required: false,
    availableInBrowser: true,
    allowedValues: ["on", "off"],
    default: "off",
    description:
      "Logs accessibility concerns to the console. Should be disabled in production",
  },
});

console.log("envVars.sanityRevalidateSeconds", envVars.sanityRevalidateSeconds);

for (const [, envVarConfig] of Object.entries(envVars)) {
  const {
    value: envValue,
    required,
    availableInBrowser,
    default: defaultValue,
    envName,
  } = envVarConfig;

  const shouldBePresent = required && (isBrowser ? availableInBrowser : true);
  const isPresent = Boolean(envValue || defaultValue);

  /**
   * @TODO we decide which var is required, etc, and set defaults and validations
   */
  if (shouldBePresent && !isPresent) {
    console.error(`- - - WARNING no config value found for required env var:
- - - ${envName}`);
  }
  if ("allowedValues" in envVarConfig && envValue) {
    // Explicitly typing allowedValues are currently the only instance
    // is of string[], so it infers the type as being too narrow
    const { allowedValues }: { allowedValues: EnvValue[] } = envVarConfig;

    if (!allowedValues.includes(envValue)) {
      throw new Error(`- - - ERROR invalid value found for env var:
- - - ${envName}
- - - Found value: ${envValue}
- - - Allowed values: ${allowedValues.join(", ")}`);
    }
  }
}

// We can safely assert it's non-nullable as our
// guard loop above will throw
type NonNullEnvValue<K extends ConfigKey> = NonNullable<
  typeof envVars[K]["value"]
>;

const configGet = <K extends ConfigKey>(key: K): NonNullEnvValue<K> => {
  const { value, default: defaultValue, envName } = envVars[key] || {};

  // Without parsing, undefined gets stringified as "undefined"
  const parsedValue = parseValue(value);

  console.log("configGet parsedValue", key, parsedValue);

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
