import type { MediaClip } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

export const getPlaybackId = (currentClip: MediaClip) => {
  if (currentClip.videoObject) {
    return currentClip.videoObject.muxPlaybackId;
  }
  return "";
};

// export const getTranscript = (currentClip: MediaClip) => {
//   if (currentClip.mediaType === "video" && currentClip.videoObject) {
//     return currentClip.videoObject.transcriptionSentences?.join(" ");
//   } else if (currentClip.mediaType === "audio" && currentClip.mediaObject) {
//     return currentClip.mediaObject.transcriptionSentences?.join(" ");
//   } else return "";
// };

export const getPlayingState = (
  currentClipMediaId: string | undefined,
  mediaId: string,
  playedVideosList?: string[],
) => {
  if (mediaId === currentClipMediaId) {
    return "playing";
  } else if (playedVideosList?.includes(mediaId)) {
    return "played";
  } else {
    return "standard";
  }
};

export const getInitialCurrentClip = (
  listOfAllClips: (MediaClip & { learningCycle: string })[],
  videoQueryParam?: string | string[] | undefined,
) => {
  if (videoQueryParam) {
    return listOfAllClips.find((clip) => clip.mediaId === videoQueryParam);
  } else {
    return listOfAllClips[0];
  }
};
