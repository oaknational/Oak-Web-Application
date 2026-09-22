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
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import {
  getExamboardTitleFromSlug,
  getKeyStageTitle,
  getTierTitleFromSlug,
} from "@/utils/curriculum/formatting";
import { getPathwayTitleFromSlug } from "@/utils/curriculum/pathways";

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
    yearGroupTitle,
    unitTitle,
    unitSlug,
    programmeSlug,
    subjectSlug,
    tierSlug,
    examBoardSlug,
    keyStageSlug,
    pathwaySlug,
    yearGroupSlug,
  } = data;

  const { lessonAccessed, unitAccessed, programmeAccessed } =
    useTeacherBrowseAnalytics((store) => store.track);

  let optionalPfs = "";
  if (tierTitle) {
    optionalPfs += `, ${tierTitle}`;
  }
  if (examBoardTitle) {
    optionalPfs += `, ${examBoardTitle}`;
  }

  const keyStageTitle = getKeyStageTitle(keyStageSlug);
  const tierName = getTierTitleFromSlug(tierSlug);
  const pathway = getPathwayTitleFromSlug(pathwaySlug);
  const examBoard = getExamboardTitleFromSlug(examBoardSlug);

  const firstBreadcrumb = {
    text: `${subjectTitle}, ${phaseTitle}, ${keyStageTitle}, ${yearGroupTitle}${optionalPfs}`,
    href: resolveOakHref({
      page: "teacher-programme",
      subjectPhaseSlug,
      tab: "units",
    }),
    onClick: () =>
      programmeAccessed({
        componentType: "breadcrumb",
        activeFilters: {},
        navigationType: "broaden",
      }),
  };

  const trackUnitAccessed = () =>
    unitAccessed({
      componentType: "breadcrumb",
      navigationType: "broaden",
      unitName: unitTitle,
      unitSlug: unitSlug,
      subjectTitle: subjectTitle,
      subjectSlug: subjectSlug,
      yearGroupName: yearGroupTitle ?? "",
      yearGroupSlug: yearGroupSlug ?? "",
      keyStageSlug: keyStageSlug,
      keyStageTitle,
      tierName,
      pathway,
      examBoard,
    });

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
        onClick: trackUnitAccessed,
      },
      {
        text: data.lessonTitle,
        href: resolveOakHref({
          page: "lesson-overview",
          unitSlug: unitSlug,
          programmeSlug,
          lessonSlug: data.lessonSlug,
        }),
        onClick: () =>
          lessonAccessed({
            componentType: "breadcrumb",
            lessonName: data.lessonTitle,
            lessonSlug: data.lessonSlug,
            lessonReleaseCohort: "2023-2026",
            lessonReleaseDate: data.lessonReleaseDate ?? "unknown",
            unitName: unitTitle,
            unitSlug: unitSlug,
            keyStageSlug,
            keyStageTitle,
            yearGroupName: yearGroupTitle ?? "",
            yearGroupSlug: yearGroupSlug ?? "",
            tierName,
            examBoard,
            pathway,
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
        onClick: trackUnitAccessed,
      },
      {
        text: data.lessonTitle,
        href: resolveOakHref({
          page: "lesson-overview",
          unitSlug: unitSlug,
          programmeSlug,
          lessonSlug: data.lessonSlug,
        }),
        onClick: () =>
          lessonAccessed({
            componentType: "breadcrumb",
            lessonName: data.lessonTitle,
            lessonSlug: data.lessonSlug,
            lessonReleaseCohort: "2023-2026",
            lessonReleaseDate: data.lessonReleaseDate ?? "unknown",
            unitName: unitTitle,
            unitSlug: unitSlug,
            keyStageSlug,
            keyStageTitle,
            yearGroupName: yearGroupTitle ?? "",
            yearGroupSlug: yearGroupSlug ?? "",
            tierName,
            examBoard,
            pathway,
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
        onClick: trackUnitAccessed,
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
