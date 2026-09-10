const path = require("node:path/posix");

// SITEMAP_BASE_URL is written to the .env file during next.config.js execution.
const sitemapBaseUrl = process.env.SITEMAP_BASE_URL;
if (!sitemapBaseUrl || sitemapBaseUrl === "undefined") {
  throw new TypeError(
    "process.env.SITEMAP_BASE_URL not defined. See code in next.config.js",
  );
}

// Can't read the Oak config here, so process switch manually.
// As long as ISR isn't disabled we should add the dynamic
// sitemaps to the sitemap list.
const shouldSkipInitialBuild = process.env.DISABLE_ISR !== "on";

// List of dynamically generated sitemaps for pages using `fallback: "blocking"`
const serversideSitemapPaths = [
  "/blog/sitemap.xml",
  "/blog/categories/sitemap.xml",
  "/webinars/sitemap.xml",
  "/webinars/categories/sitemap.xml",
  "/teachers/sitemap.xml",
];
const serversideSitemapUrls = serversideSitemapPaths.map(
  (sitemapPath) => new URL(path.join(sitemapBaseUrl, sitemapPath)).href,
);

// SSR pages that next-sitemap can't discover at build time
const additionalAboutUsPaths = [
  "/about-us/who-we-are",
  "/about-us/oaks-curricula",
  "/about-us/oaks-impact",
  "/about-us/meet-the-team",
  "/about-us/get-involved",
];

/**
 * Oak's Content Signals declaration, published inside the `User-agent: *`
 * group of the generated robots.txt.
 *
 * Decided by Aakash, relayed by MG, 2026-09-10: this site's content is
 * copyrighted, so no AI training and no AI grounding, but search is welcome.
 *
 * `open-api.thenational.academy` deliberately says the opposite for `ai-train`
 * — it serves the openly licensed curriculum. Two hosts, two licences, two
 * policies. Do not "fix" one to match the other; see `docs/content-signals.md`.
 *
 * - Content Signals policy: https://contentsignals.org/
 * - IETF draft: draft-romm-aipref-contentsignals
 */
const CONTENT_SIGNAL = "Content-Signal: ai-train=no, search=yes, ai-input=no";

/** The generated group header the directive has to sit inside. */
const USER_AGENT_GROUP = "User-agent: *\n";

/**
 * Insert the Content-Signal directive into the `User-agent: *` group.
 *
 * next-sitemap's robots builder emits only Allow, Disallow and Crawl-delay per
 * policy, so there is no config key for an arbitrary directive and this hook is
 * the supported way in.
 *
 * Throwing rather than returning the input unchanged is deliberate. A silent
 * no-op would publish a robots.txt with no declaration at all, and the build,
 * the deploy and every check downstream would still be green.
 */
const addContentSignal = async (_config, robotsTxt) => {
  if (!robotsTxt.includes(USER_AGENT_GROUP)) {
    throw new Error(
      "next-sitemap did not emit a 'User-agent: *' group, so the Content-Signal " +
        "directive has nowhere to go. Check robotsTxtOptions.policies.",
    );
  }

  return robotsTxt.replace(
    USER_AGENT_GROUP,
    `${USER_AGENT_GROUP}${CONTENT_SIGNAL}\n`,
  );
};

// https://github.com/iamvishnusankar/next-sitemap#readme
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: sitemapBaseUrl,
  additionalPaths: async () =>
    additionalAboutUsPaths.map((path) => ({
      loc: path,
      changefreq: "daily",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    })),
  // Generate a robots.txt that instructs no crawling (individual pages also have no index set).
  generateRobotsTxt: true,
  robotsTxtOptions: {
    // List the dynamically generated sitemaps here, exclude below.
    additionalSitemaps: shouldSkipInitialBuild
      ? serversideSitemapUrls
      : undefined,
    transformRobotsTxt: addContentSignal,
    policies: [
      {
        userAgent: "*",
        disallow: ["/api", "/_next/image"],
        // Note, there is a Cloudflare rule redirecting all /beta paths to a 404 page.
      },
    ],
  },
  exclude: [
    // Exclude WIP webinar pages
    "/webinars",
    "/webinars/*",
    // Pointer exclusions
    "/webinars/using-oak-to-support-during-covid-disruption-and-setting-cover-2",
    "/webinars/boosting-motivation-in-the-classroom",
    "/blog/what-impact-did-oak-have-in-2020-21",
    "/blog/using-our-new-curriculum-maps-to-support-your-classroom-planning",
    "/webinars",
    "/news-and-views",
    "/about-oak",
    "/people-and-partners",
    "/contact",
  ].concat(
    // Exclude dynamically created sitemaps
    shouldSkipInitialBuild ? serversideSitemapPaths : [],
  ),
};
