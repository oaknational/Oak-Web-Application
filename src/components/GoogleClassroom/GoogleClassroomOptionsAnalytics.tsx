"use client";

import { OptionsView } from "@oaknational/google-classroom-addon/ui";
import type {
  FactorData,
  Programme,
} from "@oaknational/google-classroom-addon/ui";

import useAnalytics from "@/context/Analytics/useAnalytics";
import { ComponentType, FilterType } from "@/browser-lib/avo/Avo";

type Props = {
  programmes: Programme[];
  baseSlug: string;
  yearSlug?: string;
  programmeUrlTemplate: string;
  backUrlTemplate: string;
  getAvailableProgrammeFactorAction: (args: {
    factorPrefix: "tier" | "examboard" | "pathway";
    programmes: never[];
  }) => Promise<FactorData[]>;
};

const FACTOR_TO_FILTER: Record<
  "tier" | "examboard" | "pathway",
  (typeof FilterType)[keyof typeof FilterType]
> = {
  tier: FilterType.TIER_FILTER,
  examboard: FilterType.EXAM_BOARD_FILTER,
  pathway: FilterType.PATHWAY_FILTER,
};

const FACTOR_TO_COMPONENT: Record<
  "tier" | "examboard" | "pathway",
  (typeof ComponentType)[keyof typeof ComponentType]
> = {
  tier: ComponentType.LEARNING_TIER_BUTTON,
  examboard: ComponentType.PROGRAMME_CARD,
  pathway: ComponentType.PROGRAMME_CARD,
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
        });
      }}
    />
  );
}
