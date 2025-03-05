import React, { FC, Fragment } from "react";

import {
  OakBasicAccordion,
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
};

const getPhase = (year: string) => {
  return Number(year) < 7 ? "primary" : "secondary";
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
}) => {
  const showLessonHelperAccordion =
    !isLegacyLicense && subject && unit && year && keystage;
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
              <OakBasicAccordion
                header={
                  <OakHeading $font="heading-5" tag="h3" $textAlign="left">
                    How to plan a lesson using our resources
                  </OakHeading>
                }
                subheading={
                  <>
                    <br />
                    <OakP $font={["body-2", "body-1"]} $textAlign="left">
                      {`To help you plan your ${year.toLowerCase()} ${subject.toLowerCase()} lesson on ${unit},
              download all teaching resources for free and adapt to suit your
              pupil’s needs...`}
                    </OakP>
                  </>
                }
                initialOpen={false}
                id="lesson-overview-seo"
                $bt="border-solid-s"
                $bb="border-solid-s"
                $borderColor="border-neutral-lighter"
                $alignItems="flex-start"
              >
                <br />
                <OakP $font={["body-2", "body-1"]} $textAlign="left">
                  {`To help you plan your ${year.toLowerCase()} ${subject.toLowerCase()} lesson on ${unit},
              download all teaching resources for free and adapt to suit your
              pupil’s needs.`}
                </OakP>
                <br />
                <OakP $font={["body-2", "body-1"]}>
                  The starter quiz will activate and check your pupils' prior
                  knowledge, with versions available both with and without
                  answers in PDF format.
                </OakP>
                <br />
                <OakP $font={["body-2", "body-1"]}>
                  We use learning cycles to break down learning into key
                  concepts or ideas linked to the learning outcome. Each
                  learning cycle features explanations with checks for
                  understanding and practice tasks with feedback. All of this is
                  found in our slide decks, ready for you to download and edit.
                  The practice tasks are also available as printable worksheets
                  and some lessons have additional materials with extra material
                  you might need for teaching the lesson.
                </OakP>
                <br />
                <OakP $font={["body-2", "body-1"]}>
                  The assessment exit quiz will test your pupils' understanding
                  of the key learning points.
                </OakP>
                <br />
                <OakP $font={["body-2", "body-1"]}>
                  Our video is a tool for planning, showing how other teachers
                  might teach the lesson, offering helpful tips, modelled
                  explanations and inspiration for your own delivery in the
                  classroom. Plus, you can set it as homework or revision for
                  pupils and keep their learning on track by sharing an online
                  pupil version of this lesson.
                </OakP>
                <br />
                <OakP $font={["body-2", "body-1"]}>
                  {`Explore more ${keystage.toLowerCase()} ${subject.toLowerCase()} lessons
                from the ${unit} unit, dive into the full ${getPhase(year)} ${subject.toLowerCase()}
                curriculum, or learn more about lesson planning.`}
                </OakP>
              </OakBasicAccordion>
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
