import { FC } from "react";
import {
  OakMediaClipStackListItem,
  OakMediaClipStackListItemProps,
} from "@oaknational/oak-components";

import { PlaybackPolicy } from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";
import useMediaClipThumbnail from "@/components/SharedComponents/VideoPlayer/useMediaClipThumbnails";

export type LessonOverviewClipWithThumbnail = Omit<
  OakMediaClipStackListItemProps,
  "imageUrl" | "imageAltText"
> & {
  playbackId: string;
  playbackPolicy: PlaybackPolicy;
  numberOfClips: number;
};

const LessonOverviewClipWithThumbnail: FC<LessonOverviewClipWithThumbnail> = ({
  title,
  playbackId,
  playbackPolicy,
  numberOfClips,
  href,
}: LessonOverviewClipWithThumbnail) => {
  const thumbnailImage = useMediaClipThumbnail({
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
    />
  );
};

export default LessonOverviewClipWithThumbnail;
