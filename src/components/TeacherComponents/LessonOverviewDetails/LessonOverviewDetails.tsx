import React, { FC, Fragment } from "react";
import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
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
import LessonInformationBox from "@/app/(core)/programmes/[subjectPhaseSlug]/units/[unitSlug]/lessons/[lessonSlug]/Components/LessonInformationBox/LessonInformationBox";
import { resolveOakHref } from "@/common-lib/urls";

type LessonOverviewDetailsProps = {
  keyLearningPoints: LessonOverviewKeyLearningPointProps[] | null | undefined;
  commonMisconceptions: LessonOverviewCommonMisconception[] | null | undefined;
  keyWords: LessonOverviewKeywordProps[] | null | undefined;
  teacherTips: LessonOverviewTeacherTipProps[] | null | undefined;
  equipmentAndResources: Equipment[] | null | undefined;
  contentGuidance: ContentGuidance[] | null | undefined;
  hasVocabAndTranscripts: boolean;
  learningOutcome: string | null | undefined;
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
  lesson: string;
  keystage: string | null | undefined;
  keystageSlug: string | null | undefined;
  examBoardSlug: string | null | undefined;
  subjectSlug: string | null | undefined;
  subjectParent: string | null | undefined;
  disablePupilLink?: boolean;
  loginRequired: boolean;
  georestricted: boolean;
  hideSeoHelper?: boolean;
  useIntegratedJourneyLayout: boolean;
  phaseSlug?: string;
};

const LessonOverviewDetails: FC<LessonOverviewDetailsProps> = ({
  keyLearningPoints,
  commonMisconceptions,
  learningOutcome,
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
  lesson,
  year,
  keystage,
  keystageSlug,
  examBoardSlug,
  subjectParent,
  subjectSlug,
  disablePupilLink,
  hideSeoHelper,
  loginRequired,
  georestricted,
  useIntegratedJourneyLayout,
  phaseSlug,
}) => {
  const { lessonSlug, unitSlug, programmeSlug } = slugs;
  const showLessonHelperAccordion =
    !isLegacyLicense &&
    !hideSeoHelper &&
    subject &&
    unit &&
    year &&
    keystage &&
    keystageSlug &&
    unitSlug &&
    programmeSlug &&
    phaseSlug &&
    subjectSlug;
  const MathJaxWrapper = isMathJaxLesson ? MathJaxWrap : Fragment;

  const getTeacherTips = () => {
    if (teacherTips) {
      const tips = teacherTips
        .filter((tip) => tip !== null)
        .map((tip) => tip.teacherTip) as string[];
      return tips.length ? tips : undefined;
    }
    return undefined;
  };
  const teacherTipList = getTeacherTips();
  const equipment = equipmentAndResources
    ? equipmentAndResources.map((e) => e.equipment)
    : undefined;
  const guidance = contentGuidance
    ? contentGuidance.map((c) => c.contentGuidanceLabel)
    : undefined;
  const filesNeeded =
    additionalFiles && programmeSlug && unitSlug
      ? {
          files: additionalFiles,
          georestricted,
          loginRequired,
          href: resolveOakHref({
            page: "lesson-downloads",
            lessonSlug,
            programmeSlug,
            unitSlug,
            downloads: "downloads",
            query: {
              preselected: "additional files",
            },
          }),
        }
      : undefined;

  return (
    <MathJaxWrapper>
      <OakGrid>
        <OakGridArea
          $colSpan={[12, useIntegratedJourneyLayout ? 12 : 8]}
          $rowStart={1}
        >
          <OakFlex
            $flexDirection={"column"}
            $flexGrow={1}
            $mr="spacing-16"
            $gap="spacing-48"
            $mb="spacing-24"
          >
            {useIntegratedJourneyLayout && learningOutcome && (
              <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
                <OakHeading $font={["heading-6", "heading-5"]} tag="h3">
                  Learning outcome
                </OakHeading>
                <OakP $font="body-2">{learningOutcome}</OakP>
              </OakFlex>
            )}
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
            {useIntegratedJourneyLayout && (
              <OakFlex $flexDirection={"column"} $gap={"spacing-40"}>
                {teacherTipList && (
                  <LessonInformationBox teacherTip={teacherTipList} />
                )}
                <LessonInformationBox
                  licence={{ copyrightYear: updatedAt }}
                  equipment={equipment?.filter(Boolean)}
                  supervision={supervisionLevel ?? undefined}
                  filesNeeded={filesNeeded}
                  contentGuidance={guidance?.filter(Boolean)}
                />
              </OakFlex>
            )}
            {showLessonHelperAccordion && !useIntegratedJourneyLayout && (
              <LessonSeoHelper
                loginRequired={loginRequired}
                geoRestricted={georestricted}
                lessonSlug={lessonSlug}
                year={year}
                programmeSlug={programmeSlug}
                unitSlug={unitSlug}
                subject={subject}
                phaseSlug={phaseSlug}
                unit={unit}
                keystage={keystage}
                keystageSlug={keystageSlug}
                examBoardSlug={examBoardSlug}
                subjectSlug={subjectSlug}
                parentSubject={subjectParent}
                disablePupilLink={
                  disablePupilLink || georestricted || loginRequired
                }
                lesson={lesson}
                isIntegratedJourney={false}
              />
            )}
          </OakFlex>
        </OakGridArea>
        {!useIntegratedJourneyLayout && (
          <OakGridArea $colSpan={[12, 4]} $colStart={[0, 9]} $rowStart={[2, 1]}>
            <OakFlex
              $flexDirection={"column"}
              $mt={["spacing-48", "spacing-0"]}
              $gap={"spacing-48"}
              $mb={"spacing-24"}
            >
              {additionalFiles && (
                <LessonOverviewFilesNeeded
                  loginRequired={loginRequired}
                  geoRestricted={georestricted}
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
        )}
      </OakGrid>
    </MathJaxWrapper>
  );
};

export default LessonOverviewDetails;
