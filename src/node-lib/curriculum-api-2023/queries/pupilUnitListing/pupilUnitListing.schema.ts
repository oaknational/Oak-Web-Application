import { z } from "zod";
import { syntheticUnitvariantsWithLessonIdsByYearsSchema } from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const unitBrowseDataSchema = z.array(
  syntheticUnitvariantsWithLessonIdsByYearsSchema.omit({
    null_unitvariant_id: true,
    base_slug: true,
  }),
);

export type UnitListingBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof unitBrowseDataSchema>
>;
