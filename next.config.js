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
    releaseStage = getReleaseStage(process.env.VERCEL_ENV);
    const isProductionBuild = releaseStage === RELEASE_STAGE_PRODUCTION;
    appVersion = getAppVersion(isProductionBuild);
    console.log(`Found app version: "${appVersion}"`);
  }

  const secrets = await fetchSecrets(oakConfig);

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    poweredByHeader: false,
    reactStrictMode: true,
    compiler: {
      styledComponents: true,
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
        secrets.FIREBASE_SERVICE_ACCOUNT,
      FIREBASE_ADMIN_DATABASE_URL:
        process.env.FIREBASE_ADMIN_DATABASE_URL ||
        secrets.FIREBASE_ADMIN_DATABASE_URL,

      // Hasura
      NEXT_PUBLIC_GRAPHQL_API_URL: oakConfig.hasura.graphqlApiUrl,
      HASURA_ADMIN_SECRET:
        process.env.HASURA_ADMIN_SECRET || secrets.HASURA_ADMIN_SECRET,

      // Oak
      NEXT_PUBLIC_CLIENT_APP_BASE_URL: oakConfig.oak.appBaseUrl,
      NEXT_PUBLIC_SEARCH_API_URL: oakConfig.oak.searchApiUrl,
    },
  };

  // DEBUG
  // @todo this reveals all keys and secrets, so we should remove this before merging
  // in feat/config branch
  // console.log("Next config", nextConfig);

  return nextConfig;
};
