import React, { FC } from "react";
import styled from "styled-components";
import {
  OakTypography,
  OakTypographyProps,
  OakFlexProps,
  OakUL,
  OakLI,
} from "@oaknational/oak-components";

const StyledOakUL = styled(OakUL)`
  list-style: none;
`;
const LessonMetadata: FC<
  {
    examBoardTitle?: string | null;
    keyStageTitle?: string | null;
    subjectTitle?: string | null;
    tierTitle?: string | null;
    yearTitle?: string | null;
    metadataArray?: string[];
    $flexWrap?: OakFlexProps["$flexWrap"];
  } & OakTypographyProps &
    OakFlexProps
> = (props) => {
  const {
    yearTitle,
    examBoardTitle,
    tierTitle,
    keyStageTitle,
    subjectTitle,
    metadataArray,
    $flexWrap,
    ...fontProps
  } = props;

  const metadata =
    metadataArray ||
    [keyStageTitle, yearTitle, subjectTitle, examBoardTitle, tierTitle].filter(
      (value) => !!value,
    );

  const metadataElements = metadata.map((value, i) => (
    <OakLI $display={"flex"} $gap={"all-spacing-2"} key={`${value}`}>
      <OakTypography {...fontProps}>{value}</OakTypography>
      {i + 1 < metadata.length && (
        <OakTypography {...fontProps} aria-hidden>
          •
        </OakTypography>
      )}
    </OakLI>
  ));

  return (
    <StyledOakUL
      $display={"flex"}
      $ph={"inner-padding-none"}
      $gap="all-spacing-2"
      $flexWrap={$flexWrap}
    >
      {metadataElements}
    </StyledOakUL>
  );
};

export default LessonMetadata;
