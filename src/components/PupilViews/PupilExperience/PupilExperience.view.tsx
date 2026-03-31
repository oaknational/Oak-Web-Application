import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { createGlobalStyle } from "styled-components";
import {
  OakBox,
  OakPupilJourneyContentGuidance,
} from "@oaknational/oak-components";

import {
  LessonEngineProvider,
  LessonSection,
  LessonReviewSection,
  LessonSectionResults,
  allLessonReviewSections,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import {
  PupilViewsIntro,
  WorksheetInfo,
} from "@/components/PupilViews/PupilIntro";
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
  AdditionalFile,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { usePupilAnalytics } from "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics";
import {
  AnalyticsUseCase,
  ComponentType,
  ContentGuidanceWarningValueType,
} from "@/browser-lib/avo/Avo";
import { PupilRedirectedOverlay } from "@/components/PupilComponents/PupilRedirectedOverlay/PupilRedirectedOverlay";
import { useWorksheetInfoState } from "@/components/PupilComponents/pupilUtils/useWorksheetInfoState";
import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import type { AddOnContextResponse } from "@/browser-lib/google-classroom/googleClassroomApi";
import { type ClassroomProgressContext } from "@/browser-lib/google-classroom";
import { mapToSubmitPupilProgress } from "@/browser-lib/google-classroom/mapToSubmitPupilProgress";
import { mapPupilLessonProgressToSectionResults } from "@/browser-lib/google-classroom/mapPupilLessonProgressToSectionResults";
import {
  GoogleClassroomAnalyticsProvider,
  useGoogleClassroomAnalytics,
} from "@/components/GoogleClassroom/useGoogleClassroomAnalytics";
import {
  type GoogleClassroomContext,
  useGoogleClassroomContext,
} from "@/components/GoogleClassroom/useGoogleClassroomContext";

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
  hasAdditionalFiles: boolean;
  additionalFiles: AdditionalFile[] | null;
  worksheetInfo: WorksheetInfo | null;
};

