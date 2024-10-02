import { isEqual, uniqWith } from "lodash";

import {
  PupilProgrammeListingData,
  ProgrammeFields,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

export type TierData = Pick<
  ProgrammeFields,
  "tier" | "tierSlug" | "tierDisplayOrder" | "tierDescription"
> & {
  isLegacy: boolean;
};

export type PathwayData = Pick<
  ProgrammeFields,
  "pathway" | "pathwaySlug" | "pathwayDisplayOrder" | "pathwayDescription"
> & {
  isLegacy: boolean;
};

export type ExamboardData = Pick<
  ProgrammeFields,
  | "examboard"
  | "examboardSlug"
  | "examboardDisplayOrder"
  | "examboardDescription"
> & {
  isLegacy: boolean;
};

export const getAvailableProgrammeFactor = ({
  programmes,
  factorPrefix,
  siblingFactors,
}: {
  programmes: PupilProgrammeListingData[];
  factorPrefix: "tier" | "examboard" | "pathway";
  siblingFactors?: { slug: "tier" | "examboard" | "pathway"; value: string }[]; // filter programmes by sibling factors
}): TierData[] | ExamboardData[] | PathwayData[] => {
  const filtered = programmes.filter((programme) => {
    return !siblingFactors
      ? programme
      : siblingFactors.every((factor) => {
          programme.programmeFields[`${factor.slug}Slug`] === factor.value;
        });
  });

  const factors = filtered
    .map((programme) => {
      switch (true) {
        case factorPrefix === "tier" && !!programme.programmeFields.tier:
          return {
            tier: programme.programmeFields.tier,
            tierSlug: programme.programmeFields.tierSlug,
            tierDisplayOrder: programme.programmeFields.tierDisplayOrder,
            tierDescription: programme.programmeFields.tierDescription,
            isLegacy: programme.programmeFields.legacy === "true",
          };
        case factorPrefix === "examboard" &&
          !!programme.programmeFields.examboard:
          return {
            examboard: programme.programmeFields.examboard,
            examboardSlug: programme.programmeFields.examboardSlug,
            examboardDisplayOrder:
              programme.programmeFields.examboardDisplayOrder,
            isLegacy: programme.programmeFields.legacy === "true",
          };
        case factorPrefix === "pathway" && !!programme.programmeFields.pathway:
          return {
            pathway: programme.programmeFields.pathway,
            pathwaySlug: programme.programmeFields.pathwaySlug,
            pathwayDisplayOrder: programme.programmeFields.pathwayDisplayOrder,
            isLegacy: programme.programmeFields.legacy === "true",
          };
        default:
          return;
      }
    })
    .filter((factor) => !!factor) as
    | TierData[]
    | ExamboardData[]
    | PathwayData[];

  return uniqWith(factors, isEqual);
};
