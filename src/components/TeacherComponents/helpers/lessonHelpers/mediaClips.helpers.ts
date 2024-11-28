import type {
  MediaClip,
  MediaClipsList,
  ConstructedMediaClip,
} from "@/components/TeacherComponents/types/mediaClip.types";
import { useSignedThumbnailToken } from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";

export const constructMediaClipList = (mediaClips: MediaClipsList) => {
  const listOfAllClips: ConstructedMediaClip[] = [];

  Object.keys(mediaClips).forEach((learningCycle) => {
    mediaClips[learningCycle].forEach((mediaClip: MediaClip) => {
      let item: ConstructedMediaClip | {};

      if (mediaClip.mediaType === "video") {
        const { videoObject, mediaClipTitle, learningCycleTitle, slug } =
          mediaClip;

        const thumbnailToken =
          videoObject &&
          useSignedThumbnailToken({
            playbackId: videoObject?.muxPlaybackId,
            playbackPolicy: videoObject?.playbackPolicy,
            isLegacy: true,
          });

        item = {
          thumbnailImage: `https://image.mux.com/${videoObject.muxPlaybackId}/thumbnail.png?token=${thumbnailToken.playbackToken}`,
          muxPlaybackId: videoObject?.muxPlaybackId || "",
          transcript: videoObject?.transcriptionSentences,
          timeCode: videoObject?.duration,
          clipName: mediaClipTitle,
          clipSlug: slug,
          learningCycle: learningCycleTitle,
          muxPlayingState: "standard",
          onClick: () => {},
          isAudioClip: false,
          element: "button",
          imageAltText: "",
        };
      } else {
        const { mediaObject, mediaClipTitle, learningCycleTitle, slug } =
          mediaClip;

        item = {
          muxPlaybackId: mediaObject?.muxPlaybackId,
          timeCode: mediaObject?.duration,
          clipName: mediaClipTitle,
          clipSlug: slug,
          learningCycle: learningCycleTitle,
          muxPlayingState: "standard",
          onClick: () => {},
          isAudioClip: true,
          element: "button",
          imageAltText: "",
        };
      }

      if (item) listOfAllClips.push(item);
    });
  });

  return listOfAllClips;
};
