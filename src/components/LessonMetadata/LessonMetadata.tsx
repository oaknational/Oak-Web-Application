import React, { FC } from "react";

import Typography from "../Typography";
import Flex from "../Flex";

const LessonMetadata: FC<{
  examBoardTitle?: string | null;
  keyStageTitle?: string | null;
  subjectTitle?: string | null;
  tierTitle?: string | null;
  yearTitle: string;
}> = (props) => {
  const { yearTitle, examBoardTitle, tierTitle, keyStageTitle, subjectTitle } =
    props;

  const metadata = [
    keyStageTitle,
    yearTitle,
    subjectTitle,
    examBoardTitle,
    tierTitle,
  ].filter((value) => !!value);

  const metadataElements = metadata.map((value, i) => (
    <React.Fragment key={`${value}`}>
      <Typography>{value}</Typography>
      {i + 1 !== metadata.length && <Typography>•</Typography>}
    </React.Fragment>
  ));

  return <Flex $gap={8}>{metadataElements}</Flex>;
};

export default LessonMetadata;
