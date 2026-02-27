"use client";

import { UnitCards } from "@oaknational/google-classroom-addon/ui";
import type { Unit } from "@oaknational/google-classroom-addon/ui";

import useAnalytics from "@/context/Analytics/useAnalytics";

type Props = {
  units: Unit[][];
  programmeSlug: string;
  unitsLessonListUrlTemplate: string;
};

export function GoogleClassroomUnitCardsAnalytics({
  units,
  programmeSlug,
  unitsLessonListUrlTemplate,
}: Props) {
  const { track } = useAnalytics();

  return (
    <UnitCards
      units={units}
      programmeSlug={programmeSlug}
      unitsLessonListUrlTemplate={unitsLessonListUrlTemplate}
      onUnitSelected={(unit) => {
        track.browseRefined({
          platform: "google-classroom",
          product: "teacher lesson resources",
          analyticsUseCase: "Teacher",
          componentType: "unit_card",
          filterType: "Unit filter",
          filterValue: unit.unitSlug,
          eventVersion: "2.0.0",
          engagementIntent: "refine",
          activeFilters: {},
        });
      }}
    />
  );
}
