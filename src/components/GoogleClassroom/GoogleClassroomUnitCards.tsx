"use client";

import {
  UnitCards,
  useGoogleClassroomAddonStore,
} from "@oaknational/google-classroom-addon/ui";
import type { Unit } from "@oaknational/google-classroom-addon/ui";

import { getClientEnvironment } from "./getClientEnvironment";

import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  AnalyticsUseCase,
  ComponentType,
  EngagementIntent,
  EventVersion,
  FilterType,
  Platform,
  Product,
} from "@/browser-lib/avo/Avo";

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
  const { track } = useAnalytics();
  const googleLoginHint = useGoogleClassroomAddonStore(
    (state) => state.googleLoginHint,
  );
  return (
    <UnitCards
      units={units}
      programmeSlug={programmeSlug}
      unitsLessonListUrlTemplate={unitsLessonListUrlTemplate}
      onUnitSelected={(unit) => {
        track.browseRefined({
          platform: Platform.GOOGLE_CLASSROOM,
          product: Product.TEACHER_LESSON_RESOURCES,
          analyticsUseCase: AnalyticsUseCase.TEACHER,
          componentType: ComponentType.UNIT_CARD,
          filterType: FilterType.UNIT_FILTER,
          filterValue: unit.unitSlug,
          eventVersion: EventVersion["2_0_0"],
          engagementIntent: EngagementIntent.REFINE,
          activeFilters: {},
          googleLoginHint,
          clientEnvironment: getClientEnvironment(),
        });
      }}
    />
  );
}
