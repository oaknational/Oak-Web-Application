import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { resolveOakHref } from "@/common-lib/urls";
import { TeachersSitemapBrowseData } from "@/node-lib/curriculum-api-2023/queries/teachersSitemap/teacherSitemap.schema";
import {
  generateURLFields,
  splitURLsInHalf,
} from "@/utils/generateSitemapUrlFields";

export async function buildAllUrlFields({
  firstHalf = true,
  teachersSitemapData,
}: {
  firstHalf: boolean;
  teachersSitemapData: TeachersSitemapBrowseData;
}) {
  const { programmes, units, lessons, keyStages } = teachersSitemapData;

  const baseUrl = getBrowserConfig("clientAppBaseUrl");

  const keyStageSubjectsURLs = keyStages.map(
    (keyStage) =>
      `${baseUrl}${resolveOakHref({
        page: "subject-index",
        keyStageSlug: keyStage.slug,
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
    ].map((url) => ({
      urls: url.trim(),
    })),
    firstHalf,
  );

  return generateURLFields(sitemapData);
}
