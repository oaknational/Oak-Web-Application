import { FC } from "react";
import {
  OakMediaClipStackListItem,
  OakMediaClipStackListItemProps,
} from "@oaknational/oak-components";

import { PlaybackPolicy } from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";
import useMediaClipThumbnailUrl from "@/components/SharedComponents/VideoPlayer/useMediaClipThumbnailsUrl";

export type LessonOverviewClipWithThumbnail = Omit<
  OakMediaClipStackListItemProps,
  "imageUrl" | "imageAltText"
> & {
  playbackId: string;
  playbackPolicy: PlaybackPolicy;
  numberOfClips: number;
  isAudioClip: boolean;
  onClick?: () => void;
  rel?: string;
};

const LessonOverviewClipWithThumbnail: FC<LessonOverviewClipWithThumbnail> = ({
  title,
  playbackId,
  playbackPolicy,
  numberOfClips,
  href,
  isAudioClip,
  onClick,
  rel,
}: LessonOverviewClipWithThumbnail) => {
  const thumbnailImage = useMediaClipThumbnailUrl({
    playbackId,
    playbackPolicy,
    isLegacy: false,
  });

  return (
    <OakMediaClipStackListItem
      rel={rel}
      title={title}
      imageUrl={thumbnailImage}
      imageAltText=""
      href={href}
      numberOfClips={numberOfClips}
      isAudioClip={isAudioClip}
      onClick={onClick}
    />
  );
};

export default LessonOverviewClipWithThumbnail;
