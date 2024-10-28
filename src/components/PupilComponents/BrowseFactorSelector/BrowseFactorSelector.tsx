import { OakPupilJourneyYearButton } from "@oaknational/oak-components";

import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import { resolveOakHref } from "@/common-lib/urls";
import { FactorData } from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";

export type Factors = {
  pathway: FactorData | null;
  examboard: FactorData | null;
  tier: FactorData | null;
};

export const BrowseFactorSelector = ({
  factorType,
  factors,
  baseSlug,
  phaseSlug,
  onClick,
  chosenFactors,
  programmes,
  onTrackingCallback,
}: {
  factorType: "pathway" | "examboard" | "tier";
  factors: FactorData[];
  baseSlug: string;
  phaseSlug: PupilProgrammeListingData["programmeFields"]["phaseSlug"];
  chosenFactors: Factors;
  programmes: PupilProgrammeListingData[];
  onClick: (factor: FactorData) => void;
  onTrackingCallback?: (factor: FactorData) => void;
}) => {
  const orderedFactors = factors.sort((a, b) => {
    return (a.factorDisplayOrder ?? 0) - (b.factorDisplayOrder ?? 0);
  });

  if (phaseSlug === "foundation") {
    throw new Error("Foundation phase not supported");
  }

  const getSlug = (factor: FactorData) => {
    const allFactors = { ...chosenFactors, [factorType]: factor };
    const allSlugs = [
      allFactors.pathway?.factorSlug,
      allFactors.tier?.factorSlug,
      allFactors.examboard?.factorSlug,
    ].filter(Boolean);
    const optionalSlug = allSlugs.join("-");

    return `${baseSlug}-${optionalSlug}${factor.isLegacy ? "-l" : ""}`;
  };

  const filteredProgrammes = programmes.filter(
    (p) =>
      (!chosenFactors.pathway ||
        p.programmeFields.pathwaySlug === chosenFactors.pathway.factorSlug) &&
      (!chosenFactors.examboard ||
        p.programmeFields.examboardSlug ===
          chosenFactors.examboard.factorSlug) &&
      (!chosenFactors.tier ||
        p.programmeFields.tierSlug === chosenFactors.tier.factorSlug),
  );

  const filteredFactors = orderedFactors.filter((f) =>
    filteredProgrammes.find(
      (p) => f.factorSlug === p.programmeFields[`${factorType}Slug`],
    ),
  );

  const getOptionsAvailable = (factor: FactorData) =>
    filteredProgrammes.filter(
      (p) =>
        p.programmeFields[`${factorType}Slug`] === factor.factorSlug &&
        Boolean(p.programmeFields.legacy) === factor.isLegacy,
    ).length > 1;

  //annoyingly tiers use the factorDescription and not the factor !
  const buttonInnerProp =
    factorType === "tier" ? "factorDescription" : "factor";

  return (
    <>
      {filteredFactors.map((factor) => {
        if (getOptionsAvailable(factor)) {
          return (
            <OakPupilJourneyYearButton
              phase={phaseSlug}
              key={factor.factorSlug}
              onClick={() => {
                onClick(factor);
                if (onTrackingCallback) {
                  onTrackingCallback(factor);
                }
              }}
              role="button"
            >
              {factor[buttonInnerProp]}
            </OakPupilJourneyYearButton>
          );
        }
        return (
          <OakPupilJourneyYearButton
            role="link"
            phase={phaseSlug}
            key={factor.factorSlug}
            element="a"
            href={resolveOakHref({
              page: "pupil-unit-index",
              programmeSlug: getSlug(factor),
            })}
            onClick={() => {
              if (onTrackingCallback) {
                onTrackingCallback(factor);
              }
            }}
          >
            {factor[buttonInnerProp]}
          </OakPupilJourneyYearButton>
        );
      })}
    </>
  );
};
