import React from "react";
import styled from "styled-components";
import {
  OakFlex,
  OakFlexProps,
  OakUiRoleToken,
  OakUL,
  parseSpacing,
} from "@oaknational/oak-components";

import { UnitsHeader, UnitsHeaderProps } from "../UnitsHeader";

const OakULFlex = styled(OakUL)`
  display: flex;
  flex-direction: column;
  gap: ${parseSpacing("spacing-12")};
`;

export type UnitsContainerProps = UnitsHeaderProps & {
  showHeader: boolean;
  unitCards: Array<React.ReactElement>;
  backgroundColour?: OakUiRoleToken;
} & Omit<
    OakFlexProps,
    "children" | "$background" | "$flexDirection" | "$pa" | "$borderRadius"
  >;

export const UnitsContainer = (props: UnitsContainerProps) => {
  const {
    isLegacy,
    showHeader,
    unitCards,
    curriculumHref,
    phase,
    subject,
    isCustomUnit,
    customHeadingText,
    banner,
    backgroundColour = "bg-decorative3-very-subdued",
    ...rest
  } = props;
  return (
    <OakFlex
      $gap="spacing-16"
      $alignItems="center"
      {...rest}
      $background={isLegacy ? "bg-neutral" : backgroundColour}
      $flexDirection="column"
      $pa="spacing-16"
      $borderRadius="border-radius-m"
    >
      {showHeader && (
        <UnitsHeader
          isLegacy={isLegacy}
          curriculumHref={curriculumHref}
          phase={phase}
          subject={subject}
          $width="100%"
          isCustomUnit={isCustomUnit}
          customHeadingText={customHeadingText}
          banner={banner}
        />
      )}
      <OakULFlex aria-label="A list of units" $reset $width="100%">
        {unitCards}
      </OakULFlex>
    </OakFlex>
  );
};
