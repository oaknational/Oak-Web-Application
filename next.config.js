const { readFileSync, writeFileSync, appendFileSync } = require("node:fs");

const {
  BugsnagBuildReporterPlugin,
  BugsnagSourceMapUploaderPlugin,
} = require("webpack-bugsnag-plugins");
const { PHASE_TEST, PHASE_PRODUCTION_BUILD } = require("next/constants");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYSE_BUNDLE === "on",
});

const {
  getAppVersion,
  getReleaseStage,
  RELEASE_STAGE_PRODUCTION,
  RELEASE_STAGE_TESTING,
} = require("./scripts/build/build_config_helpers");
const fetchConfig = require("./scripts/build/fetch_config");

// https://nextjs.org/docs/api-reference/next.config.js/introduction
module.exports = async (phase) => {
  /** @type {import('./scripts/build/fetch_config/config_types').OakConfig} */
  let oakConfig;

  let releaseStage;
  let appVersion;
  let isProductionBuild = false;
  const isNextjsProductionBuildPhase = phase === PHASE_PRODUCTION_BUILD;
  const isTestBuild = phase === PHASE_TEST || process.env.NODE_ENV === "test";

  // If we are in a test phase (or have explicitly declared a this is a test)
  // then use the fake test config values.
  if (isTestBuild) {
    oakConfig = await fetchConfig("oak-config/oak.config.test.json");

    releaseStage = RELEASE_STAGE_TESTING;
    appVersion = RELEASE_STAGE_TESTING;
  } else {
    const configLocation = process.env.OAK_CONFIG_LOCATION;
    oakConfig = await fetchConfig(configLocation);

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

  const imageDomains = ["image.mux.com", SANITY_ASSET_CDN_HOST].filter(Boolean);

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    webpack: (config, { dev, defaultLoaders }) => {
      /**
       * Enable inlining of SVGs as components
       * @see https://react-svgr.com/docs/next/
       */
      // Grab the existing rule that handles SVG imports
      const fileLoaderRule = config.module.rules.find((rule) =>
        rule.test?.test?.(".svg"),
      );
      config.module.rules.push(
        // Reapply the existing rule, but only for svg imports ending in ?url
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        // Convert all other *.svg imports to React components
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          resourceQuery: { not: /url/ }, // exclude if *.svg?url
          use: [
            defaultLoaders.babel,
            {
              loader: "@svgr/webpack",
              options: {
                babel: false,
                svgoConfig: {
                  plugins: [
                    {
                      name: "cleanupIds",
                      params: {
                        active: false,
                      },
                    },
                    {
                      name: "prefixIds",
                      params: {
                        prefixIds: false,
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      );
      // Modify the file loader rule to ignore *.svg, since we have it handled now.
      fileLoaderRule.exclude = /\.svg$/i;

      // Production and preview builds
      if (!dev && !isTestBuild) {
        // Add source maps.
        config.devtool = "source-map";
        console.log("Building source-maps");
      }
      // Production builds only.
      if (!dev && isProductionBuild && isNextjsProductionBuildPhase) {
        // Tell Bugsnag about the build.
        const bugsnagBuildInfo = {
          apiKey: oakConfig.bugsnag.apiKey,
          appVersion,
          releaseStage,
        };
        config.plugins.push(
          new BugsnagBuildReporterPlugin(bugsnagBuildInfo, {
            logLevel: "error",
          }),
        );

        // Upload production sourcemaps
        const bugsnagSourcemapInfo = {
          apiKey: oakConfig.bugsnag.apiKey,
          appVersion,
          publicPath: "https://*/_next/",
          overwrite: true,
        };
        config.plugins.push(
          new BugsnagSourceMapUploaderPlugin(bugsnagSourcemapInfo),
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
    swcMinify: true,

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
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**.googleusercontent.com",
        },
        {
          protocol: "https",
          hostname: "storage.googleapis.com",
        },
        {
          protocol: "https",
          hostname: "oaknationalacademy-res.cloudinary.com",
        },
      ],
      // Allow static builds with the default image loader.
      // TODO: REMOVE WHEN WE START USING DYNAMIC HOSTING FOR PRODUCTION
      // https://nextjs.org/docs/messages/export-image-api#possible-ways-to-fix-it
      unoptimized: isStaticBuild,
      domains: imageDomains,
    },
  };

  // Stick the deployment URL in an env so the site map generation can use it.
  // The sitemap plugin uses @next.env
  // https://github.com/iamvishnusankar/next-sitemap/blob/v3.1.18/packages/next-sitemap/bin/next-sitemap.mjs#L2
  // https://github.com/vercel/next.js/blob/v12.2.5/packages/next-env/index.ts#L100
  try {
    let baseUrl = process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL;
    if (!baseUrl) {
      throw new TypeError(
        `Could not determine NEXT_PUBLIC_CLIENT_APP_BASE_URL for sitemap generation.`,
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

  return withBundleAnalyzer(nextConfig);
};
