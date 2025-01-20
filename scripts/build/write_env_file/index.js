/**
 * This script reads out config and secrets and saves them to
 * a `.env.${env}.local` file with the appropriate NEXT_PUBLIC_* prefixes
 *
 * This step lives outside of the nextjs build process, as for non-public
 * env vars to be stripped from the client side bundle they need to be
 * appropriately prefixed before the build process starts
 */

require("dotenv").config();
const { writeFileSync } = require("node:fs");

const {
  getAppVersion,
  getReleaseStage,
  RELEASE_STAGE_PRODUCTION,
  RELEASE_STAGE_TESTING,
} = require("../build_config_helpers");
const fetchConfig = require("../fetch_config");
const fetchSecrets = require("../fetch_secrets");

async function main() {
  console.log("Writing config and secrets to temporary env file");

  const NODE_ENV = process.env.NODE_ENV || "development";

  /** @type {import('../fetch_config/config_types').OakConfig} */
  let oakConfig;

  let releaseStage;
  let appVersion;
  let isProductionBuild = false;

  // If we are in a test phase (or have explicitly declared a this is a test)
  // then use the fake test config values.
  if (NODE_ENV === "test") {
    oakConfig = await fetchConfig("oak-config/oak.config.test.json");

    releaseStage = RELEASE_STAGE_TESTING;
    appVersion = RELEASE_STAGE_TESTING;
  } else {
    const configLocation = process.env.OAK_CONFIG_LOCATION;
    oakConfig = await fetchConfig(configLocation);

    // DEBUG
    // console.log("Next Oak Config", oakConfig);

    // Figure out the release stage and app version.
    // With this set up, "production" builds can only happen on Vercel because they
    // depend on a Vercel specific env variable.
    // When we come to sort out a failover we may need to tweak this functionality.
    // Defaults to "development".
    releaseStage = getReleaseStage(
      process.env.OVERRIDE_RELEASE_STAGE ||
        process.env.VERCEL_ENV ||
        // Netlify
        process.env.CONTEXT,
    );
    isProductionBuild = releaseStage === RELEASE_STAGE_PRODUCTION;
    appVersion = getAppVersion(isProductionBuild);
    console.log(`Found app version: "${appVersion}"`);
  }

  const secretsFromNetwork = process.env.USE_ONLY_LOCAL_SECRETS
    ? {}
    : await fetchSecrets(oakConfig);

  const NEXT_PUBLIC_SANITY_ASSET_CDN_HOST =
    process.env.NEXT_PUBLIC_SANITY_ASSET_CDN_HOST ||
    oakConfig.sanity.assetCDNHost;

  const env = {
    // Values calculated in this file.
    NEXT_PUBLIC_APP_VERSION: appVersion,
    NEXT_PUBLIC_RELEASE_STAGE: releaseStage,

    // Values read from the config file.

    // Bugsnag
    NEXT_PUBLIC_BUGSNAG_API_KEY: oakConfig.bugsnag.apiKey,

    // Gleap
    NEXT_PUBLIC_GLEAP_API_KEY:
      process.env.NEXT_PUBLIC_GLEAP_API_KEY || oakConfig.gleap.apiKey,
    NEXT_PUBLIC_GLEAP_API_URL:
      process.env.NEXT_PUBLIC_GLEAP_API_URL || oakConfig.gleap.apiUrl,
    NEXT_PUBLIC_GLEAP_FRAME_URL:
      process.env.NEXT_PUBLIC_GLEAP_FRAME_URL || oakConfig.gleap.frameUrl13,

    // Hubspot
    NEXT_PUBLIC_HUBSPOT_FORM_SUBMISSION_URL:
      oakConfig.hubspot.formSubmissionUrl,
    NEXT_PUBLIC_HUBSPOT_PORTAL_ID: oakConfig.hubspot.portalId,
    NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID: oakConfig.hubspot.newsletterFormId,
    NEXT_PUBLIC_HUBSPOT_DOWNLOADS_FORM_ID: oakConfig.hubspot.downloadsFormId,
    NEXT_PUBLIC_HUBSPOT_ONBOARDING_FORM_ID: oakConfig.hubspot.onboardingFormId,
    NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID: oakConfig.hubspot.fallbackFormId,
    NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN:
      process.env.NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN ||
      oakConfig.hubspot.scriptDomain,
    HUBSPOT_FORMS_ACCESS_TOKEN:
      process.env.HUBSPOT_FORMS_ACCESS_TOKEN ||
      secretsFromNetwork.HUBSPOT_FORMS_ACCESS_TOKEN,
    HUBSPOT_OWA_ACCESS_TOKEN:
      process.env.HUBSPOT_OWA_ACCESS_TOKEN ||
      secretsFromNetwork.HUBSPOT_OWA_ACCESS_TOKEN,

    // Oak
    // App hosting URL, needed for accurate sitemaps (and canonical URLs in the metadata?).
    NEXT_PUBLIC_CLIENT_APP_BASE_URL:
      // Fixed URL defined in the Cloudbuild trigger UI.
      process.env.CLOUDBUILD_DEPLOYMENT_BASE_URL ||
      // Note this is the default Vercel URL (something.vercel.app), not the alternative preview or production one.
      // The preview ones on a thenational.academy domain we could construct, if we wanted to use Vercel for
      // production we'd need to set an env, same as for Cloudbuild.
      process.env.VERCEL_URL ||
      // Netlify https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata
      // Should default to custom domain if one is set.
      process.env.URL ||
      // Default to value in config, currently localhost:3000
      oakConfig.oak.appBaseUrl,
    NEXT_PUBLIC_SEARCH_API_URL: oakConfig.oak.searchApiUrl,
    NEXT_PUBLIC_SEARCH_API_URL_2023:
      process.env.NEXT_PUBLIC_SEARCH_API_URL_2023 ||
      oakConfig.oak.searchApiUrl2023,
    NEXT_PUBLIC_WEBINAR_SIGN_UP_URL: oakConfig.oak.webinarSignUpUrl,
    // Curriculum data
    CURRICULUM_API_URL:
      process.env.CURRICULUM_API_URL || oakConfig.oak.curriculumApiUrl,
    CURRICULUM_API_2023_URL:
      process.env.CURRICULUM_API_2023_URL || oakConfig.oak.curriculumApi2023Url,
    CURRICULUM_API_AUTH_TYPE:
      process.env.CURRICULUM_API_AUTH_TYPE ||
      oakConfig.oak.curriculumApiAuthType,
    CURRICULUM_API_AUTH_KEY:
      process.env.CURRICULUM_API_AUTH_KEY ||
      secretsFromNetwork.CURRICULUM_API_AUTH_KEY,
    CURRICULUM_API_2023_AUTH_KEY:
      process.env.CURRICULUM_API_2023_AUTH_KEY ||
      secretsFromNetwork.CURRICULUM_API_2023_AUTH_KEY,
    NEXT_PUBLIC_VERCEL_API_URL:
      process.env.NEXT_PUBLIC_VERCEL_API_URL || oakConfig.oak.vercelApiUrl,
    NEXT_PUBLIC_DOWNLOAD_API_URL:
      process.env.NEXT_PUBLIC_DOWNLOAD_API_URL || oakConfig.oak.downloadApiUrl,

    // Mux
    MUX_SIGNING_KEY:
      process.env.MUX_SIGNING_KEY || secretsFromNetwork.MUX_SIGNING_KEY,
    MUX_SIGNING_SECRET:
      process.env.MUX_SIGNING_SECRET || secretsFromNetwork.MUX_SIGNING_SECRET,
    MUX_SIGNING_KEY_2020:
      process.env.MUX_SIGNING_KEY_2020 ||
      secretsFromNetwork.MUX_SIGNING_KEY_2020,
    MUX_SIGNING_SECRET_2020:
      process.env.MUX_SIGNING_SECRET_2020 ||
      secretsFromNetwork.MUX_SIGNING_SECRET_2020,
    MUX_TOKEN_ID: process.env.MUX_TOKEN_ID || secretsFromNetwork.MUX_TOKEN_ID,
    MUX_TOKEN_SECRET:
      process.env.MUX_TOKEN_SECRET || secretsFromNetwork.MUX_TOKEN_SECRET,

    // Posthog
    NEXT_PUBLIC_POSTHOG_API_HOST:
      process.env.NEXT_PUBLIC_POSTHOG_API_HOST || oakConfig.posthog?.apiHost,
    NEXT_PUBLIC_POSTHOG_API_KEY:
      process.env.NEXT_PUBLIC_POSTHOG_API_KEY || oakConfig.posthog?.apiKey,

    // Sanity
    SANITY_REVALIDATE_SECONDS:
      process.env.SANITY_REVALIDATE_SECONDS ||
      oakConfig.sanity?.revalidateSeconds,
    NEXT_PUBLIC_SANITY_PROJECT_ID:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || oakConfig.sanity?.projectId,
    NEXT_PUBLIC_SANITY_DATASET:
      process.env.NEXT_PUBLIC_SANITY_DATASET || oakConfig.sanity?.dataset,
    SANITY_DATASET_TAG:
      process.env.SANITY_DATASET_TAG || oakConfig.sanity?.datasetTag,
    SANITY_USE_CDN: process.env.SANITY_USE_CDN || oakConfig.sanity?.useCDN,
    SANITY_AUTH_SECRET:
      process.env.SANITY_AUTH_SECRET || secretsFromNetwork.SANITY_AUTH_SECRET,
    SANITY_PREVIEW_SECRET:
      process.env.SANITY_PREVIEW_SECRET ||
      secretsFromNetwork.SANITY_PREVIEW_SECRET,
    NEXT_PUBLIC_SANITY_ASSET_CDN_HOST:
      NEXT_PUBLIC_SANITY_ASSET_CDN_HOST || oakConfig.sanity.assetCDNHost,
    // Disable ISR per environment, "on" sets the config to `true` all other values including undefined result in `false`.
    DISABLE_ISR: process.env.DISABLE_ISR,

    // Seo

    NEXT_PUBLIC_SEO_APP_NAME:
      process.env.NEXT_PUBLIC_SEO_APP_NAME || oakConfig.seo?.appName,
    NEXT_PUBLIC_SEO_APP_DESCRIPTION:
      process.env.NEXT_PUBLIC_SEO_APP_DESCRIPTION ||
      oakConfig.seo?.appDescription,
    NEXT_PUBLIC_SEO_APP_LOCALE:
      process.env.NEXT_PUBLIC_SEO_APP_LOCALE || oakConfig.seo?.appLocale,
    NEXT_PUBLIC_SEO_APP_URL:
      process.env.NEXT_PUBLIC_SEO_APP_URL || oakConfig.seo?.appUrl,
    NEXT_PUBLIC_SEO_APP_LOGO:
      process.env.NEXT_PUBLIC_SEO_APP_LOGO || oakConfig.seo?.appLogo,
    NEXT_PUBLIC_SEO_APP_FACEBOOK:
      process.env.NEXT_PUBLIC_SEO_APP_FACEBOOK || oakConfig.seo?.appFacebook,
    NEXT_PUBLIC_SEO_APP_TWITTER:
      process.env.NEXT_PUBLIC_SEO_APP_TWITTER || oakConfig.seo?.appTwitter,
    NEXT_PUBLIC_SEO_APP_TWITTER_HANDLE:
      process.env.NEXT_PUBLIC_SEO_APP_TWITTER_HANDLE ||
      oakConfig.seo?.appTwitterHandle,

    // oak-components
    NEXT_PUBLIC_OAK_ASSETS_HOST:
      process.env.NEXT_PUBLIC_OAK_ASSETS_HOST ||
      oakConfig.oakComponents?.assetsHost,
    NEXT_PUBLIC_OAK_ASSETS_PATH:
      process.env.NEXT_PUBLIC_OAK_ASSETS_PATH ||
      oakConfig.oakComponents?.assetsPath,

    // Cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      oakConfig.cloudinary?.cloudName,
    NEXT_PUBLIC_CLOUDINARY_SECURE_DISTRIBUTION:
      process.env.NEXT_PUBLIC_CLOUDINARY_SECURE_DISTRIBUTION ||
      oakConfig.cloudinary?.secureDistribution,

    // oak-consent
    NEXT_PUBLIC_OAK_CONSENT_POLICIES_URL:
      process.env.NEXT_PUBLIC_OAK_CONSENT_POLICIES_URL ||
      oakConfig.oakConsent?.policiesUrl,
    NEXT_PUBLIC_OAK_CONSENT_LOG_URL:
      process.env.NEXT_PUBLIC_OAK_CONSENT_LOG_URL ||
      oakConfig.oakConsent?.consentLogUrl,
    NEXT_PUBLIC_OAK_USER_LOG_URL:
      process.env.NEXT_PUBLIC_OAK_USER_LOG_URL ||
      oakConfig.oakConsent?.userLogUrl,

    // oak-pupil-client
    NEXT_PUBLIC_LOG_LESSON_ATTEMPT_URL:
      process.env.NEXT_PUBLIC_LOG_LESSON_ATTEMPT_URL ||
      oakConfig.oakPupilClient?.logLessonAttemptUrl,
    NEXT_PUBLIC_GET_LESSON_ATTEMPT_URL:
      process.env.NEXT_PUBLIC_GET_LESSON_ATTEMPT_URL ||
      oakConfig.oakPupilClient?.getLessonAttemptUrl,
    NEXT_PUBLIC_ADD_TEACHER_NOTE_URL:
      process.env.NEXT_PUBLIC_ADD_TEACHER_NOTE_URL ||
      oakConfig.oakPupilClient?.addTeacherNoteUrl,
    NEXT_PUBLIC_GET_TEACHER_NOTE_URL:
      process.env.NEXT_PUBLIC_GET_TEACHER_NOTE_URL ||
      oakConfig.oakPupilClient?.getTeacherNoteUrl,

    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
      oakConfig.clerk.publishableKey,
    CLERK_SECRET_KEY:
      process.env.CLERK_SECRET_KEY || secretsFromNetwork.CLERK_SECRET_KEY,

    // Geolocation
    DEVELOPMENT_USER_REGION:
      process.env.DEVELOPMENT_USER_REGION ||
      oakConfig.clerk.developmentUserRegion,
  };

  const serializedEnv = Object.entries(env).reduce((acc, [key, value]) => {
    return `${acc}${key}=${value}\n`;
  }, "");

  const warningComment = `# This file is auto generated by scripts/build/write_env_file
# any changes made here will be overwritten on the next dev/build run`;

  const envFileContent = `${warningComment}
${serializedEnv}
${warningComment}
`;

  // @TODO: add comment to file
  const envFileName =
    NODE_ENV === "development"
      ? `.env.development.local`
      : `.env.production.local`;

  console.log(`Writing env to ${envFileName}`);

  writeFileSync(envFileName, envFileContent);
}

main();
