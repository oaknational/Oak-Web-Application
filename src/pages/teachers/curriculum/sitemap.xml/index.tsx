import path from "node:path/posix";

import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

/**
 * Get all curriculum pages and construct sitemap entries for them.
 */

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sitemapBaseUrl = process.env.SITEMAP_BASE_URL || "";

  const basePath = "teachers/curriculum";

  const curriculumResult = await curriculumApi2023.subjectPhaseOptions();

  const curriculumPathSlugs: string[] = [];

  for (const curriculum of curriculumResult) {
    curriculumPathSlugs.push(`${curriculum.slug}-primary`);
    if (curriculum.examboards) {
      const examboardSlugs = curriculum.examboards.map(
        (examboard) => examboard.slug,
      );
      for (const examboardSlug of examboardSlugs) {
        curriculumPathSlugs.push(
          `${curriculum.slug}-secondary-${examboardSlug}`,
        );
      }
    }
  }

  const curriculumUnitsPaths = curriculumPathSlugs.map((curriculumPath) => {
    return path.join(sitemapBaseUrl, basePath, curriculumPath, "units");
  });
  const curriculumOverviewPaths = curriculumPathSlugs.map((curriculumPath) => {
    return path.join(sitemapBaseUrl, basePath, curriculumPath, "overview");
  });

  const curriculumUnitsFields = curriculumUnitsPaths.map(
    (curriculumUnitPath) => {
      return {
        loc: new URL(curriculumUnitPath).href,
        lastmod: new Date().toISOString(),
      };
    },
  );

  const curriculumOverviewFields = curriculumOverviewPaths.map(
    (curriculumOverviewPath) => {
      return {
        loc: new URL(curriculumOverviewPath).href,
        lastmod: new Date().toISOString(),
      };
    },
  );

  const fields = curriculumUnitsFields.concat(curriculumOverviewFields);

  return getServerSideSitemap(context, fields);
};

export default function Sitemap() {}
