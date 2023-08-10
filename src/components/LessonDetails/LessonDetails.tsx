import React, { FC } from "react";
import styled from "styled-components";

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

const StyledBox = styled(Box)`
  margin-bottom: 48px;

  /* stylelint-disable */
  &:last-child {
    margin-bottom: 0px;
  }
  /* stylelint-enable */
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
      $justifyContent={["center", "normal"]}
      $alignItems={"flex-start"}
    >
      <Flex $flexDirection={"column"} $flexGrow={1} $mr={16}>
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
        {keyWords && (
          <StyledBox>
            <KeyWords keyWords={keyWords} />
          </StyledBox>
        )}
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
