import { GetServerSideProps } from "next";
import { getServerSideSitemapLegacy } from "next-sitemap";

import CMSClient from "../../../node-lib/cms";
import { getServerSideSitemapFields } from "../../../node-lib/isr";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // SITEMAP_BASE_URL is written to the .env file during next.config.js execution.
  const sitemapBaseUrl = process.env.SITEMAP_BASE_URL || "";

  const webinarResults = await CMSClient.webinars();
  const webinarSlugs = webinarResults.map(
    (webinarResult) => webinarResult.slug,
  );

  const fields = getServerSideSitemapFields(
    context,
    sitemapBaseUrl,
    "/webinars",
    webinarSlugs,
  );

  return getServerSideSitemapLegacy(context, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {
  return null;
}
