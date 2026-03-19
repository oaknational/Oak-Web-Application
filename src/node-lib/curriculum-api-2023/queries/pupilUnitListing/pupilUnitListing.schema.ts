import { z } from "zod";
import { syntheticUnitvariantsWithLessonIdsByYearsSchema } from "@oaknational/oak-curriculum-schema";
import zodToCamelCase from "zod-to-camel-case";

export const unitBrowseDataSchema = z.array(
  syntheticUnitvariantsWithLessonIdsByYearsSchema.omit({
    null_unitvariant_id: true,
    base_slug: true,
  }),
);

const unitBrowseDataCamel = zodToCamelCase(unitBrowseDataSchema);
export type UnitListingBrowseData = z.infer<typeof unitBrowseDataCamel>;
