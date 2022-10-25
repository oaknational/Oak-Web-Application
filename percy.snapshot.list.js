/**
 * Generate a list of snapshot configs for use with `percy snapshot`
 * https://docs.percy.io/docs/percy-snapshot#configuration
 */
const baseUrl = process.env.PERCY_BASE_URL;
if (!baseUrl) {
  throw new TypeError("process.env.PERCY_BASE_URL must be defined");
}
console.log("Percy base url:", baseUrl);

// Support single string relative URLs, or objects with a `url` key.
// https://docs.percy.io/docs/percy-snapshot#configuration
const snapshotRelativeUrls = [
  "/",
  "/lesson-planning",
  "/develop-your-curriculum",
  "/about-us/who-we-are",
  "/about-us/board",
  "/blog",
  "/blog/how-to-design-a-unit-of-study",
  "/blog/evolution-of-oak",
  "/blog/join-the-childrens-mental-health-week-assembly-2022",
  "/legal/accessibility-statement",
  "/lp/download-our-lesson-and-resource-directory",
];

const urls = snapshotRelativeUrls.map((relUrl) => {
  if (typeof relUrl === "string") {
    const url = new URL(relUrl, baseUrl).href;
    return { name: relUrl, url };
  } else {
    const url = new URL(relUrl.url, baseUrl).href;
    return {
      // Pass through any fancy config.
      ...relUrl,
      name: relUrl.url,
      url,
    };
  }
});

module.exports = urls;
