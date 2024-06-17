import { isEqual, uniqWith } from "lodash";

import { ExamboardData } from "@/components/PupilComponents/BrowseExamboardSelector";
import { TierData } from "@/components/PupilComponents/BrowseTierSelector";
import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

export const getAvailableProgrammeFactor = ({
  programmes,
  factorPrefix,
}: {
  programmes: PupilProgrammeListingData[];
  factorPrefix: "tier" | "examboard";
}): TierData[] | ExamboardData[] => {
  const factors = programmes
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
        default:
          return;
      }
    })
    .filter((factor) => !!factor) as TierData[] | ExamboardData[];

  return uniqWith(factors, isEqual);
};
