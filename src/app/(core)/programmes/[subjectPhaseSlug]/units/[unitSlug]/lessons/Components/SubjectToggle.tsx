import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import Link from "next/link";

import { resolveOakHref } from "@/common-lib/urls";
import { ProgrammeToggles } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

type SubjectToggleProps = {
  unitSlug: string;
  subjectOptionToggles: ProgrammeToggles;
};

type SubjectToggleOptionProps = {
  unitSlug: string;
  subjectOption: ProgrammeToggles[number];
};

const SubjectToggleOption = ({
  unitSlug,
  subjectOption,
}: SubjectToggleOptionProps) => {
  const { isSelected, programmeSlug, title } = subjectOption;
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
 * A toggle that allows users to switch subject programmes for a unit.
 */
export const SubjectToggle = ({
  unitSlug,
  subjectOptionToggles,
}: SubjectToggleProps) => {
  if (subjectOptionToggles.length < 2) {
    return null;
  }

  return (
    <OakFlex
      as="nav"
      aria-labelledby="subject-toggle-heading"
      $flexDirection="column"
      $gap="spacing-24"
      $pb="spacing-32"
    >
      <OakHeading tag="h3" id="subject-toggle-heading" $font="heading-7">
        Exam subject (KS4)
      </OakHeading>
      <OakFlex $flexDirection="row" $gap="spacing-12">
        {subjectOptionToggles.map((subjectOption) => (
          <SubjectToggleOption
            key={subjectOption.programmeSlug}
            unitSlug={unitSlug}
            subjectOption={subjectOption}
          />
        ))}
      </OakFlex>
    </OakFlex>
  );
};
