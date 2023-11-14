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
    for (const curriculumPhase of curriculum.phases) {
      if (curriculumPhase.slug === "primary") {
        curriculumPathSlugs.push(`${curriculum.slug}-primary`);
      } else if (
        curriculumPhase.slug === "secondary" &&
        !curriculum.examboards
      ) {
        curriculumPathSlugs.push(`${curriculum.slug}-secondary`);
      } else if (
        curriculumPhase.slug === "secondary" &&
        curriculum.examboards
      ) {
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
  }

  const fields = [];
  for (const tab of ["overview", "units"]) {
    for (const slug of curriculumPathSlugs) {
      fields.push({
        loc: path.join(sitemapBaseUrl, basePath, slug, tab),
        lastmid: new Date().toISOString(),
      });
    }
  }

  return getServerSideSitemap(context, fields);
};

export default function Sitemap() {}
