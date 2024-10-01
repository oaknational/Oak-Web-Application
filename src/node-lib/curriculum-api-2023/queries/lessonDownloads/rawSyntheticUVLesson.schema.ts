import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";

export const rawSyntheticUVLessonSchema =
  syntheticUnitvariantLessonsSchema.omit({
    null_unitvariant_id: true,
  });

export type RawSyntheticUVLesson = z.infer<typeof rawSyntheticUVLessonSchema>;
