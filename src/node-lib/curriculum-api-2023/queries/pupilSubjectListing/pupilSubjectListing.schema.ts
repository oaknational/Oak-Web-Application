import { z } from "zod";
import { syntheticProgrammesByYearSchema } from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const pupilSubjectListingSchema = syntheticProgrammesByYearSchema.pick({
  programme_slug: true,
  programme_fields: true,
  year_slug: true,
  base_slug: true,
  is_legacy: true,
});

export type PupilSubjectListingData = ConvertKeysToCamelCase<
  z.infer<typeof pupilSubjectListingSchema>
>;
