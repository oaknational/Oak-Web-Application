import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import { getServerSideSitemapFields } from "@/node-lib/isr";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // SITEMAP_BASE_URL is written to the .env file during next.config.js execution.
  const sitemapBaseUrl = process.env.SITEMAP_BASE_URL || "";

  const keyStages = await curriculumApi2023.keyStages();

  const keystageSlugs = keyStages.keyStages.map((ks) => `${ks.slug}/subjects`);

  const fields = getServerSideSitemapFields(
    context,
    sitemapBaseUrl,
    "/teachers/key-stages/",
    keystageSlugs,
  );

  return getServerSideSitemap(context, fields);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Sitemap() {}
