"use client";

import { SubjectsPageView } from "@oaknational/google-classroom-addon/ui";
import type { Subject } from "@oaknational/google-classroom-addon/ui";

import useAnalytics from "@/context/Analytics/useAnalytics";

type Props = {
  subjects: Subject[];
  unitsUrlTemplate: string;
  optionsUrlTemplate: string;
};

export function GoogleClassroomSubjectsAnalytics({
  subjects,
  unitsUrlTemplate,
  optionsUrlTemplate,
}: Props) {
  const { track } = useAnalytics();

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
        });
      }}
    />
  );
}
