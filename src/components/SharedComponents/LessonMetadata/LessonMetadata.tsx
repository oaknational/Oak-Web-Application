import React, { FC } from "react";
import {
  OakTypography,
  OakTypographyProps,
  OakFlex,
  OakFlexProps,
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
    <React.Fragment key={`${value}`}>
      <OakTypography {...fontProps}>{value}</OakTypography>
      {i + 1 < metadata.length && (
        <OakTypography {...fontProps} aria-hidden>
          •
        </OakTypography>
      )}
    </React.Fragment>
  ));

  return (
    <OakFlex $gap="all-spacing-2" $flexWrap={$flexWrap}>
      {metadataElements}
    </OakFlex>
  );
};

export default LessonMetadata;
