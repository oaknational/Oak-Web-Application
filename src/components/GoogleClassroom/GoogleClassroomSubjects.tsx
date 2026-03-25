"use client";

import {
  SubjectsPageView,
  useGoogleClassroomAddonStore,
} from "@oaknational/google-classroom-addon/ui";
import type { Subject } from "@oaknational/google-classroom-addon/ui";

import { getClientEnvironment } from "./getClientEnvironment";

import useAnalytics from "@/context/Analytics/useAnalytics";

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
          platform: "google-classroom",
          product: "teacher lesson resources",
          analyticsUseCase: "Teacher",
          componentType: "subject_card",
          filterType: "Subject filter",
          filterValue: subject.programmeFields.subjectSlug ?? "",
          eventVersion: "2.0.0",
          engagementIntent: "refine",
          activeFilters: {},
          googleLoginHint,
          clientEnvironment: getClientEnvironment(),
        });
      }}
    />
  );
}
