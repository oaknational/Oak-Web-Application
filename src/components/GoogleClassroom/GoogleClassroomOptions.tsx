"use client";

import { OptionsView } from "@oaknational/google-classroom-addon/ui";
import type {
  FactorData,
  Programme,
} from "@oaknational/google-classroom-addon/ui";

import { useGoogleClassroomAnalytics } from "@/components/GoogleClassroom/useGoogleClassroomAnalytics";

type Props = Readonly<{
  programmes: Programme[];
  baseSlug: string;
  yearSlug?: string;
  programmeUrlTemplate: string;
  backUrlTemplate: string;
  getAvailableProgrammeFactorAction: (args: {
    factorPrefix: "tier" | "examboard" | "pathway";
    programmes: Programme[];
  }) => Promise<FactorData[]>;
}>;

export function GoogleClassroomOptions({
  programmes,
  baseSlug,
  yearSlug,
  programmeUrlTemplate,
  backUrlTemplate,
  getAvailableProgrammeFactorAction,
}: Props) {
  const trackOptionSelected = useGoogleClassroomAnalytics(
    (state) => state.trackOptionSelected,
  );

  return (
    <OptionsView
      programmes={programmes}
      baseSlug={baseSlug}
      yearSlug={yearSlug}
      programmeUrlTemplate={programmeUrlTemplate}
      backUrlTemplate={backUrlTemplate}
      getAvailableProgrammeFactorAction={getAvailableProgrammeFactorAction}
      onOptionSelected={trackOptionSelected}
    />
  );
}
