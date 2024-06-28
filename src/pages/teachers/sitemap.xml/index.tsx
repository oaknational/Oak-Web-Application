import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  generateURLFields,
  splitURLsInHalf,
} from "@/utils/generateSitemapUrlFields";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { resolveOakHref } from "@/common-lib/urls";

/**
 * Get all sitemap urls, construct sitemap entries for them.
 */

export async function buildAllUrlFields({ firstHalf = true }) {
  const teachersSiteMap = await curriculumApi2023.teachersSitemap();
  const {
    programmes,
    units,
    lessons,
    keyStages,
    specialistProgrammes,
    specialistUnits,
    specialistLessons,
  } = teachersSiteMap;

  const baseUrl = getBrowserConfig("clientAppBaseUrl");

  const specialistSubjectsURLs = `${baseUrl}${resolveOakHref({
    page: "specialist-subject-index",
  })}`;

  const specialistProgrammesURLs = specialistProgrammes.map(
    (programme) =>
      `${baseUrl}${resolveOakHref({
        page: "specialist-unit-index",
        programmeSlug: programme.programmeSlug,
      })}`,
  );

  const specialistUnitsURLs = specialistUnits.map(
    (unit) =>
      `${baseUrl}${resolveOakHref({
        page: "specialist-lesson-index",
        programmeSlug: unit.programmeSlug,
        unitSlug: unit.unitSlug,
      })}
          `,
  );

  const specialistLessonsURLs = specialistLessons.map(
    (lesson) =>
      `${baseUrl}${resolveOakHref({
        page: "specialist-lesson-overview",
        programmeSlug: lesson.programmeSlug,
        unitSlug: lesson.unitSlug,
        lessonSlug: lesson.lessonSlug,
      })}`,
  );

  console.log("specialistProgrammesURLs", specialistProgrammesURLs);
  const keyStageSubjectsURLs = keyStages.map(
    (keyStageSlug) =>
      `${baseUrl}${resolveOakHref({
        page: "subject-index",
        keyStageSlug,
      })}`,
  );

  const programmesURLs = programmes.map(
    (programme) =>
      `${baseUrl}${resolveOakHref({
        page: "unit-index",
        programmeSlug: programme.programmeSlug,
      })}`,
  );
  const unitsURLs = units.map(
    (unit) =>
      `${baseUrl}${resolveOakHref({
        page: "lesson-index",
        programmeSlug: unit.programmeSlug,
        unitSlug: unit.unitSlug,
      })}
          `,
  );
  const lessonsURLs = lessons.map(
    (lesson) =>
      `${baseUrl}${resolveOakHref({
        page: "lesson-overview",
        programmeSlug: lesson.programmeSlug,
        unitSlug: lesson.unitSlug,
        lessonSlug: lesson.lessonSlug,
      })}`,
  );

  const sitemapData = splitURLsInHalf(
    [
      ...keyStageSubjectsURLs,
      ...programmesURLs,
      ...unitsURLs,
      ...lessonsURLs,
      specialistSubjectsURLs,
      ...specialistProgrammesURLs,
      ...specialistUnitsURLs,
      ...specialistLessonsURLs,
    ].map((url) => ({
      urls: url.trim(),
    })),
    firstHalf,
  );

  return generateURLFields(sitemapData);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const fields = await buildAllUrlFields({ firstHalf: true });
  return getServerSideSitemap(context, fields);
};

export default function Sitemap() {}
