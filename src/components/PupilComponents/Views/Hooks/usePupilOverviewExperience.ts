import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { usePupilExperienceBase } from "./usePupilExperienceBase";

import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";
import { ContentGuidanceTrackingArgs } from "@/components/PupilComponents/Views/PupilLessonOverview";
import {
  buildOverviewSectionItems,
  getInteractiveQuestions,
  getUnitListingHref,
  pickAvailableSectionsForLesson,
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
  /*********
   * State *
   *********/
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
    lessonSlug,
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
      lessonSlug: state.lessonSlug,
      markLessonStarted: state.markLessonStarted,
      dismissContentGuidance: state.dismissContentGuidance,
    })),
  );

  // GC-only: wait until progress init so dismiss cannot race
  // initialiseLessonProgress resetting contentGuidanceDismissed.
  const contentGuidanceCanOpen =
    classroomAssignmentChecked &&
    (isClassroomAssignment !== true || lessonSlug === browseData.lessonSlug);

  const {
    trackSectionStarted,
    trackLessonStarted,
    trackLessonAbandoned,
    trackContentGuidanceAccepted,
    trackContentGuidanceDeclined,
  } = usePupilLessonAnalytics();

  const [isMounted, setIsMounted] = useState(false);
  const [redirectOverlayCleared, setRedirectOverlayCleared] = useState(false);

  /**********************
   * Content to display *
   **********************/
  const unitListingHref = getUnitListingHref({
    subjectSlug: browseData.programmeFields.subjectSlug,
    phaseSlug: browseData.programmeFields.phaseSlug,
    yearSlug: browseData.programmeFields.yearSlug,
  });

  const starterQuizNumQuestions = getInteractiveQuestions(
    lessonContent.starterQuiz,
  ).length;

  const exitQuizNumQuestions = getInteractiveQuestions(
    lessonContent.exitQuiz,
  ).length;

  // Sections the lesson has content for, ignoring variant restrictions. Used to
  // hide sections with no data (e.g. no exit quiz) while still showing
  // variant-excluded sections as disabled.
  const sectionsWithData = pickAvailableSectionsForLesson(lessonContent);

  const sectionItems = buildOverviewSectionItems({
    lessonReviewSections,
    sectionsWithData,
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

  /*****************************
   * Page interaction handlers *
   *****************************/
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

  /*********
   * Hooks *
   *********/
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    isClassroomAssignment,
    classroomAssignmentChecked,
    contentGuidanceDismissed,
    contentGuidanceCanOpen,
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
