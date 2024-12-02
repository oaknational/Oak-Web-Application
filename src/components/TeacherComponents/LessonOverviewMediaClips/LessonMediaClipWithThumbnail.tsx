import { FC } from "react";
import {
  OakMediaClipStackListItem,
  OakMediaClipStackListItemProps,
} from "@oaknational/oak-components";

import {
  PlaybackPolicy,
  useSignedThumbnailToken,
} from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";

export type LessonMediaClipWithThumbnailProps = Omit<
  OakMediaClipStackListItemProps,
  "imageUrl" | "imageAltText"
> & {
  playbackId: string;
  playbackPolicy: PlaybackPolicy;
  numberOfClips: number;
};

const LessonMediaClipWithThumbnail: FC<LessonMediaClipWithThumbnailProps> = ({
  title,
  playbackId,
  playbackPolicy,
  numberOfClips,
  href,
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
    <OakMediaClipStackListItem
      title={title}
      imageUrl={thumbnailImage}
      imageAltText=""
      href={href}
      numberOfClips={numberOfClips}
    />
  );
};

export default LessonMediaClipWithThumbnail;
