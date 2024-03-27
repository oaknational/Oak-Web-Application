import { createGlobalStyle } from "styled-components";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonOverviewData } from "@/node-lib/curriculum-api";
import {
  LessonEngineProvider,
  allLessonReviewSections,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import { PupilViewsIntro } from "@/components/PupilViews/PupilIntro";
import { PupilViewsLessonOverview } from "@/components/PupilViews/PupilLessonOverview";
import { PupilViewsReview } from "@/components/PupilViews/PupilReview";
import { PupilViewsQuiz } from "@/components/PupilViews/PupilQuiz";
import { PupilViewsVideo } from "@/components/PupilViews/PupilVideo";
import { getInteractiveQuestions } from "@/components/PupilComponents/QuizUtils/questionUtils";
import { PupilExpiredView } from "@/components/PupilViews/PupilExpired/PupilExpired.view";
import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";

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

// Moves Confirmic modal clear of the bottom navigation
// This should be removed once confirmic is replaced (PUPIL-478)
const CookieConsentStyles = createGlobalStyle`
#mtm-frame-container {
  bottom: 70px!important;
  height: 510px;
  overflow: clip;

  // Hides the corner shadow
  > div {
    display: none;  
  }
}
`;

export const PupilExperienceView = ({
  curriculumData,
  hasWorksheet,
  backUrl,
}: PupilExperienceViewProps) => {
  const availableSections = pickAvailableSectionsForLesson(curriculumData);

  return (
    <PupilLayout
      seoProps={{
        ...getSeoProps({
          title: curriculumData.lessonTitle,
          description: "Lesson description",
        }),
      }}
    >
      <OakThemeProvider theme={oakDefaultTheme}>
        <CookieConsentStyles />
        <LessonEngineProvider initialLessonReviewSections={availableSections}>
          <OakBox $height={"100vh"}>
            {curriculumData.expired ? (
              <PupilExpiredView lessonTitle={curriculumData.lessonTitle} />
            ) : (
              <PupilPageContent
                curriculumData={curriculumData}
                hasWorksheet={hasWorksheet}
                backUrl={backUrl}
              />
            )}
          </OakBox>
        </LessonEngineProvider>
      </OakThemeProvider>
    </PupilLayout>
  );
};
