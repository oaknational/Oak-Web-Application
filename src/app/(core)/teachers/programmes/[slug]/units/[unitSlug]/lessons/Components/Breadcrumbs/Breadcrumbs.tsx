"use client";

import {
  OakBreadcrumbs,
  OakBreadcrumbsProps,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import type { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import type { LessonMediaClipsData } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import type { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";
import type { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import type { TeachersUnitOverviewData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

type BreadcrumbsProps =
  | {
      mode: "lesson";
      data: TeachersLessonOverviewPageData;
      subjectPhaseSlug: string;
    }
  | {
      mode: "unit";
      data: TeachersUnitOverviewData;
      subjectPhaseSlug: string;
    }
  | {
      mode: "downloads";
      data: LessonDownloadsPageData;
      subjectPhaseSlug: string;
    }
  | {
      mode: "share";
      data: LessonShareData;
      subjectPhaseSlug: string;
    }
  | {
      mode: "media";
      data: LessonMediaClipsData;
      subjectPhaseSlug: string;
    };

export const Breadcrumbs = ({
  data,
  subjectPhaseSlug,
  mode,
}: BreadcrumbsProps) => {
  const {
    tierTitle,
    examBoardTitle,
    subjectTitle,
    phaseTitle,
    keyStageTitle,
    yearGroupTitle,
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
    text: `${subjectTitle}, ${phaseTitle}, ${keyStageTitle}, ${yearGroupTitle}${optionalPfs}`,
    href: resolveOakHref({
      page: "teacher-programme",
      subjectPhaseSlug,
      tab: "units",
    }),
  };

  let breadcrumbs: OakBreadcrumbsProps["breadcrumbs"];
  if (mode === "downloads" || mode === "share") {
    breadcrumbs = [
      firstBreadcrumb,
      {
        text: unitTitle,
        href: resolveOakHref({
          page: "unit-overview",
          unitSlug: unitSlug,
          programmeSlug,
        }),
      },
      {
        text: data.lessonTitle,
        href: resolveOakHref({
          page: "lesson-overview",
          unitSlug: unitSlug,
          programmeSlug,
          lessonSlug: data.lessonSlug,
        }),
      },
      {
        text: mode === "downloads" ? "Downloads" : "Share",
      },
    ];
  } else if (mode === "media") {
    breadcrumbs = [
      firstBreadcrumb,
      {
        text: unitTitle,
        href: resolveOakHref({
          page: "unit-overview",
          unitSlug: unitSlug,
          programmeSlug,
        }),
      },
      {
        text: data.lessonTitle,
        href: resolveOakHref({
          page: "lesson-overview",
          unitSlug: unitSlug,
          programmeSlug,
          lessonSlug: data.lessonSlug,
        }),
      },
      {
        text: "Media",
      },
    ];
  } else if (mode === "lesson") {
    breadcrumbs = [
      firstBreadcrumb,
      {
        text: unitTitle,
        href: resolveOakHref({
          page: "unit-overview",
          unitSlug: unitSlug,
          programmeSlug,
        }),
      },
      {
        text: data.lessonTitle,
      },
    ];
  } else {
    breadcrumbs = [
      firstBreadcrumb,
      {
        text: `Unit ${data.unitIndex} of ${data.unitCount}`,
      },
    ];
  }

  return <OakBreadcrumbs breadcrumbs={breadcrumbs} />;
};