export const PupilPageContent = ({
  browseData,
  lessonContent,
  hasAdditionalFiles,
  hasWorksheet,
  backUrl,
  pageType,
  worksheetInfo,
  additionalFiles,
}: Omit<PupilExperienceViewProps, "initialSection">) => {
  const { currentSection } = useLessonEngineContext();
  const {
    starterQuiz,
    exitQuiz,
    lessonTitle,
    pupilLessonOutcome,
    phonicsOutcome,
    videoMuxPlaybackId,
    videoWithSignLanguageMuxPlaybackId,
    isLegacy,
    contentGuidance,
    supervisionLevel,
  } = lessonContent;

  const ageRestriction = browseData.features?.ageRestriction;
  const starterQuizNumQuestions = getInteractiveQuestions(starterQuiz).length;
  const exitQuizNumQuestions = getInteractiveQuestions(exitQuiz).length;

  const narrowTranscriptSentences = (
    transcriptSentences: string[] | string | undefined,
  ) =>
    Array.isArray(transcriptSentences)
      ? transcriptSentences
      : [transcriptSentences ?? ""];

  const hasVideoSection = Boolean(videoMuxPlaybackId);
  const [hasVisitedVideoSection, setHasVisitedVideoSection] = useState(
    currentSection === "video",
  );

  useEffect(() => {
    if (currentSection === "video") {
      setHasVisitedVideoSection(true);
    }
  }, [currentSection]);

  return (
    <>
      {currentSection === "overview" && (
        <PupilViewsLessonOverview
          lessonTitle={lessonTitle ?? ""}
          browseData={browseData}
          pupilLessonOutcome={pupilLessonOutcome ?? undefined}
          phonicsOutcome={phonicsOutcome ?? undefined}
          contentGuidance={contentGuidance}
          supervisionLevel={supervisionLevel ?? undefined}
          starterQuizNumQuestions={starterQuizNumQuestions}
          exitQuizNumQuestions={exitQuizNumQuestions}
          backUrl={backUrl}
        />
      )}

      {currentSection === "intro" && (
        <PupilViewsIntro
          {...lessonContent}
          hasWorksheet={hasWorksheet}
          hasAdditionalFiles={hasAdditionalFiles}
          additionalFiles={additionalFiles}
          worksheetInfo={worksheetInfo}
          ageRestriction={ageRestriction}
        />
      )}

      {currentSection === "starter-quiz" && (
        <PupilViewsQuiz questionsArray={starterQuiz ?? []} />
      )}

      {hasVideoSection && hasVisitedVideoSection && (
        <OakBox
          $display={currentSection === "video" ? "block" : "none"}
          aria-hidden={currentSection !== "video"}
          $height="100vh"
        >
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
            hasAdditionalFiles={hasAdditionalFiles}
            additionalFiles={additionalFiles}
          />
        </OakBox>
      )}

      {currentSection === "exit-quiz" && (
        <PupilViewsQuiz questionsArray={exitQuiz ?? []} />
      )}

      {currentSection === "review" && (
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
      )}
    </>
  );
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

const PupilExperienceClassroomAnalytics = ({
  isGoogleClassroomAssignment,
}: {
  isGoogleClassroomAssignment: boolean;
}) => {
  const trackAddOnOpenedOnce = useGoogleClassroomAnalytics(
    (state) => state.trackAddOnOpenedOnce,
  );
  const clearAddOnOpenedFlag = useGoogleClassroomAnalytics(
    (state) => state.clearAddOnOpenedFlag,
  );

  useEffect(() => {
    window.addEventListener("pagehide", clearAddOnOpenedFlag);
    return () => window.removeEventListener("pagehide", clearAddOnOpenedFlag);
  }, [clearAddOnOpenedFlag]);

  useEffect(() => {
    if (!isGoogleClassroomAssignment) return;

    trackAddOnOpenedOnce({
      analyticsUseCase: AnalyticsUseCase.PUPIL,
    });
  }, [isGoogleClassroomAssignment, trackAddOnOpenedOnce]);

  return null;
};

type ClassroomAnalyticsContext = {
  pupilLoginHint: string | null;
  teacherLoginHint: string | null;
  submissionId: string | null;
};

type PupilExperienceLayoutProps = PupilExperienceViewProps & {
  googleClassroomContext: GoogleClassroomContext;
  onClassroomContextResolved: (ctx: ClassroomAnalyticsContext) => void;
};

const PupilExperienceLayout = ({
  browseData,
  lessonContent,
  hasWorksheet,
  hasAdditionalFiles,
  additionalFiles,
  backUrl,
  initialSection,
  pageType,
  worksheetInfo,
  googleClassroomContext,
  onClassroomContextResolved,
}: PupilExperienceLayoutProps) => {
  const ageRestriction = browseData.features?.ageRestriction;
  const hasAgeRestriction = !!ageRestriction;
  const {
    isClassroomAssignment,
    classroomAssignmentChecked,
    courseId,
    itemId,
    attachmentId,
  } = googleClassroomContext;
  const isGoogleClassroomAssignment =
    isClassroomAssignment === true && classroomAssignmentChecked === true;
  const classroomContextRef = useRef<ClassroomProgressContext | null>(null);
  const [isFetchingClassroomContext, setIsFetchingClassroomContext] =
    useState(false);
  const [isContextReady, setIsContextReady] = useState(false);
  const [initialSectionResults, setInitialSectionResults] =
    useState<LessonSectionResults>();
  const [lessonEngineInstanceKey, setLessonEngineInstanceKey] = useState(0);

  const fetchGoogleClassroomContext = async () => {
    if (!courseId || !itemId || !attachmentId) {
      setIsContextReady(true);
      return;
    }

    try {
      setIsFetchingClassroomContext(true);
      const result: AddOnContextResponse | null =
        await googleClassroomApi.getAddOnContext({
          courseId,
          itemId,
          attachmentId,
        });

      const submissionId = result?.studentContext?.submissionId;
      const pupilLoginHint = result?.pupilLoginHint;
      const teacherLoginHint = result?.teacherLoginHint ?? null;
      onClassroomContextResolved({
        pupilLoginHint: pupilLoginHint ?? null,
        teacherLoginHint,
        submissionId: submissionId ?? null,
      });
      if (submissionId && pupilLoginHint) {
        classroomContextRef.current = {
          submissionId,
          pupilLoginHint,
          attachmentId,
          courseId,
          itemId,
        };

        const progressResult = await googleClassroomApi.getPupilLessonProgress({
          submissionId,
          itemId,
          attachmentId,
        });
        if (!progressResult) return;
        const mappedSectionResults =
          mapPupilLessonProgressToSectionResults(progressResult);
        if (Object.keys(mappedSectionResults).length > 0) {
          setInitialSectionResults(mappedSectionResults);
          setLessonEngineInstanceKey((value) => value + 1);
        }
      }
    } catch {
      // Failed to get context - progress sync will be disabled
    } finally {
      setIsFetchingClassroomContext(false);
      setIsContextReady(true);
    }
  };

  useEffect(() => {
    if (!isGoogleClassroomAssignment || classroomContextRef.current) return;
    fetchGoogleClassroomContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachmentId, courseId, isGoogleClassroomAssignment, itemId]);

  useEffect(() => {
    if (!classroomAssignmentChecked) return;
    if (!isGoogleClassroomAssignment) setIsContextReady(true);
  }, [classroomAssignmentChecked, isGoogleClassroomAssignment]);

  const handleOnNext = useCallback(
    async (
      sectionResults: LessonSectionResults,
      _completedSection: LessonReviewSection,
    ) => {
      const ctx = classroomContextRef.current;
      if (!ctx) return;

      try {
        const payload = mapToSubmitPupilProgress(ctx, sectionResults);
        await googleClassroomApi.submitPupilProgress(payload);
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  const getAgeRestrictionString = (
    ageRestriction: string | undefined | null,
  ) => {
    switch (ageRestriction) {
      case "7_and_above":
        return `To view this lesson, you must be in year 7 and above`;
      case "10_and_above":
        return `To view this lesson, you must be in year 10 and above`;
      default:
        return `This lesson is age restricted.`;
    }
  };

  const { track } = usePupilAnalytics();
  const [isOpen, setIsOpen] = useState<boolean>(
    !!lessonContent.contentGuidance || hasAgeRestriction,
  );
  const router = useRouter();
  const availableSections = pickAvailableSectionsForLesson(lessonContent);

  const isSensitive = lessonContent.deprecatedFields?.isSensitive === true;

  const [redirectOverlayCleared, setRedirectOverlayCleared] = useState(false);

  const handleContentGuidanceAccept = () => {
    setIsOpen(false);
    track.contentGuidanceAccepted({
      supervisionLevel: lessonContent.supervisionLevel || "",
      contentGuidanceWarning: lessonContent.contentGuidance?.find((cg) => {
        return cg.contentguidanceArea;
      })?.contentguidanceArea as ContentGuidanceWarningValueType,
      ageRestriction: hasAgeRestriction ? ageRestriction : "all",
    });
  };

  const handleContentGuidanceDecline = () => {
    if (isGoogleClassroomAssignment) {
      window?.parent?.postMessage(
        {
          type: "Classroom",
          action: "closeIframe",
        },
        "https://classroom.google.com",
      );
    } else if (backUrl) {
      router.replace(backUrl);
    } else {
      router.back();
    }
    track.contentGuidanceDeclined({
      supervisionLevel: lessonContent.supervisionLevel || "",
      contentGuidanceWarning: lessonContent.contentGuidance?.find((cg) => {
        return cg.contentguidanceArea;
      })?.contentguidanceArea as ContentGuidanceWarningValueType,
      ageRestriction: hasAgeRestriction ? ageRestriction : "all",
    });
  };

  useEffect(() => {
    if (!isContextReady) return;
    track.lessonAccessedPupilJourney({
      componentType: ComponentType.PAGE_VIEW,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContextReady]);

  const declineIcon = isGoogleClassroomAssignment ? "cross" : undefined;
  const declineText = isGoogleClassroomAssignment ? "Exit lesson" : undefined;
  return (
    <GoogleClassroomAnalyticsProvider>
      <PupilExperienceClassroomAnalytics
        isGoogleClassroomAssignment={isGoogleClassroomAssignment}
      />
      <PupilLayout
        seoProps={{
          ...getSeoProps({
            title: browseData.lessonData.title,
            description: browseData.lessonData.pupilLessonOutcome,
          }),
          noIndex: true,
          noFollow: isSensitive,
        }}
      >
        <CookieConsentStyles />
        <LessonEngineProvider
          key={lessonEngineInstanceKey}
          initialLessonReviewSections={availableSections}
          initialSection={initialSection}
          initialSectionResults={initialSectionResults}
          onNext={isGoogleClassroomAssignment ? handleOnNext : undefined}
          onSectionResultUpdate={
            isGoogleClassroomAssignment ? handleOnNext : undefined
          }
          isHydratingInitialProgress={isFetchingClassroomContext}
        >
          {hasAgeRestriction ? (
            <OakPupilJourneyContentGuidance
              isOpen={isOpen && redirectOverlayCleared}
              onAccept={handleContentGuidanceAccept}
              onDecline={handleContentGuidanceDecline}
              title={getAgeRestrictionString(ageRestriction)}
              declineIcon={declineIcon}
              declineText={declineText}
              contentGuidance={
                lessonContent.contentGuidance
                  ? lessonContent.contentGuidance
                  : [
                      {
                        contentguidanceLabel:
                          "Speak to an adult before starting this lesson.",
                        contentguidanceDescription: null,
                        contentguidanceArea: null,
                      },
                    ]
              }
              supervisionLevel={
                lessonContent.contentGuidance
                  ? lessonContent.supervisionLevel
                  : null
              }
            />
          ) : (
            <OakPupilJourneyContentGuidance
              isOpen={isOpen && redirectOverlayCleared}
              onAccept={handleContentGuidanceAccept}
              onDecline={handleContentGuidanceDecline}
              contentGuidance={lessonContent.contentGuidance}
              supervisionLevel={lessonContent.supervisionLevel}
              declineIcon={declineIcon}
              declineText={declineText}
            />
          )}

          <OakBox style={{ pointerEvents: !isOpen ? "all" : "none" }}>
            <OakBox $height={"100vh"}>
              {browseData.lessonData.deprecatedFields?.expired ? (
                <PupilExpiredView lessonTitle={browseData.lessonData.title} />
              ) : (
                <PupilPageContent
                  browseData={browseData}
                  lessonContent={lessonContent}
                  hasWorksheet={hasWorksheet}
                  worksheetInfo={worksheetInfo}
                  backUrl={backUrl}
                  pageType={pageType}
                  hasAdditionalFiles={hasAdditionalFiles}
                  additionalFiles={additionalFiles}
                />
              )}
            </OakBox>
          </OakBox>
        </LessonEngineProvider>
        <PupilRedirectedOverlay
          isLessonPage={true}
          onLoaded={(isShowing) => setRedirectOverlayCleared(!isShowing)}
          onClose={() => setRedirectOverlayCleared(true)}
        />
      </PupilLayout>
    </GoogleClassroomAnalyticsProvider>
  );
};

export const PupilExperienceView = (props: PupilExperienceViewProps) => {
  const { browseData, lessonContent } = props;
  const [classroomAnalyticsContext, setClassroomAnalyticsContext] =
    useState<ClassroomAnalyticsContext>({
      pupilLoginHint: null,
      teacherLoginHint: null,
      submissionId: null,
    });
  const googleClassroomContext = useGoogleClassroomContext();

  const { worksheetInfo } = useWorksheetInfoState(
    lessonContent.hasWorksheetAssetObject,
    lessonContent.lessonSlug,
  );

  return (
    <PupilAnalyticsProvider
      pupilPathwayData={getPupilPathwayData(browseData)}
      lessonContent={lessonContent}
      classroomAssignmentContext={{
        courseId: googleClassroomContext.courseId,
        itemId: googleClassroomContext.itemId,
        attachmentId: googleClassroomContext.attachmentId,
        clientEnvironment: googleClassroomContext.clientEnvironment,
        classroomAssignmentId: googleClassroomContext.classroomAssignmentId,
      }}
      pupilLoginHint={classroomAnalyticsContext.pupilLoginHint}
      teacherLoginHint={classroomAnalyticsContext.teacherLoginHint}
      submissionId={classroomAnalyticsContext.submissionId}
    >
      <PupilExperienceLayout
        {...props}
        worksheetInfo={worksheetInfo}
        googleClassroomContext={googleClassroomContext}
        onClassroomContextResolved={setClassroomAnalyticsContext}
      />
    </PupilAnalyticsProvider>
  );
};
