import React, { FC, Fragment } from "react";
import { OakFlex } from "@oaknational/oak-components";

import LessonOverviewKeyLearningPoints, {
  LessonOverviewKeyLearningPointProps,
} from "@/components/TeacherComponents/LessonOverviewKeyLearningPoints";
import LessonOverviewCommonMisconceptions, {
  LessonOverviewCommonMisconception,
} from "@/components/TeacherComponents/LessonOverviewCommonMisconceptions";
import LessonOverviewKeywords, {
  LessonOverviewKeywordProps,
} from "@/components/TeacherComponents/LessonOverviewKeywords";
import LessonOverviewTeacherTips, {
  LessonOverviewTeacherTipProps,
} from "@/components/TeacherComponents/LessonOverviewTeacherTips";
import LessonOverviewHelper from "@/components/TeacherComponents/LessonOverviewHelper";
import Box from "@/components/SharedComponents/Box";
import {
  ContentGuidance,
  Equipment,
} from "@/components/TeacherComponents/LessonOverviewRequirements/LessonOverviewRequirements";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";

type LessonOverviewDetailsProps = {
  keyLearningPoints: LessonOverviewKeyLearningPointProps[] | null | undefined;
  commonMisconceptions: LessonOverviewCommonMisconception[] | null | undefined;
  keyWords: LessonOverviewKeywordProps[] | null | undefined;
  teacherTips: LessonOverviewTeacherTipProps[] | null | undefined;
  equipmentAndResources: Equipment[] | null | undefined;
  contentGuidance: ContentGuidance[] | null | undefined;
  supervisionLevel: string | null | undefined;
  isLegacyLicense?: boolean;
  isMathJaxLesson: boolean;
  updatedAt: string;
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
  isMathJaxLesson,
  updatedAt,
}) => {
  const MathJaxWrapper = isMathJaxLesson ? MathJaxWrap : Fragment;
  return (
    <MathJaxWrapper>
      <OakFlex
        $flexDirection={"row"}
        $flexWrap={["wrap", "nowrap"]}
        $justifyContent={["center", "normal"]}
        $alignItems={"flex-start"}
      >
        <OakFlex
          $flexDirection={"column"}
          $flexGrow={1}
          $mr="space-between-s"
          $gap="all-spacing-9"
          $mb="space-between-m"
        >
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
              <LessonOverviewKeywords keyWords={keyWords} />
            </Box>
          )}
        </OakFlex>
        <OakFlex
          $flexDirection={"column"}
          $mt={["space-between-l", "space-between-none"]}
          $gap={"all-spacing-9"}
          $mb={"space-between-m"}
        >
          {teacherTips && teacherTips.length > 0 && (
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
                updatedAt={updatedAt}
              />
            </Box>
          ) : null}
        </OakFlex>
      </OakFlex>
    </MathJaxWrapper>
  );
};

export default LessonOverviewDetails;
