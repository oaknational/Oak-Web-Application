import {
  OakFlex,
  OakHeading,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import { ProgrammeFields } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import { resolveOakHref } from "@/common-lib/urls";

export type TierData = Pick<
  ProgrammeFields,
  "tier" | "tierSlug" | "tierDisplayOrder"
>;
export const BrowseTierSelector = ({
  tiers,
  baseSlug,
  examboardSlug,
  isLegacy,
}: {
  tiers: TierData[];
  baseSlug: string;
  examboardSlug?: string | null;
  isLegacy: boolean;
}) => {
  const programmeSlugs = tiers.map(
    (tier) =>
      `${baseSlug}-${tier.tierSlug}${examboardSlug ? `-${examboardSlug}` : ""}${
        isLegacy ? "-l" : ""
      }`,
  );

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      <OakHeading tag="h2">Choose a tier</OakHeading>
      {tiers.map((tier, i) => {
        const programmeSlug = programmeSlugs[i];
        if (programmeSlug) {
          return (
            <OakSecondaryButton
              key={tier.tierSlug}
              element="a"
              href={resolveOakHref({
                page: "pupil-unit-index",
                programmeSlug,
              })}
            >
              {tier.tier}
            </OakSecondaryButton>
          );
        }
      })}
    </OakFlex>
  );
};
