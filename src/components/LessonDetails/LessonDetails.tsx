import React, { FC } from "react";

import Grid, { GridArea } from "../Grid";
import Flex from "../Flex";
import KeyLearningPoints, {
  KeyLearningPoint,
} from "../KeyLearningPoints/KeyLearningPoints";
import CommonMisconceptions, {
  CommonMisconception,
} from "../CommonMisconceptions/CommonMisconceptions";
import KeyWords, { KeyWord } from "../KeyWords/KeyWords";

type LessonDetailsProps = {
  keyLearningPoints: KeyLearningPoint[] | null | undefined;
  commonMisconceptions: CommonMisconception[] | null | undefined;
  keyWords: KeyWord[] | null | undefined;
};

const LessonDetails: FC<LessonDetailsProps> = ({
  keyLearningPoints,
  commonMisconceptions,
  keyWords,
}) => {
  return (
    <Flex $flexDirection={"column"}>
      <Grid $width={"100%"}>
        <GridArea $colSpan={[12, 8]}>
          {keyLearningPoints && (
            <KeyLearningPoints keyLearningPoints={keyLearningPoints} />
          )}
          {commonMisconceptions && (
            <CommonMisconceptions commonMisconceptions={commonMisconceptions} />
          )}
          {keyWords && <KeyWords keyWords={keyWords} />}
        </GridArea>
      </Grid>
    </Flex>
  );
};

export default LessonDetails;
