import { z } from "zod";
import { syntheticUnitvariantLessonsByKsSchema } from "@oaknational/oak-curriculum-schema";

export const rawSuvLessonsSchema = syntheticUnitvariantLessonsByKsSchema.omit({
  unitvariant_id: true,
  null_unitvariant: true,
});

export type RawSuvLessons = z.infer<typeof rawSuvLessonsSchema>;
