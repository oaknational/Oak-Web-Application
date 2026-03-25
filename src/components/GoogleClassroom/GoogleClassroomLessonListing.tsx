"use client";

import React from "react";
import { LessonListingView } from "@oaknational/google-classroom-addon/ui";
import type {
  ProgrammeFields,
  UnitData,
} from "@oaknational/google-classroom-addon/ui";

import { useGoogleClassroomAnalytics } from "@/components/GoogleClassroom/useGoogleClassroomAnalytics";
import type { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";

type Props = Readonly<{
  browseData: LessonListingBrowseData;
  programmeSlug: string;
  unitData?: UnitData;
  programmeFields?: ProgrammeFields;
  programmeUrlTemplate: string;
  pupilLessonUrlTemplate: string;
  headerLeftSlot?: React.ReactElement;
}>;

export function GoogleClassroomLessonListing({
  browseData,
  programmeSlug,
  unitData,
  programmeFields,
  programmeUrlTemplate,
  pupilLessonUrlTemplate,
  headerLeftSlot,
}: Props) {
  const trackLessonSelected = useGoogleClassroomAnalytics(
    (state) => state.trackLessonSelected,
  );
  const trackLessonPreviewed = useGoogleClassroomAnalytics(
    (state) => state.trackLessonPreviewed,
  );

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
        trackLessonSelected({
          lesson,
          unitData,
          programmeFields,
        });
      }}
      onLessonPreviewed={(lessonSlug) => {
        const lesson = lessonLookup.get(lessonSlug);
        if (!lesson) return;
        trackLessonPreviewed({
          lesson,
          unitData,
          programmeFields,
        });
      }}
    />
  );
}
