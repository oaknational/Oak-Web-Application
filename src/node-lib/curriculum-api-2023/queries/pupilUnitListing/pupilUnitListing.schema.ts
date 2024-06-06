import { z } from "zod";
import { syntheticUnitvariantsWithLessonIdsSchema } from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const unitBrowseDataSchema = z.array(
  syntheticUnitvariantsWithLessonIdsSchema.omit({
    null_unitvariant: true,
    base_slug: true,
  }),
);

export type UnitListingBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof unitBrowseDataSchema>
>;
