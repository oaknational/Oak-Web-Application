import React, { FC } from "react";

import LessonOverviewKeyLearningPoints, {
  LessonOverviewKeyLearningPointProps,
} from "@/components/TeacherComponents/LessonOverviewKeyLearningPoints";
import LessonOverviewCommonMisconceptions, {
  LessonOverviewCommonMisconception,
} from "@/components/TeacherComponents/LessonOverviewCommonMisconceptions";
import KeyWords, { KeyWord } from "@/components/KeyWords/KeyWords";
import LessonOverviewTeacherTips, {
  LessonOverviewTeacherTipProps,
} from "@/components/TeacherComponents/LessonOverviewTeacherTips";
import LessonOverviewHelper from "@/components/TeacherComponents/LessonOverviewHelper";
import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";
import {
  ContentGuidance,
  Equipment,
} from "@/components/TeacherComponents/LessonOverviewRequirements/LessonOverviewRequirements";

type LessonOverviewDetailsProps = {
  keyLearningPoints: LessonOverviewKeyLearningPointProps[] | null | undefined;
  commonMisconceptions: LessonOverviewCommonMisconception[] | null | undefined;
  keyWords: KeyWord[] | null | undefined;
  teacherTips: LessonOverviewTeacherTipProps[] | null | undefined;
  equipmentAndResources: Equipment[] | null | undefined;
  contentGuidance: ContentGuidance[] | null | undefined;
  supervisionLevel: string | null | undefined;
  isLegacyLicense?: boolean;
};

const LessonOverviewDetails: FC<LessonOverviewDetailsProps> = ({
  keyLearningPoints,
  commonMisconceptions,
  keyWords,
  teacherTips,
  equipmentAndResources,
  contentGuidance,
  supervisionLevel,
  isLegacyLicense,
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
            <LessonOverviewKeyLearningPoints
              keyLearningPoints={keyLearningPoints}
            />
          </Box>
        )}
        {commonMisconceptions && (
          <Box>
            <LessonOverviewCommonMisconceptions
              commonMisconceptions={commonMisconceptions}
            />
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
            <LessonOverviewTeacherTips teacherTips={teacherTips} />
          </Box>
        )}
        {(equipmentAndResources && equipmentAndResources.length > 0) ||
        (contentGuidance && contentGuidance.length > 0) ||
        supervisionLevel ||
        isLegacyLicense !== undefined ? (
          <Box>
            <LessonOverviewHelper
              equipment={equipmentAndResources}
              contentGuidance={contentGuidance}
              supervisionLevel={supervisionLevel}
              isLegacyLicense={isLegacyLicense}
            />
          </Box>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default LessonOverviewDetails;
