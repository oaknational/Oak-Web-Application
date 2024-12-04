import React, { FC, Fragment } from "react";
import { OakBox, OakFlex } from "@oaknational/oak-components";

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
import {
  ContentGuidance,
  Equipment,
} from "@/components/TeacherComponents/LessonOverviewRequirements/LessonOverviewRequirements";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import LessonOverviewVocabButton from "@/components/TeacherComponents/LessonOverviewVocabButton";

type LessonOverviewDetailsProps = {
  keyLearningPoints: LessonOverviewKeyLearningPointProps[] | null | undefined;
  commonMisconceptions: LessonOverviewCommonMisconception[] | null | undefined;
  keyWords: LessonOverviewKeywordProps[] | null | undefined;
  teacherTips: LessonOverviewTeacherTipProps[] | null | undefined;
  equipmentAndResources: Equipment[] | null | undefined;
  contentGuidance: ContentGuidance[] | null | undefined;
  hasVocabAndTranscripts: boolean;
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
  hasVocabAndTranscripts,
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
          {hasVocabAndTranscripts && (
            <OakBox>
              <LessonOverviewVocabButton />
            </OakBox>
          )}
          {keyLearningPoints && (
            <OakBox>
              <LessonOverviewKeyLearningPoints
                keyLearningPoints={keyLearningPoints}
              />
            </OakBox>
          )}
          {keyWords && (
            <OakBox>
              <LessonOverviewKeywords keyWords={keyWords} />
            </OakBox>
          )}
          {commonMisconceptions && (
            <OakBox>
              <LessonOverviewCommonMisconceptions
                commonMisconceptions={commonMisconceptions}
              />
            </OakBox>
          )}
        </OakFlex>
        <OakFlex
          $flexDirection={"column"}
          $mt={["space-between-l", "space-between-none"]}
          $gap={"all-spacing-9"}
          $mb={"space-between-m"}
        >
          {teacherTips && teacherTips.length > 0 && (
            <OakBox>
              <LessonOverviewTeacherTips teacherTips={teacherTips} />
            </OakBox>
          )}
          {(equipmentAndResources && equipmentAndResources.length > 0) ||
          (contentGuidance && contentGuidance.length > 0) ||
          supervisionLevel ||
          isLegacyLicense !== undefined ? (
            <OakBox>
              <LessonOverviewHelper
                equipment={equipmentAndResources}
                contentGuidance={contentGuidance}
                supervisionLevel={supervisionLevel}
                isLegacyLicense={isLegacyLicense}
                updatedAt={updatedAt}
              />
            </OakBox>
          ) : null}
        </OakFlex>
      </OakFlex>
    </MathJaxWrapper>
  );
};

export default LessonOverviewDetails;
