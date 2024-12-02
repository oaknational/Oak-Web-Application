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

const baseLessonMediaClipsSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  keyStageTitle: z.string(),
});

export const canonicalLessonMediaClipsSchema =
  baseLessonMediaClipsSchema.extend({
    pathways: z.array(lessonPathwaySchema),
  });

const mediaObjectSchema = z
  .object({
    resourceType: z.string(),
    muxPlaybackId: z.string(),
    playbackPolicy: z.enum(["signed", "public"]),
    title: z.string(),
    usageRestrictions: z.string().optional(),
    alt: z.string().optional(),
    attributionRequired: z.string(),
    duration: z.number(),
  })
  .nullable();

const videoObjectSchema = z
  .object({
    muxPlaybackId: z.string(),
    playbackPolicy: z.enum(["public", "signed"]),
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
  mediaId: z.number().nullish(),
  learningCycleTitle: z.string(),
  mediaClipTitle: z.string(),
  playbackPolicy: z.enum(["public", "signed"]),
  slug: z.string(),
  title: z.string(),
  mediaObject: mediaObjectSchema,
  mediaType: z.enum(["audio", "video"]),
  videoId: z.number().nullish(),
  videoObject: videoObjectSchema,
});

const cycleSchema = z.array(mediaClipsCycleSchema);

export const mediaClipsSchema = z.record(z.string(), cycleSchema);

// TODO: Rename and extrapolate these types into component library

export const lessonMediaClipsSchema = baseLessonMediaClipsSchema.extend({
  ...baseLessonBrowseSchema.shape,
  mediaClips: mediaClipsSchema,
});
export type MediaObject = z.infer<typeof mediaClipsSchema>;
export type LessonMediaClipsData = z.infer<typeof lessonMediaClipsSchema>;
export type CanonicalLessonMediaClips = z.infer<
  typeof canonicalLessonMediaClipsSchema
>;
