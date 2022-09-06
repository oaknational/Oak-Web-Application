/**
 * Generate config for running Pa11yCI.
 *
 * Note, this config is also used as the source of URLs to test for Lighthouse CI.
 */

const config = {
  defaults: {
    runners: ["axe"],
    hideElements:
      "#mtm-root-container, #mtm-frame-container, #avo-debugger, #homepage-blog-list",
  },
  urls: [],
};

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

// URLs should end with a `/` to avoid redirects from
// e.g. `/unit` to `/unit/index.html` during tests.
const relativeUrls = [
  "/",
  {
    url: "/lesson-planning",
    ignore: [
      // Pa11y using Axe is looking for videos with track elements of type=captions, but the
      // Mux player is rendering type=subtitles, so Pa11y is complaining, not sure who is wrong
      // hiding for now.
      "video-caption",
      // This is something to do with the video controls in the Shadow DOM, they appear white on black,
      // but Pa11y isn't picking that up.
      "color-contrast",
    ],
    // log: {
    //   debug: console.log,
    //   error: console.error,
    //   info: console.info,
    // },
  },
  "/develop-your-curriculum",
  "/about-us/who-we-are",
  "/about-us/board",
  // Ignore beta pages for now.
  // "/beta/lessons/physics-only-review-chj3cd/",
  // "/beta/sign-in",
  // "/beta/search",
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
