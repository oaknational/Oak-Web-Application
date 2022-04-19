const {
  getAppVersion,
  getReleaseStage,
  RELEASE_STAGE_PRODUCTION,
} = require("./scripts/build/build_config_helpers");

// With this set up, "production" builds can only happen on Vercel.
// When we come to sort out a failover we may need to tweak this functionality.
// Defaults to "development".
const releaseStage = getReleaseStage(process.env.VERCEL_ENV);
const isProductionBuild = releaseStage === RELEASE_STAGE_PRODUCTION;

const appVersion = getAppVersion(isProductionBuild);
console.log(`Found app version: "${appVersion}"`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
    NEXT_PUBLIC_CLIENT_APP_BASE_URL: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL,
    NEXT_PUBLIC_RELEASE_STAGE: releaseStage,
  },
};

module.exports = nextConfig;
