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
  "/lp/lesson-and-resource-directory",
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
