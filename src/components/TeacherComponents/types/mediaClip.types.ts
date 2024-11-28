import { PlaybackPolicy } from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";

export type MediaObject = {
  // url: string;
  muxPlaybackId: string;
  playbackPolicy: PlaybackPolicy;
  transcriptionSentences?: string[];
  resourceType: string;
  title: string;
  usageRestrictions?: string;
  // alt?: string;
  attributionRequired: string;
  duration: number;
};

export type VideoObject = {
  // url: string;
  muxPlaybackId: string;
  playbackPolicy: PlaybackPolicy;
  videoWithSignLanguageMuxPlaybackId?: string;
  transcriptionSentences?: string[];
  resourceType: string;
  title: string;
  usageRestrictions?: string;
  attributionRequired: string;
  duration: number;
};

export type MediaClip = {
  order: number;
  learningCycleTitle: LearningCycle;
  mediaId: number | null | undefined;
  slug: string;
  mediaClipTitle: string;
  mediaClipSlug: string;
  mediaObject: MediaObject;
  mediaType: "audio" | "video";
  videoId: number | null;
  videoObject: VideoObject;
};

export type MediaClipsList = {
  intro: MediaClip[];
  cycle1: MediaClip[];
  cycle2: MediaClip[];
  cycle3: MediaClip[];
};

export type LearningCycle = "intro" | "cycle 1" | "cycle 2" | "cycle 3";

export type ConstructedMediaClip = {
  thumbnailImage?: string;
  muxPlaybackId: string;
  transcript?: string[];
  timeCode: number;
  clipName: string;
  clipSlug: string;
  learningCycle: string;
  muxPlayingState: "standard" | "played" | "playing";
  onClick: () => void;
  imageAltText: string;
  isAudioClip: boolean;
  element: "button" | "a";
};
