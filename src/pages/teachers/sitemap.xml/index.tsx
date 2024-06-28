import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import { buildAllUrlFields } from "@/pages-helpers/teacher/sitemap-pages/sitemap-pages-helper";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

/**
 * Get all sitemap urls, construct sitemap entries for them.
 */

export const getServerSideProps: GetServerSideProps = async (context) => {
  const teachersSitemapData = await curriculumApi2023.teachersSitemap();

  const fields = await buildAllUrlFields({
    firstHalf: true,
    teachersSitemapData,
  });
  return getServerSideSitemap(context, fields);
};

export default function Sitemap() {}
