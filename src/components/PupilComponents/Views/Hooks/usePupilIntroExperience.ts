import { useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { usePupilExperienceBase } from "./usePupilExperienceBase";

import {
  getAdditionalFileAssetIds,
  getDedupedContentGuidanceLabels,
  getIntroBottomNavLabel,
  getIntroWorksheetInitResult,
  pickNextIncompleteSection,
  shouldInitIntroWorksheetResult,
} from "@/components/PupilComponents/Views/ViewHelpers";
import { usePupilLessonAnalytics } from "@/context/PupilLessonAnalytics/usePupilLessonAnalytics";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { useAdditionalFilesDownload } from "@/components/PupilComponents/Views/ViewHelpers/Intro/useAdditionalFilesDownload";
import { useWorksheetDownload } from "@/components/PupilComponents/Views/ViewHelpers/Intro/useWorksheetDownload";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

export type UsePupilIntroExperienceParams = Pick<
  PupilLessonPageProps,
  "browseData" | "lessonContent" | "hasWorksheet" | "additionalFiles"
>;
export const usePupilIntroExperience = ({
  browseData,
  lessonContent,
  hasWorksheet,
  additionalFiles,
}: UsePupilIntroExperienceParams) => {
  /*********
   * State *
   *********/
  const { router, getSectionHref, goToSection, ensureCanProgress } =
    usePupilExperienceBase();

  const {
    sectionResults,
    lessonReviewSections,
    lessonStarted,
    isReadOnly,
    completeSection,
    updateSectionInProgressResult,
  } = usePupilLessonProgress(
    useShallow((state) => ({
      sectionResults: state.sectionResults,
      lessonReviewSections: state.lessonReviewSections,
      lessonStarted: state.lessonStarted,
      isReadOnly: state.isReadOnly,
      completeSection: state.completeSection,
      updateSectionInProgressResult: state.updateSectionInProgressResult,
    })),
  );

  const {
    trackSectionStarted,
    trackLessonStarted,
    trackLessonCompleted,
    trackIntroCompleted,
    trackIntroAbandoned,
    trackWorksheetDownloaded,
  } = usePupilLessonAnalytics();
  const additionalFilesAssetIds = useMemo(
    () => getAdditionalFileAssetIds(additionalFiles),
    [additionalFiles],
  );

  const { startAdditionalFilesDownload, isAdditionalFilesDownloading } =
    useAdditionalFilesDownload(browseData.lessonSlug, additionalFilesAssetIds);

  const { startDownload, isDownloading } = useWorksheetDownload(
    browseData.lessonSlug,
    lessonContent.isLegacy ?? false,
  );

  const [isCompletingAndRedirecting, setIsCompletingAndRedirecting] =
    useState(false);

  const sectionStartedAtRef = useRef(Date.now());

  /**********************
   * Content to display *
   **********************/
  const removedGuidanceDuplicates = getDedupedContentGuidanceLabels(
    lessonContent.contentGuidance,
  );

  const overviewHref = getSectionHref("overview");

  const getSectionResultsAfterComplete = () => ({
    ...sectionResults,
    intro: {
      ...sectionResults.intro,
      isComplete: true,
    },
  });

  const proceedLabel = isCompletingAndRedirecting
    ? "I'm ready"
    : getIntroBottomNavLabel(sectionResults.intro?.isComplete);

  /*****************************
   * Page interaction handlers *
   *****************************/
  const handleProceed = () => {
    if (!ensureCanProgress()) return;

    if (!sectionResults.intro?.isComplete) {
      setIsCompletingAndRedirecting(true);
      if (!lessonStarted) {
        trackLessonStarted();
      }
      trackIntroCompleted({ sectionStartedAt: sectionStartedAtRef.current });
      completeSection("intro");
      const nextSectionResults = getSectionResultsAfterComplete();
      const allComplete = lessonReviewSections.every(
        (section) => nextSectionResults[section]?.isComplete,
      );
      if (allComplete) {
        trackLessonCompleted();
      }
      goToSection(allComplete ? "review" : "overview");
      return;
    }
    const nextSection = pickNextIncompleteSection({
      lessonReviewSections,
      sectionResults,
    });

    if (isReadOnly) {
      trackSectionStarted({ section: "review", sectionResults });
      goToSection("review");
      return;
    }
    trackSectionStarted({ section: nextSection, sectionResults });
    goToSection(nextSection);
  };

  const handleBackToOverview = () => {
    if (!sectionResults.intro?.isComplete) {
      if (!lessonStarted) {
        trackLessonStarted();
      }
      trackIntroAbandoned({
        sectionStartedAt: sectionStartedAtRef.current,
      });
    }
    void router.push(overviewHref);
  };

  const handleAdditionalFilesDownload = () => {
    updateSectionInProgressResult("intro", {
      filesDownloaded: true,
      additionalFilesAvailable: true,
    });
    void startAdditionalFilesDownload();
  };

  const handleWorksheetDownload = async () => {
    updateSectionInProgressResult("intro", {
      worksheetDownloaded: true,
      worksheetAvailable: true,
    });
    if (!lessonStarted) {
      trackLessonStarted();
    }
    const isSuccess = await startDownload();
    if (isSuccess) {
      trackWorksheetDownloaded();
    }
  };

  /*********
   * Hooks *
   *********/
  useEffect(() => {
    if (
      shouldInitIntroWorksheetResult({
        worksheetAvailable: sectionResults.intro?.worksheetAvailable,
        currentSection: "intro",
      })
    ) {
      updateSectionInProgressResult(
        "intro",
        getIntroWorksheetInitResult({
          worksheetDownloaded: sectionResults.intro?.worksheetDownloaded,
          hasWorksheet,
        }),
      );
    }
  }, [
    hasWorksheet,
    sectionResults.intro?.worksheetAvailable,
    sectionResults.intro?.worksheetDownloaded,
    updateSectionInProgressResult,
  ]);

  return {
    overviewHref,
    removedGuidanceDuplicates,
    proceedLabel,
    isAdditionalFilesDownloading,
    isDownloading,
    handleProceed,
    handleBackToOverview,
    handleAdditionalFilesDownload,
    handleWorksheetDownload,
  };
};
