import { z } from "zod";
import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";

export const rawSyntheticUVLessonSchema = z.object({
  ...syntheticUnitvariantLessonsSchema.omit({
    supplementary_data: true,
    null_unitvariant_id: true,
  }).shape,
  order_in_unit: z.number().optional(),
});

export type RawSyntheticUVLesson = z.infer<typeof rawSyntheticUVLessonSchema>;
