
import type { MediaClip, MediaClipsList, ConstructedMediaClip } from "@/components/TeacherComponents/types/mediaClip.types";
import { useSignedThumbnailToken } from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";

export const constructMediaClipList = (mediaClips: MediaClipsList) => {
    const listOfAllClips: ConstructedMediaClip[] = [];

  Object.keys(mediaClips).forEach((learningCycle) => {
    mediaClips[learningCycle].forEach((mediaClip: MediaClip) => {
      let item: ConstructedMediaClip | {};

      if (mediaClip.mediaType === "video") {
        const { videoObject } = mediaClip;

        const thumbnailToken = videoObject && useSignedThumbnailToken({
          playbackId: videoObject?.muxPlaybackId,
          playbackPolicy: "signed",
          isLegacy: false,
        });

        item = {
          thumbnailImage: `https://image.mux.com/${videoObject.muxPlaybackId}/thumbnail.{format}?token=${thumbnailToken}`,
          muxPlaybackId: videoObject?.muxPlaybackId || "",
          timeCode: videoObject?.duration,
          clipName: videoObject?.displayName,
          learningCycle: "[learning cycle title here]",
          muxPlayingState: "standard",
          onClick: () => {},
          imageAltText: "",
          isAudioClip: false,
          element: "button",
        };
      } else {
        const { mediaObject } = mediaClip;
        
          item = {
            muxPlaybackId: mediaObject?.url, // todo should it come from playbackId too?
            timeCode: 0, // @todo
            clipName: mediaObject?.displayName,
            learningCycle: "[learning cycle title here]", //@todo
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