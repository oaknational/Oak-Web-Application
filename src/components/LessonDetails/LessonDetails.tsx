import React, { FC } from "react";

import Grid, { GridArea } from "../Grid";
import Flex from "../Flex";
import { Heading } from "../Typography";
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
      <Heading $font={["heading-5", "heading-4"]} tag={"h2"}>
        Lesson details
      </Heading>

      <Grid $width={"100%"} $mt={[48, 24]} $mb={[56, 24]}>
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
