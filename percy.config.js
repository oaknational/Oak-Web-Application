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
    "Please specify Cloudflare Access token headers in envs\nfor background info see https://developers.cloudflare.com/cloudflare-one/identity/service-tokens/"
  );
}

module.exports = {
  version: 2,
  snapshot: {
    widths: [375, 1280],
    minHeight: 1024,
    percyCSS: `
    #mtm-root-container { display: none!important; }
    `,
  },
  discovery: {
    allowedHostnames: [],
    userAgent: "Percy",
    requestHeaders: {
      "CF-Access-Client-Id": CfAccessClientId,
      "CF-Access-Client-Secret": CfAccessClientSecret,
    },
  },
};
