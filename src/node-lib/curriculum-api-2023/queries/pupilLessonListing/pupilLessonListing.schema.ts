import { z } from "zod";
import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const lessonBrowseDataSchema = z.array(
  syntheticUnitvariantLessonsSchema.omit({
    null_unitvariant: true,
    base_slug: true,
  }),
);

export type LessonListingBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataSchema>
>;
