import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import Link from "next/link";

import { resolveOakHref } from "@/common-lib/urls";

type TierToggleProps = {
  programmeSlug: string;
  unitSlug: string;
  tierSlug: string | null | undefined;
};

type TierToggleOptionProps = {
  programmeSlug: string;
  unitSlug: string;
  isActive: boolean;
  tierSlug: "foundation" | "higher";
};

const TierToggleOption = ({
  programmeSlug,
  unitSlug,
  tierSlug,
  isActive,
}: TierToggleOptionProps) => {
  const Button = isActive ? OakPrimaryButton : OakSecondaryButton;
  const label = tierSlug === "foundation" ? "Foundation" : "Higher";

  const href = resolveOakHref({
    page: "unit-page",
    subjectPhaseSlug: subjectPhaseSlugWithKs4Tier(programmeSlug, tierSlug),
    unitSlug,
  });

  return (
    <Button
      element={Link}
      href={href}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Button>
  );
};

/**
 * A toggle that allows the user to switch the learning tier (KS4) of a unit.
 */
export const TierToggle = ({
  programmeSlug,
  unitSlug,
  tierSlug,
}: TierToggleProps) => {
  if (!isKs4ExamTierSlug(tierSlug)) {
    return null;
  }

  return (
    <OakFlex
      as="nav"
      aria-labelledby="tier-toggle-heading"
      $flexDirection="column"
      $gap="spacing-24"
      $pb="spacing-32"
    >
      <OakHeading tag="h3" id="tier-toggle-heading" $font="heading-7">
        Learning tier (KS4)
      </OakHeading>
      <OakFlex $flexDirection="row" $gap="spacing-12">
        <TierToggleOption
          isActive={tierSlug === "foundation"}
          programmeSlug={programmeSlug}
          unitSlug={unitSlug}
          tierSlug="foundation"
        />
        <TierToggleOption
          isActive={tierSlug === "higher"}
          programmeSlug={programmeSlug}
          unitSlug={unitSlug}
          tierSlug="higher"
        />
      </OakFlex>
    </OakFlex>
  );
};

/**
 * Rewrites the KS4 tier segment in a programme slug (foundation ↔ higher).
 * Preserves trailing segments after the tier (e.g. exam board:
 * `combined-science-secondary-ks4-foundation-aqa` → `...-higher-aqa`).
 */
function subjectPhaseSlugWithKs4Tier(
  subjectPhaseSlug: string,
  tier: "foundation" | "higher",
): string {
  const parts = subjectPhaseSlug.split("-");
  const tierIndex = parts.findIndex(isKs4ExamTierSlug);
  if (tierIndex === -1) {
    return subjectPhaseSlug;
  }
  parts[tierIndex] = tier;
  return parts.join("-");
}

/**
 * Checks if input is a valid KS4 exam tier slug.
 */
function isKs4ExamTierSlug(
  slug: string | null | undefined,
): slug is "foundation" | "higher" {
  return slug === "foundation" || slug === "higher";
}
