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
  // Don't generate a robots.txt, we want to manually control this.
  generateRobotsTxt: false,
  exclude: [
    // Don't add beta pages for now.
    "/beta",
    "/beta/*",
    // Don't index the file that generates the sitemaps for the dynamic pages.
    "/server-sitemap-index.xml",
  ],
  // Ignore server-side sitemap config for static version of site.
  // https://github.com/iamvishnusankar/next-sitemap#generating-dynamicserver-side-sitemaps
  // robotsTxtOptions: {
  //   additionalSitemaps: [
  //     "https://example.com/server-sitemap-index.xml", // <==== Add here
  //   ],
  // },
  // ...other options
};
