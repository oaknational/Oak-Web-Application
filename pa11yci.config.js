/**
 * Generate config for running Pa11yCI.
 *
 * Note, this config is also used as the source of URLs to test for Lighthouse CI.
 */

const config = {
  defaults: {
    runners: ["axe"],
    // TODO: Video showing as NOT captioned when it is - check with Jim Creswell
    hideElements:
      "video, #mtm-root-container, #mtm-frame-container, #avo-debugger",
  },
  urls: [],
};

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

// URLs should end with a `/` to avoid redirects from
// e.g. `/unit` to `/unit/index.html` during tests.
const relativeUrls = [
  "/",
  "/lesson-planning",
  "/beta/lessons/physics-only-review-chj3cd/",
  "/beta/sign-in",
  "/beta/search",
];

// Add the base URL to the relative URLs.
config.urls = relativeUrls.map((relUrl) => {
  if (typeof relUrl === "string") {
    return new URL(relUrl, baseUrl).href;
  } else {
    relUrl.url = new URL(relUrl.url, baseUrl).href;
    return relUrl;
  }
});

module.exports = config;
