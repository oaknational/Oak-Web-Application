import { createGlobalStyle } from "styled-components";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import {
  LessonEngineProvider,
  LessonSection,
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
import {
  PupilAnalyticsProvider,
  getPupilPathwayData,
} from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import {
  BrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const pickAvailableSectionsForLesson = (lessonContent: LessonContent) =>
  allLessonReviewSections.filter((section) => {
    switch (section) {
      case "starter-quiz":
        return !!lessonContent?.starterQuiz?.length;
      case "exit-quiz":
        return !!lessonContent?.exitQuiz?.length;
      case "video":
        return !!lessonContent?.videoMuxPlaybackId;
      default:
        return true;
    }
  });

export type PupilExperienceViewProps = {
  browseData: BrowseData;
  lessonContent: LessonContent;
  hasWorksheet: boolean;
  backUrl?: string | null;
  initialSection: LessonSection;
};

export const PupilPageContent = ({
  browseData,
  lessonContent,
  hasWorksheet,
  backUrl,
}: Omit<PupilExperienceViewProps, "initialSection">) => {
  const { currentSection } = useLessonEngineContext();
  const {
    starterQuiz,
    exitQuiz,
    lessonTitle,
    pupilLessonOutcome,
    videoMuxPlaybackId,
    videoWithSignLanguageMuxPlaybackId,
    isLegacy,
  } = lessonContent;

  const { subjectDescription, subjectSlug, yearDescription } =
    browseData.programmeFields;

  const starterQuizNumQuestions = getInteractiveQuestions(starterQuiz).length;
  const exitQuizNumQuestions = getInteractiveQuestions(exitQuiz).length;

  switch (currentSection) {
    case "overview":
      return (
        <PupilViewsLessonOverview
          lessonTitle={lessonTitle ?? ""}
          subjectTitle={subjectDescription}
          subjectSlug={subjectSlug}
          yearTitle={yearDescription}
          pupilLessonOutcome={pupilLessonOutcome ?? undefined}
          starterQuizNumQuestions={starterQuizNumQuestions}
          exitQuizNumQuestions={exitQuizNumQuestions}
          backUrl={backUrl}
        />
      );
    case "intro":
      return <PupilViewsIntro {...lessonContent} hasWorksheet={hasWorksheet} />;
    case "starter-quiz":
      return <PupilViewsQuiz questionsArray={starterQuiz ?? []} />;
    case "video":
      return (
        <PupilViewsVideo
          lessonTitle={lessonTitle ?? ""}
          videoMuxPlaybackId={videoMuxPlaybackId ?? undefined}
          videoWithSignLanguageMuxPlaybackId={
            videoWithSignLanguageMuxPlaybackId ?? undefined
          }
          transcriptSentences={lessonContent.transcriptSentences ?? []}
          isLegacy={isLegacy ?? false}
        />
      );
    case "exit-quiz":
      return <PupilViewsQuiz questionsArray={exitQuiz ?? []} />;
    case "review":
      return (
        <PupilViewsReview lessonTitle={lessonTitle ?? ""} backUrl={backUrl} />
      );
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
  browseData,
  lessonContent,
  hasWorksheet,
  backUrl,
  initialSection,
}: PupilExperienceViewProps) => {
  const availableSections = pickAvailableSectionsForLesson(lessonContent);

  return (
    <PupilAnalyticsProvider pupilPathwayData={getPupilPathwayData(browseData)}>
      <PupilLayout
        seoProps={{
          ...getSeoProps({
            title: browseData.lessonData.title,
            description: browseData.lessonData.pupilLessonOutcome,
          }),
        }}
      >
        <OakThemeProvider theme={oakDefaultTheme}>
          <CookieConsentStyles />
          <LessonEngineProvider
            initialLessonReviewSections={availableSections}
            initialSection={initialSection}
          >
            <OakBox $height={"100vh"}>
              {browseData.lessonData.deprecatedFields?.expired ? (
                <PupilExpiredView lessonTitle={browseData.lessonData.title} />
              ) : (
                <PupilPageContent
                  browseData={browseData}
                  lessonContent={lessonContent}
                  hasWorksheet={hasWorksheet}
                  backUrl={backUrl}
                />
              )}
            </OakBox>
          </LessonEngineProvider>
        </OakThemeProvider>
      </PupilLayout>
    </PupilAnalyticsProvider>
  );
};
