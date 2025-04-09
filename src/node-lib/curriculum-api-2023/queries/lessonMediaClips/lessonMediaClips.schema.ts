import { z } from "zod";
import {
  actionsSchema,
  syntheticUnitvariantLessonsSchema,
  mediaClipObjectSchema,
  videoClipObjectSchema,
  mediaClipCycleSchema,
  mediaClipsRecordSchema,
} from "@oaknational/oak-curriculum-schema";

import { zodToCamelCase } from "@/node-lib/curriculum-api-2023/helpers/zodToCamelCase";
import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const lessonBrowseDataSchema = syntheticUnitvariantLessonsSchema.omit({
  null_unitvariant_id: true,
});

export type LessonBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataSchema>
>;

export const mediaClipObjectCamelCaseSchema = zodToCamelCase(
  mediaClipObjectSchema,
);
export const videoClipObjectCamelCaseSchema = zodToCamelCase(
  videoClipObjectSchema,
);
export const mediaClipCycleCamelSchema = zodToCamelCase(mediaClipCycleSchema);
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

const baseLessonMediaClipsPageSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  keyStageTitle: z.string(),
  mediaClips: mediaClipsRecordCamelSchema,
  lessonOutline: z.array(z.object({ lessonOutline: z.string() })),
  actions: zodToCamelCase(actionsSchema).nullish(),
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
  z.infer<typeof mediaClipCycleSchema>
>;

// Page Schemas
export type LessonMediaClipsData = z.infer<typeof lessonMediaClipsSchema>;
export type CanonicalLessonMediaClips = z.infer<
  typeof canonicalLessonMediaClipsSchema
>;
