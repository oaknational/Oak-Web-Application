import React, { FC } from "react";
import { OakTypography, OakTypographyProps } from "@oaknational/oak-components";

import { BoxProps } from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";

const LessonMetadata: FC<
  {
    examBoardTitle?: string | null;
    keyStageTitle?: string | null;
    subjectTitle?: string | null;
    tierTitle?: string | null;
    yearTitle?: string | null;
    metadataArray?: string[];
  } & OakTypographyProps &
    BoxProps
> = (props) => {
  const {
    yearTitle,
    examBoardTitle,
    tierTitle,
    keyStageTitle,
    subjectTitle,
    metadataArray,
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

  return <Flex $gap={8}>{metadataElements}</Flex>;
};

export default LessonMetadata;
