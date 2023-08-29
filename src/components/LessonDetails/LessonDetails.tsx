import React, { FC } from "react";

import KeyLearningPoints, {
  KeyLearningPoint,
} from "@/components/KeyLearningPoints/KeyLearningPoints";
import CommonMisconceptions, {
  CommonMisconception,
} from "@/components/CommonMisconceptions/CommonMisconceptions";
import KeyWords, { KeyWord } from "@/components/KeyWords/KeyWords";
import TeacherTips, { TeacherTip } from "@/components/TeacherTips/TeacherTips";
import LessonHelper from "@/components/LessonHelper/LessonHelper";
import Flex from "@/components/Flex";
import Box from "@/components/Box";
import {
  ContentGuidance,
  Equipment,
} from "@/components/LessonRequirements/LessonRequirements";

type LessonDetailsProps = {
  keyLearningPoints: KeyLearningPoint[] | null | undefined;
  commonMisconceptions: CommonMisconception[] | null | undefined;
  keyWords: KeyWord[] | null | undefined;
  teacherTips: TeacherTip[] | null | undefined;
  equipmentAndResources: Equipment[] | null | undefined;
  contentGuidance: ContentGuidance[] | null | undefined;
  supervisionLevel: string | null | undefined;
};

const LessonDetails: FC<LessonDetailsProps> = ({
  keyLearningPoints,
  commonMisconceptions,
  keyWords,
  teacherTips,
  equipmentAndResources,
  contentGuidance,
  supervisionLevel,
}) => {
  return (
    <Flex
      $flexDirection={"row"}
      $flexWrap={["wrap", "nowrap"]}
      $justifyContent={["center", "normal"]}
      $alignItems={"flex-start"}
    >
      <Flex $flexDirection={"column"} $flexGrow={1} $mr={16} $gap={48} $mb={24}>
        {keyLearningPoints && (
          <Box>
            <KeyLearningPoints keyLearningPoints={keyLearningPoints} />
          </Box>
        )}
        {commonMisconceptions && (
          <Box>
            <CommonMisconceptions commonMisconceptions={commonMisconceptions} />
          </Box>
        )}
        {keyWords && (
          <Box>
            <KeyWords keyWords={keyWords} />
          </Box>
        )}
      </Flex>
      <Flex $flexDirection={"column"} $mt={[48, 0]} $gap={48} $mb={24}>
        {teacherTips && (
          <Box>
            <TeacherTips teacherTips={teacherTips} />
          </Box>
        )}
        {(equipmentAndResources && equipmentAndResources.length > 0) ||
        (contentGuidance && contentGuidance.length > 0) ||
        supervisionLevel ? (
          <Box>
            <LessonHelper
              equipment={equipmentAndResources}
              contentGuidance={contentGuidance}
              supervisionLevel={supervisionLevel}
            />
          </Box>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default LessonDetails;
