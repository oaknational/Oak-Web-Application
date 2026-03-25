"use client";

import {
  SubjectsPageView,
  useGoogleClassroomAddonStore,
} from "@oaknational/google-classroom-addon/ui";
import type { Subject } from "@oaknational/google-classroom-addon/ui";

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
  subjects: Subject[];
  unitsUrlTemplate: string;
  optionsUrlTemplate: string;
}>;

export function GoogleClassroomSubjects({
  subjects,
  unitsUrlTemplate,
  optionsUrlTemplate,
}: Props) {
  const { track } = useAnalytics();
  const googleLoginHint = useGoogleClassroomAddonStore(
    (state) => state.googleLoginHint,
  );

  return (
    <SubjectsPageView
      subjects={subjects}
      unitsUrlTemplate={unitsUrlTemplate}
      optionsUrlTemplate={optionsUrlTemplate}
      onSubjectSelected={(subject) => {
        track.browseRefined({
          platform: Platform.GOOGLE_CLASSROOM,
          product: Product.TEACHER_LESSON_RESOURCES,
          analyticsUseCase: AnalyticsUseCase.TEACHER,
          componentType: ComponentType.SUBJECT_CARD,
          filterType: FilterType.SUBJECT_FILTER,
          filterValue: subject.programmeFields.subjectSlug ?? "",
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
