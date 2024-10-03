import { OakPupilJourneyYearButton } from "@oaknational/oak-components";

import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import { resolveOakHref } from "@/common-lib/urls";
import { FactorData } from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";

export const BrowseFactorSelector = ({
  factors,
  baseSlug,
  phaseSlug,
  onClick,
}: {
  factors: FactorData[];
  baseSlug: string;
  phaseSlug: PupilProgrammeListingData["programmeFields"]["phaseSlug"];
  chosenFactors: FactorData[]; // TODO use these to construct the slug when it is a link
  onClick?: (factor: FactorData) => void;
}) => {
  const orderedFactors = factors.sort((a, b) => {
    return (a.factorDisplayOrder ?? 0) - (b.factorDisplayOrder ?? 0);
  });

  if (phaseSlug === "foundation") {
    throw new Error("Foundation phase not supported");
  }

  //TODO annoyingly tiers use the factorDescription and not the factor !

  return (
    <>
      {" "}
      {(() => {
        switch (true) {
          case !!onClick:
            return orderedFactors.map((factor) => (
              <OakPupilJourneyYearButton
                phase={phaseSlug}
                key={factor.factorSlug}
                onClick={() => onClick(factor)}
                role="button"
              >
                {factor.factor}
              </OakPupilJourneyYearButton>
            ));
          case !!baseSlug:
            return orderedFactors.map((factor) => (
              <OakPupilJourneyYearButton
                role="link"
                phase={phaseSlug}
                key={factor.factorSlug}
                element="a"
                href={resolveOakHref({
                  page: "pupil-unit-index",
                  programmeSlug: `${baseSlug}-${factor.factorSlug}${
                    factor.isLegacy ? "-l" : ""
                  }`,
                })}
              >
                {factor.factor}
              </OakPupilJourneyYearButton>
            ));
        }
      })()}
    </>
  );
};
