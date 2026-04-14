"use client";

import { OakBox, OakGrid, OakGridArea } from "@oaknational/oak-components";

import LessonOverviewVideo from "../../../../../../../../../components/TeacherComponents/LessonOverviewVideo";
import { getAnalyticsBrowseData } from "../../../../../../../../../components/TeacherComponents/helpers/getAnalyticsBrowseData";

import PreviousNextNav from "@/components/TeacherComponents/PreviousNextNav/PreviousNextNav";
import { resolveOakHref } from "@/common-lib/urls";
import type { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import LessonOverviewPresentation from "@/components/TeacherComponents/LessonOverviewPresentation";
import LessonOverviewDocPresentation from "@/components/TeacherComponents/LessonOverviewDocPresentation";
import LessonOverviewMediaClips from "@/components/TeacherComponents/LessonOverviewMediaClips";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";
import LessonDetails from "@/components/TeacherComponents/LessonOverviewDetails";
import QuizContainerNew from "@/components/TeacherComponents/LessonOverviewQuizContainer";
import { createAttributionObject } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import {
  LessonOverviewQuizQuestion,
  StemObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";

const ALLOWED_MATHJAX_SUBJECT_SLUGS = new Set([
  "maths",
  "physics",
  "chemistry",
  "biology",
  "combined-science",
  "science",
]);

const containsMathJax = (text: string | undefined | null): boolean => {
  if (!text) return false;
  const mathJaxPatterns = /(\$\$|\\\[|\\\(|\\begin\{)/;
  return mathJaxPatterns.test(text);
};

const findMathJaxInStemObjects = (answer: StemObject[]): boolean => {
  if (!answer) return false;
  return answer.some((a) => a.type === "text" && containsMathJax(a.text));
};

const hasAnswerMathJax = (question: LessonOverviewQuizQuestion): boolean => {
  const answers = question.answers;
  if (!answers) return false;

  if (
    answers["multiple-choice"]?.some((ans) =>
      findMathJaxInStemObjects(ans.answer),
    )
  ) {
    return true;
  }

  if (answers.match?.some((ans) => findMathJaxInStemObjects(ans.matchOption))) {
    return true;
  }

  if (answers.order?.some((ans) => findMathJaxInStemObjects(ans.answer))) {
    return true;
  }

  if (
    answers["short-answer"]?.some((ans) => findMathJaxInStemObjects(ans.answer))
  ) {
    return true;
  }

  return false;
};

const hasQuizMathJax = (
  quizData: LessonOverviewQuizQuestion[] | undefined,
): boolean => {
  return (
    quizData?.some((question) => {
      const stemCheck = question.questionStem?.some(
        (stem) => stem.type === "text" && containsMathJax(stem.text),
      );
      const answerCheck = hasAnswerMathJax(question);
      return stemCheck || answerCheck;
    }) ?? false
  );
};

const hasLessonMathJax = (data: TeachersLessonOverviewPageData): boolean => {
  // Teacher lessons are never legacy license
  const isLegacyLicense = false;

  if (
    (data.subjectSlug &&
      !ALLOWED_MATHJAX_SUBJECT_SLUGS.has(data.subjectSlug)) ||
    isLegacyLicense
  ) {
    return false;
  }

  if (
    data.contentGuidance?.some((cg) =>
      containsMathJax(cg.contentGuidanceDescription),
    )
  ) {
    return true;
  }
  if (
    data.misconceptionsAndCommonMistakes?.some(
      (mcm) =>
        containsMathJax(mcm.misconception) || containsMathJax(mcm.response),
    )
  ) {
    return true;
  }
  if (data.teacherTips?.some((tt) => containsMathJax(tt.teacherTip))) {
    return true;
  }
  if (
    data.keyLearningPoints?.some((klp) => containsMathJax(klp.keyLearningPoint))
  ) {
    return true;
  }
  if (
    data.lessonKeywords?.some(
      (kw) => containsMathJax(kw.keyword) || containsMathJax(kw.description),
    )
  ) {
    return true;
  }

  return (
    hasQuizMathJax(data.exitQuiz || []) ||
    hasQuizMathJax(data.starterQuiz || [])
  );
};

function getLessonResources({
  data,
  copyRightState,
}: {
  data: TeachersLessonOverviewPageData;
  copyRightState: ReturnType<typeof useComplexCopyright>;
}) {
  const isMathJaxLesson = hasLessonMathJax(data);
  const browsePathwayData = getAnalyticsBrowseData({
    keyStageSlug: data.keyStageSlug,
    keyStageTitle: data.keyStageTitle,
    subjectSlug: data.subjectSlug,
    subjectTitle: data.subjectTitle,
    unitSlug: data.unitSlug,
    unitTitle: data.unitTitle,
    year: data.year,
    yearTitle: data.yearTitle,
    examBoardTitle: data.examBoardTitle,
    tierTitle: data.tierTitle,
    pathwayTitle: data.pathwayTitle,
    lessonSlug: data.lessonSlug,
    lessonName: data.lessonTitle,
    lessonReleaseDate: data.lessonReleaseDate,
    isLegacy: false,
  });
  const lessonGuide = data.lessonGuideUrl ? (
    <LessonOverviewDocPresentation
      asset={data.lessonGuideUrl}
      title={data.lessonTitle}
      isWorksheetLandscape={true}
      docType="lesson guide"
    />
  ) : undefined;
  const presentation = data.presentationUrl ? (
    <LessonOverviewPresentation
      asset={data.presentationUrl}
      title={data.lessonTitle}
      isWorksheet={false}
    />
  ) : undefined;
  const mediaClips = data.lessonMediaClips?.length ? (
    <LessonOverviewMediaClips
      lessonSlug={data.lessonSlug}
      learningCycleVideos={data.lessonMediaClips}
      isCanonical={false}
      unitSlug={data.unitSlug}
      programmeSlug={data.programmeSlug}
      lessonOutline={data.lessonOutline}
      isPELesson={!!data.actions?.displayPETitle}
      isMFL={!!data.actions?.displayVocabButton}
      onTrackingCallback={() => {}}
    />
  ) : undefined;
  const lessonDetails = (
    <LessonDetails
      loginRequired={data.loginRequired}
      geoRestricted={data.geoRestricted}
      keyLearningPoints={data.keyLearningPoints}
      commonMisconceptions={data.misconceptionsAndCommonMistakes}
      keyWords={data.lessonKeywords?.length ? data.lessonKeywords : undefined}
      slugs={{
        lessonSlug: data.lessonSlug,
        unitSlug: data.unitSlug,
        programmeSlug: data.programmeSlug,
      }}
      teacherTips={data.teacherTips}
      equipmentAndResources={data.lessonEquipmentAndResources}
      contentGuidance={data.contentGuidance}
      supervisionLevel={data.supervisionLevel}
      isLegacyLicense={false}
      isMathJaxLesson={isMathJaxLesson}
      hasVocabAndTranscripts={Boolean(data.additionalMaterialUrl)}
      displayVocab={!!data.actions?.displayVocabButton}
      updatedAt={data.updatedAt}
      additionalFiles={data.additionalFiles}
      year={data.yearTitle}
      subject={data.subjectTitle}
      keystage={data.keyStageTitle}
      unit={data.unitTitle}
      lesson={data.lessonTitle}
      examBoardSlug={data.examBoardSlug}
      subjectSlug={data.subjectSlug}
      subjectParent={data.subjectParent}
      disablePupilLink={data.actions?.disablePupilShare}
      hideSeoHelper={copyRightState.showGeoBlocked}
    />
  );
  const lessonVideo = (
    <LessonOverviewVideo
      video={data.videoMuxPlaybackId}
      signLanguageVideo={data.videoWithSignLanguageMuxPlaybackId}
      title={data.lessonTitle}
      transcriptSentences={data.transcriptSentences}
      isLegacy={false}
      browsePathwayData={browsePathwayData}
    />
  );
  const worksheet = data.worksheetUrl ? (
    <LessonOverviewPresentation
      asset={data.worksheetUrl}
      title={data.lessonTitle}
      isWorksheetLandscape={!!data.isWorksheetLandscape}
      isWorksheet={true}
    />
  ) : undefined;
  const starterQuiz = data.starterQuiz ? (
    <QuizContainerNew
      questions={data.starterQuiz}
      imageAttribution={createAttributionObject(data.starterQuiz)}
      isMathJaxLesson={isMathJaxLesson}
    />
  ) : undefined;
  const exitQuiz = data.exitQuiz ? (
    <QuizContainerNew
      questions={data.exitQuiz}
      imageAttribution={createAttributionObject(data.starterQuiz)}
      isMathJaxLesson={isMathJaxLesson}
    />
  ) : undefined;
  const additionalMaterials = data.additionalMaterialUrl ? (
    <LessonOverviewDocPresentation
      asset={data.additionalMaterialUrl}
      title={data.lessonTitle}
      isWorksheetLandscape={false}
      docType="additional material"
    />
  ) : undefined;
  return [
    { key: "lesson-guide", component: lessonGuide },
    { key: "presentation", component: presentation },
    { key: "media-clips", component: mediaClips },
    { key: "lesson-details", component: lessonDetails },
    { key: "lesson-video", component: lessonVideo },
    { key: "worksheet", component: worksheet },
    { key: "starter-quiz", component: starterQuiz },
    { key: "exit-quiz", component: exitQuiz },
    { key: "addtional-materials", component: additionalMaterials },
  ].filter((item) => item.component);
}

export default function LessonView(
  data: Readonly<TeachersLessonOverviewPageData>,
) {
  const copyRightState = useComplexCopyright({
    loginRequired: data.loginRequired,
    geoRestricted: data.geoRestricted,
  });

  const lessonResources = getLessonResources({ data, copyRightState });
  return (
    <OakBox $ph="spacing-40">
      <OakGrid
        $cg="spacing-16"
        $rg="spacing-56"
        $mb={["spacing-0", "spacing-48", "spacing-48"]}
        $mh="auto"
        $mt={["spacing-48", "spacing-56"]}
        $width={"100%"}
        $maxWidth={"spacing-1280"}
      >
        <OakGridArea
          $colSpan={[12, 3]}
          $alignSelf={"start"}
          $position={"sticky"}
          $display={["none", "block"]}
          $top={"spacing-92"} // FIXME: ideally we'd dynamically calculate this based on the height of the header using the next allowed size. This could be achieved with a new helperFunction get nextAvailableSize
        >
          {/* anchor links area */}
        </OakGridArea>
        <OakGridArea $colSpan={[12, 9]} $mb={"spacing-48"}>
          {lessonResources.map((resource) => (
            <OakBox key={resource.key} $mb={"spacing-48"}>
              {resource.component}
            </OakBox>
          ))}
          <PreviousNextNav
            backgroundColorLevel={1}
            currentIndex={data.orderInUnit ?? undefined}
            navItemType="lesson"
            previous={
              data.previousLesson
                ? {
                    href: resolveOakHref({
                      page: "integrated-lesson-index",
                      programmeSlug: data.programmeSlug,
                      unitSlug: data.unitSlug,
                      lessonSlug: data.previousLesson.lessonSlug,
                    }),
                    title: data.previousLesson.lessonTitle,
                    index: data.previousLesson.lessonIndex,
                  }
                : undefined
            }
            next={
              data.nextLesson
                ? {
                    href: resolveOakHref({
                      page: "integrated-lesson-index",
                      programmeSlug: data.programmeSlug,
                      unitSlug: data.unitSlug,
                      lessonSlug: data.nextLesson.lessonSlug,
                    }),
                    title: data.nextLesson.lessonTitle,
                    index: data.nextLesson.lessonIndex,
                  }
                : undefined
            }
          />
        </OakGridArea>
      </OakGrid>
    </OakBox>
  );
}
