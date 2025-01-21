import { z } from "zod";
import {
  syntheticUnitvariantLessonsSchema,
  mediaClipsRecordSchema,
} from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const lessonBrowseDataSchema = syntheticUnitvariantLessonsSchema.omit({
  null_unitvariant_id: true,
});

export type LessonBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataSchema>
>;

export const clipMediaObjectSchema = z
  .object({
    id: z.string(),
    url: z.string(),
    type: z.string(),
    bytes: z.number(),
    format: z.string(),
    duration: z.number().nullable(),
    displayName: z.string(),
    resourceType: z.string(),
  })
  .partial()
  .nullish();

export const clipVideoObjectSchema = z
  .object({
    id: z.string(),
    duration: z.number().nullable(),
    muxAssetId: z.string(),
    playbackIds: z.array(
      z
        .object({
          id: z.string(),
          policy: z.string(),
        })
        .partial()
        .nullish(),
    ),
    muxPlaybackId: z.string(),
  })
  .partial()
  .nullish();

export const mediaClipCycleCamel = z
  .object({
    // Test data had mixture of numbers and strings
    order: z.number().or(z.string()),
    mediaId: z.number().or(z.string()),
    videoId: z.number().nullable(),
    mediaType: z.string().nullish(),
    customTitle: z.string().nullish(),
    mediaObject: clipMediaObjectSchema,
    videoObject: clipVideoObjectSchema,
  })
  .partial()
  .nullish();

// const mediaClipCycleCamel = zodToCamelCase(mediaClipCycleSchema);
const lessonPathwaySchema = z.object({
  programmeSlug: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  lessonCohort: z.string().nullish(),
  examBoardSlug: z.string().nullish(),
  examBoardTitle: z.string().nullish(),
  tierSlug: z.string().nullish(),
  tierTitle: z.string().nullish(),
});

export const mediaClipsRecordCamelSchema = z.record(
  z.string(),
  z.array(mediaClipCycleCamel),
);

const baseLessonMediaClipsPageSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  keyStageTitle: z.string(),
  mediaClips: mediaClipsRecordCamelSchema.nullable(),
  lessonOutline: z.array(z.object({ lessonOutline: z.string() })),
});

export const lessonMediaClipsSchema = baseLessonMediaClipsPageSchema.extend({
  ...lessonPathwaySchema.shape,
});

export const canonicalLessonMediaClipsSchema =
  baseLessonMediaClipsPageSchema.extend({
    pathways: z.array(lessonPathwaySchema),
  });

export type MediaClipListCamelCase = ConvertKeysToCamelCase<
  z.infer<typeof mediaClipsRecordSchema>
>;

export type MediaClip = ConvertKeysToCamelCase<
  z.infer<typeof mediaClipCycleCamel>
>;

// Page Schemas
export type LessonMediaClipsData = z.infer<typeof lessonMediaClipsSchema>;
export type CanonicalLessonMediaClips = z.infer<
  typeof canonicalLessonMediaClipsSchema
>;
