/**
 * Generate config for running Pa11yCI.
 *
 * Note, this config is also used as the source of URLs to test for Lighthouse CI.
 */

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const isLocalHost = new URL(baseUrl).host === "localhost:3000";

// Cloudflare Access token
const CfAccessClientId = process.env.CF_ACCESS_CLIENT_ID;
const CfAccessClientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
if (!isLocalHost && (!CfAccessClientId || !CfAccessClientSecret)) {
  throw new TypeError(
    "Please specify Cloudflare Access token headers in envs\nfor background info see https://developers.cloudflare.com/cloudflare-one/identity/service-tokens/"
  );
}

// https://github.com/pa11y/pa11y-ci#configuration
const config = {
  defaults: {
    runners: ["axe"],
    hideElements:
      "#mtm-root-container, #mtm-frame-container, #avo-debugger, .pa11y-ignore",
    ignore: [
      // Pa11y using Axe is looking for videos with track elements of type=captions, but the
      // Mux player is rendering type=subtitles, so Pa11y is complaining, not sure who is wrong
      // hiding for now
      "video-caption",
      // This is something to do with the video controls in the Shadow DOM, they appear white on black,
      // but Pa11y isn't picking that up.
      "color-contrast",
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

// URLs should end with a `/` to avoid redirects from
// e.g. `/unit` to `/unit/index.html` during tests.
const relativeUrls = [
  // Error pages
  "/404",
  // Public pages
  "/",
  "/lesson-planning",
  "/develop-your-curriculum",
  "/support-your-team",
  "/about-us/who-we-are",
  "/about-us/leadership",
  "/about-us/board",
  "/about-us/partners",
  "/about-us/work-with-us",
  "/blog",
  "/blog/how-to-design-a-unit-of-study",
  "/blog/evolution-of-oak",
  "/blog/join-the-childrens-mental-health-week-assembly-2022",
  "/legal/accessibility-statement",
  "/lp/download-our-lesson-and-resource-directory",
  // Beta pages
  "/beta",
  "/beta/teachers",
  "/beta/teachers/key-stages/ks1/subjects",
  "/beta/teachers/key-stages/ks4/subjects/maths",
  "/beta/teachers/key-stages/ks4/subjects/maths/units?tier=foundation",
  "/beta/teachers/key-stages/ks4/subjects/maths/units/directed-numbers-fe66",
  "/beta/teachers/key-stages/ks4/subjects/maths/units/directed-numbers-fe66/lessons/adding-directed-numbers-chjk4t",
  "/beta/teachers/key-stages/ks4/subjects/maths/units/directed-numbers-fe66/lessons/adding-directed-numbers-chjk4t/downloads",
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
