/**
 * Configure Percy
 * https://docs.percy.io/docs/cli-configuration#a-complete-config
 *
 * Note: Percy is triggered in Github workflows, the logic is here .github/actions/percy_snapshots/index.js
 */

// Vercel automation bypass secret
const vercelAutomationBypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
if (!vercelAutomationBypass) {
  throw new TypeError(
    "Please specify Vercel automation bypass secret in envs\nfor background info see https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection#protection-bypass-for-automation",
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
      visibility: hidden;
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
      "x-vercel-protection-bypass": vercelAutomationBypass,
    },
  },
};
