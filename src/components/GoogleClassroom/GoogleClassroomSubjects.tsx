"use client";

import { SubjectsPageView } from "@oaknational/google-classroom-addon/ui";
import type { Subject } from "@oaknational/google-classroom-addon/ui";

import { useGoogleClassroomAnalytics } from "@/components/GoogleClassroom/useGoogleClassroomAnalytics";

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
  const trackSubjectSelected = useGoogleClassroomAnalytics(
    (state) => state.trackSubjectSelected,
  );

  return (
    <SubjectsPageView
      subjects={subjects}
      unitsUrlTemplate={unitsUrlTemplate}
      optionsUrlTemplate={optionsUrlTemplate}
      onSubjectSelected={trackSubjectSelected}
    />
  );
}
