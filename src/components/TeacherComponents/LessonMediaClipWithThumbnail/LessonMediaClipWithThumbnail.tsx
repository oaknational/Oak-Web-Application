import { FC } from "react";
import { OakMediaClip, OakMediaClipProps } from "@oaknational/oak-components";

import { PlaybackPolicy } from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";
import useMediaClipThumbnailUrl from "@/components/SharedComponents/VideoPlayer/useMediaClipThumbnailsUrl";

export type LessonMediaClipWithThumbnailProps = Omit<
  OakMediaClipProps,
  "thumbnailImage" | "imageAltText"
> & {
  playbackId: string;
  playbackPolicy: PlaybackPolicy;
};

const LessonMediaClipWithThumbnail: FC<LessonMediaClipWithThumbnailProps> = ({
  clipName,
  timeCode,
  learningCycle,
  muxPlayingState,
  isAudioClip,
  onClick,
  playbackId,
  playbackPolicy,
}: LessonMediaClipWithThumbnailProps) => {
  const thumbnailImage = useMediaClipThumbnailUrl({
    playbackId,
    playbackPolicy,
    isLegacy: false,
  });

  return (
    <OakMediaClip
      clipName={clipName}
      timeCode={timeCode}
      learningCycle={learningCycle}
      thumbnailImage={thumbnailImage}
      muxPlayingState={muxPlayingState}
      isAudioClip={isAudioClip}
      imageAltText=""
      onClick={onClick}
    />
  );
};

export default LessonMediaClipWithThumbnail;
