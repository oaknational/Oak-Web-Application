import { FC } from "react";
import { OakMediaClip, OakMediaClipProps } from "@oaknational/oak-components";

import {
  PlaybackPolicy,
  useSignedThumbnailToken,
} from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";

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
  const thumbnailToken = useSignedThumbnailToken({
    playbackId,
    playbackPolicy,
    isLegacy: false,
  });

  const thumbnailImage = thumbnailToken
    ? `https://image.mux.com/${playbackId}/thumbnail.png?token=${thumbnailToken.playbackToken}`
    : "";

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
