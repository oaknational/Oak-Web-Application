import { z } from "zod";
import {
  SyntheticUnitvariantsWithLessonIdsByYearsCamel,
  syntheticUnitvariantsWithLessonIdsByYearsSchema,
} from "@oaknational/oak-curriculum-schema";

export const unitBrowseDataSchema = z.array(
  syntheticUnitvariantsWithLessonIdsByYearsSchema.omit({
    null_unitvariant_id: true,
    base_slug: true,
  }),
);

export type UnitListingBrowseData = Array<
  Omit<
    SyntheticUnitvariantsWithLessonIdsByYearsCamel,
    "nullUnitvariantId" | "baseSlug"
  >
>;
