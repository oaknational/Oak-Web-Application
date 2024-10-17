import { useState } from "react";
import { useRouter } from "next/router";
import { createGlobalStyle } from "styled-components";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
  OakPupilJourneyContentGuidance,
} from "@oaknational/oak-components";
import { OakPupilClientProvider } from "@oaknational/oak-pupil-client";

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
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { usePupilAnalytics } from "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics";
import { ContentGuidanceWarningValueType } from "@/browser-lib/avo/Avo";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

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
  browseData: LessonBrowseData;
  lessonContent: LessonContent;
  hasWorksheet: boolean;
  backUrl?: string | null;
  initialSection: LessonSection;
  pageType: "preview" | "canonical" | "browse";
};

export const PupilPageContent = ({
  browseData,
  lessonContent,
  hasWorksheet,
  backUrl,
  pageType,
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
    contentGuidance,
    supervisionLevel,
  } = lessonContent;

  const starterQuizNumQuestions = getInteractiveQuestions(starterQuiz).length;
  const exitQuizNumQuestions = getInteractiveQuestions(exitQuiz).length;

  const narrowTranscriptSentences = (
    transcriptSentences: string[] | string | undefined,
  ) =>
    Array.isArray(transcriptSentences)
      ? transcriptSentences
      : [transcriptSentences ?? ""];

  switch (currentSection) {
    case "overview":
      return (
        <PupilViewsLessonOverview
          lessonTitle={lessonTitle ?? ""}
          browseData={browseData}
          pupilLessonOutcome={pupilLessonOutcome ?? undefined}
          contentGuidance={contentGuidance}
          supervisionLevel={supervisionLevel ?? undefined}
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
          transcriptSentences={narrowTranscriptSentences(
            lessonContent.transcriptSentences,
          )}
          isLegacy={isLegacy ?? false}
          browseData={browseData}
        />
      );
    case "exit-quiz":
      return <PupilViewsQuiz questionsArray={exitQuiz ?? []} />;
    case "review":
      return (
        <PupilViewsReview
          lessonTitle={lessonTitle ?? ""}
          backUrl={backUrl}
          starterQuizQuestionsArray={starterQuiz ?? []}
          exitQuizQuestionsArray={exitQuiz ?? []}
          programmeSlug={browseData.programmeSlug}
          unitSlug={browseData.unitSlug}
          browseData={browseData}
          pageType={pageType}
        />
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

const PupilExperienceLayout = ({
  browseData,
  lessonContent,
  hasWorksheet,
  backUrl,
  initialSection,
  pageType,
}: PupilExperienceViewProps) => {
  const [trackingSent, setTrackingSent] = useState<boolean>(false);
  const { track } = usePupilAnalytics();
  const [isOpen, setIsOpen] = useState<boolean>(
    !!lessonContent.contentGuidance,
  );
  const router = useRouter();
  const availableSections = pickAvailableSectionsForLesson(lessonContent);

  const isSensitive = lessonContent.deprecatedFields?.isSensitive === true;

  const handleContentGuidanceAccept = () => {
    setIsOpen(false);
    track.contentGuidanceAccepted({
      supervisionLevel: lessonContent.supervisionLevel || "",
      contentGuidanceWarning: lessonContent.contentGuidance?.find((cg) => {
        return cg.contentguidanceArea;
      })?.contentguidanceArea as ContentGuidanceWarningValueType,
    });
  };

  const handleContentGuidanceDecline = () => {
    backUrl ? router.replace(backUrl) : router.back();
    track.contentGuidanceDeclined({
      supervisionLevel: lessonContent.supervisionLevel || "",
      contentGuidanceWarning: lessonContent.contentGuidance?.find((cg) => {
        return cg.contentguidanceArea;
      })?.contentguidanceArea as ContentGuidanceWarningValueType,
    });
  };

  if (trackingSent === false) {
    track.lessonAccessed({
      componentType: "page view",
    });
    setTrackingSent(true);
  }

  return (
    <OakPupilClientProvider
      config={{
        getLessonAttemptUrl: getBrowserConfig("oakGetLessonAttemptUrl"),
        logLessonAttemptUrl: getBrowserConfig("oakLogLessonAttemptUrl"),
      }}
    >
      <PupilLayout
        seoProps={{
          ...getSeoProps({
            title: browseData.lessonData.title,
            description: browseData.lessonData.pupilLessonOutcome,
          }),
          noIndex: isSensitive,
          noFollow: isSensitive,
        }}
      >
        <OakThemeProvider theme={oakDefaultTheme}>
          <CookieConsentStyles />
          <LessonEngineProvider
            initialLessonReviewSections={availableSections}
            initialSection={initialSection}
          >
            <OakPupilJourneyContentGuidance
              isOpen={isOpen}
              onAccept={handleContentGuidanceAccept}
              onDecline={handleContentGuidanceDecline}
              contentGuidance={lessonContent.contentGuidance}
              supervisionLevel={lessonContent.supervisionLevel}
            />

            <OakBox style={{ pointerEvents: !isOpen ? "all" : "none" }}>
              <OakBox $height={"100vh"}>
                {browseData.lessonData.deprecatedFields?.expired ? (
                  <PupilExpiredView lessonTitle={browseData.lessonData.title} />
                ) : (
                  <PupilPageContent
                    browseData={browseData}
                    lessonContent={lessonContent}
                    hasWorksheet={hasWorksheet}
                    backUrl={backUrl}
                    pageType={pageType}
                  />
                )}
              </OakBox>
            </OakBox>
          </LessonEngineProvider>
        </OakThemeProvider>
      </PupilLayout>
    </OakPupilClientProvider>
  );
};

export const PupilExperienceView = (props: PupilExperienceViewProps) => {
  const { browseData, lessonContent } = props;
  return (
    <PupilAnalyticsProvider
      pupilPathwayData={getPupilPathwayData(browseData)}
      lessonContent={lessonContent}
    >
      <PupilExperienceLayout {...props} />
    </PupilAnalyticsProvider>
  );
};
