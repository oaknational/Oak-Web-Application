import { z } from "zod";
import {
  syntheticUnitvariantLessonsSchema,
  mediaClipsRecordSchema,
  clipVideoObjectSchema,
  clipMediaObjectSchema,
  // mediaClipCycleSchema,
} from "@oaknational/oak-curriculum-schema";

// import { zodToCamelCase } from "@/node-lib/curriculum-api-2023/helpers/zodToCamelCase";
import { lessonPathwaySchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import { baseLessonBrowseSchema } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";
import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const lessonBrowseDataSchema = syntheticUnitvariantLessonsSchema.omit({
  null_unitvariant_id: true,
});

export type LessonBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataSchema>
>;

const metadataCamelSchema = z
  .object({
    assetType: z.string(),
    sourceType: z.string(),
    assetSource: z.string(),
    licenceType: z.string(),
    contentCycle: z.string(),
    permissionGranted: z.string(),
  })
  .partial();

const mediaObjectCamelSchema = z.object({
  id: z.string(),
  url: z.string(),
  type: z.string(),
  bytes: z.number(),
  width: z.number(),
  format: z.string(),
  height: z.number(),
  version: z.number(),
  duration: z.number(),
  metadata: metadataCamelSchema,
  secureUrl: z.string(),
  accessMode: z.string(),
  assetFolder: z.string(),
  displayName: z.string(),
  resourceType: z.string(),
});

const trackCamelSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    assetId: z.string(),
    duration: z.number(),
  })
  .partial();

export const videoObjectCamelSchema = z.object({
  id: z.string(),
  status: z.string().optional(),
  tracks: z.array(trackCamelSchema).optional(),
  duration: z.number(),
  createdAt: z.number(),
  mp4Support: z.string(),
  passthrough: z.string(),
  muxAssetId: z.string(),
  playbackIds: z.array(
    z.object({
      id: z.string(),
      policy: z.string(),
    }),
  ),
  encodingTier: z.string(),
  videoQuality: z.string(),
  muxPlaybackId: z.string(),
  signedStreamId: z.string(),
  staticRenditions: z.object({
    status: z.string(),
  }),
  maxResolutionTier: z.string(),
  maxStoredResolution: z.string(),
  nonStandardInputReasons: z
    .object({
      audioCodec: z.string(),
    })
    .optional(),
});

// const mediaObjectCamelSchema = zodToCamelCase(clipMediaObjectSchema);

// export const videoObjectCamelSchema = zodToCamelCase(clipVideoObjectSchema);

// export const mediaClipsCycleCamelSchema = zodToCamelCase(mediaClipCycleSchema);

export const mediaClipsCycleCamelSchema = z.object({
  //both data types coming back from the API
  order: z.number().or(z.string()),
  mediaId: z.number().or(z.string()),
  videoId: z.number(),
  mediaType: z.string(),
  customTitle: z.string(),
  mediaObject: mediaObjectCamelSchema,
  videoObject: videoObjectCamelSchema,
});

export const mediaClipsRecordCamelSchema = z.record(
  z.string(),
  z.array(mediaClipsCycleCamelSchema),
);

const baseLessonMediaClipsPageSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  keyStageTitle: z.string(),
  mediaClips: mediaClipsRecordCamelSchema,
  lessonOutline: z.array(z.object({ lessonOutline: z.string() })),
});

export const lessonMediaClipsSchema = baseLessonMediaClipsPageSchema.extend({
  ...baseLessonBrowseSchema.shape,
});

export const canonicalLessonMediaClipsSchema =
  baseLessonMediaClipsPageSchema.extend({
    pathways: z.array(lessonPathwaySchema),
  });

export type ClipMediaObject = z.infer<typeof clipMediaObjectSchema>;
export type ClipVideoObject = z.infer<typeof clipVideoObjectSchema>;

export type MediaClipsList = z.infer<typeof mediaClipsRecordSchema>;
export type MediaClipListCamelCase = ConvertKeysToCamelCase<
  z.infer<typeof mediaClipsRecordSchema>
>;

export type MediaClip = ConvertKeysToCamelCase<
  z.infer<typeof mediaClipsCycleCamelSchema>
>;

// Page Schemas
export type LessonMediaClipsData = z.infer<typeof lessonMediaClipsSchema>;
export type CanonicalLessonMediaClips = z.infer<
  typeof canonicalLessonMediaClipsSchema
>;
