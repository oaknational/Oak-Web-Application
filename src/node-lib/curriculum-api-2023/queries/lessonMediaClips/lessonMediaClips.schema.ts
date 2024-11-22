/**
 *
 * Ultimately some of these types will be used more widely at which point they could be moved to a shared location
 *
 */

import { z } from "zod";
import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";

import { lessonPathwaySchema } from "../../shared.schema";

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
});

export const lessonMediaClipsSchema = baseLessonMediaClipsSchema.extend({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  examBoardSlug: z.string().nullish(),
  examBoardTitle: z.string().nullish(),
  tierSlug: z.string().nullish(),
  tierTitle: z.string().nullish(),
});

export const canonicalLessonMediaClipsSchema =
  baseLessonMediaClipsSchema.extend({
    pathways: z.array(lessonPathwaySchema),
  });

export type LessonMediaClipsData = z.infer<typeof lessonMediaClipsSchema>;
export type CanonicalLessonMediaClips = z.infer<
  typeof canonicalLessonMediaClipsSchema
>;
