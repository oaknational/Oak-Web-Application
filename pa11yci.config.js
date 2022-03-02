/**
 * Generate config for running Pa11yCI.
 *
 * Note, this config is also used as the source of URLs to test for Lighthouse CI.
 */

const config = {
  defaults: { runners: ["axe"] },
  urls: [],
};

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
// console.log("baseUrl", baseUrl);

// URLs should end with a `/` to avoid redirects from
// e.g. `/unit` to `/unit/index.html` during tests.
const relativeUrls = ["/"];
config.urls = relativeUrls.map((relUrl) => new URL(relUrl, baseUrl).href);

module.exports = config;
