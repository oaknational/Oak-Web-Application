import { GetServerSideProps } from "next";

import CMSClient from "../../../../node-lib/cms";
import { getServerSideSitemapEntries } from "../../../../node-lib/isr";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // SITEMAP_BASE_URL is written to the .env file during next.config.js execution.
  const sitemapBaseUrl = process.env.SITEMAP_BASE_URL || "";

  const webinarResults = await CMSClient.webinars();
  const categorySlugs = webinarResults.map(
    (webinarResult) => webinarResult.category.slug
  );
  const uniqueCategorySlugs = new Set(categorySlugs);

  return getServerSideSitemapEntries(
    context,
    sitemapBaseUrl,
    "/webinars/categories",
    Array.from(uniqueCategorySlugs)
  );
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Sitemap() {}
