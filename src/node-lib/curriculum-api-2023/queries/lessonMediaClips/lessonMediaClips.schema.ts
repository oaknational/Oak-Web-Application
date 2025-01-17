import { z } from "zod";
import {
  syntheticUnitvariantLessonsSchema,
  videoObjectSchema,
  // mediaClipSchema as cycleSchema,
} from "@oaknational/oak-curriculum-schema";

import { lessonPathwaySchema } from "../../shared.schema";
import { baseLessonBrowseSchema } from "../lessonShare/lessonShare.schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const lessonBrowseDataSchema = syntheticUnitvariantLessonsSchema
  .omit({
    null_unitvariant_id: true,
  })
  .extend({
    lesson_data: syntheticUnitvariantLessonsSchema.shape.lesson_data.extend({
      lesson_outline: z
        .array(z.object({ lesson_outline: z.string() }))
        .optional(),
    }),
  });

export type LessonBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataSchema>
>;

// TODO: EXPORT FROM SCHEMA LIB
const MetadataSchema = z
  .object({
    asset_type: z.string(),
    source_type: z.string(),
    asset_source: z.string(),
    licence_type: z.string(),
    content_cycle: z.string(),
    permissionGranted: z.string(),
  })
  .partial();

const mediaObjectSchema = z.object({
  id: z.string(),
  url: z.string(),
  type: z.string(),
  bytes: z.number(),
  width: z.number(),
  format: z.string(),
  height: z.number(),
  version: z.number(),
  duration: z.number(),
  metadata: MetadataSchema,
  secure_url: z.string(),
  access_mode: z.string(),
  asset_folder: z.string(),
  display_name: z.string(),
  resource_type: z.string(),
});

const MetadataCamelSchema = z
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
  metadata: MetadataCamelSchema,
  secureUrl: z.string(),
  accessMode: z.string(),
  assetFolder: z.string(),
  displayName: z.string(),
  resourceType: z.string(),
});

const TrackCamelSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    assetId: z.string(),
    duration: z.number(),
  })
  .partial();

export const videoObjectCamelSchema = z
  .object({
    id: z.string().optional(),
    status: z.string().optional(),
    tracks: z.array(TrackCamelSchema).optional(),
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
    nonStandardInputReasons: z.object({
      audioCodec: z.string(),
    }),
  })
  .partial();

export const mediaClipCamelSchema = z
  .object({
    //both data types coming back from the API
    order: z.number().or(z.string()),
    mediaId: z.number().or(z.string()),
    videoId: z.number(),
    mediaType: z.string(),
    customTitle: z.string(),
    mediaObject: mediaObjectCamelSchema,
    videoObject: videoObjectCamelSchema,
  })
  .partial();

export const mediaClipsSchema = z.record(
  z.string(),
  z.array(mediaClipCamelSchema),
);

const baseLessonMediaClipsPageSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  keyStageTitle: z.string(),
  mediaClips: mediaClipsSchema,
  lessonOutline: z.array(z.object({ lessonOutline: z.string() })),
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
export type MediaClipListCamelCase = ConvertKeysToCamelCase<
  z.infer<typeof mediaClipsSchema>
>;

export type MediaClip = ConvertKeysToCamelCase<
  z.infer<typeof mediaClipCamelSchema>
>;

// Page Schemas
export type LessonMediaClipsData = z.infer<typeof lessonMediaClipsSchema>;
export type CanonicalLessonMediaClips = z.infer<
  typeof canonicalLessonMediaClipsSchema
>;
