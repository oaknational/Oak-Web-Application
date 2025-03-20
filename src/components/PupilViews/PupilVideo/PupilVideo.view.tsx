import { useState, useRef } from "react";
import {
  OakBackLink,
  OakCardHeader,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHandDrawnHR,
  OakInfo,
  OakLessonBottomNav,
  OakLessonInfoCard,
  OakLessonLayout,
  OakLessonTopNav,
  OakLessonVideoTranscript,
  OakP,
  OakPrimaryButton,
  OakPrimaryInvertedButton,
  OakTertiaryButton,
  OakUL,
} from "@oaknational/oak-components";

import { useAdditionalFilesDownload } from "../PupilIntro/useAdditionalFilesDownload";
import { additionalFileListItem } from "../PupilIntro";

import {
  VideoResult,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import VideoPlayer, {
  VideoEventCallbackArgs,
} from "@/components/SharedComponents/VideoPlayer/VideoPlayer";
import { useGetSectionLinkProps } from "@/components/PupilComponents/pupilUtils/lessonNavigation";
import { usePupilAnalytics } from "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics";
import { useTrackSectionStarted } from "@/hooks/useTrackSectionStarted";
import { useGetVideoTrackingData } from "@/hooks/useGetVideoTrackingData";
import { getPupilPathwayData } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import {
  LessonBrowseData,
  AdditionalFiles,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

type PupilViewsVideoProps = {
  lessonTitle: string;
  videoMuxPlaybackId?: string;
  videoWithSignLanguageMuxPlaybackId?: string;
  transcriptSentences: string[];
  isLegacy: boolean;
  browseData: LessonBrowseData;
  hasAdditionalFiles: boolean;
  additionalFiles: AdditionalFiles["tpcDownloadablefiles"];
};

export const PupilViewsVideo = ({
  lessonTitle,
  videoMuxPlaybackId,
  videoWithSignLanguageMuxPlaybackId,
  transcriptSentences,
  isLegacy,
  browseData,
  hasAdditionalFiles,
  additionalFiles,
}: PupilViewsVideoProps) => {
  const {
    completeActivity,
    updateCurrentSection,
    updateSectionResult,
    sectionResults,
    proceedToNextSection,
    lessonReviewSections,
    updateAdditionalFilesDownloaded,
  } = useLessonEngineContext();
  const getSectionLinkProps = useGetSectionLinkProps();
  const additionalFilesAssetIds = additionalFiles
    ? additionalFiles.map((file) => file.assetId)
    : [];
  const { startAdditionalFilesDownload, isAdditionalFilesDownloading } =
    useAdditionalFilesDownload(browseData.lessonSlug, additionalFilesAssetIds);
  const { track } = usePupilAnalytics();
  const { getVideoTrackingData } = useGetVideoTrackingData();
  const { trackSectionStarted } = useTrackSectionStarted();
  const [signLanguageOn, setSignLanguageOn] = useState(false);
  const playbackId =
    signLanguageOn && videoWithSignLanguageMuxPlaybackId
      ? videoWithSignLanguageMuxPlaybackId
      : videoMuxPlaybackId;

  const videoResult = useRef<VideoResult>({
    played: false,
    duration: 0,
    timeElapsed: 0,
    muted: false,
    signedOpened: false,
    transcriptOpened: false,
  });

  // make sure the video result is initialized
  if (!sectionResults.video) {
    updateSectionResult(videoResult.current);
  }

  const handleVideoEvent = (event: VideoEventCallbackArgs) => {
    videoResult.current.played = true;
    videoResult.current.duration = event.duration || 0;
    videoResult.current.muted = event.muted || false;
    const t = event.timeElapsed || 0;
    // throttling updates to every 10 seconds to avoid overloading state updates
    // also prevents timeElapsed from being updated when the skips to an earlier moment
    if (event.event !== "playing" || t - videoResult.current.timeElapsed > 10) {
      videoResult.current.timeElapsed = t;
      updateSectionResult(videoResult.current);
    }
  };

  const handleBackLinkClick = () => {
    if (track.lessonActivityAbandonedLessonVideo) {
      track.lessonActivityAbandonedLessonVideo(getVideoTrackingData());
    }
    updateCurrentSection("overview");
  };

  const handleBottomButtonClick = () => {
    if (sectionResults.video?.isComplete) {
      const nextSection =
        lessonReviewSections.find(
          (section) => !sectionResults[section]?.isComplete,
        ) ?? "review";
      trackSectionStarted(nextSection);
      proceedToNextSection();
    } else {
      completeActivity("video");
      if (track.lessonActivityCompletedLessonVideo) {
        track.lessonActivityCompletedLessonVideo(getVideoTrackingData());
      }
    }
  };

  const handleAdditionalFilesDownloadClicked = () => {
    updateAdditionalFilesDownloaded({
      filesDownloaded: true,
      additionalFilesAvailable: true,
    });
    startAdditionalFilesDownload();
  };

  return (
    <OakLessonLayout
      lessonSectionName="video"
      topNavSlot={
        <OakLessonTopNav
          backLinkSlot={
            <OakBackLink
              {...getSectionLinkProps("overview", handleBackLinkClick)}
            />
          }
          heading="Lesson video"
          lessonSectionName="video"
          mobileSummary="In progress..."
        />
      }
      bottomNavSlot={
        <OakLessonBottomNav>
          <OakPrimaryButton
            element="a"
            {...getSectionLinkProps("overview", handleBottomButtonClick)}
            width={["100%", "max-content"]}
            iconName="arrow-right"
            isTrailingIcon
          >
            {sectionResults.video?.isComplete
              ? "Continue lesson"
              : "I've finished the video"}
          </OakPrimaryButton>
        </OakLessonBottomNav>
      }
    >
      <OakGrid
        $maxWidth={["100%", "all-spacing-23", "100%"]}
        $mh="auto"
        $ph={["inner-padding-m", "inner-padding-xl", "inner-padding-none"]}
      >
        <OakGridArea
          $colStart={[1, 1, 3]}
          $colSpan={[12, 12, 8]}
          $mb="space-between-m2"
        >
          {playbackId ? (
            <VideoPlayer
              playbackId={playbackId}
              playbackPolicy="signed"
              title={lessonTitle}
              location="pupil"
              isLegacy={isLegacy}
              userEventCallback={handleVideoEvent}
              pathwayData={{ ...getPupilPathwayData(browseData) }}
            />
          ) : (
            "This lesson does not contain a video"
          )}
        </OakGridArea>
        <OakGridArea $colStart={[1, 1, 3]} $colSpan={[12, 12, 8]}>
          {transcriptSentences.length > 0 && (
            <OakLessonVideoTranscript
              transcriptToggled={({ isOpen }: { isOpen: boolean }) => {
                if (isOpen) {
                  videoResult.current.transcriptOpened = true;
                  updateSectionResult(videoResult.current);
                }
              }}
              id="video-transcript"
              signLanguageControl={
                videoWithSignLanguageMuxPlaybackId && (
                  <OakTertiaryButton
                    onClick={() => {
                      setSignLanguageOn(!signLanguageOn);
                      if (!signLanguageOn) {
                        videoResult.current.signedOpened = !signLanguageOn;
                        updateSectionResult(videoResult.current);
                      }
                    }}
                    iconName="sign-language"
                    isTrailingIcon
                  >
                    {signLanguageOn
                      ? "Hide sign language"
                      : "Show sign language"}
                  </OakTertiaryButton>
                )
              }
            >
              {transcriptSentences.map((sentence, index) => (
                <OakP key={index} $mb="space-between-s">
                  {sentence}
                </OakP>
              ))}
            </OakLessonVideoTranscript>
          )}
          <OakHandDrawnHR
            $height={"all-spacing-1"}
            hrColor={"border-neutral-lighter"}
            $width={"100%"}
          />
          <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
            {hasAdditionalFiles && additionalFiles && (
              <OakLessonInfoCard>
                <OakFlex $gap={"space-between-s"}>
                  <OakCardHeader iconName="additional-material" tag="h1">
                    {`File${additionalFiles.length > 1 ? "s" : ""} you will need for this lesson`}
                  </OakCardHeader>
                  <OakInfo
                    hint={"Download these files to use in the lesson."}
                    id={"quiz-video-aditional-files"}
                    tooltipPosition={"top-right"}
                  />
                </OakFlex>

                <OakUL
                  $display={"flex"}
                  $flexDirection={"column"}
                  $gap={"space-between-s"}
                  $reset
                >
                  {additionalFiles.map((file, index) =>
                    additionalFileListItem(file, index),
                  )}
                </OakUL>

                <OakPrimaryInvertedButton
                  onClick={handleAdditionalFilesDownloadClicked}
                  isLoading={isAdditionalFilesDownloading}
                  iconName="download"
                  isTrailingIcon
                  $font={"heading-7"}
                  $pl={"inner-padding-none"}
                  $pr={"inner-padding-none"}
                >
                  {additionalFiles.length === 1
                    ? "Download file"
                    : "Download files"}
                </OakPrimaryInvertedButton>
              </OakLessonInfoCard>
            )}
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </OakLessonLayout>
  );
};
