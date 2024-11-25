import groupBy from "lodash/groupBy";
import isEqual from "lodash/isEqual";
import uniqWith from "lodash/uniqWith";

import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

export type FactorData = {
  factor: string | null;
  factorSlug: string | null;
  factorDisplayOrder: number | null;
  factorDescription: string | null;
  isLegacy: boolean;
};

const prioritiseNonLegacy = (factors: FactorData[]) => {
  // This creates a filtered array of factors giving preference to non-legacy factors

  // group factors by factor value to compare them
  const allfactors: { [key: string]: FactorData[] } = groupBy(
    factors,
    (factor: FactorData) => factor.factor,
  );

  const filteredFactors = Object.keys(allfactors)
    .map((factor) => {
      const mappedExamboard = allfactors[factor];
      if (!Array.isArray(mappedExamboard) || mappedExamboard.length < 1) return;
      return (
        allfactors[factor]?.find((factor: FactorData) => !factor.isLegacy) ??
        mappedExamboard[0]
      );
    })
    .filter((factor): factor is FactorData => factor !== undefined);

  return filteredFactors;
};

export const getAvailableProgrammeFactor = ({
  programmes,
  factorPrefix,
}: {
  programmes: PupilProgrammeListingData[];
  factorPrefix: "tier" | "examboard" | "pathway";
}): FactorData[] => {
  const factors = programmes
    .map((programme) => {
      if (!programme.programmeFields[factorPrefix]) {
        return null;
      }

      return {
        factor: programme.programmeFields[factorPrefix],
        factorSlug: programme.programmeFields[`${factorPrefix}Slug`],
        factorDisplayOrder:
          programme.programmeFields[`${factorPrefix}DisplayOrder`],
        factorDescription:
          programme.programmeFields[`${factorPrefix}Description`],
        isLegacy: programme.programmeFields.legacy === "true",
      };
    })
    .filter((factor) => !!factor);

  return prioritiseNonLegacy(uniqWith(factors, isEqual));
};
