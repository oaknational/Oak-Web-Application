import { getServerSideSitemap } from "next-sitemap";
import { GetServerSideProps } from "next";

import CMSClient from "../../../node-lib/cms";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // SITEMAP_BASE_URL is written to the .env file during next.config.js execution.
  const sitemapBaseUrl = process.env.SITEMAP_BASE_URL;

  const blogResults = await CMSClient.blogPosts();

  const fields = blogResults.map((blogResult) => {
    return {
      loc: new URL(`${sitemapBaseUrl}/blog/${blogResult.slug}`).href,
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    };
  });

  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Sitemap() {}
