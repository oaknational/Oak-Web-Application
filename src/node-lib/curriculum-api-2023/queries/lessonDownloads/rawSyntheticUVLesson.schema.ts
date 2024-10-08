import { z } from "zod";
import { syntheticUnitvariantLessonsByKsSchema } from "@oaknational/oak-curriculum-schema";

export const rawSyntheticUVLessonSchema =
  syntheticUnitvariantLessonsByKsSchema.omit({
    unitvariant_id: true,
    null_unitvariant: true,
  });

export type RawSyntheticUVLesson = z.infer<typeof rawSyntheticUVLessonSchema>;
