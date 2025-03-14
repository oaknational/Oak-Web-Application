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
  sanityDatasetTag: {
    value: process.env.SANITY_DATASET_TAG,
    envName: "SANITY_DATASET_TAG",
    required: true,
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
    default: 60,
  },
  disableIsr: {
    value: process.env.DISABLE_ISR === "on",
    envName: "DISABLE_ISR",
    required: false,
    availableInBrowser: false,
    allowedValues: [true, false],
    default: null,
    description: "Disables incremental static regeneration (ISR).",
  },
  hubspotFormsAccessToken: {
    value: process.env.HUBSPOT_FORMS_ACCESS_TOKEN,
    envName: "HUBSPOT_FORMS_ACCESS_TOKEN",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  hubspotOwaAccessToken: {
    value: process.env.HUBSPOT_OWA_ACCESS_TOKEN,
    envName: "HUBSPOT_OWA_ACCESS_TOKEN",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  curriculumApiUrl: {
    value: process.env.CURRICULUM_API_URL,
    envName: "CURRICULUM_API_URL",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  curriculumApi2023Url: {
    value: process.env.CURRICULUM_API_2023_URL,
    envName: "CURRICULUM_API_2023_URL",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  curriculumApiAuthType: {
    value: process.env.CURRICULUM_API_AUTH_TYPE,
    envName: "CURRICULUM_API_AUTH_TYPE",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  curriculumApiAuthKey: {
    value: process.env.CURRICULUM_API_AUTH_KEY,
    envName: "CURRICULUM_API_AUTH_KEY",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  curriculumApi2023AuthKey: {
    value: process.env.CURRICULUM_API_2023_AUTH_KEY,
    envName: "CURRICULUM_API_2023_AUTH_KEY",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  personalisationApiUrl: {
    value: process.env.PERSONALISATION_API_URL,
    envName: "PERSONALISATION_API_URL",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  personalisationApiAuthKey: {
    value: process.env.PERSONALISATION_API_AUTH_KEY,
    envName: "PERSONALISATION_API_AUTH_KEY",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  personalisationApiAuthRole: {
    value: process.env.PERSONALISATION_API_AUTH_ROLE,
    envName: "PERSONALISATION_API_AUTH_ROLE",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  muxSigningKey: {
    value: process.env.MUX_SIGNING_KEY,
    envName: "MUX_SIGNING_KEY",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  muxSigningSecret: {
    value: process.env.MUX_SIGNING_SECRET,
    envName: "MUX_SIGNING_SECRET",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  muxSigningKey2020: {
    value: process.env.MUX_SIGNING_KEY_2020,
    envName: "MUX_SIGNING_KEY_2020",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  muxSigningSecret2020: {
    value: process.env.MUX_SIGNING_SECRET_2020,
    envName: "MUX_SIGNING_SECRET_2020",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  muxTokenId: {
    value: process.env.MUX_TOKEN_ID,
    envName: "MUX_TOKEN_ID",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  muxTokenSecret: {
    value: process.env.MUX_TOKEN_SECRET,
    envName: "MUX_TOKEN_SECRET",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  clerkPublishableKey: {
    description:
      "Note: this value must also be set in Netlify's environment vars since it is needed in middleware",
    value: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    envName: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    required: true,
    availableInBrowser: true,
    default: null,
  },
  clerkSecretKey: {
    description:
      "Note: this value must also be set in Netlify's environment vars since it is needed in middleware",
    value: process.env.CLERK_SECRET_KEY,
    envName: "CLERK_SECRET_KEY",
    required: true,
    availableInBrowser: false,
    default: null,
  },
  clerkSigningSecret: {
    value: process.env.CLERK_SIGNING_SECRET,
    envName: "CLERK_SIGNING_SECRET",
    required: true,
    availableInBrowser: false,
    default: null,
  },
});

for (const [, envVarConfig] of Object.entries(envVars)) {
  const {
    value: envValue,
    required,
    default: defaultValue,
    envName,
  } = envVarConfig;

  // These secrets shouldn't be making it to the browser, so existence
  // checks will fail.
  if (!isBrowser) {
    const shouldBePresent = required;
    const isPresent = Boolean(envValue || defaultValue);

    /**
     * @TODO we decide which var is required, etc, and set defaults and validations
     */
    if (shouldBePresent && !isPresent) {
      console.error(`- - - WARNING (getServerConfig): No config value found for required env var:
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
}

// We can safely assert it's non-nullable as our
// guard loop above will throw
type NonNullEnvValue<K extends ConfigKey> = NonNullable<
  (typeof envVars)[K]["value"]
>;

const getServerConfig = <K extends ConfigKey>(key: K): NonNullEnvValue<K> => {
  const {
    value,
    default: defaultValue,
    envName,
    required,
  } = envVars[key] || {};

  // Without parsing, undefined gets stringified as "undefined"
  const parsedValue = parseValue(value);

  // Allow falsy values to be passed, but not `undefined`, don't allow empty strings on required values.
  if (parsedValue !== undefined && !(required && parsedValue === "")) {
    return parsedValue;
  }

  // Allow falsy values to be set, but not `undefined` or `null` (which indicates a deliberate lack of default)
  if (defaultValue !== undefined && defaultValue !== null) {
    return defaultValue;
  }

  if (!isBrowser) {
    throw new Error(
      `getServerConfig('${key}') failed because there is no env value ${envName}`,
    );
  }
  return "";
};

export default getServerConfig;
