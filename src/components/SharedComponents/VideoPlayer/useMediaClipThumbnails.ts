import { PlaybackPolicy, useSignedThumbnailToken } from "./useSignedVideoToken";

interface UseThumbnailImageProps {
  playbackId: string;
  playbackPolicy: PlaybackPolicy;
  isLegacy?: boolean;
}

const useMediaClipThumbnail = ({
  playbackId,
  playbackPolicy,
  isLegacy = false,
}: UseThumbnailImageProps) => {
  const thumbnailToken = useSignedThumbnailToken({
    playbackId,
    playbackPolicy,
    isLegacy,
  });

  const thumbnailImage = thumbnailToken
    ? `https://image.mux.com/${playbackId}/thumbnail.png?token=${thumbnailToken.playbackToken}`
    : "";

  return thumbnailImage;
};

export default useMediaClipThumbnail;
