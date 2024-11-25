import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import { buildAllUrlFields } from "@/pages-helpers/teacher/sitemap-pages/sitemap-pages-helper";
import { teachersSitemap } from "@/node-lib/curriculum-api-2023";

/**
 * Get all sitemap url construct sitemap entries for them.
 */

export const getServerSideProps: GetServerSideProps = async (context) => {
  const teachersSitemapData = await teachersSitemap();
  const fields = await buildAllUrlFields({
    firstHalf: false,
    teachersSitemapData,
  });
  return getServerSideSitemap(context, fields);
};

export default function Sitemap() {}
