import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonOverviewData } from "@/node-lib/curriculum-api";
import {
  LessonEngineProvider,
  LessonReviewSection,
  allLessonReviewSections,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import { PupilViewsIntro } from "@/components/PupilViews/PupilIntro";
import { PupilViewsLessonOverview } from "@/components/PupilViews/PupilLessonOverview";
import { PupilViewsReview } from "@/components/PupilViews/PupilReview";
import { PupilViewsQuiz } from "@/components/PupilViews/PupilQuiz";
import { PupilViewsVideo } from "@/components/PupilViews/PupilVideo";
import { getInteractiveQuestions } from "@/components/PupilComponents/QuizUtils/questionUtils";

export const pickAvailableSectionsForLesson = (
  curriculumData: PupilLessonOverviewData,
) =>
  allLessonReviewSections.filter((section) => {
    switch (section) {
      case "starter-quiz":
        return !!curriculumData?.starterQuiz?.length;
      case "exit-quiz":
        return !!curriculumData?.exitQuiz?.length;
      case "video":
        return !!curriculumData.videoMuxPlaybackId;
      default:
        return true;
    }
  });

export type PupilExperienceViewProps = {
  curriculumData: PupilLessonOverviewData;
  hasWorksheet: boolean;
  backUrl?: string | null;
};

export const PupilPageContent = ({
  curriculumData,
  hasWorksheet,
  backUrl,
}: PupilExperienceViewProps) => {
  const { currentSection } = useLessonEngineContext();

  const {
    starterQuiz,
    exitQuiz,
    lessonTitle,
    subjectTitle,
    subjectSlug,
    yearTitle,
    pupilLessonOutcome,
    videoMuxPlaybackId,
    videoWithSignLanguageMuxPlaybackId,
    isLegacy,
  } = curriculumData;

  const starterQuizNumQuestions = getInteractiveQuestions(starterQuiz).length;
  const exitQuizNumQuestions = getInteractiveQuestions(exitQuiz).length;

  switch (currentSection) {
    case "overview":
      return (
        <PupilViewsLessonOverview
          lessonTitle={lessonTitle}
          subjectTitle={subjectTitle}
          subjectSlug={subjectSlug}
          yearTitle={yearTitle ?? undefined}
          pupilLessonOutcome={pupilLessonOutcome ?? undefined}
          starterQuizNumQuestions={starterQuizNumQuestions}
          exitQuizNumQuestions={exitQuizNumQuestions}
          backUrl={backUrl}
        />
      );
    case "intro":
      return (
        <PupilViewsIntro {...curriculumData} hasWorksheet={hasWorksheet} />
      );
    case "starter-quiz":
      return <PupilViewsQuiz questionsArray={starterQuiz ?? []} />;
    case "video":
      return (
        <PupilViewsVideo
          lessonTitle={lessonTitle}
          videoMuxPlaybackId={videoMuxPlaybackId ?? undefined}
          videoWithSignLanguageMuxPlaybackId={
            videoWithSignLanguageMuxPlaybackId ?? undefined
          }
          transcriptSentences={curriculumData.transcriptSentences ?? []}
          isLegacy={isLegacy}
        />
      );
    case "exit-quiz":
      return <PupilViewsQuiz questionsArray={exitQuiz ?? []} />;
    case "review":
      return <PupilViewsReview lessonTitle={lessonTitle} backUrl={backUrl} />;
    default:
      return null;
  }
};

export const PupilExperienceView = ({
  curriculumData,
  hasWorksheet,
  backUrl,
}: PupilExperienceViewProps) => {
  const availableSections = pickAvailableSectionsForLesson(curriculumData);

  const sectionCompletedTrackingCB = (section: LessonReviewSection) => {
    console.log("Section completed: ", section);
    // send tracking here
  };

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <LessonEngineProvider
        initialLessonReviewSections={availableSections}
        sectionCompletedTrackingCB={sectionCompletedTrackingCB}
      >
        <OakBox $height={"100vh"}>
          <PupilPageContent
            curriculumData={curriculumData}
            hasWorksheet={hasWorksheet}
            backUrl={backUrl}
          />
        </OakBox>
      </LessonEngineProvider>
    </OakThemeProvider>
  );
};
