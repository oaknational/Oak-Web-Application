/**
 * Generate config for running Pa11yCI.
 *
 * Note, this config is also used as the source of URLs to test for Lighthouse CI.
 */

const getDeploymentTestUrls = require("./src/common-lib/urls/getDeploymentTestUrls");

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const isLocalHost = new URL(baseUrl).host === "localhost:3000";

// Cloudflare Access token
const CfAccessClientId = process.env.CF_ACCESS_CLIENT_ID;
const CfAccessClientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
if (!isLocalHost && (!CfAccessClientId || !CfAccessClientSecret)) {
  throw new TypeError(
    "Please specify Cloudflare Access token headers in envs\nfor background info see https://developers.cloudflare.com/cloudflare-one/identity/service-tokens/",
  );
}

// https://github.com/pa11y/pa11y-ci#configuration
const config = {
  defaults: {
    userAgent: "oak testing Pa11y",
    timeout: 120000,
    runners: ["axe"],
    hideElements:
      /**
       * Elements we hide from Pa11y.
       *
       * Metomic
       * Avo
       * Anything labelled with .pa11y-ignore (doesn't work if element has shadow-dom children for some reason)
       */
      '#mtm-root-container, #mtm-frame-container, #avo-debugger, .pa11y-ignore, div[class^="PostHogSurvey"]',
    ignore: [
      // We have multiple instances of high-contrast text being detected as low-contrast
      // because of low-contrast text shadows.
      "color-contrast",

      //   Pa11y using Axe is looking for videos with track elements of type=captions, but the
      //   Mux player is rendering type=subtitles, so Pa11y is complaining, not sure who is wrong
      "video-caption",

      // There are also problems with the video controls being a <ul> with <slot> rather than <li> children.
      // Eslint should prevent us doing this in components we control.
      "list",
    ],
    headers: {
      "CF-Access-Client-Id": CfAccessClientId,
      "CF-Access-Client-Secret": CfAccessClientSecret,
    },
  },
  urls: [],
  // log: {
  //   debug: console.log,
  //   error: console.error,
  //   info: console.info,
  // },
};

const relativeUrls = getDeploymentTestUrls();

// Add the base URL to the relative URLs.
config.urls = relativeUrls.map((relUrl) => {
  // This is the current default.
  if (typeof relUrl === "string") {
    const pa11yUrl = new URL(relUrl, baseUrl).href;
    return {
      url: pa11yUrl,
      // Should help detect if we get served, e.g. a Cloudflare error page.
      actions: ["wait for element #__next to be visible"],
    };
    // Return the already created URL config object.
  } else {
    relUrl.url = new URL(relUrl.url, baseUrl).href;
    return relUrl;
  }
});

module.exports = config;
