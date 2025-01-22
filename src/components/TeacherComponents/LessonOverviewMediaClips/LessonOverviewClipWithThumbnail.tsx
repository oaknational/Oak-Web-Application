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
};

const LessonOverviewClipWithThumbnail: FC<LessonOverviewClipWithThumbnail> = ({
  title,
  playbackId,
  playbackPolicy,
  numberOfClips,
  href,
  isAudioClip,
}: LessonOverviewClipWithThumbnail) => {
  const thumbnailImage = useMediaClipThumbnailUrl({
    playbackId,
    playbackPolicy,
    isLegacy: false,
  });

  return (
    <OakMediaClipStackListItem
      title={title}
      imageUrl={thumbnailImage}
      imageAltText=""
      href={href}
      numberOfClips={numberOfClips}
      isAudioClip={isAudioClip}
    />
  );
};

export default LessonOverviewClipWithThumbnail;
