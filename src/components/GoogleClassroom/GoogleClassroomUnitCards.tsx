"use client";

import { UnitCards } from "@oaknational/google-classroom-addon/ui";
import type { Unit } from "@oaknational/google-classroom-addon/ui";

import { useGoogleClassroomAnalytics } from "@/components/GoogleClassroom/useGoogleClassroomAnalytics";

type Props = Readonly<{
  units: Unit[][];
  programmeSlug: string;
  unitsLessonListUrlTemplate: string;
}>;

export function GoogleClassroomUnitCards({
  units,
  programmeSlug,
  unitsLessonListUrlTemplate,
}: Props) {
  const trackUnitSelected = useGoogleClassroomAnalytics(
    (state) => state.trackUnitSelected,
  );
  return (
    <UnitCards
      units={units}
      programmeSlug={programmeSlug}
      unitsLessonListUrlTemplate={unitsLessonListUrlTemplate}
      onUnitSelected={trackUnitSelected}
    />
  );
}
