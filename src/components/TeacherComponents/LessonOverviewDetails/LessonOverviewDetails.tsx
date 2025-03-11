import React, { FC, Fragment } from "react";
import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
} from "@oaknational/oak-components";

import { LessonSeoHelper } from "./LessonSeoHelper";

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
import LessonOverviewFilesNeeded from "@/components/TeacherComponents/LessonOverviewFilesNeeded";
import { Slugs } from "@/components/TeacherComponents/LessonItemContainer/LessonItemContainer";

type LessonOverviewDetailsProps = {
  keyLearningPoints: LessonOverviewKeyLearningPointProps[] | null | undefined;
  commonMisconceptions: LessonOverviewCommonMisconception[] | null | undefined;
  keyWords: LessonOverviewKeywordProps[] | null | undefined;
  teacherTips: LessonOverviewTeacherTipProps[] | null | undefined;
  equipmentAndResources: Equipment[] | null | undefined;
  contentGuidance: ContentGuidance[] | null | undefined;
  hasVocabAndTranscripts: boolean;
  //temporary to only render on beta pages
  displayVocab: boolean;
  supervisionLevel: string | null | undefined;
  isLegacyLicense?: boolean;
  isMathJaxLesson: boolean;
  updatedAt: string;
  additionalFiles: string[] | null | undefined;
  slugs: Slugs;
  year: string | null | undefined;
  subject: string | null | undefined;
  unit: string | null | undefined;
  keystage: string | null | undefined;
  examBoardSlug: string | null | undefined;
  subjectSlug: string | null | undefined;
  subjectParent: string | null | undefined;
  disablePupilLink?: boolean;
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
  displayVocab,
  additionalFiles,
  slugs,
  subject,
  unit,
  year,
  keystage,
  examBoardSlug,
  subjectParent,
  subjectSlug,
  disablePupilLink,
}) => {
  const { lessonSlug, unitSlug, programmeSlug } = slugs;
  const showLessonHelperAccordion =
    !isLegacyLicense &&
    subject &&
    unit &&
    year &&
    keystage &&
    unitSlug &&
    programmeSlug &&
    subjectSlug;
  const MathJaxWrapper = isMathJaxLesson ? MathJaxWrap : Fragment;
  return (
    <MathJaxWrapper>
      <OakGrid>
        <OakGridArea $colSpan={[12, 8]} $rowStart={1}>
          <OakFlex
            $flexDirection={"column"}
            $flexGrow={1}
            $mr="space-between-s"
            $gap="all-spacing-9"
            $mb="space-between-m"
          >
            {hasVocabAndTranscripts && displayVocab && (
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
            {showLessonHelperAccordion && (
              <LessonSeoHelper
                lessonSlug={lessonSlug}
                year={year}
                programmeSlug={programmeSlug}
                unitSlug={unitSlug}
                subject={subject}
                unit={unit}
                keystage={keystage}
                examBoardSlug={examBoardSlug}
                subjectSlug={subjectSlug}
                parentSubject={subjectParent}
                disablePupilLink={disablePupilLink}
              />
            )}
          </OakFlex>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 4]} $colStart={[0, 9]} $rowStart={[2, 1]}>
          <OakFlex
            $flexDirection={"column"}
            $mt={["space-between-l", "space-between-none"]}
            $gap={"all-spacing-9"}
            $mb={"space-between-m"}
          >
            {additionalFiles && (
              <LessonOverviewFilesNeeded
                slugs={slugs}
                additionalFiles={additionalFiles}
              />
            )}
            {teacherTips && teacherTips.length > 0 && (
              <OakBox>
                <LessonOverviewTeacherTips teacherTips={teacherTips} />
              </OakBox>
            )}
            {(equipmentAndResources && equipmentAndResources.length > 0) ||
            (contentGuidance && contentGuidance.length > 0) ||
            supervisionLevel ||
            isLegacyLicense !== undefined ? (
              <LessonOverviewHelper
                equipment={equipmentAndResources}
                contentGuidance={contentGuidance}
                supervisionLevel={supervisionLevel}
                isLegacyLicense={isLegacyLicense}
                updatedAt={updatedAt}
              />
            ) : null}
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </MathJaxWrapper>
  );
};

export default LessonOverviewDetails;
