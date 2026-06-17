import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { usePupilExperienceBase } from "./usePupilExperienceBase";

import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";
import { ContentGuidanceTrackingArgs } from "@/components/PupilComponents/Views/PupilLessonOverview";
import {
  buildOverviewSectionItems,
  getInteractiveQuestions,
  getUnitListingHref,
  pickNextIncompleteSection,
  pickProceedToNextSectionLabel,
} from "@/components/PupilComponents/Views/ViewHelpers";
import { usePupilLessonAnalytics } from "@/context/PupilLessonAnalytics/usePupilLessonAnalytics";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

export type UsePupilOverviewExperienceParams = Pick<
  PupilLessonPageProps,
  "browseData" | "lessonContent" | "backUrl"
>;

export const usePupilOverviewExperience = ({
  browseData,
  lessonContent,
  backUrl,
}: UsePupilOverviewExperienceParams) => {
  const { router, getSectionHref, goToSection } = usePupilExperienceBase();
  const { isClassroomAssignment, classroomAssignmentChecked } =
    useAssignmentSearchParams();
  const {
    sectionResults,
    lessonReviewSections,
    isLessonComplete,
    lessonStarted,
    isReadOnly,
    isHydratingInitialProgress,
    contentGuidanceDismissed,
    markLessonStarted,
    dismissContentGuidance,
  } = usePupilLessonProgress(
    useShallow((state) => ({
      sectionResults: state.sectionResults,
      lessonReviewSections: state.lessonReviewSections,
      isLessonComplete: state.isLessonComplete,
      lessonStarted: state.lessonStarted,
      isReadOnly: state.isReadOnly,
      isHydratingInitialProgress: state.isHydratingInitialProgress,
      contentGuidanceDismissed: state.contentGuidanceDismissed,
      markLessonStarted: state.markLessonStarted,
      dismissContentGuidance: state.dismissContentGuidance,
    })),
  );
  const {
    trackSectionStarted,
    trackLessonStarted,
    trackLessonAbandoned,
    trackContentGuidanceAccepted,
    trackContentGuidanceDeclined,
  } = usePupilLessonAnalytics();
  const [isMounted, setIsMounted] = useState(false);
  const [redirectOverlayCleared, setRedirectOverlayCleared] = useState(false);

  const unitListingHref = getUnitListingHref({
    subjectSlug: browseData.programmeFields.subjectSlug,
    phaseSlug: browseData.programmeFields.phaseSlug,
    yearSlug: browseData.programmeFields.yearSlug,
  });

  const handleProceedToNextSectionClick = () => {
    const nextSection = pickNextIncompleteSection({
      lessonReviewSections,
      sectionResults,
    });
    if (!lessonStarted) {
      trackLessonStarted();
    }
    markLessonStarted();
    trackSectionStarted({ section: nextSection, sectionResults });
    goToSection(nextSection);
  };

  const starterQuizNumQuestions = getInteractiveQuestions(
    lessonContent.starterQuiz,
  ).length;
  const exitQuizNumQuestions = getInteractiveQuestions(
    lessonContent.exitQuiz,
  ).length;

  const sectionItems = buildOverviewSectionItems({
    lessonReviewSections,
    sectionResults,
    isReadOnly,
    isHydratingInitialProgress,
    starterQuizNumQuestions,
    exitQuizNumQuestions,
    onSectionClick: (section) => {
      if (!lessonStarted) {
        trackLessonStarted();
      }
      markLessonStarted();
      trackSectionStarted({ section, sectionResults });
    },
    getSectionHref,
  });

  const lessonOutcomes = [
    lessonContent.pupilLessonOutcome,
    lessonContent.phonicsOutcome,
  ].filter(Boolean) as string[];

  const proceedLabel = pickProceedToNextSectionLabel({
    lessonStarted,
    isLessonComplete,
    sectionResults,
  });

  const handleContentGuidanceAccept = (args: ContentGuidanceTrackingArgs) => {
    dismissContentGuidance();
    trackContentGuidanceAccepted(args);
  };

  const handleContentGuidanceDecline = (args: ContentGuidanceTrackingArgs) => {
    trackContentGuidanceDeclined(args);

    if (isClassroomAssignment) {
      globalThis.window?.parent?.postMessage(
        {
          type: "Classroom",
          action: "closeIframe",
        },
        "https://classroom.google.com",
      );
    } else if (backUrl) {
      void router.replace(backUrl);
    } else {
      router.back();
    }
  };

  const handleViewAllLessonsClick = () => {
    if (isLessonComplete === false) {
      trackLessonAbandoned();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    isClassroomAssignment,
    classroomAssignmentChecked,
    contentGuidanceDismissed,
    isMounted,
    redirectOverlayCleared,
    setRedirectOverlayCleared,
    unitListingHref,
    sectionItems,
    lessonOutcomes,
    proceedLabel,
    handleProceedToNextSectionClick,
    handleContentGuidanceAccept,
    handleContentGuidanceDecline,
    handleViewAllLessonsClick,
  };
};
