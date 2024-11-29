import { PlaybackPolicy } from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";

export type MediaObject = {
  muxPlaybackId: string;
  playbackPolicy: PlaybackPolicy;
  transcriptionSentences?: string[];
  resourceType: string;
  title: string;
  usageRestrictions?: string;
  attributionRequired: string;
  duration: number;
};

export type VideoObject = {
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
  learningCycleTitle: string;
  mediaId: number | null | undefined;
  slug: string;
  mediaClipTitle: string;
  mediaObject: MediaObject | null;
  mediaType: "audio" | "video";
  videoId: number | null;
  videoObject: VideoObject | null;
};

export type MediaClipsList = {
  intro: MediaClip[];
  cycle1: MediaClip[];
  cycle2: MediaClip[];
  cycle3: MediaClip[];
};

export type LearningCycle = "intro" | "cycle1" | "cycle2" | "cycle3";
