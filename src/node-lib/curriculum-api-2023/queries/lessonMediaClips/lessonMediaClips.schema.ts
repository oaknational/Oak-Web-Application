/**
 *
 * Ultimately some of these types will be used more widely at which point they could be moved to a shared location
 *
 */

import { z } from "zod";
import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";

import { lessonPathwaySchema } from "../../shared.schema";
import { baseLessonBrowseSchema } from "../lessonShare/lessonShare.schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const lessonBrowseDataSchema = syntheticUnitvariantLessonsSchema.omit({
  null_unitvariant_id: true,
});

export type LessonBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataSchema>
>;

// TODO : Refactor so this and the video object are one
const mediaObjectSchema = z
  .object({
    muxPlaybackId: z.string(),
    playbackPolicy: z.string(),
    transcriptionSentences: z.array(z.string()).optional(),
    resourceType: z.string(),
    title: z.string(),
    usageRestrictions: z.string().optional(),
    attributionRequired: z.string(),
    duration: z.number(),
  })
  .nullable();

const videoObjectSchema = z
  .object({
    muxPlaybackId: z.string(),
    // TODO : fix playback policy
    playbackPolicy: z.string(),
    videoWithSignLanguageMuxPlaybackId: z.string().optional(),
    transcriptionSentences: z.array(z.string()).optional(),
    resourceType: z.string(),
    title: z.string(),
    usageRestrictions: z.string().optional(),
    attributionRequired: z.string(),
    duration: z.number(),
  })
  .nullable();

const mediaClipsCycleSchema = z.object({
  order: z.number().min(1),
  learningCycleTitle: z.string(),
  mediaId: z.number(),
  slug: z.string(),
  mediaClipTitle: z.string(),
  mediaObject: mediaObjectSchema,
  mediaType: z.string(),
  videoId: z.number().nullable(),
  videoObject: videoObjectSchema,
});

export const cycleSchema = z.array(mediaClipsCycleSchema);

export const mediaClipsSchema = z.record(z.string(), cycleSchema);

const baseLessonMediaClipsPageSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  keyStageTitle: z.string(),
  mediaClips: mediaClipsSchema,
});

export const canonicalLessonMediaClipsSchema =
  baseLessonMediaClipsPageSchema.extend({
    pathways: z.array(lessonPathwaySchema),
  });

export const lessonMediaClipsSchema = baseLessonMediaClipsPageSchema.extend({
  ...baseLessonBrowseSchema.shape,
});

// MUX Video / Audio object schemas
export type MediaObject = z.infer<typeof mediaObjectSchema>;
export type VideoObject = z.infer<typeof videoObjectSchema>;

export type MediaClipsList = z.infer<typeof mediaClipsSchema>;
export type MediaClip = z.infer<typeof mediaClipsCycleSchema>;

// Page Schemas
export type LessonMediaClipsData = z.infer<typeof lessonMediaClipsSchema>;
export type CanonicalLessonMediaClips = z.infer<
  typeof canonicalLessonMediaClipsSchema
>;
