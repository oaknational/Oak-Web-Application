// SITEMAP_BASE_URL is written to the .env file during next.config.js execution.
const sitemapBaseUrl = process.env.SITEMAP_BASE_URL;
if (!sitemapBaseUrl || sitemapBaseUrl === "undefined") {
  throw new TypeError(
    "process.env.SITEMAP_BASE_URL not defined. See code in next.config.js"
  );
}

// https://github.com/iamvishnusankar/next-sitemap#readme
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: sitemapBaseUrl,
  generateIndexSitemap: false,
  // Disallow all paths.
  transform: async () => null,
  // Configure robots.txt
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        // Note, there is a Cloudflare rule redirecting all /beta paths to a 404 page.
        disallow: ["/"],
      },
    ],
  },

  // Ignore server-side sitemap config for static version of site.
  // https://github.com/iamvishnusankar/next-sitemap#generating-dynamicserver-side-sitemaps
  // robotsTxtOptions: {
  //   additionalSitemaps: [
  //     "https://example.com/server-sitemap-index.xml", // <==== Add here
  //   ],
  // },
  // ...other options
};
