import { OakPupilJourneyYearButton } from "@oaknational/oak-components";

import {
  ProgrammeFields,
  PupilProgrammeListingData,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import { resolveOakHref } from "@/common-lib/urls";

export type TierData = Pick<
  ProgrammeFields,
  "tier" | "tierSlug" | "tierDisplayOrder" | "tierDescription"
> & {
  isLegacy: boolean;
};
export const BrowseTierSelector = ({
  tiers,
  baseSlug,
  examboardSlug,
  phaseSlug,
}: {
  tiers: TierData[];
  baseSlug: string;
  examboardSlug?: string | null;
  phaseSlug: PupilProgrammeListingData["programmeFields"]["phaseSlug"];
}) => {
  const orderedTiers = tiers.sort(
    (a, b) => (a.tierDisplayOrder ?? 0) - (b.tierDisplayOrder ?? 0),
  );

  const programmeSlugs = orderedTiers.map(
    (tier) =>
      `${baseSlug}-${tier.tierSlug}${examboardSlug ? `-${examboardSlug}` : ""}${
        tier.isLegacy ? "-l" : ""
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
