const { PHASE_TEST } = require("next/constants");

const {
  getAppVersion,
  getReleaseStage,
  RELEASE_STAGE_PRODUCTION,
  RELEASE_STAGE_TESTING,
} = require("./scripts/build/build_config_helpers");
const fetchConfig = require("./scripts/build/fetch_config");
const fetchSecrets = require("./scripts/build/fetch_secrets");

// https://nextjs.org/docs/api-reference/next.config.js/introduction
module.exports = async (phase) => {
  /** @type {import('./scripts/build/fetch_config/config_types').OakConfig} */
  let oakConfig;

  let releaseStage;
  let appVersion;

  // If we are in a test phase (or have explicitly declared a this is a test)
  // then use the fake test config values.
  if (phase === PHASE_TEST || process.env.NODE_ENV === "test") {
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
      process.env.OVERRIDE_RELEASE_STAGE || process.env.VERCEL_ENV
    );
    const isProductionBuild = releaseStage === RELEASE_STAGE_PRODUCTION;
    appVersion = getAppVersion(isProductionBuild);
    console.log(`Found app version: "${appVersion}"`);
  }

  const secretsFromNetwork = process.env.USE_ONLY_LOCAL_SECRETS
    ? {}
    : await fetchSecrets(oakConfig);

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    poweredByHeader: false,
    reactStrictMode: true,
    compiler: {
      styledComponents: true,
    },
    experimental: {
      // Allow static builds with the default image loader.
      // TODO: REMOVE WHEN WE START USING DYNAMIC HOSTING FOR PRODUCTION
      // https://nextjs.org/docs/messages/export-image-api#possible-ways-to-fix-it
      images: {
        unoptimized: true,
      },
    },
    env: {
      // Values calculated in this file.
      NEXT_PUBLIC_APP_VERSION: appVersion,
      NEXT_PUBLIC_RELEASE_STAGE: releaseStage,

      // Values read from the config file.

      // Bugsnag
      NEXT_PUBLIC_BUGSNAG_API_KEY: oakConfig.bugsnag.apiKey,

      // Firebase
      NEXT_PUBLIC_FIREBASE_API_HOST: oakConfig.firebase.apiHost,
      NEXT_PUBLIC_FIREBASE_API_KEY: oakConfig.firebase.apiKey,
      NEXT_PUBLIC_FIREBASE_APP_ID: oakConfig.firebase.appId,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: oakConfig.firebase.authDomain,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        oakConfig.firebase.messagingSenderId,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: oakConfig.firebase.projectId,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: oakConfig.firebase.storageBucket,
      NEXT_PUBLIC_FIREBASE_TOKEN_API_HOST: oakConfig.firebase.tokenHost,
      FIREBASE_SERVICE_ACCOUNT:
        process.env.FIREBASE_SERVICE_ACCOUNT ||
        secretsFromNetwork.FIREBASE_SERVICE_ACCOUNT,
      FIREBASE_ADMIN_DATABASE_URL:
        process.env.FIREBASE_ADMIN_DATABASE_URL ||
        secretsFromNetwork.FIREBASE_ADMIN_DATABASE_URL,

      // Gleap
      NEXT_PUBLIC_GLEAP_API_KEY:
        process.env.NEXT_PUBLIC_GLEAP_API_KEY || oakConfig.gleap.apiKey,
      NEXT_PUBLIC_GLEAP_API_URL:
        process.env.NEXT_PUBLIC_GLEAP_API_URL || oakConfig.gleap.apiUrl,
      NEXT_PUBLIC_GLEAP_WIDGET_URL:
        process.env.NEXT_PUBLIC_GLEAP_WIDGET_URL || oakConfig.gleap.widgetUrl,

      // Hasura
      NEXT_PUBLIC_GRAPHQL_API_URL: oakConfig.hasura.graphqlApiUrl,
      HASURA_ADMIN_SECRET:
        process.env.HASURA_ADMIN_SECRET ||
        secretsFromNetwork.HASURA_ADMIN_SECRET,

      // Hubspot
      NEXT_PUBLIC_HUBSPOT_PORTAL_ID: oakConfig.hubspot.portalId,
      NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID:
        oakConfig.hubspot.newsletterFormId,
      NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID: oakConfig.hubspot.fallbackFormId,
      NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN:
        process.env.NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN ||
        oakConfig.hubspot.scriptDomain,

      // Oak
      NEXT_PUBLIC_CLIENT_APP_BASE_URL: oakConfig.oak.appBaseUrl,
      NEXT_PUBLIC_SEARCH_API_URL: oakConfig.oak.searchApiUrl,

      // Posthog
      NEXT_PUBLIC_POSTHOG_API_HOST:
        process.env.NEXT_PUBLIC_POSTHOG_API_HOST || oakConfig.posthog?.apiHost,
      NEXT_PUBLIC_POSTHOG_API_KEY:
        process.env.NEXT_PUBLIC_POSTHOG_API_KEY || oakConfig.posthog?.apiKey,

      // Sanity
      SANITY_PROJECT_ID:
        process.env.SANITY_PROJECT_ID || oakConfig.sanity?.projectId,
      SANITY_DATASET: process.env.SANITY_DATASET || oakConfig.sanity?.dataset,
      SANITY_DATASET_TAG:
        process.env.SANITY_DATASET_TAG || oakConfig.sanity?.datasetTag,
      SANITY_USE_CDN: process.env.SANITY_USE_CDN || oakConfig.sanity?.useCDN,
      SANITY_AUTH_SECRET:
        process.env.SANITY_AUTH_SECRET || secretsFromNetwork.SANITY_AUTH_SECRET,
      SANITY_PREVIEW_SECRET:
        process.env.SANITY_PREVIEW_SECRET ||
        secretsFromNetwork.SANITY_PREVIEW_SECRET,
    },
  };

  // DEBUG
  // @todo this reveals all keys and secrets, so we should remove this before merging
  // in feat/config branch
  // console.log("Next config", nextConfig);

  return nextConfig;
};
