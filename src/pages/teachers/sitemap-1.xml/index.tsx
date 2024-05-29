import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

/**
 * Get all sitemap url construct sitemap entries for them.
 */

export type URLFields = { urls: string }[];

export const generateURLFields = (urls: URLFields) => {
  return urls.map((url) => {
    return {
      loc: url.urls,
      lastmod: new Date().toISOString(),
    };
  });
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const teacherSiteMap = await curriculumApi2023.teachersSitemap();
  const fields = generateURLFields(teacherSiteMap);

  const middleIndex = Math.floor(fields.length / 2);

  const secondHalf = fields.slice(middleIndex);

  return getServerSideSitemap(context, secondHalf);
};

export default function Sitemap() {}
