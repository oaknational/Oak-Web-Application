import React, { FC } from "react";
import {
  OakTypography,
  OakTypographyProps,
  OakFlexProps,
  OakLI,
  OakUL,
} from "@oaknational/oak-components";

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
    <OakUL
      $reset={true}
      $display={"flex"}
      $gap="all-spacing-2"
      $flexWrap={$flexWrap}
    >
      {metadataElements}
    </OakUL>
  );
};

export default LessonMetadata;
