/** @type {import('next-sitemap').IConfig} */

// https://www.npmjs.com/package/next-sitemaptouch
module.exports = {
  siteUrl: process.env.SITE_URL || "https://not_a_site.com",
  generateRobotsTxt: true, // (optional)
  exclude: ["/server-sitemap-index.xml"], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://example.com/server-sitemap-index.xml", // <==== Add here
    ],
  },
  // ...other options
};
