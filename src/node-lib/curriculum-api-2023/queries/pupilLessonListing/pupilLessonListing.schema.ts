import { z } from "zod";

import { syntheticUnitvariantLessonsSchema } from "@/node-lib/curriculum-api-2023/shared.schema.new";
import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const lessonBrowseDataSchema = syntheticUnitvariantLessonsSchema.omit({
  null_unitvariant: true,
  unit_data: true,
  lesson_data: true,
  programme_fields: true,
  supplementary_data: true,
});

export type LessonBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataSchema>
>;
