import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import Link from "next/link";

import { resolveOakHref } from "@/common-lib/urls";
import { ProgrammeToggles } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

type TierToggleProps = {
  unitSlug: string;
  tierOptionToggles: ProgrammeToggles;
};

type TierToggleOptionProps = {
  unitSlug: string;
  tierOption: ProgrammeToggles[number];
};

const TierToggleOption = ({ unitSlug, tierOption }: TierToggleOptionProps) => {
  const { isSelected, programmeSlug, title } = tierOption;
  const Button = isSelected ? OakPrimaryButton : OakSecondaryButton;

  const href = resolveOakHref({
    page: "unit-page",
    subjectPhaseSlug: programmeSlug,
    unitSlug,
  });

  return (
    <Button
      element={Link}
      href={href}
      aria-current={isSelected ? "page" : undefined}
    >
      {title}
    </Button>
  );
};

/**
 * A toggle that allows the user to switch the learning tier (KS4) of a unit.
 */
export const TierToggle = ({
  unitSlug,
  tierOptionToggles,
}: TierToggleProps) => {
  if (tierOptionToggles.length < 2) {
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
        {tierOptionToggles.map((tierOption) => (
          <TierToggleOption
            key={tierOption.programmeSlug}
            unitSlug={unitSlug}
            tierOption={tierOption}
          />
        ))}
      </OakFlex>
    </OakFlex>
  );
};
