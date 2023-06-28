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

  // programmes/art-primary-ks1/units
  interface ProgrammeSlug {
    programmeSlug: string;
  }
  const programmeSlugs: ProgrammeSlug[] = [];
  for await (const keyStageSlug of keyStageSlugs) {
    const subjectResults = await curriculumApi.subjectListing({
      keyStageSlug,
    });
    subjectResults.subjects.forEach((subject) => {
      const programmeSlug: ProgrammeSlug = {
        programmeSlug: subject.programmeSlug,
      };
      programmeSlugs.push(programmeSlug);
    });
  }

  const programmePaths = flatten(
    programmeSlugs.map((programmeSlug) => {
      const pagePath = path.join(
        sitemapBaseUrl,
        basePath,
        "programmes",
        programmeSlug.programmeSlug
      );
      return [pagePath, path.join(pagePath, "units")];
    })
  );
  const programmeFields = programmePaths.map((programmePath) => {
    return {
      loc: new URL(programmePath).href,
      lastmod: new Date().toISOString(),
    };
  });

  // programmes/[programmeSlug]/units/[unitSlug]/lessons
  interface UnitSlug {
    programmeSlug: string;
    unitSlug: string;
  }
  const unitSlugs: UnitSlug[] = [];
  for await (const singleProgrammeSlug of programmeSlugs) {
    const { programmeSlug } = singleProgrammeSlug;
    const unitResults = await curriculumApi.unitListing({
      programmeSlug,
    });
    unitResults.units.forEach((unit) => {
      const unitSlug: UnitSlug = {
        programmeSlug: unit.programmeSlug,
        unitSlug: unit.slug,
      };
      unitSlugs.push(unitSlug);
    });
  }
  const unitPaths = unitSlugs.map((unitSlug) =>
    path.join(
      sitemapBaseUrl,
      basePath,
      "programmes",
      unitSlug.programmeSlug,
      "units",
      unitSlug.unitSlug,
      "lessons"
    )
  );
  const unitFields = unitPaths.map((unitPath) => {
    return {
      loc: new URL(unitPath).href,
      lastmod: new Date().toISOString(),
    };
  });

  // // DEBUG
  // console.log({ keystageSubjectUnitFields });
  // context.res.end("done!");
  // const result = { props: {} };
  // return result;

  // key-stages/[keyStageSlug]/subject/[subjectSlug]/units/[unitSlug]/lessons/[lessonSlug]
  // key-stages/[keyStageSlug]/subject/[subjectSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads

  // programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]
  interface LessonSlug {
    programmeSlug: string;
    unitSlug: string;
    lessonSlug: string;
  }
  const lessonSlugs: LessonSlug[] = [];
  for await (const unitSlugItem of unitSlugs) {
    const { programmeSlug, unitSlug } = unitSlugItem;
    const lessonResults = await curriculumApi.lessonListing({
      programmeSlug,
      unitSlug,
    });
    lessonResults.lessons.forEach((lesson) => {
      const lessonSlug: LessonSlug = {
        programmeSlug: lessonResults.programmeSlug,
        unitSlug: lessonResults.unitSlug,
        lessonSlug: lesson.lessonSlug,
      };
      lessonSlugs.push(lessonSlug);
    });
  }
  const lessonPaths = flatten(
    lessonSlugs.map((lessonSlug) => {
      const lessonPath = path.join(
        sitemapBaseUrl,
        basePath,
        "programmes",
        lessonSlug.programmeSlug,
        "units",
        lessonSlug.unitSlug,
        "lessons",
        lessonSlug.lessonSlug
      );
      return [lessonPath, path.join(lessonPath, "downloads")];
    })
  );
  const lessonFields = lessonPaths.map((lessonPath) => {
    return {
      loc: new URL(lessonPath).href,
      lastmod: new Date().toISOString(),
    };
  });

  // Join the fields and send the response.
  const fields = keystageFields.concat(
    programmeFields,
    unitFields,
    lessonFields
  );
  return getServerSideSitemap(context, fields);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Sitemap() {}
