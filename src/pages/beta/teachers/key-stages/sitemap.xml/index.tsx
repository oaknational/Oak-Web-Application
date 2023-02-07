import path from "node:path/posix";

import { flatten } from "lodash";
import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import curriculumApi from "../../../../../node-lib/curriculum-api";

/**
 * Get all the key stages and construct sitemap entries for them, then all the subjects in each key stage,
 * then units in each subject, then lessons in each unit, and construct sitemap entries for them.
 *
 *
 * @todo this is the naive approach, and generates far too many pages for a sitemap file, they should be limited to about
 * 10k entries. We can split on key stage, but that might not be enough. But we can split further using sitemap
 * index files, but next-sitemap doesn't expose that functionality for server-side sitemaps (I think),
 * so we would need to do some digging, that also hits the complexity of needing to know the sitemap file names
 * at build time so we can statically reference them in the next-sitemap config.
 *
 * @todo these are effectively nested loops, and *very* slow, about ten minutes on a high powered Mac,
 * can we move this into a materialised view and a single request?
 * And can we move it getStaticProps with ISR turned on? No, because the response happens by using the
 * server side props context.response object.
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  // SITEMAP_BASE_URL is written to the .env file during next.config.js execution.
  const sitemapBaseUrl = process.env.SITEMAP_BASE_URL || "";

  const basePath = "beta/teachers/key-stages";

  /**
   * Figure out the paths to all the nested dynamic routes under this directory.
   */

  // key-stages/[keyStageSlug]/subject
  const keyStageResult = await curriculumApi.teachersHomePage();
  const keyStageSlugs = keyStageResult.keyStages.map(
    (keyStage) => keyStage.slug
  );
  const keyStagePaths = keyStageSlugs.map((keyStageSlug) =>
    path.join(sitemapBaseUrl, basePath, keyStageSlug, "subjects")
  );
  const keystageFields = keyStagePaths.map((kPath) => {
    return {
      loc: new URL(kPath).href,
      lastmod: new Date().toISOString(),
    };
  });

  // key-stages/[keyStageSlug]/subject/[subjectSlug]
  // key-stages/[keyStageSlug]/subject/[subjectSlug]/units
  interface KeyStageSubjectSlug {
    keyStageSlug: string;
    subjectSlug: string;
  }
  const keyStageSubjectSlugs: KeyStageSubjectSlug[] = [];
  for await (const keyStageSlug of keyStageSlugs) {
    const subjectResults = await curriculumApi.teachersKeyStageSubjects({
      keyStageSlug,
    });
    subjectResults.subjects.forEach((subject) => {
      const keyStageSubjectSlug: KeyStageSubjectSlug = {
        keyStageSlug: subject.keyStageSlug,
        subjectSlug: subject.slug,
      };
      keyStageSubjectSlugs.push(keyStageSubjectSlug);
    });
  }
  const keystageSubjectPaths = flatten(
    keyStageSubjectSlugs.map((keyStageSubjectSlug) => {
      const pagePath = path.join(
        sitemapBaseUrl,
        basePath,
        keyStageSubjectSlug.keyStageSlug,
        "subjects",
        keyStageSubjectSlug.subjectSlug
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
  interface KeyStageSubjectUnitSlug {
    keyStageSlug: string;
    subjectSlug: string;
    unitSlug: string;
  }
  const keyStageSubjectUnitSlugs: KeyStageSubjectUnitSlug[] = [];
  for await (const keyStageSubjectSlug of keyStageSubjectSlugs) {
    const { keyStageSlug, subjectSlug } = keyStageSubjectSlug;
    const unitResults = await curriculumApi.teachersKeyStageSubjectUnits({
      keyStageSlug,
      subjectSlug,
    });
    unitResults.units.forEach((unit) => {
      const keyStageSubjectUnitSlug: KeyStageSubjectUnitSlug = {
        keyStageSlug: unit.keyStageSlug,
        subjectSlug: unit.subjectSlug,
        unitSlug: unit.slug,
      };
      keyStageSubjectUnitSlugs.push(keyStageSubjectUnitSlug);
    });
  }
  const keystageSubjectUnitPaths = keyStageSubjectUnitSlugs.map(
    (keyStageSubjectUnitSlug) =>
      path.join(
        sitemapBaseUrl,
        basePath,
        keyStageSubjectUnitSlug.keyStageSlug,
        "subjects",
        keyStageSubjectUnitSlug.subjectSlug,
        "units",
        keyStageSubjectUnitSlug.unitSlug
      )
  );
  const keystageSubjectUnitFields = keystageSubjectUnitPaths.map(
    (keystageSubjectUnitPath) => {
      return {
        loc: new URL(keystageSubjectUnitPath).href,
        lastmod: new Date().toISOString(),
      };
    }
  );

  // // DEBUG
  // console.log({ keystageSubjectUnitFields });
  // context.res.end("done!");
  // const result = { props: {} };
  // return result;

  // key-stages/[keyStageSlug]/subject/[subjectSlug]/units/[unitSlug]/lessons/[lessonSlug]
  // key-stages/[keyStageSlug]/subject/[subjectSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads
  interface KeyStageSubjectUnitLessonSlug {
    keyStageSlug: string;
    subjectSlug: string;
    unitSlug: string;
    lessonSlug: string;
  }
  const keyStageSubjectUnitLessonSlugs: KeyStageSubjectUnitLessonSlug[] = [];
  for await (const keyStageSubjectUnitSlug of keyStageSubjectUnitSlugs) {
    const { keyStageSlug, subjectSlug, unitSlug } = keyStageSubjectUnitSlug;
    const lessonResults =
      await curriculumApi.teachersKeyStageSubjectUnitLessons({
        keyStageSlug,
        subjectSlug,
        unitSlug,
      });
    lessonResults.lessons.forEach((lesson) => {
      const keyStageSubjectUnitLessonSlug: KeyStageSubjectUnitLessonSlug = {
        keyStageSlug: lesson.keyStageSlug,
        subjectSlug: lesson.subjectSlug,
        unitSlug: lesson.unitSlug,
        lessonSlug: lesson.slug,
      };
      keyStageSubjectUnitLessonSlugs.push(keyStageSubjectUnitLessonSlug);
    });
  }
  const keystageSubjectUnitLessonPaths = flatten(
    keyStageSubjectUnitLessonSlugs.map((keyStageSubjectUnitLessonSlug) => {
      const lessonPath = path.join(
        sitemapBaseUrl,
        basePath,
        keyStageSubjectUnitLessonSlug.keyStageSlug,
        "subjects",
        keyStageSubjectUnitLessonSlug.subjectSlug,
        "units",
        keyStageSubjectUnitLessonSlug.unitSlug,
        "lessons",
        keyStageSubjectUnitLessonSlug.lessonSlug
      );
      return [lessonPath, path.join(lessonPath, "downloads")];
    })
  );
  const keystageSubjectUnitLessonFields = keystageSubjectUnitLessonPaths.map(
    (keystageSubjectUnitLessonPath) => {
      return {
        loc: new URL(keystageSubjectUnitLessonPath).href,
        lastmod: new Date().toISOString(),
      };
    }
  );

  // Join the fields and send the response.
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
