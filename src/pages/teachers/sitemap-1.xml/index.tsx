import { GetServerSideProps } from "next";
import { getServerSideSitemapLegacy } from "next-sitemap";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { buildAllUrlFields } from "@/pages-helpers/teacher/sitemap-pages/sitemap-pages-helper";

/**
 * Get part of teachers pages and construct sitemap entries for them.
 */

export const getServerSideProps: GetServerSideProps = async (context) => {
  const teachersSitemapData = await curriculumApi2023.teachersSitemap();
  const fields = await buildAllUrlFields({
    firstHalf: false,
    teachersSitemapData,
  });
  return getServerSideSitemapLegacy(context, fields);
};

export default function Sitemap() {
  return null;
}
