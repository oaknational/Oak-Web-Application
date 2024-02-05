import { useState } from "react";
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

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer/VideoPlayer";

type PupilViewsVideoProps = {
  lessonTitle: string;
  videoMuxPlaybackId?: string;
  videoWithSignLanguageMuxPlaybackId?: string;
  transcriptSentences: string[];
  lessonCohort?: string;
  isLegacyLicense: boolean;
};

export const PupilViewsVideo = ({
  lessonTitle,
  videoMuxPlaybackId,
  videoWithSignLanguageMuxPlaybackId,
  transcriptSentences,
}: PupilViewsVideoProps) => {
  const { completeSection, updateCurrentSection } = useLessonEngineContext();
  const [signLanguageOn, setSignLanguageOn] = useState(false);
  const playbackId =
    signLanguageOn && videoWithSignLanguageMuxPlaybackId
      ? videoWithSignLanguageMuxPlaybackId
      : videoMuxPlaybackId;

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
            width={["100%", "auto"]}
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
          {playbackId && (
            <VideoPlayer
              playbackId={playbackId}
              playbackPolicy="signed"
              title={lessonTitle}
              location="lesson"
              isLegacy={false}
            />
          )}
        </OakGridArea>
        <OakGridArea $colStart={[1, 1, 3]} $colSpan={[12, 12, 8]}>
          <OakLessonVideoTranscript
            id="video-transcript"
            signLanguageControl={
              videoWithSignLanguageMuxPlaybackId && (
                <OakTertiaryButton
                  onClick={() => setSignLanguageOn(!signLanguageOn)}
                  iconName="sign-language"
                  isTrailingIcon
                >
                  {signLanguageOn ? "Hide sign language" : "Show sign language"}
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
        </OakGridArea>
      </OakGrid>
    </OakLessonLayout>
  );
};
