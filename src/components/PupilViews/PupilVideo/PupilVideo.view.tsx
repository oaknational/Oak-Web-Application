import {
  OakBackLink,
  OakBox,
  OakGrid,
  OakGridArea,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonTopNav,
  OakPrimaryButton,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { useState } from "react";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer/VideoPlayer";

type PupilViewsVideoProps = {
  videoTitle: string;
  videoMuxPlaybackId: string;
  videoWithSignLanguageMuxPlaybackId?: string;
  transcriptSentences?: string;
};

export const PupilViewsVideo = ({
  videoTitle,
  videoMuxPlaybackId,
  videoWithSignLanguageMuxPlaybackId,
  transcriptSentences,
}: PupilViewsVideoProps) => {
  const { completeSection, updateCurrentSection } = useLessonEngineContext();
  const [signLanguageOn, setSignLanguageOn] = useState(false);

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
        <OakGridArea $colStart={[1, 1, 3]} $colSpan={[12, 12, 8]}>
          <VideoPlayer
            playbackId={
              signLanguageOn && videoWithSignLanguageMuxPlaybackId
                ? videoWithSignLanguageMuxPlaybackId
                : videoMuxPlaybackId
            }
            playbackPolicy="public"
            title={videoTitle}
            location="lesson"
            isLegacy={false}
          />
          {videoWithSignLanguageMuxPlaybackId && (
            <OakTertiaryButton
              onClick={() => setSignLanguageOn(!signLanguageOn)}
            >
              {signLanguageOn ? "Hide sign language" : "Show sign language"}
            </OakTertiaryButton>
          )}
          <OakBox $mt="space-between-xl">{transcriptSentences}</OakBox>
        </OakGridArea>
      </OakGrid>
    </OakLessonLayout>
  );
};
