import { OakPupilJourneyYearButton } from "@oaknational/oak-components";

import {
  ProgrammeFields,
  PupilProgrammeListingData,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import { resolveOakHref } from "@/common-lib/urls";

export type TierData = Pick<
  ProgrammeFields,
  "tier" | "tierSlug" | "tierDisplayOrder" | "tierDescription"
>;
export const BrowseTierSelector = ({
  tiers,
  baseSlug,
  examboardSlug,
  isLegacy,
  phaseSlug,
}: {
  tiers: TierData[];
  baseSlug: string;
  examboardSlug?: string | null;
  isLegacy: boolean;
  phaseSlug: PupilProgrammeListingData["programmeFields"]["phaseSlug"];
}) => {
  const orderedTiers = tiers.sort((a, b) => {
    if (a.tier && b.tier) {
      if (a.tier < b.tier) {
        return -1;
      }
      if (a.tier > b.tier) {
        return 1;
      }
    }
    return 0;
  });

  const programmeSlugs = orderedTiers.map(
    (tier) =>
      `${baseSlug}-${tier.tierSlug}${examboardSlug ? `-${examboardSlug}` : ""}${
        isLegacy ? "-l" : ""
      }`,
  );

  if (phaseSlug === "foundation" || !phaseSlug) {
    throw new Error("Foundation phase is not supported");
  }

  return (
    <>
      {" "}
      {orderedTiers.map((tier, i) => {
        const programmeSlug = programmeSlugs[i];
        if (programmeSlug) {
          return (
            <OakPupilJourneyYearButton
              role="link"
              phase={phaseSlug}
              key={tier.tierSlug}
              element="a"
              href={resolveOakHref({
                page: "pupil-unit-index",
                programmeSlug,
              })}
            >
              {tier.tierDescription}
            </OakPupilJourneyYearButton>
          );
        }
      })}
    </>
  );
};
