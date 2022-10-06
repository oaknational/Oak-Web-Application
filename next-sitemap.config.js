/** @type {import('next-sitemap').IConfig} */

// SITEMAP_BASE_URL is written to the .env file during next.config.js execution.
const sitemapBaseUrl = process.env.SITEMAP_BASE_URL;
if (!sitemapBaseUrl || sitemapBaseUrl === "undefined") {
  throw new TypeError(
    "process.env.SITEMAP_BASE_URL not defined. See code in next.config.js"
  );
}

// Switch to disable SEO per environment.
const disableSeo = process.env.NEXT_PUBLIC_DISABLE_SEO;
if (disableSeo) {
  console.warning(
    "SEO disabled in this environment, creating restrictive robots.txt"
  );
}

const basePolicy = disableSeo
  ? {
      userAgent: "*",
      // Disallow all paths.
      disallow: ["/"],
    }
  : {
      userAgent: "*",
      // Note, there is a Cloudflare rule redirecting all /beta paths to a 404 page.
      allow: ["/"],
    };

// https://github.com/iamvishnusankar/next-sitemap#readme
module.exports = {
  siteUrl: sitemapBaseUrl,
  // Generate a robots.txt that instructs no crawling (individual pages also have no index set).
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [basePolicy],
  },
  exclude: [
    // Don't add beta pages to the sitemap for now.
    "/beta",
    "/beta/*",
    // Exclude WIP webinar pages
    "/webinars",
    "/webinars/*",
    // Don't list the file that generates the sitemaps for the dynamic pages.
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
