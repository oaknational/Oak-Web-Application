import { z } from "zod";
import { syntheticUnitvariantLessonsByKsSchemaOld } from "@oaknational/oak-curriculum-schema";

export const rawSuvLessonsSchema =
  syntheticUnitvariantLessonsByKsSchemaOld.omit({
    unitvariant_id: true,
    null_unitvariant: true,
  });

export type RawSuvLessons = z.infer<typeof rawSuvLessonsSchema>;
