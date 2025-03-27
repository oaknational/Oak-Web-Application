import { GetServerSideProps } from "next";
import { getServerSideSitemapLegacy } from "next-sitemap";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getServerSideSitemapFields } from "@/node-lib/isr";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // SITEMAP_BASE_URL is written to the .env file during next.config.js execution.
  const sitemapBaseUrl = process.env.SITEMAP_BASE_URL || "";

  const keyStages = await curriculumApi2023.teachersHomePage();

  const keystageSlugs = keyStages.keyStages.map((ks) => `${ks.slug}/subjects`);

  const fields = getServerSideSitemapFields(
    context,
    sitemapBaseUrl,
    "/teachers/key-stages/",
    keystageSlugs,
  );

  return getServerSideSitemapLegacy(context, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {
  return null;
}
