/**
 * Configure Percy
 * https://docs.percy.io/docs/cli-configuration#a-complete-config
 *
 * Note: Percy is triggered in Github workflows, the logic is here .github/actions/percy_snapshots/index.js
 */

// Cloudflare Access token
const CfAccessClientId = process.env.CF_ACCESS_CLIENT_ID;
const CfAccessClientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
if (!CfAccessClientId || !CfAccessClientSecret) {
  throw new TypeError(
    "Please specify Cloudflare Access token headers in envs\nfor background info see https://developers.cloudflare.com/cloudflare-one/identity/service-tokens/",
  );
}

const baseUrl = process.env.PERCY_BASE_URL;
if (!baseUrl) {
  throw new TypeError("process.env.PERCY_BASE_URL must be defined");
}

/** @type {import('./node_modules/@percy/core/types').PercyConfigOptions} */
module.exports = {
  version: 2,
  snapshot: {
    widths: [375, 1280],
    minHeight: 1024,
    percyCSS: `
    #mtm-root-container { display: none!important; }
    
    *[data-percy-hide="contents"] > * {
      display: none;
    }
    `,
  },
  discovery: {
    concurrency: 6,
    retry: true,
    // Standard config.
    networkIdleTimeout: 750,
    allowedHostnames: [
      "docs.google.com",
      // "gstatic-fonts.thenational.academy",
      // "sanity-asset-cdn.thenational.academy",
    ],
    userAgent: "oak testing Percy",
    requestHeaders: {
      "CF-Access-Client-Id": CfAccessClientId,
      "CF-Access-Client-Secret": CfAccessClientSecret,
    },
  },
};
