/** @type {import('next-sitemap').IConfig} */

// SITEMAP_BASE_URL is written to the .env file during next.config.js execution.
const sitemapBaseUrl = process.env.SITEMAP_BASE_URL;
if (!sitemapBaseUrl || sitemapBaseUrl === "undefined") {
  throw new TypeError(
    "process.env.SITEMAP_BASE_URL not defined. See code in next.config.js"
  );
}

// https://github.com/iamvishnusankar/next-sitemap#readme
module.exports = {
  siteUrl: sitemapBaseUrl,
  // Generate a robots.txt that instructs no crawling (individual pages also have no index set).
  generateRobotsTxt: true,
  robotsTxtOptions: {
    // List the dynamically generated sitemaps here.
    additionalSitemaps: [new URL(`${sitemapBaseUrl}/blog/sitemap.xml`).href],
    policies: [
      {
        userAgent: "*",
        // Note, there is a Cloudflare rule redirecting all /beta paths to a 404 page.
        allow: ["/"],
      },
    ],
  },
  exclude: [
    // Exclude dynamically created sitemaps
    "blog/sitemap.xml",
    // Don't add beta pages to the sitemap for now.
    "/beta",
    "/beta/*",
    // Exclude WIP webinar pages
    "/webinars",
    "/webinars/*",
    // Don't list the file that generates the sitemaps for the dynamic pages.
    "/server-sitemap-index.xml",
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
  ],
};
