import { PlaybackPolicy, useSignedThumbnailToken } from "./useSignedVideoToken";

interface UseThumbnailImageProps {
  playbackId: string;
  playbackPolicy: PlaybackPolicy;
  isLegacy?: boolean;
}

const useMediaClipThumbnailUrl = ({
  playbackId,
  playbackPolicy,
  isLegacy = false,
}: UseThumbnailImageProps) => {
  const thumbnailToken = useSignedThumbnailToken({
    playbackId,
    playbackPolicy,
    isLegacy,
  });

  if (thumbnailToken.playbackToken !== null) {
    const thumbnailImage = thumbnailToken
      ? `https://image.mux.com/${playbackId}/thumbnail.png?token=${thumbnailToken.playbackToken}`
      : "";
    return thumbnailImage;
  } else {
    return "";
  }
};

export default useMediaClipThumbnailUrl;
