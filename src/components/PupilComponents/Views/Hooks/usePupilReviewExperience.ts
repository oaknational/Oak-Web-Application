import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { usePupilExperienceBase } from "./usePupilExperienceBase";

import {
  buildReviewAttemptData,
  buildReviewShareUrl,
  getHasQuizSections,
  shouldShowReviewBottomNav,
} from "@/components/PupilComponents/Views/ViewHelpers";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { resolveOakHref } from "@/common-lib/urls";
import { useOakPupil } from "@/hooks/useOakPupil";
import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";
import { getReviewSections } from "@/components/PupilComponents/Views/ViewHelpers/Review/getReviewSections";
import { getReviewFinalFeedback } from "@/components/PupilComponents/Views/ViewHelpers/Review/getReviewFinalFeedback";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";
import { usePupilLessonAnalytics } from "@/context/PupilLessonAnalytics/usePupilLessonAnalytics";

export type UsePupilReviewExperienceParams = Pick<
  PupilLessonPageProps,
  "browseData" | "lessonContent"
>;
export const usePupilReviewExperience = ({
  browseData,
  lessonContent,
}: UsePupilReviewExperienceParams) => {
  /*********
   * State *
   *********/
  const { router, getSectionHref } = usePupilExperienceBase();

  const pupilClient = useOakPupil();

  const { sectionResults, lessonReviewSections, isLessonComplete, isReadOnly } =
    usePupilLessonProgress(
      useShallow((state) => ({
        sectionResults: state.sectionResults,
        lessonReviewSections: state.lessonReviewSections,
        isLessonComplete: state.isLessonComplete,
        isReadOnly: state.isReadOnly,
      })),
    );

  const { isClassroomAssignment, classroomAssignmentChecked } =
    useAssignmentSearchParams();

  const { trackLessonSummaryReviewed, trackActivityResultsShared } =
    usePupilLessonAnalytics();

  const [trackingSent, setTrackingSent] = useState(false);

  const [isAttemptingShare, setIsAttemptingShare] = useState<
    "failed" | "shared" | "initial"
  >("initial");

  const [storedAttemptLocally, setStoredAttemptLocally] = useState<{
    stored: boolean;
    attemptId: string;
  }>({ stored: false, attemptId: "" });

  /**********************
   * Content to display *
   **********************/
  const hasQuizSections = getHasQuizSections(lessonReviewSections);
  const showBottomNav = shouldShowReviewBottomNav({
    classroomAssignmentChecked,
    isClassroomAssignment,
  });
  const overviewHref = getSectionHref("overview");

  const finalFeedback = useMemo(
    () => getReviewFinalFeedback(isLessonComplete, sectionResults),
    [isLessonComplete, sectionResults],
  );

  const reviewSections = getReviewSections(
    lessonContent,
    lessonReviewSections,
    sectionResults,
  );

  const printableHref = storedAttemptLocally.stored
    ? resolveOakHref({
        page: "pupil-lesson-results-canonical-printable",
        lessonSlug: browseData.lessonSlug,
        attemptId: storedAttemptLocally.attemptId,
      })
    : undefined;

  /*****************************
   * Page interaction handlers *
   *****************************/
  const handleGoToOverview = () => {
    void router.push(overviewHref);
  };

  const handleCopyLink = () => {
    const attemptData = buildReviewAttemptData({
      lessonSlug: browseData.lessonSlug,
      lessonTitle: lessonContent.lessonTitle ?? "",
      subject: browseData.programmeFields.subject,
      yearDescription: browseData.programmeFields.yearDescription,
      sectionResults,
    });
    const res = pupilClient.logAttempt(attemptData, false);
    if (typeof res === "string") {
      void navigator.clipboard.writeText(
        buildReviewShareUrl({
          lessonSlug: browseData.lessonSlug,
          attemptId: res,
        }),
      );
      trackActivityResultsShared({
        sectionResults,
        starterQuizQuestionsArray: lessonContent.starterQuiz,
        exitQuizQuestionsArray: lessonContent.exitQuiz,
      });
      setIsAttemptingShare("shared");
      return;
    }
    void navigator.clipboard.writeText(
      buildReviewShareUrl({
        lessonSlug: browseData.lessonSlug,
        attemptId: res.attemptId,
      }),
    );
    trackActivityResultsShared({
      sectionResults,
      starterQuizQuestionsArray: lessonContent.starterQuiz,
      exitQuizQuestionsArray: lessonContent.exitQuiz,
    });
    setIsAttemptingShare("shared");
    res.promise.catch(() => {
      setIsAttemptingShare("failed");
    });
  };

  /*********
   * Hooks *
   *********/
  useEffect(() => {
    if (storedAttemptLocally.stored || !isLessonComplete) return;

    const attemptData = buildReviewAttemptData({
      lessonSlug: browseData.lessonSlug,
      lessonTitle: lessonContent.lessonTitle ?? "",
      subject: browseData.programmeFields.subject,
      yearDescription: browseData.programmeFields.yearDescription,
      sectionResults,
    });
    const attemptId = pupilClient.logAttempt(attemptData, true);

    if (typeof attemptId === "string") {
      setStoredAttemptLocally({ stored: true, attemptId });
    }
  }, [
    browseData.lessonSlug,
    browseData.programmeFields.subject,
    browseData.programmeFields.yearDescription,
    isLessonComplete,
    lessonContent.lessonTitle,
    pupilClient,
    sectionResults,
    storedAttemptLocally.stored,
  ]);

  useEffect(() => {
    if (trackingSent || !isLessonComplete) return;
    trackLessonSummaryReviewed({
      sectionResults,
      starterQuizQuestionsArray: lessonContent.starterQuiz,
      exitQuizQuestionsArray: lessonContent.exitQuiz,
    });
    setTrackingSent(true);
  }, [
    isLessonComplete,
    lessonContent.exitQuiz,
    lessonContent.starterQuiz,
    sectionResults,
    trackLessonSummaryReviewed,
    trackingSent,
  ]);

  useEffect(() => {
    if (!isLessonComplete) {
      void router.push(overviewHref);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLessonComplete]);

  return {
    isReadOnly,
    hasQuizSections,
    showBottomNav,
    overviewHref,
    isAttemptStored: storedAttemptLocally.stored,
    isAttemptingShare,
    printableHref,
    reviewSections,
    finalFeedback,
    handleGoToOverview,
    handleCopyLink,
  };
};
