import isBrowser from "../utils/isBrowser";

type EnvValue = string | number;
// Config values can be the result of a logic test on an env value,
// e.g. `process.env.MY_ENV_SWITCH === "on"`
type ConfigValue = EnvValue | boolean;
type DefaultValue = string | number | boolean | null;

type EnvVar = {
  value: ConfigValue | undefined;
  required: boolean;
  availableInBrowser: boolean;
  default: DefaultValue;
  // useful for messaging in case if missing vars
  envName: string;
  description?: string;
  allowedValues?: EnvValue[] | boolean[];
};

const parseValue = <T extends ConfigValue>(value: T | undefined) => {
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
  clientAppBaseUrl: {
    value: process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL,
    envName: "NEXT_PUBLIC_CLIENT_APP_BASE_URL",
    required: true,
    availableInBrowser: true,
    default: "http://localhost:3000",
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
  vercelApiUrl: {
    value: process.env.NEXT_PUBLIC_VERCEL_API_URL,
    envName: "NEXT_PUBLIC_VERCEL_API_URL",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  downloadApiUrl: {
    value: process.env.NEXT_PUBLIC_DOWNLOAD_API_URL,
    envName: "NEXT_PUBLIC_DOWNLOAD_API_URL",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  seoAppName: {
    value: process.env.NEXT_PUBLIC_SEO_APP_NAME,
    envName: "NEXT_PUBLIC_SEO_APP_NAME",
    required: false,
    availableInBrowser: true,
    default: null,
  },
  seoAppDescription: {
    value: process.env.NEXT_PUBLIC_SEO_APP_DESCRIPTION,
    envName: "NEXT_PUBLIC_SEO_APP_DESCRIPTION",
    required: false,
    availableInBrowser: true,
    default: null,
  },
  seoAppLocale: {
    value: process.env.NEXT_PUBLIC_SEO_APP_LOCALE,
    envName: "NEXT_PUBLIC_SEO_APP_LOCALE",
    required: false,
    availableInBrowser: true,
    default: null,
  },
  seoAppUrl: {
    value: process.env.NEXT_PUBLIC_SEO_APP_URL,
    envName: "NEXT_PUBLIC_SEO_APP_URL",
    required: false,
    availableInBrowser: true,
    default: null,
  },
  seoAppLogo: {
    value: process.env.NEXT_PUBLIC_SEO_APP_LOGO,
    envName: "NEXT_PUBLIC_SEO_APP_LOGO",
    required: false,
    availableInBrowser: true,
    default: null,
  },
  seoAppFacebook: {
    value: process.env.NEXT_PUBLIC_SEO_APP_FACEBOOK,
    envName: "NEXT_PUBLIC_SEO_APP_FACEBOOK",
    required: false,
    availableInBrowser: true,
    default: null,
  },
  seoAppTwitter: {
    value: process.env.NEXT_PUBLIC_SEO_APP_TWITTER,
    envName: "NEXT_PUBLIC_SEO_APP_TWITTER",
    required: false,
    availableInBrowser: true,
    default: null,
  },
  seoAppTwitterHandle: {
    value: process.env.NEXT_PUBLIC_SEO_APP_TWITTER_HANDLE,
    envName: "NEXT_PUBLIC_SEO_APP_TWITTER_HANDLE",
    required: false,
    availableInBrowser: true,
    default: null,
  },
  searchApiUrl2023: {
    value: `${process.env.NEXT_PUBLIC_SEARCH_API_URL_2023}/v2`,
    envName: "NEXT_PUBLIC_SEARCH_API_URL_2023",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  hubspotFormSubmissionUrl: {
    value: process.env.NEXT_PUBLIC_HUBSPOT_FORM_SUBMISSION_URL,
    envName: "NEXT_PUBLIC_HUBSPOT_FORM_SUBMISSION_URL",
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
    // Hubspot form name dev: Main Email Signup
    value: process.env.NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID,
    envName: "NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  hubspotDownloadsFormId: {
    // Hubspot form name dev: OWA teacher resource download/share
    value: process.env.NEXT_PUBLIC_HUBSPOT_DOWNLOADS_FORM_ID,
    envName: "NEXT_PUBLIC_HUBSPOT_DOWNLOADS_FORM_ID",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  hubspotOnboardingFormId: {
    // Hubspot form name dev: Oak Account Creation Form
    value: process.env.NEXT_PUBLIC_HUBSPOT_ONBOARDING_FORM_ID,
    envName: "NEXT_PUBLIC_HUBSPOT_ONBOARDING_FORM_ID",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  hubspotFallbackFormId: {
    // Hubspot form name dev: Teacher Hub - Email Signup Modal (FAILSAFE version)
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
    value: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    envName: "NEXT_PUBLIC_SANITY_PROJECT_ID",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  sanityDataset: {
    value: process.env.NEXT_PUBLIC_SANITY_DATASET,
    envName: "NEXT_PUBLIC_SANITY_DATASET",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  sanityRevalidateSeconds: {
    value: process.env.SANITY_REVALIDATE_SECONDS
      ? parseInt(process.env.SANITY_REVALIDATE_SECONDS, 10)
      : undefined,
    envName: "SANITY_REVALIDATE_SECONDS",
    required: true,
    availableInBrowser: true,
    default: 60,
  },
  sanityAssetCDNHost: {
    /**
     * Domain without 'https://', eg: "cdn.sanity.io"
     */
    value: process.env.NEXT_PUBLIC_SANITY_ASSET_CDN_HOST,
    envName: "NEXT_PUBLIC_SANITY_ASSET_CDN_HOST",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  pingdomUptimeId: {
    value: process.env.NEXT_PUBLIC_PINGDOM_UPTIME_ID,
    envName: "NEXT_PUBLIC_PINGDOM_UPTIME_ID",
    required: true,
    availableInBrowser: true,
    // The old ID, already configured for all sites in Pingdom.
    default:
      "d6-7d-b6-4b-74-15-da-2e-2c-3c-00-34-3b-5f-f5-44-03-0f-fc-9f-c9-ce-16-7c-97-42-16-ab-1a-2e-82-5d",
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
  gleapFrameUrl: {
    value: process.env.NEXT_PUBLIC_GLEAP_FRAME_URL,
    envName: "NEXT_PUBLIC_GLEAP_FRAME_URL",
    required: true,
    availableInBrowser: true,
    default: null,
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
  webinarSignUpUrl: {
    value: process.env.NEXT_PUBLIC_WEBINAR_SIGN_UP_URL,
    envName: "NEXT_PUBLIC_WEBINAR_SIGN_UP_URL",
    required: true,
    availableInBrowser: true,
    description: "Sign up link for upcoming webinars",
    default: null,
  },
  oakComponentsAssetsHost: {
    value: process.env.NEXT_PUBLIC_OAK_ASSETS_HOST,
    envName: "NEXT_PUBLIC_OAK_ASSETS_HOST",
    required: true,
    availableInBrowser: true,
    default: null,
    description: "Host for assets needed by the oak-components package",
  },
  oakComponentsAssetsPath: {
    value: process.env.NEXT_PUBLIC_OAK_ASSETS_PATH,
    envName: "NEXT_PUBLIC_OAK_ASSETS_PATH",
    required: true,
    availableInBrowser: true,
    default: null,
    description:
      "Remote path to assets served from `oakAssetsHost`. Required by the oak-components package",
  },
  cloudinaryCloudName: {
    value: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    envName: "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    required: true,
    availableInBrowser: true,
    default: null,
    description:
      "The secure Cloudinary instance serving user generated content",
  },
  cloudinarySecureDistribution: {
    value: process.env.NEXT_PUBLIC_CLOUDINARY_SECURE_DISTRIBUTION,
    envName: "NEXT_PUBLIC_CLOUDINARY_SECURE_DISTRIBUTION",
    required: true,
    availableInBrowser: true,
    default: null,
    description:
      "The private Cloudinary origin from which to serve user generated content",
  },
  oakConsentPoliciesUrl: {
    value: process.env.NEXT_PUBLIC_OAK_CONSENT_POLICIES_URL,
    envName: "NEXT_PUBLIC_OAK_CONSENT_POLICIES_URL",
    required: true,
    availableInBrowser: true,
    default: null,
    description: "URL from which to fetch consent policies",
  },
  oakConsentLogUrl: {
    value: process.env.NEXT_PUBLIC_OAK_CONSENT_LOG_URL,
    envName: "NEXT_PUBLIC_OAK_CONSENT_LOG_URL",
    required: true,
    availableInBrowser: true,
    default: null,
    description: "URL to log consent choices to",
  },
  oakUserLogUrl: {
    value: process.env.NEXT_PUBLIC_OAK_USER_LOG_URL,
    envName: "NEXT_PUBLIC_OAK_USER_LOG_URL",
    required: true,
    availableInBrowser: true,
    default: null,
    description: "URL to log the first user visit to",
  },
  oakGetLessonAttemptUrl: {
    value: process.env.NEXT_PUBLIC_GET_LESSON_ATTEMPT_URL,
    envName: "NEXT_PUBLIC_GET_LESSON_ATTEMPT_URL",
    required: true,
    availableInBrowser: true,
    default: null,
    description: "URL to get the lesson attempt",
  },
  oakLogLessonAttemptUrl: {
    value: process.env.NEXT_PUBLIC_LOG_LESSON_ATTEMPT_URL,
    envName: "NEXT_PUBLIC_LOG_LESSON_ATTEMPT_URL",
    required: true,
    availableInBrowser: true,
    default: null,
    description: "URL to log the lesson attempt",
  },
  oakGetTeacherNoteUrl: {
    value: process.env.NEXT_PUBLIC_GET_TEACHER_NOTE_URL,
    envName: "NEXT_PUBLIC_GET_TEACHER_NOTE_URL",
    required: true,
    availableInBrowser: true,
    default: null,
    description: "URL to get the teacher note",
  },
  oakAddTeacherNoteUrl: {
    value: process.env.NEXT_PUBLIC_ADD_TEACHER_NOTE_URL,
    envName: "NEXT_PUBLIC_ADD_TEACHER_NOTE_URL",
    required: true,
    availableInBrowser: true,
    default: null,
    description: "URL to add the teacher note",
  },
  developmentUserRegion: {
    value: process.env.DEVELOPMENT_USER_REGION,
    envName: "DEVELOPMENT_USER_REGION",
    required: false,
    availableInBrowser: false,
    default: null,
    description:
      "The region to use in authentication when running in development mode",
  },
  sentryOrganisationIdentifier: {
    value: process.env.NEXT_PUBLIC_SENTRY_ORGANISATION_IDENTIFIER,
    envName: "NEXT_PUBLIC_SENTRY_ORGANISATION_IDENTIFIER",
    required: true,
    availableInBrowser: true,
    default: null,
    description: "The slug identifying the organisation within Sentry",
  },
  sentryProjectIdentifier: {
    value: process.env.NEXT_PUBLIC_SENTRY_PROJECT_IDENTIFIER,
    envName: "NEXT_PUBLIC_SENTRY_PROJECT_IDENTIFIER",
    required: true,
    availableInBrowser: true,
    default: null,
    description: "The slug identifying the project within Sentry",
  },
  sentryDsn: {
    value: process.env.NEXT_PUBLIC_SENTRY_DSN,
    envName: "NEXT_PUBLIC_SENTRY_DSN",
    required: true,
    availableInBrowser: true,
    default: null,
    description: "The DSN for the Sentry project",
  },
  sentryEnabled: {
    value: process.env.NEXT_PUBLIC_SENTRY_ENABLED,
    envName: "NEXT_PUBLIC_SENTRY_ENABLED",
    required: true,
    availableInBrowser: true,
    default: "false",
    description: "Whether sentry is enabled or not",
  },
});

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
    console.error(`- - - WARNING (getBrowserConfig): No config value found for required env var:
- - - ${envName}`);
  }
  if ("allowedValues" in envVarConfig && envValue) {
    // Explicitly typing allowedValues are currently the only instance
    // is of string[], so it infers the type as being too narrow
    const { allowedValues }: { allowedValues: ConfigValue[] } = envVarConfig;

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
  (typeof envVars)[K]["value"]
>;

const getBrowserConfig = <K extends ConfigKey>(key: K): NonNullEnvValue<K> => {
  const {
    value,
    default: defaultValue,
    envName,
    required,
    availableInBrowser,
  } = envVars[key] || {};

  // Without parsing, undefined gets stringified as "undefined"
  const parsedValue = parseValue(value);

  const shouldBePresent = required && (isBrowser ? availableInBrowser : true);

  // Allow falsy values to be passed, but not `undefined`, don't allow empty strings for values that should be present.
  if (parsedValue !== undefined && !(shouldBePresent && parsedValue === "")) {
    return parsedValue;
  }

  // Allow falsy values to be set, but not `undefined` or `null` (which indicates a deliberate lack of default)
  if (defaultValue !== undefined && defaultValue !== null) {
    return defaultValue;
  }

  throw new Error(
    `getBrowserConfig('${key}') failed because there is no env value ${envName}`,
  );
};

export default getBrowserConfig;
