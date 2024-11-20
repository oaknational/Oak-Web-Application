import { z } from "zod";
import { syntheticUnitvariantLessonsByKsSchemaOld } from "@oaknational/oak-curriculum-schema";

export const rawSyntheticUVLessonSchema =
  syntheticUnitvariantLessonsByKsSchemaOld.omit({
    unitvariant_id: true,
    null_unitvariant: true,
  });

export type RawSyntheticUVLesson = z.infer<typeof rawSyntheticUVLessonSchema>;
