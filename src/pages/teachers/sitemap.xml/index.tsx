import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

/**
 * Get all sitemap url construct sitemap entries for them.
 */

export const getServerSideProps: GetServerSideProps = async (context) => {
  const teacherSiteMap = await curriculumApi2023.teachersSitemap();

  const fields = teacherSiteMap.map((url) => {
    return {
      loc: url.urls,
      lastmod: new Date().toISOString(),
    };
  });

  return getServerSideSitemap(context, fields);
};

export default function Sitemap() {}
