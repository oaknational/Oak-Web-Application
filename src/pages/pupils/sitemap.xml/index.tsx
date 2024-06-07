import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  generateURLFields,
  splitURLsInHalf,
} from "@/utils/generateSitemapUrlFields";
import { resolveOakHref } from "@/common-lib/urls";

/**
 * Get all sitemap url construct sitemap entries for them.
 */

const baseUrl = "https://www.thenational.academy";

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pupilsSiteMap = await curriculumApi2023.pupilsSitemap();
  const { programmes, units, lessons } = pupilsSiteMap;

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

  const sitemapData = splitURLsInHalf(
    [...yearUrls, ...programmesURLs, ...unitsURLs, ...lessonsURLs].map(
      (url) => ({
        urls: url,
      }),
    ),
    true,
  );

  const fields = generateURLFields(sitemapData);

  return getServerSideSitemap(context, fields);
};

export default function Sitemap() {}
