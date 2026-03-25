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

export function GoogleClassroomOptions({
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
          platform: Platform.GOOGLE_CLASSROOM,
          product: Product.TEACHER_LESSON_RESOURCES,
          analyticsUseCase: AnalyticsUseCase.TEACHER,
          componentType: FACTOR_TO_COMPONENT[factorType],
          filterType: FACTOR_TO_FILTER[factorType],
          filterValue: factor.factorSlug ?? "",
          eventVersion: EventVersion["2_0_0"],
          engagementIntent: EngagementIntent.REFINE,
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
