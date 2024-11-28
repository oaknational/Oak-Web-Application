
import type { MediaClip, MediaClipsList, ConstructedMediaClip } from "@/components/TeacherComponents/types/mediaClip.types";
import { useSignedThumbnailToken } from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";

export const constructMediaClipList = (mediaClips: MediaClipsList) => {
    const listOfAllClips: ConstructedMediaClip[] = [];

  Object.keys(mediaClips).forEach((learningCycle) => {
    mediaClips[learningCycle].forEach((mediaClip: MediaClip) => {
      let item: ConstructedMediaClip | {};

      if (mediaClip.mediaType === "video") {
        const { videoObject, mediaClipTitle, learningCycleTitle, mediaClipSlug } = mediaClip;

        const thumbnailToken = videoObject && useSignedThumbnailToken({
          playbackId: videoObject?.muxPlaybackId,
          playbackPolicy: "signed",
          isLegacy: true,
        });

        item = {
          thumbnailImage: `https://image.mux.com/${videoObject.muxPlaybackId}/thumbnail.png?token=${thumbnailToken.playbackToken}`,
          muxPlaybackId: videoObject?.muxPlaybackId || "",
          timeCode: videoObject?.duration,
          clipName: mediaClipTitle,
          clipSlug: mediaClipSlug,
          learningCycle: learningCycleTitle,
          muxPlayingState: "standard",
          onClick: () => {},
          imageAltText: "",
          isAudioClip: false,
          element: "button",
        };
      } else {
        const { mediaObject, mediaClipTitle, learningCycleTitle, mediaClipSlug } = mediaClip;
        
          item = {
            muxPlaybackId: mediaObject?.muxPlaybackId,
            timeCode: mediaObject?.duration,
            clipName: mediaClipTitle,
            clipSlug: mediaClipSlug,
            learningCycle: learningCycleTitle,
            muxPlayingState: "standard",
            onClick: () => {},
            imageAltText: "",
            isAudioClip: true,
            element: "button",
          };
      } 

      if (item) listOfAllClips.push(item);
    });  
  });

  return listOfAllClips;
}