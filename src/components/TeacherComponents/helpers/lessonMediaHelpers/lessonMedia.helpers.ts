import type { MediaClip } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

export const getPlaybackId = (currentClip: MediaClip) => {
  if (currentClip && currentClip.videoObject) {
    const signed = currentClip.videoObject.playbackIds?.find((p) => {
      return p?.policy === "signed";
    });
    return signed?.id;
  }
  return "";
};

export const joinTranscript = (currentClip: MediaClip) => {
  return currentClip.transcriptSentences?.join(" ");
};

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
