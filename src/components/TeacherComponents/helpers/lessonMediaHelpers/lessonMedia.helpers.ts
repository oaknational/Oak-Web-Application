import type { MediaClip } from "@/components/TeacherComponents/types/mediaClip.types";

export const getPlaybackId = (currentClip: MediaClip) => {
  if (currentClip.mediaType === "video" && currentClip.videoObject) {
    return currentClip.videoObject.muxPlaybackId;
  } else if (currentClip.mediaType === "audio" && currentClip.mediaObject) {
    return currentClip.mediaObject.muxPlaybackId;
  } else return "";
};

export const getTranscript = (currentClip: MediaClip) => {
  if (currentClip.mediaType === "video" && currentClip.videoObject) {
    return currentClip.videoObject.transcriptionSentences?.join(" ");
  } else if (currentClip.mediaType === "audio" && currentClip.mediaObject) {
    return currentClip.mediaObject.transcriptionSentences?.join(" ");
  } else return "";
};

export const getPlayingState = (
  currentClipSlug: string | undefined,
  slug: string,
) => {
  if (slug === currentClipSlug) {
    return "playing";
  } else {
    return "standard";
  }
};
