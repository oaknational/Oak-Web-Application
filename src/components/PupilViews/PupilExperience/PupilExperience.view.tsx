import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { createGlobalStyle } from "styled-components";
import {
  OakBox,
  OakInlineBanner,
  OakPupilJourneyContentGuidance,
} from "@oaknational/oak-components";
import { PostSubmissionState } from "@oaknational/google-classroom-addon/types";
import {
  AuthCookieKeys,
  GoogleSignInView,
} from "@oaknational/google-classroom-addon/ui";

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
  mapToSubmitCourseWorkProgress,
  type CourseWorkProgressContext,
} from "@/browser-lib/google-classroom/mapToSubmitCourseWorkProgress";
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
    globalThis.window.addEventListener("pagehide", clearAddOnOpenedFlag);
    return () =>
      globalThis.window.removeEventListener("pagehide", clearAddOnOpenedFlag);
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
  /** When set, the pupil arrived via a CourseWork link (teacher-assigned). */
  assignmentToken?: string | null;
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
  assignmentToken,
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
  const [isReadOnlyState, setIsReadOnlyState] = useState(false);

  // ── CourseWork flow (teacher-assigned link with assignmentToken) ──────────
  const courseWorkContextRef = useRef<CourseWorkProgressContext | null>(null);
  const [isPupilSignInRequired, setIsPupilSignInRequired] = useState(false);
  const isCourseWorkFlow = Boolean(
    assignmentToken && !isGoogleClassroomAssignment,
  );
  // Queue: holds the latest sectionResults that arrived before context was ready.
  // Only the most-recent call matters — earlier partial saves are superseded.
  const pendingCourseWorkSaveRef = useRef<LessonSectionResults | null>(null);
  // Guard against concurrent saves so the read-merge-write in the addon is safe.
  const courseWorkSaveInFlightRef = useRef(false);

  const fetchAddonContext = useCallback(
    async (args: {
      courseId: string;
      itemId: string;
      attachmentId: string;
    }): Promise<AddOnContextResponse | null> => {
      return googleClassroomApi.getAddOnContext(args);
    },
    [],
  );

  const fetchPupilProgress = useCallback(
    async (args: {
      submissionId: string;
      itemId: string;
      attachmentId: string;
    }): Promise<LessonSectionResults> => {
      const progressResult =
        await googleClassroomApi.getPupilLessonProgress(args);

      if (!progressResult) {
        return {};
      }

      return mapPupilLessonProgressToSectionResults(progressResult);
    },
    [],
  );

  const isSubmissionStateReadOnly = useCallback(
    async (args: {
      courseId: string;
      itemId: string;
      attachmentId: string;
      submissionId: string;
    }): Promise<boolean | null> => {
      const submissionState =
        await googleClassroomApi.getPostSubmissionState(args);

      if (!submissionState) {
        return null;
      }

      return (
        submissionState.submissionState === PostSubmissionState.RETURNED ||
        submissionState.submissionState === PostSubmissionState.TURNED_IN
      );
    },
    [],
  );

  useEffect(() => {
    if (!isGoogleClassroomAssignment || classroomContextRef.current) return;
    const hydrateGoogleClassroomContext = async () => {
      if (!courseId || !itemId || !attachmentId) {
        setIsContextReady(true);
        return;
      }

      try {
        setIsFetchingClassroomContext(true);
        const addonContext = await fetchAddonContext({
          courseId,
          itemId,
          attachmentId,
        });

        const submissionId = addonContext?.studentContext?.submissionId;
        const pupilLoginHint = addonContext?.pupilLoginHint;
        const teacherLoginHint = addonContext?.teacherLoginHint ?? null;
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

          const mappedSectionResults = await fetchPupilProgress({
            submissionId,
            itemId,
            attachmentId,
          });
          if (Object.keys(mappedSectionResults).length > 0) {
            setInitialSectionResults(mappedSectionResults);
            setLessonEngineInstanceKey((value) => value + 1);
          }

          const readOnlyState = await isSubmissionStateReadOnly({
            courseId,
            itemId,
            attachmentId,
            submissionId,
          });

          if (readOnlyState !== null) {
            setIsReadOnlyState(readOnlyState);
          }
        }
      } catch {
        // Failed to get context - progress sync will be disabled
      } finally {
        setIsFetchingClassroomContext(false);
        setIsContextReady(true);
      }
    };

    const refreshReadOnlyState = async () => {
      if (!courseId || !itemId || !attachmentId) {
        setIsContextReady(true);
        return;
      }

      try {
        const addonContext = await fetchAddonContext({
          courseId,
          itemId,
          attachmentId,
        });
        const submissionId = addonContext?.studentContext?.submissionId;
        const pupilLoginHint = addonContext?.pupilLoginHint;
        if (!submissionId || !pupilLoginHint) {
          return;
        }

        classroomContextRef.current = {
          submissionId,
          pupilLoginHint,
          attachmentId,
          courseId,
          itemId,
        };

        const readOnlyState = await isSubmissionStateReadOnly({
          courseId,
          itemId,
          attachmentId,
          submissionId,
        });

        if (readOnlyState !== null) {
          setIsReadOnlyState(readOnlyState);
        }
      } catch {
        // Failed to get context - progress sync will be disabled
      }
    };

    void hydrateGoogleClassroomContext();

    const handleWindowFocus = async () => {
      await refreshReadOnlyState();
    };

    globalThis.window.addEventListener("focus", handleWindowFocus);
    return () => {
      globalThis.window.removeEventListener("focus", handleWindowFocus);
    };
  }, [
    attachmentId,
    courseId,
    fetchAddonContext,
    fetchPupilProgress,
    isGoogleClassroomAssignment,
    isSubmissionStateReadOnly,
    itemId,
    onClassroomContextResolved,
  ]);

  useEffect(() => {
    if (!classroomAssignmentChecked) return;
    if (!isGoogleClassroomAssignment) setIsContextReady(true);
  }, [classroomAssignmentChecked, isGoogleClassroomAssignment]);

  const saveCourseWorkProgressNow = useCallback(
    async (sectionResults: LessonSectionResults) => {
      const cwCtx = courseWorkContextRef.current;
      if (!cwCtx) return;
      if (courseWorkSaveInFlightRef.current) {
        // Another save is running — queue this one; it will be flushed on completion.
        pendingCourseWorkSaveRef.current = sectionResults;
        return;
      }
      courseWorkSaveInFlightRef.current = true;
      try {
        const payload = mapToSubmitCourseWorkProgress(cwCtx, sectionResults);
        await googleClassroomApi.upsertCourseWorkProgress(payload);
      } catch (error) {
        console.error("Failed to save CourseWork progress:", error);
      } finally {
        courseWorkSaveInFlightRef.current = false;
        // Flush any save that queued while this one was in flight.
        const pending = pendingCourseWorkSaveRef.current;
        if (pending) {
          pendingCourseWorkSaveRef.current = null;
          void saveCourseWorkProgressNow(pending);
        }
      }
    },
    [],
  );

  // ── CourseWork: hydrate pupil context when assignmentToken is present ──────
  // Extracted so it can be called both on mount and after a successful sign-in.
  const runHydrateCourseWorkContext = useCallback(async () => {
    if (!assignmentToken) return;
    setIsFetchingClassroomContext(true);

    // Check if pupil is authenticated
    const session = await googleClassroomApi.verifySession(true)();
    if (!session.authenticated) {
      setIsPupilSignInRequired(true);
      setIsFetchingClassroomContext(false);
      setIsContextReady(true);
      return;
    }

    try {
      const ctx =
        await googleClassroomApi.getCourseWorkContext(assignmentToken);

      if (!ctx?.submissionId || !session.loginHint) {
        // Can't track progress without a submission – render lesson normally.
        setIsContextReady(true);
        return;
      }

      courseWorkContextRef.current = {
        submissionId: ctx.submissionId,
        assignmentToken,
        courseWorkId: ctx.courseWorkId,
        courseId: ctx.courseId,
        pupilLoginHint: session.loginHint,
      };

      // Restore saved progress
      const savedProgress = await googleClassroomApi.getCourseWorkProgress(
        ctx.submissionId,
        assignmentToken,
      );
      if (savedProgress) {
        const p = savedProgress as Record<string, unknown>;
        const mapped: LessonSectionResults = {};
        if (p.starterQuiz)
          mapped["starter-quiz"] =
            p.starterQuiz as LessonSectionResults["starter-quiz"];
        if (p.exitQuiz)
          mapped["exit-quiz"] = p.exitQuiz as LessonSectionResults["exit-quiz"];
        if (p.video) mapped.video = p.video as LessonSectionResults["video"];
        if (p.intro) mapped.intro = p.intro as LessonSectionResults["intro"];

        if (Object.keys(mapped).length > 0) {
          setInitialSectionResults(mapped);
          setLessonEngineInstanceKey((k) => k + 1);
        }
      }

      // Flush any progress that was queued before context was ready.
      // The isContextReady flush-effect handles the initial load case (where
      // isContextReady transitions false→true); this handles re-hydration after
      // sign-in, where isContextReady is already true and the effect won't re-run.
      const pending = pendingCourseWorkSaveRef.current;
      if (pending) {
        pendingCourseWorkSaveRef.current = null;
        void saveCourseWorkProgressNow(pending);
      }
    } catch {
      // Failed to load context — lesson will render without progress tracking
    } finally {
      setIsFetchingClassroomContext(false);
      setIsContextReady(true);
    }
  }, [assignmentToken, saveCourseWorkProgressNow]);

  useEffect(() => {
    if (!isCourseWorkFlow || !assignmentToken) return;
    if (courseWorkContextRef.current) return;

    void runHydrateCourseWorkContext();
  }, [isCourseWorkFlow, assignmentToken, runHydrateCourseWorkContext]);

  // Flush any progress that was queued before the CourseWork context was ready.
  useEffect(() => {
    if (!isContextReady || !courseWorkContextRef.current) return;
    const pending = pendingCourseWorkSaveRef.current;
    if (!pending) return;
    pendingCourseWorkSaveRef.current = null;
    void saveCourseWorkProgressNow(pending);
  }, [isContextReady, saveCourseWorkProgressNow]);

  const handleOnNext = useCallback(
    async (
      sectionResults: LessonSectionResults,
      _completedSection: LessonReviewSection,
    ) => {
      // CourseWork flow
      if (isCourseWorkFlow) {
        if (courseWorkContextRef.current) {
          await saveCourseWorkProgressNow(sectionResults);
        } else {
          // Context not ready yet — queue so it's flushed once hydration completes.
          pendingCourseWorkSaveRef.current = sectionResults;
        }
        return;
      }

      // Add-on flow
      const ctx = classroomContextRef.current;
      if (!ctx) return;

      try {
        const payload = mapToSubmitPupilProgress(ctx, sectionResults);
        await googleClassroomApi.submitPupilProgress(payload);
      } catch (error) {
        console.error(error);
      }
    },
    [isCourseWorkFlow, saveCourseWorkProgressNow],
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
      globalThis.window?.parent?.postMessage(
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
        {isPupilSignInRequired && (
          <OakBox
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "rgba(255,255,255,0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <OakBox $maxWidth="spacing-480" $width="100%" $pa="spacing-8">
              <GoogleSignInView
                getGoogleSignInLink={() =>
                  googleClassroomApi.getGoogleSignInUrl(null, false, true)
                }
                onSuccessfulSignIn={async () => {
                  setIsPupilSignInRequired(false);
                  await runHydrateCourseWorkContext();
                }}
                privacyPolicyUrl="/legal/privacy-policy"
                showMailingListOption={false}
                cookieKeys={[
                  AuthCookieKeys.PupilAccessToken,
                  AuthCookieKeys.PupilSession,
                ]}
              />
            </OakBox>
          </OakBox>
        )}
        <LessonEngineProvider
          key={lessonEngineInstanceKey}
          initialLessonReviewSections={availableSections}
          initialSection={isReadOnlyState ? "review" : initialSection}
          initialSectionResults={initialSectionResults}
          onNext={
            isGoogleClassroomAssignment || isCourseWorkFlow
              ? handleOnNext
              : undefined
          }
          onSectionResultUpdate={
            isGoogleClassroomAssignment || isCourseWorkFlow
              ? handleOnNext
              : undefined
          }
          isHydratingInitialProgress={isFetchingClassroomContext}
          isReadOnly={isReadOnlyState}
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

          <OakBox style={{ pointerEvents: isOpen ? "none" : "all" }}>
            <OakBox $height={"100vh"}>
              {browseData.lessonData.deprecatedFields?.expired ? (
                <PupilExpiredView lessonTitle={browseData.lessonData.title} />
              ) : (
                <>
                  <OakInlineBanner
                    message="You have turned-in this assignment. You can review the lesson and see your previous answers."
                    isOpen={isReadOnlyState}
                  />
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
                </>
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

  // Read assignmentToken from the URL for the CourseWork flow
  const searchParams =
    globalThis.window === undefined
      ? null
      : new URLSearchParams(globalThis.window.location.search);
  const assignmentToken = searchParams?.get("assignmentToken") ?? null;

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
        assignmentToken={assignmentToken}
      />
    </PupilAnalyticsProvider>
  );
};
