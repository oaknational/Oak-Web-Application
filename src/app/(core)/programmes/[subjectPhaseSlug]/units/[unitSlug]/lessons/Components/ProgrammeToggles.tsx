import {
  OakFlex,
  OakHeading,
  OakIcon,
  OakPrimaryButton,
  OakSecondaryButton,
  parseColorFilter,
  parseSpacing,
} from "@oaknational/oak-components";
import Link from "next/link";
import styled, { css } from "styled-components";

import { resolveOakHref } from "@/common-lib/urls";
import { ProgrammeToggles as ProgrammeTogglesData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

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

const StyledIcon = styled(OakIcon)<{ $isSelected: boolean }>`
  margin-block: -${parseSpacing("spacing-8")};
  margin-left: -${parseSpacing("spacing-8")};

  ${(props) =>
    props.$isSelected &&
    css`
      filter: ${parseColorFilter("text-inverted")};
    `}
`;

const ProgrammeToggleOption = ({
  unitSlug,
  programmeToggle,
}: ProgrammeToggleOptionProps) => {
  const { isSelected, programmeSlug, title } = programmeToggle;
  const Button = isSelected ? OakPrimaryButton : OakSecondaryButton;
  const subjectIconName = programmeToggle.subjectSlug
    ? getValidSubjectIconName(programmeToggle.subjectSlug)
    : undefined;

  const href = resolveOakHref({
    page: "integrated-unit-overview",
    programmeSlug,
    unitSlug,
  });

  return (
    <Button
      element={Link}
      href={href}
      aria-current={isSelected ? "page" : undefined}
      iconOverride={
        subjectIconName ? (
          <StyledIcon
            iconName={subjectIconName}
            aria-hidden="true"
            $isSelected={isSelected}
          />
        ) : undefined
      }
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
      <OakHeading tag="h2" id={headingId} $font="heading-7">
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
