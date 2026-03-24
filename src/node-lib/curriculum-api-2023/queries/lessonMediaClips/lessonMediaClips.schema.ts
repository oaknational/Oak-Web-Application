import { z } from "zod";
import {
  syntheticUnitvariantLessonsSchema,
  actionsSchema,
  mediaClipsRecordSchemaCamel,
  mediaClipCycleSchemaCamel,
  SyntheticUnitvariantLessonsCamel,
} from "@oaknational/oak-curriculum-schema";
import zodToCamelCase from "zod-to-camel-case";

export const lessonBrowseDataSchema = syntheticUnitvariantLessonsSchema.omit({
  null_unitvariant_id: true,
});

export type LessonBrowseData = Omit<
  SyntheticUnitvariantLessonsCamel,
  "nullUnitvariantId"
>;

export const mediaClipObjectCamelCaseSchema = z.object({
  url: z.string(),
  type: z.string(),
  bytes: z.number(),
  format: z.string(),
  displayName: z.string(),
  resourceType: z.string(),
});

export const videoClipObjectCamelCaseSchema = z
  .object({
    duration: z.number().nullable().optional(),
    muxAssetId: z.string(),
    playbackIds: z.array(
      z.object({
        id: z.string(),
        policy: z.string(),
      }),
    ),
    muxPlaybackId: z.string(),
  })
  .nullable();

export const mediaClipCycleCamelSchema = z.object({
  order: z.number().or(z.string()),
  mediaId: z.number().or(z.string()),
  videoId: z.number().nullish(),
  mediaType: z.string().nullish(),
  customTitle: z.string().nullish(),
  mediaObject: mediaClipObjectCamelCaseSchema,
  videoObject: videoClipObjectCamelCaseSchema,
  transcriptSentences: z.array(z.string()).nullish(),
});

export const mediaClipsRecordCamelSchema = z.record(
  z.string(),
  z.array(mediaClipCycleCamelSchema),
);

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

const actionsSchemaCamel = zodToCamelCase(actionsSchema, {
  bidirectional: true,
});
const baseLessonMediaClipsPageSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  keyStageTitle: z.string(),
  mediaClips: mediaClipsRecordCamelSchema,
  lessonOutline: z.array(z.object({ lessonOutline: z.string() })),
  actions: actionsSchemaCamel.nullish(),
  lessonReleaseDate: z.string().nullable(),
  geoRestricted: z.boolean(),
  loginRequired: z.boolean(),
});

export const lessonMediaClipsSchema = baseLessonMediaClipsPageSchema.extend({
  ...lessonPathwaySchema.shape,
});

export const canonicalLessonMediaClipsSchema =
  baseLessonMediaClipsPageSchema.extend({
    pathways: z.array(lessonPathwaySchema),
  });

export type MediaClipListCamelCase = z.infer<
  typeof mediaClipsRecordSchemaCamel
>;

export type MediaClip = z.infer<typeof mediaClipCycleSchemaCamel>;

// Page Schemas
export type LessonMediaClipsData = z.infer<typeof lessonMediaClipsSchema>;
export type CanonicalLessonMediaClips = z.infer<
  typeof canonicalLessonMediaClipsSchema
>;
