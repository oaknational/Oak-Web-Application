"use client";

import {
  OakBreadcrumbs,
  OakBreadcrumbsProps,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import { TeachersUnitOverviewData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

export const Breadcrumbs = ({
  data,
  subjectPhaseSlug,
}: {
  data: TeachersLessonOverviewPageData | TeachersUnitOverviewData;
  subjectPhaseSlug: string;
}) => {
  const {
    tierTitle,
    examBoardTitle,
    subjectTitle,
    phaseTitle,
    keyStageTitle,
    yearTitle,
    unitTitle,
    unitSlug,
    programmeSlug,
  } = data;

  let optionalPfs = "";
  if (tierTitle) {
    optionalPfs += `, ${tierTitle}`;
  }
  if (examBoardTitle) {
    optionalPfs += `, ${examBoardTitle}`;
  }

  const firstBreadcrumb = {
    text: `${subjectTitle}, ${phaseTitle}, ${keyStageTitle}, ${yearTitle}${optionalPfs}`,
    href: resolveOakHref({
      page: "teacher-programme",
      subjectPhaseSlug,
      tab: "units",
    }),
  };

  let breadcrumbs;

  const isLessonData = (
    u: TeachersLessonOverviewPageData | TeachersUnitOverviewData,
  ): u is TeachersLessonOverviewPageData => {
    return !!(u as TeachersLessonOverviewPageData).lessonSlug;
  };

  if (isLessonData(data)) {
    breadcrumbs = [
      firstBreadcrumb,
      {
        text: unitTitle,
        href: resolveOakHref({
          page: "unit-page",
          unitSlug: unitSlug,
          subjectPhaseSlug: programmeSlug,
        }),
      },
      {
        text: data.lessonTitle,
      },
    ] satisfies OakBreadcrumbsProps["breadcrumbs"];
  } else {
    breadcrumbs = [
      firstBreadcrumb,
      {
        text: `Unit ${data.unitIndex} of ${data.unitCount}`,
      },
    ] satisfies OakBreadcrumbsProps["breadcrumbs"];
  }

  return <OakBreadcrumbs breadcrumbs={breadcrumbs} />;
};
