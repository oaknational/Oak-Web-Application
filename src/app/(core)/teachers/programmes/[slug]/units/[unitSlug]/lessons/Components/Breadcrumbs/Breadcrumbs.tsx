"use client";

import {
  OakBreadcrumbs,
  OakBreadcrumbsProps,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { useProgrammeState } from "@/context/TeacherBrowseAnalytics/hooks/useProgrammeState";
import { LessonState } from "@/context/TeacherBrowseAnalytics/teacherBrowseAnalytics.types";

type BreadcrumbsProps = { subjectPhaseSlug: string } & (
  | {
      mode: "lesson" | "downloads" | "share" | "media";
    }
  | { mode: "unit"; data: { unitIndex: number; unitCount: number } }
);

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { subjectPhaseSlug, mode } = props;
  const { lessonAccessed, unitAccessed, programmeAccessed } =
    useTeacherBrowseAnalytics((store) => store.track);
  const { lessonState, unitState } = useProgrammeState();

  if (!unitState) {
    return null;
  }

  const {
    subjectTitle,
    phaseTitle,
    keyStageTitle,
    yearGroupTitle,
    tierTitle,
    examBoardTitle,
  } = unitState;

  let optionalPfs = "";
  if (tierTitle) {
    optionalPfs += `, ${tierTitle}`;
  }
  if (examBoardTitle) {
    optionalPfs += `, ${examBoardTitle}`;
  }

  const trackUnitAccessed = () => {
    unitAccessed({
      componentType: "breadcrumb",
      navigationType: "broaden",
    });
  };

  const trackLessonAccessed = (lesson: LessonState) => {
    lessonAccessed({
      componentType: "breadcrumb",
      lessonName: lesson.title,
      lessonSlug: lesson.slug,
      lessonReleaseCohort: "2023-2026",
      lessonReleaseDate: lesson.lessonReleaseDate,
    });
  };

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

  const breadcrumbs: OakBreadcrumbsProps["breadcrumbs"] = [firstBreadcrumb];

  if (mode === "unit") {
    // Last breadcrumb for the unit overview page
    breadcrumbs.push({
      text: `Unit ${props.data.unitIndex} of ${props.data.unitCount}`,
    });
  } else if (lessonState) {
    // Link to the unit overview page
    breadcrumbs.push({
      text: lessonState.unit.title,
      href: resolveOakHref({
        page: "unit-overview",
        unitSlug: lessonState.unit.slug,
        programmeSlug: lessonState.programmeSlug,
      }),
      onClick: trackUnitAccessed,
    });

    if (mode === "lesson") {
      // Last breadcrumb for the lesson overview page
      breadcrumbs.push({
        text: lessonState.lesson.title,
      });
    } else {
      // Link to the lesson overview page and add a final breadcrumb for either download, media or share page

      breadcrumbs.push(
        {
          text: lessonState.lesson.title,
          href: resolveOakHref({
            page: "lesson-overview",
            unitSlug: lessonState.unit.slug,
            programmeSlug: lessonState.programmeSlug,
            lessonSlug: lessonState.lesson.slug,
          }),
          onClick: trackLessonAccessed,
        },
        {
          text: `${mode[0]?.toUpperCase()}${mode.slice(1)}`,
        },
      );
    }
  }

  return <OakBreadcrumbs breadcrumbs={breadcrumbs} />;
};
