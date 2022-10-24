const { readFileSync, writeFileSync, appendFileSync } = require("node:fs");

const {
  BugsnagBuildReporterPlugin,
  BugsnagSourceMapUploaderPlugin,
} = require("webpack-bugsnag-plugins");
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_TEST,
} = require("next/constants");

const {
  getAppVersion,
  getReleaseStage,
  RELEASE_STAGE_PRODUCTION,
  RELEASE_STAGE_TESTING,
} = require("./scripts/build/build_config_helpers");
const fetchConfig = require("./scripts/build/fetch_config");
const fetchSecrets = require("./scripts/build/fetch_secrets");
const { getSecurityHeaders } = require("./scripts/build/policies");

// https://nextjs.org/docs/api-reference/next.config.js/introduction
module.exports = async (phase) => {
  /** @type {import('./scripts/build/fetch_config/config_types').OakConfig} */
  let oakConfig;

  let releaseStage;
  let appVersion;
  let isProductionBuild = false;
  const isNextjsProductionBuildPhase = phase === PHASE_PRODUCTION_BUILD;
  const isNextjsDevelopmentServer = phase === PHASE_DEVELOPMENT_SERVER;

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
      process.env.OVERRIDE_RELEASE_STAGE ||
        process.env.VERCEL_ENV ||
        // Netlify
        process.env.CONTEXT
    );
    isProductionBuild = releaseStage === RELEASE_STAGE_PRODUCTION;
    appVersion = getAppVersion(isProductionBuild);
    console.log(`Found app version: "${appVersion}"`);
  }

  const secretsFromNetwork = process.env.USE_ONLY_LOCAL_SECRETS
    ? {}
    : await fetchSecrets(oakConfig);

  // Flags to change behaviour for static builds.
  // Remove when we start using dynamic hosting for production.
  // Assumption that all static builds happen in Cloudbuild triggers (override available, see below).
  const cloudbuildTriggerName = process.env.CLOUDBUILD_TRIGGER_NAME;
  // Is a static build
  const isStaticBuild =
    (!!cloudbuildTriggerName && cloudbuildTriggerName !== "undefined") ||
    process.env.STATIC_BUILD_ALLOWED === "on";
  // Is a static build with beta pages deleted.
  const isStaticWWWBuild =
    isStaticBuild && cloudbuildTriggerName?.startsWith("OWA-WWW");

  const SANITY_ASSET_CDN_HOST =
    process.env.SANITY_ASSET_CDN_HOST || oakConfig.sanity.assetCDNHost;

  const imageDomains = [SANITY_ASSET_CDN_HOST].filter(Boolean);

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    webpack: (config, { dev }) => {
      // Production builds only.
      if (!dev && isProductionBuild && isNextjsProductionBuildPhase) {
        // Add source maps to production builds.
        config.devtool = "source-map";

        // Tell Bugsnag about the build.
        const bugsnagBuildInfo = {
          apiKey: oakConfig.bugsnag.apiKey,
          appVersion,
          releaseStage,
        };
        config.plugins.push(
          new BugsnagBuildReporterPlugin(bugsnagBuildInfo, {
            logLevel: "error",
          })
        );

        // Upload production sourcemaps
        const bugsnagSourcemapInfo = {
          apiKey: oakConfig.bugsnag.apiKey,
          appVersion,
          publicPath: "https://*/_next/",
          overwrite: true,
        };
        config.plugins.push(
          new BugsnagSourceMapUploaderPlugin(bugsnagSourcemapInfo)
        );
      }

      return config;
    },
    /**
     * Disable font optimization as we're using Cloudflare's fast-google-fonts
     * worker which not only includes this optimization but also rewrites all
     * relevant domains to be first party.
     * @see https://nextjs.org/docs/basic-features/font-optimization
     * @see https://blog.cloudflare.com/fast-google-fonts-with-cloudflare-workers/
     */
    optimizeFonts: false,
    poweredByHeader: false,
    reactStrictMode: true,
    compiler: {
      styledComponents: true,
    },
    async headers() {
      return [
        {
          // Apply these headers to all routes in your application.
          source: "/:path*",
          headers: getSecurityHeaders(isNextjsDevelopmentServer),
        },
      ];
    },

    // Allow static builds with deleted beta pages to build.
    eslint: {
      ignoreDuringBuilds: isStaticWWWBuild,
    },
    // Allow static builds with deleted beta pages to build.
    typescript: {
      ignoreBuildErrors: isStaticWWWBuild,
    },
    // Need this so static URLs and dynamic URLs match.
    trailingSlash: false,
    // Make sure production source maps exist for e.g. Bugsnag
    productionBrowserSourceMaps: true,
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

      // Posthog
      NEXT_PUBLIC_POSTHOG_API_HOST:
        process.env.NEXT_PUBLIC_POSTHOG_API_HOST || oakConfig.posthog?.apiHost,
      NEXT_PUBLIC_POSTHOG_API_KEY:
        process.env.NEXT_PUBLIC_POSTHOG_API_KEY || oakConfig.posthog?.apiKey,

      // Sanity
      SANITY_REVALIDATE_SECONDS:
        process.env.SANITY_REVALIDATE_SECONDS ||
        oakConfig.sanity?.revalidateSeconds,
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
      SANITY_ASSET_CDN_HOST,
      // Disable ISR per environment, "on" sets the config to `true` all other values including undefined result in `false`.
      DISABLE_ISR: process.env.DISABLE_ISR,
    },
    images: {
      // Allow static builds with the default image loader.
      // TODO: REMOVE WHEN WE START USING DYNAMIC HOSTING FOR PRODUCTION
      // https://nextjs.org/docs/messages/export-image-api#possible-ways-to-fix-it
      unoptimized: isStaticBuild,

      domains: imageDomains,
      /**
       * deviceSizes
       * @see https://github.com/vercel/next.js/issues/18413#issuecomment-775591999
       */
      deviceSizes: [
        16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920,
        2048, 3840,
      ],
    },
  };

  // Stick the deployment URL in an env so the site map generation can use it.
  // The sitemap plugin uses @next.env
  // https://github.com/iamvishnusankar/next-sitemap/blob/v3.1.18/packages/next-sitemap/bin/next-sitemap.mjs#L2
  // https://github.com/vercel/next.js/blob/v12.2.5/packages/next-env/index.ts#L100
  try {
    let baseUrl = nextConfig.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL;
    if (!baseUrl) {
      throw new TypeError(
        `Could not determine NEXT_PUBLIC_CLIENT_APP_BASE_URL for sitemap generation.`
      );
    }
    // Not all services prepend the protocol.
    if (!baseUrl.startsWith("http")) {
      baseUrl = `https://${baseUrl}`;
    }

    const baseUrlEnv = `SITEMAP_BASE_URL=${baseUrl}`;

    // Write the value out to the env file.
    const envFileName = ".env.local";
    // Make sure the file exists
    appendFileSync(envFileName, "");
    // Read current values.
    const currentEnv = readFileSync(envFileName, { encoding: "utf-8" });
    let newEnv;
    const sitemapUrlRegex = /^SITEMAP_BASE_URL=.*$/m;
    if (sitemapUrlRegex.test(currentEnv)) {
      // Replace existing value.
      newEnv = currentEnv.replace(sitemapUrlRegex, baseUrlEnv);
    } else {
      // Add new value.
      newEnv = `${currentEnv}\n${baseUrlEnv}`;
    }
    // Write new values.
    writeFileSync(envFileName, newEnv);
    console.log(`Wrote "${baseUrlEnv}" to .env file for sitemap generation.`);
  } catch (err) {
    console.error("Could not write SITEMAP_BASE_URL to env file");
    throw err;
  }

  return nextConfig;
};
