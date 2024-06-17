import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  generateURLFields,
  splitURLsInHalf,
} from "@/utils/generateSitemapUrlFields";
import { resolveOakHref } from "@/common-lib/urls";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const yearSlugs = [
  "year-1",
  "year-2",
  "year-3",
  "year-4",
  "year-5",
  "year-6",
  "year-7",
  "year-8",
  "year-9",
  "year-10",
  "year-11",
];

export async function buildAllUrlFields({ firstHalf = true }) {
  const pupilsSiteMap = await curriculumApi2023.pupilsSitemap();
  const { programmes, units, lessons } = pupilsSiteMap;

  const baseUrl = getBrowserConfig("clientAppBaseUrl");

  const yearUrls = yearSlugs.map(
    (yearSlug) =>
      `${baseUrl}${resolveOakHref({ page: "pupil-subject-index", yearSlug })}`,
  );

  const programmesURLs = programmes.map(
    (programme) =>
      `${baseUrl}${resolveOakHref({
        page: "pupil-unit-index",
        programmeSlug: programme.programmeSlug,
      })}`,
  );
  const unitsURLs = units.map(
    (unit) =>
      `${baseUrl}${resolveOakHref({
        page: "pupil-lesson-index",
        programmeSlug: unit.programmeSlug,
        unitSlug: unit.unitSlug,
      })}
          `,
  );
  const lessonsURLs = lessons.map(
    (lesson) =>
      `${baseUrl}${resolveOakHref({
        page: "pupil-lesson",
        programmeSlug: lesson.programmeSlug,
        unitSlug: lesson.unitSlug,
        lessonSlug: lesson.lessonSlug,
      })}`,
  );

  const additionalUrls = [];
  additionalUrls.push(
    `${baseUrl}${resolveOakHref({
      page: "pupil-year-index",
    })}`,
  );

  const sitemapData = splitURLsInHalf(
    [
      ...additionalUrls,
      ...yearUrls,
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
