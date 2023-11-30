import React, { FC } from "react";

import Typography from "../Typography";
import Flex from "../Flex";
import { BoxProps } from "../Box";

import { FontProps } from "@/styles/utils/typography";

const LessonMetadata: FC<
  {
    examBoardTitle?: string | null;
    keyStageTitle?: string | null;
    subjectTitle?: string | null;
    tierTitle?: string | null;
    yearTitle?: string | null;
    metadataArray?: string[];
  } & FontProps &
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
      <Typography {...fontProps}>{value}</Typography>
      {i + 1 < metadata.length && (
        <Typography {...fontProps} aria-hidden>
          •
        </Typography>
      )}
    </React.Fragment>
  ));

  return <Flex $gap={8}>{metadataElements}</Flex>;
};

export default LessonMetadata;
