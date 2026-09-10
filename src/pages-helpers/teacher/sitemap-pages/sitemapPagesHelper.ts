/**
 * Builds teacher sitemap entries from `teachersSitemap` browse data and
 * `curriculumPhaseOptions`.
 *
 * ## URL types emitted
 *
 * - **Base programme pages** — `/units` for every subject phase (and KS4 exam
 *   board/pathway slug where applicable); `/curriculum-explainer` for curriculum
 *   subjects only (omitted for non-curriculum subjects such as rule-of-law).
 * - **Filter variant programme pages** — `?years=` and `?keystages=` on the
 *   units tab only (no variant URLs for curriculum-explainer).
 * - **Unit and lesson overview pages** — from browse-data unit/lesson slugs.
 *
 * ## Filter variant rules
 *
 * Variant URLs mirror programme-page filter visibility. Implementation detail
 * lives in `groupProgrammeFilterUnits.ts`.
 *
 * - **Year variants** — emitted only when `yearOptions.length > 1`. Respects
 *   `programme_field_overrides.year_slug` (e.g. units grouped as `all-years`).
 * - **Keystage variants** — emitted only when `keystages.length > 1` and
 *   `yearOptions.length > 1`. With a single year bucket, keystage query params
 *   do not filter content on the page, so no keystage variants are indexed.
 */
import type { MetadataRoute } from "next";

import { resolveOakHref } from "@/common-lib/urls";
import { type CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023";
import { TeachersSitemapBrowseData } from "@/node-lib/curriculum-api-2023/queries/teachersSitemap/teacherSitemap.schema";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  getProgrammeFilterVariants,
  mapKs4OptionSlugs,
} from "@/pages-helpers/teacher/sitemap-pages/groupProgrammeFilterUnits";

// SITEMAP_BASE_URL is written to the .env file during next.config.ts execution.
function getSitemapBaseUrl(): string {
  const sitemapBaseUrl = process.env.SITEMAP_BASE_URL;

  if (!sitemapBaseUrl || sitemapBaseUrl === "undefined") {
    throw new TypeError(
      "process.env.SITEMAP_BASE_URL not defined. See code in next.config.ts",
    );
  }

  return sitemapBaseUrl;
}

/**
 * Builds the URLs for the programme pages
 */
function buildProgrammeUrls(subjects: CurriculumPhaseOptions): string[] {
  const url = new URL(getSitemapBaseUrl());

  return subjects.flatMap((subject) =>
    subject.phases.flatMap((phase) => {
      const programmePages = mapKs4OptionSlugs(subject, phase);

      return programmePages.flatMap(({ subjectPhaseSlug }) => {
        url.pathname = resolveOakHref({
          page: "teacher-programme",
          subjectPhaseSlug,
          tab: "units",
        });
        const unitUrl = url.toString();

        // If the subject is non-curriculum there is no curriculum explainer
        if (subject.non_curriculum) {
          return [unitUrl];
        }

        url.pathname = resolveOakHref({
          page: "teacher-programme",
          subjectPhaseSlug,
          tab: "curriculum-explainer",
        });

        const curriculumExplainerUrl = url.toString();

        return [unitUrl, curriculumExplainerUrl];
      });
    }),
  );
}

function buildProgrammeFilterVariantUrls(
  subjects: CurriculumPhaseOptions,
  programmeFilterUnits: TeachersSitemapBrowseData["programmeFilterUnits"],
): string[] {
  const baseUrl = getSitemapBaseUrl();
  const variants = getProgrammeFilterVariants(subjects, programmeFilterUnits);

  return variants.flatMap(({ subjectPhaseSlug, keystages, years }) => {
    const keystageUrls = keystages.map((keystage) =>
      new URL(
        resolveOakHref({
          page: "teacher-programme",
          subjectPhaseSlug,
          tab: "units",
          query: { keystages: keystage },
        }),
        baseUrl,
      ).toString(),
    );

    const yearUrls = years.map((year) =>
      new URL(
        resolveOakHref({
          page: "teacher-programme",
          subjectPhaseSlug,
          tab: "units",
          query: { years: year },
        }),
        baseUrl,
      ).toString(),
    );

    return [...keystageUrls, ...yearUrls];
  });
}

function buildAllUrls(
  data: TeachersSitemapBrowseData,
  subjects: CurriculumPhaseOptions,
): string[] {
  const { units, lessons, programmeFilterUnits } = data;
  const validSubjects = filterValidCurriculumPhaseOptions(subjects);
  const programmeUrls = buildProgrammeUrls(validSubjects);
  const programmeFilterVariantUrls = buildProgrammeFilterVariantUrls(
    validSubjects,
    programmeFilterUnits,
  );
  const url = new URL(getSitemapBaseUrl());

  // Build the URLs for the unit pages
  const unitUrls = units.map((unit) => {
    url.pathname = resolveOakHref({
      page: "unit-overview",
      programmeSlug: unit.programmeSlug,
      unitSlug: unit.unitSlug,
    });

    return url.toString();
  });

  // Build the URLs for the lesson pages
  const lessonUrls = lessons.map((lesson) => {
    url.pathname = resolveOakHref({
      page: "lesson-overview",
      programmeSlug: lesson.programmeSlug,
      unitSlug: lesson.unitSlug,
      lessonSlug: lesson.lessonSlug,
    });

    return url.toString();
  });

  return [
    ...programmeUrls,
    ...programmeFilterVariantUrls,
    ...unitUrls,
    ...lessonUrls,
  ];
}

export function buildTeachersSitemapEntries(
  data: TeachersSitemapBrowseData,
  subjects: CurriculumPhaseOptions,
): MetadataRoute.Sitemap {
  const allUrls = buildAllUrls(data, subjects);
  const lastModified = new Date();

  return allUrls.map((url) => ({
    url,
    lastModified,
  }));
}
