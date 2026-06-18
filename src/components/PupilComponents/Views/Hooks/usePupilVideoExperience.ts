import { useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { usePupilExperienceBase } from "./usePupilExperienceBase";

import {
  getAdditionalFileAssetIds,
  getNarrowTranscriptSentences,
  getVideoPlaybackId,
  pickNextIncompleteSection,
  shouldPersistVideoTimeElapsed,
} from "@/components/PupilComponents/Views/ViewHelpers";
import { usePupilLessonAnalytics } from "@/context/PupilLessonAnalytics/usePupilLessonAnalytics";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { useAdditionalFilesDownload } from "@/components/PupilComponents/Views/ViewHelpers/Intro/useAdditionalFilesDownload";
import { VideoEventCallbackArgs } from "@/components/SharedComponents/VideoPlayer/VideoPlayer";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

export type UsePupilVideoExperienceParams = Pick<
  PupilLessonPageProps,
  "browseData" | "lessonContent" | "additionalFiles"
>;
export const usePupilVideoExperience = ({
  browseData,
  lessonContent,
  additionalFiles,
}: UsePupilVideoExperienceParams) => {
  /*********
   * State *
   *********/
  const { router, getSectionHref, goToSection } = usePupilExperienceBase();

  const {
    sectionResults,
    lessonReviewSections,
    lessonStarted,
    isReadOnly,
    completeSection,
    updateSectionInProgressResult,
    markLessonStarted,
  } = usePupilLessonProgress(
    useShallow((state) => ({
      sectionResults: state.sectionResults,
      lessonReviewSections: state.lessonReviewSections,
      lessonStarted: state.lessonStarted,
      isReadOnly: state.isReadOnly,
      completeSection: state.completeSection,
      updateSectionInProgressResult: state.updateSectionInProgressResult,
      markLessonStarted: state.markLessonStarted,
    })),
  );

  const {
    trackSectionStarted,
    trackLessonStarted,
    trackLessonCompleted,
    trackVideoCompleted,
    trackVideoAbandoned,
  } = usePupilLessonAnalytics();

  const [signLanguageOn, setSignLanguageOn] = useState(false);

  const [isCompletingAndRedirecting, setIsCompletingAndRedirecting] =
    useState(false);

  const additionalFilesAssetIds = useMemo(
    () => getAdditionalFileAssetIds(additionalFiles),
    [additionalFiles],
  );

  const sectionStartedAtRef = useRef(Date.now());

  const { startAdditionalFilesDownload, isAdditionalFilesDownloading } =
    useAdditionalFilesDownload(browseData.lessonSlug, additionalFilesAssetIds);

  /**********************
   * Content to display *
   **********************/
  const transcriptSentences = getNarrowTranscriptSentences(
    lessonContent.transcriptSentences,
  );

  const overviewHref = getSectionHref("overview");

  const playbackId = getVideoPlaybackId({
    signLanguageOn,
    videoMuxPlaybackId: lessonContent.videoMuxPlaybackId ?? undefined,
    videoWithSignLanguageMuxPlaybackId:
      lessonContent.videoWithSignLanguageMuxPlaybackId ?? undefined,
  });

  const videoResultRef = useRef({
    played: sectionResults.video?.played || false,
    duration: sectionResults.video?.duration || 0,
    timeElapsed: sectionResults.video?.timeElapsed || 0,
    muted: sectionResults.video?.muted || false,
    signedOpened: sectionResults.video?.signedOpened || false,
    transcriptOpened: sectionResults.video?.transcriptOpened || false,
  });

  const getSectionResultsAfterComplete = () => ({
    ...sectionResults,
    video: {
      ...sectionResults.video,
      ...videoResultRef.current,
      isComplete: true,
    },
  });

  const getPostCompleteSection = () => {
    const nextSectionResults = getSectionResultsAfterComplete();
    return lessonReviewSections.every(
      (section) => nextSectionResults[section]?.isComplete,
    )
      ? "review"
      : "overview";
  };

  const isVideoComplete = sectionResults.video?.isComplete ?? false;
  const proceedLabel =
    !isCompletingAndRedirecting && isVideoComplete
      ? "Continue lesson"
      : "I've finished the video";

  /*****************************
   * Page interaction handlers *
   *****************************/
  const handleVideoEvent = ({
    event,
    timeElapsed,
    duration,
    muted,
  }: VideoEventCallbackArgs) => {
    videoResultRef.current.played = true;
    videoResultRef.current.duration = duration || 0;
    videoResultRef.current.muted = muted || false;
    const nextTimeElapsed = timeElapsed || 0;
    if (
      shouldPersistVideoTimeElapsed({
        event,
        nextTimeElapsed,
        currentTimeElapsed: videoResultRef.current.timeElapsed,
        currentSection: "video",
      })
    ) {
      videoResultRef.current.timeElapsed = nextTimeElapsed;
      updateSectionInProgressResult("video", videoResultRef.current);
    }
  };

  const handleBackToOverview = () => {
    if (!sectionResults.video?.isComplete) {
      if (!lessonStarted) {
        trackLessonStarted();
      }
      trackVideoAbandoned({
        sectionResults: {
          ...sectionResults,
          video: {
            ...sectionResults.video,
            ...videoResultRef.current,
            isComplete: false,
          },
        },
        sectionStartedAt: sectionStartedAtRef.current,
      });
    }
    markLessonStarted();
    void router.push(overviewHref);
  };

  const handleProceed = () => {
    if (!sectionResults.video?.isComplete) {
      setIsCompletingAndRedirecting(true);
      if (!lessonStarted) {
        trackLessonStarted();
      }
      updateSectionInProgressResult("video", videoResultRef.current);
      completeSection("video");
      const nextSectionResults = getSectionResultsAfterComplete();
      trackVideoCompleted({
        sectionResults: nextSectionResults,
        sectionStartedAt: sectionStartedAtRef.current,
      });
      const allComplete = lessonReviewSections.every(
        (section) => nextSectionResults[section]?.isComplete,
      );
      if (allComplete) {
        trackLessonCompleted();
      }
      goToSection(getPostCompleteSection());
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

  const handleTranscriptToggled = ({ isOpen }: { isOpen: boolean }) => {
    if (!isOpen) return;
    videoResultRef.current.transcriptOpened = true;
    updateSectionInProgressResult("video", videoResultRef.current);
  };

  const handleSignLanguageToggle = () => {
    const isTurningOn = !signLanguageOn;
    setSignLanguageOn(isTurningOn);
    if (!isTurningOn) return;
    videoResultRef.current.signedOpened = true;
    updateSectionInProgressResult("video", videoResultRef.current);
  };

  const handleAdditionalFilesDownload = () => {
    updateSectionInProgressResult("intro", {
      filesDownloaded: true,
      additionalFilesAvailable: true,
    });
    void startAdditionalFilesDownload();
  };

  return {
    overviewHref,
    playbackId,
    proceedLabel,
    transcriptSentences,
    signLanguageOn,
    isAdditionalFilesDownloading,
    videoInitialTimeElapsed: sectionResults.video?.timeElapsed ?? 0,
    handleVideoEvent,
    handleBackToOverview,
    handleProceed,
    handleTranscriptToggled,
    handleSignLanguageToggle,
    handleAdditionalFilesDownload,
  };
};
