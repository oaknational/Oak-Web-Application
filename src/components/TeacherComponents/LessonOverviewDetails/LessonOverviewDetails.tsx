import React, { FC, Fragment } from "react";
import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
} from "@oaknational/oak-components";

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
import LessonInformationBox from "@/app/(core)/teachers/programmes/[slug]/units/[unitSlug]/lessons/[lessonSlug]/Components/LessonInformationBox/LessonInformationBox";
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
  loginRequired: boolean;
  georestricted: boolean;
  useIntegratedJourneyLayout: boolean;
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
  loginRequired,
  georestricted,
  useIntegratedJourneyLayout,
}) => {
  const { lessonSlug, unitSlug, programmeSlug } = slugs;
  const MathJaxWrapper = isMathJaxLesson ? MathJaxWrap : Fragment;

  const getTeacherTips = () => {
    if (teacherTips) {
      const tips = teacherTips
        .filter((tip) => !!tip && !!tip.teacherTip)
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
