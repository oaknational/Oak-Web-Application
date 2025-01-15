import {
  LessonMediaClipsSchema as LessonMediaClips,
  mediaClipSchema,
} from "@oaknational/oak-curriculum-schema";
import { z } from "zod";

import { MediaClipsList } from "../lessonMediaClips/lessonMediaClips.schema";

type MediaClipsSchema = z.infer<typeof mediaClipSchema>;

export const constructMediaClips = (
  mediaClips: LessonMediaClips,
): MediaClipsList | null => {
  const result: MediaClipsList = {};
  for (const mediaClipCycle in mediaClips) {
    const mediaClipData = mediaClips[
      mediaClipCycle as keyof typeof mediaClips
    ] as unknown as MediaClipsSchema[];
    console.log(mediaClipData, "<< DATA AQUI");
    if (!mediaClipData) {
      return null;
    }
    //TODO : GO THROUGH TYPE AND CLEAN UP
    const mediaClipObjects = mediaClipData.map(
      (mediaClipData: MediaClipsSchema) => {
        return {
          order: Number(mediaClipData.order),
          learningCycleTitle: "",
          mediaId: Number(mediaClipData.media_id),
          // No video slug
          slug: "",
          mediaClipTitle: mediaClipData.custom_title ?? "",
          videoId: mediaClipData.video_id ?? null,
          mediaType: mediaClipData.media_type ?? "",
          videoObject: {
            // this has both public and signed, which to use?
            // resourceType and title needed?
            muxPlaybackId: mediaClipData?.video_object?.mux_playback_id ?? "",
            playbackPolicy: "public" as const,
            duration: mediaClipData?.video_object?.duration ?? 0,
            resourceType: "video",
            title: "",
            usageRestrictions: "",
            attributionRequired: "",
          },
          mediaObject: {
            // this has both public and signed, which to use?
            // resourceType and title needed?
            muxPlaybackId: mediaClipData?.video_object?.mux_playback_id ?? "",
            playbackPolicy: "public" as const,
            duration: mediaClipData?.media_object?.duration ?? 0,
            resourceType: "video",
            title: "",
            usageRestrictions: "",
            attributionRequired: "",
          },
        };
      },
    );
    result[mediaClipCycle] = mediaClipObjects;
  }
  return result;
};
