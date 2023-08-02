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
import TeacherTips, { TeacherTip } from "../TeacherTips/TeacherTips";

type LessonDetailsProps = {
  keyLearningPoints: KeyLearningPoint[] | null | undefined;
  commonMisconceptions: CommonMisconception[] | null | undefined;
  keyWords: KeyWord[] | null | undefined;
  teacherTips: TeacherTip[] | null | undefined;
};

const LessonDetails: FC<LessonDetailsProps> = ({
  keyLearningPoints,
  commonMisconceptions,
  keyWords,
  teacherTips,
}) => {
  return (
    <Flex $flexDirection={"column"}>
      <Grid $width={"100%"} $cg={16} $rg={48}>
        {keyLearningPoints && (
          <GridArea $colSpan={[12, 8]} $colStart={1} $width={"100%"}>
            <KeyLearningPoints keyLearningPoints={keyLearningPoints} />
          </GridArea>
        )}
        {commonMisconceptions && (
          <GridArea $colSpan={[12, 8]} $colStart={1}>
            {commonMisconceptions && (
              <CommonMisconceptions
                commonMisconceptions={commonMisconceptions}
              />
            )}
          </GridArea>
        )}
        {keyWords && (
          <GridArea $colSpan={[12, 8]} $colStart={1}>
            {keyWords && <KeyWords keyWords={keyWords} />}
          </GridArea>
        )}
        {teacherTips && (
          <GridArea
            $colSpan={[12, 4]}
            $colStart={[1, 9]}
            $width={"100%"}
            $rowStart={[4, 1]}
          >
            <TeacherTips teacherTips={teacherTips} />
          </GridArea>
        )}
      </Grid>
    </Flex>
  );
};

export default LessonDetails;
