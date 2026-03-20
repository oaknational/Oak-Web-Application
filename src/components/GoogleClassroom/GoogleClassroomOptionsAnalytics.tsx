"use client";

import {
  OptionsView,
  useGoogleClassroomAddonStore,
} from "@oaknational/google-classroom-addon/ui";
import type {
  FactorData,
  Programme,
} from "@oaknational/google-classroom-addon/ui";

import { getClientEnvironment } from "./getClientEnvironment";

import useAnalytics from "@/context/Analytics/useAnalytics";
import { ComponentType, FilterType } from "@/browser-lib/avo/Avo";

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

const FACTOR_TO_FILTER: Record<
  "tier" | "examboard" | "pathway",
  (typeof FilterType)[keyof typeof FilterType]
> = {
  tier: "Tier filter",
  examboard: "Exam board filter",
  pathway: "Pathway filter",
};

const FACTOR_TO_COMPONENT: Record<
  "tier" | "examboard" | "pathway",
  (typeof ComponentType)[keyof typeof ComponentType]
> = {
  tier: "learning_tier_button",
  examboard: "programme_card",
  pathway: "programme_card",
};

export function GoogleClassroomOptionsAnalytics({
  programmes,
  baseSlug,
  yearSlug,
  programmeUrlTemplate,
  backUrlTemplate,
  getAvailableProgrammeFactorAction,
}: Props) {
  const { track } = useAnalytics();
  const googleLoginHint = useGoogleClassroomAddonStore(
    (state) => state.googleLoginHint,
  );

  return (
    <OptionsView
      programmes={programmes}
      baseSlug={baseSlug}
      yearSlug={yearSlug}
      programmeUrlTemplate={programmeUrlTemplate}
      backUrlTemplate={backUrlTemplate}
      getAvailableProgrammeFactorAction={getAvailableProgrammeFactorAction}
      onOptionSelected={(factorType, factor) => {
        track.browseRefined({
          platform: "google-classroom",
          product: "teacher lesson resources",
          analyticsUseCase: "Teacher",
          componentType: FACTOR_TO_COMPONENT[factorType],
          filterType: FACTOR_TO_FILTER[factorType],
          filterValue: factor.factorSlug ?? "",
          eventVersion: "2.0.0",
          engagementIntent: "refine",
          activeFilters: {
            tier: factorType === "tier" ? factor.factorSlug : undefined,
            examboard:
              factorType === "examboard" ? factor.factorSlug : undefined,
            pathway: factorType === "pathway" ? factor.factorSlug : undefined,
          },
          googleLoginHint,
          clientEnvironment: getClientEnvironment(),
        });
      }}
    />
  );
}
