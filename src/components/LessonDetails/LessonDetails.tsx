import React, { FC } from "react";
import styled from "styled-components";

import Box from "../Box";
import Flex from "../Flex";
import KeyLearningPoints, {
  KeyLearningPoint,
} from "../KeyLearningPoints/KeyLearningPoints";
import CommonMisconceptions, {
  CommonMisconception,
} from "../CommonMisconceptions/CommonMisconceptions";
import KeyWords, { KeyWord } from "../KeyWords/KeyWords";
import TeacherTips, { TeacherTip } from "../TeacherTips/TeacherTips";
import LessonHelper from "../LessonHelper/LessonHelper";

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

const StyledBox = styled(Box)`
  margin-bottom: 48px;

  &:last-child {
    margin-bottom: 24px;
  }
`;

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
      $justifyContent={"center"}
    >
      <Flex $flexDirection={"column"} $mr={16}>
        {keyLearningPoints && (
          <StyledBox>
            <KeyLearningPoints keyLearningPoints={keyLearningPoints} />
          </StyledBox>
        )}
        {commonMisconceptions && (
          <StyledBox>
            <CommonMisconceptions commonMisconceptions={commonMisconceptions} />
          </StyledBox>
        )}
        {keyWords && <KeyWords keyWords={keyWords} />}
      </Flex>
      <Flex $flexDirection={"column"} $mt={[48, 0]}>
        {teacherTips && (
          <StyledBox>
            <TeacherTips teacherTips={teacherTips} />
          </StyledBox>
        )}
        {equipmentAndResources || contentGuidance || supervisionLevel ? (
          <StyledBox>
            <LessonHelper
              equipment={equipmentAndResources}
              contentGuidance={contentGuidance}
              supervisionLevel={supervisionLevel}
            />
          </StyledBox>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default LessonDetails;
