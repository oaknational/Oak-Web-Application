import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
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
  type PupilClassroomTrackingContext,
} from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import {
  LessonBrowseData,
  LessonContent,
  AdditionalFile,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { usePupilAnalytics } from "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics";
import { ContentGuidanceWarningValueType } from "@/browser-lib/avo/Avo";
import { PupilRedirectedOverlay } from "@/components/PupilComponents/PupilRedirectedOverlay/PupilRedirectedOverlay";
import { useWorksheetInfoState } from "@/components/PupilComponents/pupilUtils/useWorksheetInfoState";
import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";
import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import type { AddOnContextResponse } from "@/browser-lib/google-classroom/googleClassroomApi";
import { getClassroomAssignmentId } from "@/browser-lib/google-classroom/classroomAnalytics";
import {
  mapToSubmitPupilProgress,
  type ClassroomContext,
} from "@/browser-lib/google-classroom/mapToSubmitPupilProgress";
import { mapPupilLessonProgressToSectionResults } from "@/browser-lib/google-classroom/mapPupilLessonProgressToSectionResults";

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

type PupilExperienceLayoutProps = PupilExperienceViewProps & {
  isGoogleClassroomAssignment: boolean;
  classroomTrackingContext?: PupilClassroomTrackingContext;
  setClassroomTrackingContext: Dispatch<
    SetStateAction<PupilClassroomTrackingContext | undefined>
  >;
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
  isGoogleClassroomAssignment,
  classroomTrackingContext,
  setClassroomTrackingContext,
}: PupilExperienceLayoutProps) => {
  const ageRestriction = browseData.features?.ageRestriction;
  const hasAgeRestriction = !!ageRestriction;
  const classroomContextRef = useRef<ClassroomContext | null>(null);
  const [isFetchingClassroomContext, setIsFetchingClassroomContext] =
    useState(false);
  const [initialSectionResults, setInitialSectionResults] =
    useState<LessonSectionResults>();
  const [lessonEngineInstanceKey, setLessonEngineInstanceKey] = useState(0);

  const fetchGoogleClassroomContext = async () => {
    if (!classroomTrackingContext) return;

    const { courseId, itemId, attachmentId } = classroomTrackingContext;
    if (!courseId || !itemId || !attachmentId) return;

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
      const teacherLoginHint = result?.teacherLoginHint;

      setClassroomTrackingContext((existing) =>
        existing
          ? {
              ...existing,
              submissionId: submissionId ?? existing.submissionId,
              teacherLoginHint: teacherLoginHint ?? existing.teacherLoginHint,
              pupilLoginHint: pupilLoginHint ?? existing.pupilLoginHint,
            }
          : existing,
      );

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
    }
  };

  useEffect(() => {
    if (
      !isGoogleClassroomAssignment ||
      classroomContextRef.current ||
      !classroomTrackingContext
    )
      return;
    fetchGoogleClassroomContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomTrackingContext, isGoogleClassroomAssignment]);

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

  const [trackingSent, setTrackingSent] = useState<boolean>(false);
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

  if (trackingSent === false) {
    track.lessonAccessed({
      componentType: "page view",
    });
    setTrackingSent(true);
  }

  const declineIcon = isGoogleClassroomAssignment ? "cross" : undefined;
  const declineText = isGoogleClassroomAssignment ? "Exit lesson" : undefined;
  return (
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
  );
};

export const PupilExperienceView = (props: PupilExperienceViewProps) => {
  const { browseData, lessonContent } = props;
  const searchParams = useSearchParams();
  const { isClassroomAssignment, classroomAssignmentChecked } =
    useAssignmentSearchParams();
  const isGoogleClassroomAssignment = Boolean(
    isClassroomAssignment && classroomAssignmentChecked,
  );

  const { worksheetInfo } = useWorksheetInfoState(
    lessonContent.hasWorksheetAssetObject,
    lessonContent.lessonSlug,
  );

  const baseClassroomTrackingContext = useMemo(() => {
    if (!isGoogleClassroomAssignment) return undefined;

    const courseId = searchParams?.get("courseId");
    const itemId = searchParams?.get("itemId");
    const attachmentId = searchParams?.get("attachmentId");

    if (!courseId || !itemId || !attachmentId) return undefined;

    return {
      courseId,
      itemId,
      attachmentId,
      submissionId: "",
      classroomAssignmentId: getClassroomAssignmentId({ courseId, itemId }),
      teacherLoginHint: "",
      pupilLoginHint: "",
      clientEnvironment: "iframe",
    } satisfies PupilClassroomTrackingContext;
  }, [isGoogleClassroomAssignment, searchParams]);

  const [classroomTrackingContext, setClassroomTrackingContext] = useState<
    PupilClassroomTrackingContext | undefined
  >(baseClassroomTrackingContext);

  useEffect(() => {
    setClassroomTrackingContext((existing) => {
      if (!baseClassroomTrackingContext) return undefined;

      const isSameAssignment =
        existing?.classroomAssignmentId ===
          baseClassroomTrackingContext.classroomAssignmentId &&
        existing?.attachmentId === baseClassroomTrackingContext.attachmentId;

      return {
        ...baseClassroomTrackingContext,
        submissionId: isSameAssignment ? (existing?.submissionId ?? "") : "",
        teacherLoginHint: isSameAssignment
          ? (existing?.teacherLoginHint ?? "")
          : "",
        pupilLoginHint: isSameAssignment
          ? (existing?.pupilLoginHint ?? "")
          : "",
      };
    });
  }, [baseClassroomTrackingContext]);

  return (
    <PupilAnalyticsProvider
      pupilPathwayData={getPupilPathwayData(browseData)}
      lessonContent={lessonContent}
      classroomTrackingContext={classroomTrackingContext}
    >
      <PupilExperienceLayout
        {...props}
        worksheetInfo={worksheetInfo}
        isGoogleClassroomAssignment={isGoogleClassroomAssignment}
        classroomTrackingContext={classroomTrackingContext}
        setClassroomTrackingContext={setClassroomTrackingContext}
      />
    </PupilAnalyticsProvider>
  );
};
