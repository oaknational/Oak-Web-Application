import { GetServerSideProps } from "next";
import { getServerSideSitemapLegacy } from "next-sitemap";

import { buildAllUrlFields } from "@/pages-helpers/teacher/sitemap-pages/sitemap-pages-helper";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

/**
 * Get all sitemap url construct sitemap entries for them.
 */

export const getServerSideProps: GetServerSideProps = async (context) => {
  const teachersSitemapData = await curriculumApi2023.teachersSitemap();
  const fields = await buildAllUrlFields({
    firstHalf: false,
    teachersSitemapData,
  });
  return getServerSideSitemapLegacy(context, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
