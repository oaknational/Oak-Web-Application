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

  const curriculumResult = await curriculumApi2023.curriculumPhaseOptions();

  const curriculumPathSlugs: string[] = [];

  for (const curriculum of curriculumResult) {
    for (const curriculumPhase of curriculum.phases) {
      if (curriculumPhase.slug === "primary") {
        curriculumPathSlugs.push(`${curriculum.slug}-primary`);
      } else if (
        curriculumPhase.slug === "secondary" &&
        !curriculum.ks4_options
      ) {
        curriculumPathSlugs.push(`${curriculum.slug}-secondary`);
      } else if (
        curriculumPhase.slug === "secondary" &&
        curriculum.ks4_options
      ) {
        const ks4OptionsSlugs = curriculum.ks4_options.map(
          (ks4_option) => ks4_option.slug,
        );
        for (const ks4OptionsSlug of ks4OptionsSlugs) {
          curriculumPathSlugs.push(
            `${curriculum.slug}-secondary-${ks4OptionsSlug}`,
          );
        }
      }
    }
  }

  const fields = [];
  for (const tab of ["overview", "units"]) {
    for (const slug of curriculumPathSlugs) {
      const url = new URL(sitemapBaseUrl);
      url.pathname = path.join(basePath, slug, tab);

      fields.push({
        loc: url.href,
        lastmod: new Date().toISOString(),
      });
    }
  }
  return getServerSideSitemap(context, fields);
};

export default function Sitemap() {}
