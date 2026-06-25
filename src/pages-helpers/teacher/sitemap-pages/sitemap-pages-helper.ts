import type { MetadataRoute } from "next";

import { getSubjectPhaseSlug } from "@/components/TeacherComponents/helpers/getSubjectPhaseSlug";
import { resolveOakHref } from "@/common-lib/urls";
import { type CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023";
import { TeachersSitemapBrowseData } from "@/node-lib/curriculum-api-2023/queries/teachersSitemap/teacherSitemap.schema";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { isExamboardSlug } from "@/pages-helpers/pupil/options-pages/options-pages-helpers";

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

function mapExamboardSlugs(
  subject: CurriculumPhaseOptions[number],
  phase: CurriculumPhaseOptions[number]["phases"][number],
): string[] {
  // Primary phase has no exam board slugs
  if (phase.slug === "primary") {
    return [
      getSubjectPhaseSlug({
        subject: subject.slug,
        phaseSlug: phase.slug,
      }),
    ];
  }

  // Filter out exam board slugs that are not valid
  const examBoardSlugs =
    subject.ks4_options?.filter((option) => isExamboardSlug(option.slug)) ?? [];

  // If no valid exam board slugs, return the subject phase slug
  if (examBoardSlugs.length === 0) {
    return [
      getSubjectPhaseSlug({
        subject: subject.slug,
        phaseSlug: phase.slug,
      }),
    ];
  }

  // Return the subject phase slug with the valid exam board slug
  return examBoardSlugs.map((ks4Option) =>
    getSubjectPhaseSlug({
      subject: subject.slug,
      phaseSlug: phase.slug,
      examBoardSlug: ks4Option.slug,
    }),
  );
}

/**
 * Builds the URLs for the programme pages
 */
function buildProgrammeUrls(subjects: CurriculumPhaseOptions): string[] {
  const url = new URL(getSitemapBaseUrl());

  return subjects.flatMap((subject) =>
    subject.phases.flatMap((phase) => {
      const subjectPhaseSlugs = mapExamboardSlugs(subject, phase);

      return subjectPhaseSlugs.flatMap((subjectPhaseSlug) => {
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

function buildAllUrls(
  data: TeachersSitemapBrowseData,
  subjects: CurriculumPhaseOptions,
): string[] {
  const { units, lessons } = data;
  const programmeUrls = buildProgrammeUrls(
    filterValidCurriculumPhaseOptions(subjects),
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

  return [...programmeUrls, ...unitUrls, ...lessonUrls];
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
