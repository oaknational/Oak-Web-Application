import path from "node:path/posix";

import { flatten } from "lodash";
import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import curriculumApi from "../../../../../node-lib/curriculum-api";

/**
 * @todo this page generates a sitemap with about 8000 entries so far. We need to split it into
 * multiple smaller sitemaps and reference them all in the sitemap index.
 *
 * maybe do it on keystage since there are only a few of those, and we need to know
 * the URLs in advance so we can explicitly add them to the additional sitemap
 * config in next-sitemap.config.js .
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  // SITEMAP_BASE_URL is written to the .env file during next.config.js execution.
  const sitemapBaseUrl = process.env.SITEMAP_BASE_URL || "";

  const basePath = "beta/teachers/key-stages";

  const keyStageSubjectPairs =
    await curriculumApi.teachersKeyStageSubjectTiersPaths();
  // Key stage, subject, unit combos. We don't know the units yet,
  // so start with an empty array.
  interface Params {
    keyStageSlug: string;
    subjectSlug: string;
    unitSlugs: string[];
  }
  const ksuSlugs = keyStageSubjectPairs.tiers.map(
    ({ keyStageSlug, subjectSlug }) => {
      const params: Params = {
        keyStageSlug,
        subjectSlug,
        unitSlugs: [],
      };
      return params;
    }
  );

  /**
   * Figure out the paths to all the nested dynamic routes under this directory.
   */

  // key-stages/[keyStageSlug]/subject
  const uniqueKeystages = new Set(
    ksuSlugs.map((ksSlug) => ksSlug.keyStageSlug)
  );
  const keystageFields = Array.from(uniqueKeystages).map((keystage) => {
    return {
      loc: new URL(path.join(sitemapBaseUrl, basePath, keystage, "subjects"))
        .href,
      lastmod: new Date().toISOString(),
    };
  });

  // key-stages/[keyStageSlug]/subject/[subjectSlug]
  // key-stages/[keyStageSlug]/subject/[subjectSlug]/units
  const keystageSubjectPaths = flatten(
    ksuSlugs.map((ksSlug) => {
      const pagePath = path.join(
        sitemapBaseUrl,
        basePath,
        ksSlug.keyStageSlug,
        "subjects",
        ksSlug.subjectSlug
      );
      return [pagePath, path.join(pagePath, "units")];
    })
  );
  const keystageSubjectFields = keystageSubjectPaths.map((ksPath) => {
    return {
      loc: new URL(ksPath).href,
      lastmod: new Date().toISOString(),
    };
  });

  // key-stages/[keyStageSlug]/subject/[subjectSlug]/units/[unitSlug]
  let keystageSubjectUnitPaths: string[] = [];
  for await (const ksuSlug of ksuSlugs) {
    const { keyStageSlug, subjectSlug } = ksuSlug;
    // Given the key stage and subject, fetch the units.
    const curriculumData = await curriculumApi.teachersKeyStageSubjectUnits({
      keyStageSlug,
      subjectSlug,
    });
    const unitSlugs = curriculumData.units.map((unit) => unit.slug);

    // Store the units of the slugs object for use in subsequent path constructions.
    ksuSlug.unitSlugs = unitSlugs;

    const pagePaths = unitSlugs.map((unitSlug) => {
      const pagePath = path.join(
        sitemapBaseUrl,
        basePath,
        keyStageSlug,
        "subjects",
        subjectSlug,
        "units",
        unitSlug
      );
      return pagePath;
    });

    keystageSubjectUnitPaths = keystageSubjectUnitPaths.concat(pagePaths);
  }
  const keystageSubjectUnitFields = keystageSubjectUnitPaths.map((ksuPath) => {
    return {
      loc: new URL(ksuPath).href,
      lastmod: new Date().toISOString(),
    };
  });

  // key-stages/[keyStageSlug]/subject/[subjectSlug]/units/[unitSlug]/lessons/[lessonSlug]
  // key-stages/[keyStageSlug]/subject/[subjectSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads
  let keystageSubjectUnitLessonPaths: string[] = [];
  for await (const ksuSlug of ksuSlugs) {
    const { keyStageSlug, subjectSlug, unitSlugs } = ksuSlug;
    for await (const unitSlug of unitSlugs) {
      // Given the key stage, subject, and unit, fetch the lessons.
      const curriculumData =
        await curriculumApi.teachersKeyStageSubjectUnitLessons({
          keyStageSlug,
          subjectSlug,
          unitSlug,
        });
      const lessonSlugs = curriculumData.lessons.map((lesson) => lesson.slug);
      const pagePaths = lessonSlugs.map((lessonSlug) => {
        const pagePath = path.join(
          sitemapBaseUrl,
          basePath,
          keyStageSlug,
          "subjects",
          subjectSlug,
          "units",
          unitSlug,
          "lessons",
          lessonSlug
        );
        const downloadsPagePath = path.join(pagePath, "downloads");
        return [pagePath, downloadsPagePath];
      });
      keystageSubjectUnitLessonPaths = keystageSubjectUnitLessonPaths.concat(
        flatten(pagePaths)
      );
    }
  }
  const keystageSubjectUnitLessonFields = keystageSubjectUnitLessonPaths.map(
    (ksulPath) => {
      return {
        loc: new URL(ksulPath).href,
        lastmod: new Date().toISOString(),
      };
    }
  );

  const fields = keystageFields.concat(
    keystageSubjectFields,
    keystageSubjectUnitFields,
    keystageSubjectUnitLessonFields
  );

  return getServerSideSitemap(context, fields);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Sitemap() {}
