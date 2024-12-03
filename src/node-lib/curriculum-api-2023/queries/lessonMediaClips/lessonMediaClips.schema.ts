/**
 *
 * Ultimately some of these types will be used more widely at which point they could be moved to a shared location
 *
 */

import { z } from "zod";
import { syntheticUnitvariantLessonsByKsSchema } from "@oaknational/oak-curriculum-schema";

import { lessonPathwaySchema } from "../../shared.schema";
import { baseLessonBrowseSchema } from "../lessonShare/lessonShare.schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const lessonBrowseDataSchema =
  syntheticUnitvariantLessonsByKsSchema.omit({
    null_unitvariant_id: true,
  });

export type LessonBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataSchema>
>;

const mediaObjectSchema = z
  .object({
    muxPlaybackId: z.string(),
    playbackPolicy: z.enum(["signed", "public"]),
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
    playbackPolicy: z.enum(["signed", "public"]),
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
  mediaType: z.enum(["audio", "video"]),
  videoId: z.number().nullable(),
  videoObject: videoObjectSchema,
});

const cycleSchema = z.array(mediaClipsCycleSchema);

const mediaClipsSchema = z.object({
  intro: cycleSchema,
  cycle1: cycleSchema,
  cycle2: cycleSchema,
  cycle3: cycleSchema,
});

const learningCycleSchema = z.enum(["intro", "cycle1", "cycle2", "cycle3"]);

const baseLessonMediaClipsSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  keyStageTitle: z.string(),
  mediaClips: mediaClipsSchema,
});

export const canonicalLessonMediaClipsSchema =
  baseLessonMediaClipsSchema.extend({
    pathways: z.array(lessonPathwaySchema),
  });

export const lessonMediaClipsSchema = baseLessonMediaClipsSchema.extend({
  ...baseLessonBrowseSchema.shape,
});

export type MediaClipsList = z.infer<typeof mediaClipsSchema>;
export type MediaClip = z.infer<typeof mediaClipsCycleSchema>;
export type LessonMediaClipsData = z.infer<typeof lessonMediaClipsSchema>;
export type CanonicalLessonMediaClips = z.infer<
  typeof canonicalLessonMediaClipsSchema
>;
export type MediaObject = z.infer<typeof mediaObjectSchema>;
export type VideoObject = z.infer<typeof videoObjectSchema>;
export type LearningCycle = z.infer<typeof learningCycleSchema>;
