import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import Link from "next/link";

import { resolveOakHref } from "@/common-lib/urls";
import { ProgrammeToggles as ProgrammeTogglesData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

export type ProgrammeToggleOptions = ProgrammeTogglesData;

type ProgrammeTogglesProps = {
  heading: string;
  unitSlug: string;
  programmeToggles: ProgrammeToggleOptions;
  headingId: string;
};

type ProgrammeToggleOptionProps = {
  unitSlug: string;
  programmeToggle: ProgrammeToggleOptions[number];
};

const ProgrammeToggleOption = ({
  unitSlug,
  programmeToggle,
}: ProgrammeToggleOptionProps) => {
  const { isSelected, programmeSlug, title } = programmeToggle;
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
 * Enables navigating horizontally to another programme for the same unit.
 */
export const ProgrammeToggles = ({
  heading,
  unitSlug,
  programmeToggles,
  headingId,
}: ProgrammeTogglesProps) => {
  if (programmeToggles.length < 2) return null;

  return (
    <OakFlex
      as="nav"
      aria-labelledby={headingId}
      $flexDirection="column"
      $gap="spacing-24"
    >
      <OakHeading tag="h3" id={headingId} $font="heading-7">
        {heading}
      </OakHeading>
      <OakFlex $flexDirection="row" $gap="spacing-12">
        {programmeToggles.map((programmeToggle) => (
          <ProgrammeToggleOption
            key={programmeToggle.programmeSlug}
            unitSlug={unitSlug}
            programmeToggle={programmeToggle}
          />
        ))}
      </OakFlex>
    </OakFlex>
  );
};
