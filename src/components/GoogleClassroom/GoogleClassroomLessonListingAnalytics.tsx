"use client";

import React from "react";
import { LessonListingView } from "@oaknational/google-classroom-addon/ui";
import type {
  ProgrammeFields,
  UnitData,
} from "@oaknational/google-classroom-addon/ui";

import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  LessonReleaseCohort,
  type LessonReleaseCohortValueType,
  type TierNameValueType,
  type ExamBoardValueType,
  type PathwayValueType,
} from "@/browser-lib/avo/Avo";
import type { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";

type Props = {
  browseData: LessonListingBrowseData;
  programmeSlug: string;
  unitData?: UnitData;
  programmeFields?: ProgrammeFields;
  programmeUrlTemplate: string;
  pupilLessonUrlTemplate: string;
  headerLeftSlot?: React.ReactElement;
};

function getLessonReleaseCohort(
  isLegacy: boolean,
): LessonReleaseCohortValueType {
  return isLegacy
    ? LessonReleaseCohort["2020_2023"]
    : LessonReleaseCohort["2023_2026"];
}

export function GoogleClassroomLessonListingAnalytics({
  browseData,
  programmeSlug,
  unitData,
  programmeFields,
  programmeUrlTemplate,
  pupilLessonUrlTemplate,
  headerLeftSlot,
}: Props) {
  const { track } = useAnalytics();

  const lessonLookup = React.useMemo(
    () => new Map(browseData.map((item) => [item.lessonSlug, item])),
    [browseData],
  );

  return (
    <LessonListingView
      browseData={browseData as never}
      programmeSlug={programmeSlug}
      unitData={unitData}
      programmeFields={programmeFields}
      programmeUrlTemplate={programmeUrlTemplate}
      pupilLessonUrlTemplate={pupilLessonUrlTemplate}
      headerLeftSlot={headerLeftSlot}
      onLessonSelected={(lessonSlug) => {
        const lesson = lessonLookup.get(lessonSlug);
        if (!lesson) return;
        track.classroomLessonSelected({
          lessonName: lesson.lessonData.title,
          lessonSlug: lesson.lessonSlug,
          lessonReleaseCohort: getLessonReleaseCohort(lesson.isLegacy),
          lessonReleaseDate:
            lesson.lessonData.lessonReleaseDate ?? "unreleased",
          unitName: unitData?.title ?? "",
          unitSlug: lesson.unitSlug,
          tierName: (programmeFields?.tier ?? null) as TierNameValueType,
          examBoard: (programmeFields?.examboard ?? null) as ExamBoardValueType,
          pathway: (programmeFields?.optionality ?? null) as PathwayValueType,
          googleLoginHint: "",
        });
      }}
      onLessonPreviewed={(lessonSlug) => {
        const lesson = lessonLookup.get(lessonSlug);
        if (!lesson) return;
        track.classroomLessonPreviewed({
          lessonName: lesson.lessonData.title,
          lessonSlug: lesson.lessonSlug,
          lessonReleaseCohort: getLessonReleaseCohort(lesson.isLegacy),
          lessonReleaseDate:
            lesson.lessonData.lessonReleaseDate ?? "unreleased",
          unitName: unitData?.title ?? "",
          unitSlug: lesson.unitSlug,
          googleLoginHint: "",
        });
      }}
    />
  );
}
