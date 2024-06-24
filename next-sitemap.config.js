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
  "/teachers/curriculum/sitemap.xml",
  "/teachers/key-stages/sitemap.xml",
  "/teachers/sitemap.xml",
  "/teachers/sitemap-1.xml",
  "/pupils/sitemap.xml",
  "/pupils/sitemap-1.xml",
];
const serversideSitemapUrls = serversideSitemapPaths.map(
  (sitemapPath) => new URL(path.join(sitemapBaseUrl, sitemapPath)).href,
);

// https://github.com/iamvishnusankar/next-sitemap#readme
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: sitemapBaseUrl,
  // Generate a robots.txt that instructs no crawling (individual pages also have no index set).
  generateRobotsTxt: true,
  robotsTxtOptions: {
    // List the dynamically generated sitemaps here, exclude below.
    additionalSitemaps: shouldSkipInitialBuild
      ? serversideSitemapUrls
      : undefined,
    policies: [
      {
        userAgent: "*",
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
