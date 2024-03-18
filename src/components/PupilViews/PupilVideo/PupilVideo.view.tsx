import { useState, useRef } from "react";
import {
  OakBackLink,
  OakGrid,
  OakGridArea,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonTopNav,
  OakLessonVideoTranscript,
  OakP,
  OakPrimaryButton,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import {
  VideoResult,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import VideoPlayer, {
  VideoEventCallbackArgs,
} from "@/components/SharedComponents/VideoPlayer/VideoPlayer";

type PupilViewsVideoProps = {
  lessonTitle: string;
  videoMuxPlaybackId?: string;
  videoWithSignLanguageMuxPlaybackId?: string;
  transcriptSentences: string[];
  isLegacy: boolean;
};

export const PupilViewsVideo = ({
  lessonTitle,
  videoMuxPlaybackId,
  videoWithSignLanguageMuxPlaybackId,
  transcriptSentences,
  isLegacy,
}: PupilViewsVideoProps) => {
  const { completeSection, updateCurrentSection, updateSectionResult } =
    useLessonEngineContext();
  const [signLanguageOn, setSignLanguageOn] = useState(false);
  const playbackId =
    signLanguageOn && videoWithSignLanguageMuxPlaybackId
      ? videoWithSignLanguageMuxPlaybackId
      : videoMuxPlaybackId;

  const videoResult = useRef<VideoResult>({
    played: false,
    duration: 0,
    timeElapsed: 0,
  });

  const handleVideoEvent = (event: VideoEventCallbackArgs) => {
    videoResult.current.played = true;
    videoResult.current.duration = event.duration || 0;
    const t = event.timeElapsed || 0;
    // throttling updates to every 10 seconds to avoid overloading state updates
    // also prevents timeElapsed from being updated when the skips to an earlier moment
    if (event.event !== "playing" || t - videoResult.current.timeElapsed > 10) {
      videoResult.current.timeElapsed = t;
      updateSectionResult(videoResult.current);
    }
  };

  return (
    <OakLessonLayout
      lessonSectionName="video"
      topNavSlot={
        <OakLessonTopNav
          backLinkSlot={
            <OakBackLink
              type="button"
              onClick={() => {
                updateCurrentSection("overview");
              }}
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
            onClick={() => {
              completeSection("video");
            }}
            width={["100%", "max-content"]}
            iconName="arrow-right"
            isTrailingIcon
          >
            I've finished the video
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
            />
          ) : (
            "This lesson does not contain a video"
          )}
        </OakGridArea>
        <OakGridArea $colStart={[1, 1, 3]} $colSpan={[12, 12, 8]}>
          {transcriptSentences.length > 0 && (
            <OakLessonVideoTranscript
              id="video-transcript"
              signLanguageControl={
                videoWithSignLanguageMuxPlaybackId && (
                  <OakTertiaryButton
                    onClick={() => setSignLanguageOn(!signLanguageOn)}
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
        </OakGridArea>
      </OakGrid>
    </OakLessonLayout>
  );
};
