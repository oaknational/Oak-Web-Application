import { z } from "zod";
import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";

export const rawSuvLessonsSchema = syntheticUnitvariantLessonsSchema.omit({
  null_unitvariant_id: true,
});

export type RawSuvLessons = z.infer<typeof rawSuvLessonsSchema>;
