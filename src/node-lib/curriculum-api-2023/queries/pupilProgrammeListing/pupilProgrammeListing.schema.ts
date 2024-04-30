import { z } from "zod";
import { syntheticProgrammesByYearSchema } from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const pupilProgrammeListingSchema = syntheticProgrammesByYearSchema.pick(
  {
    programme_slug: true,
    combined_programme_fields: true,
    base_programme_fields: true,
  },
);

export type PupilProgrammeListingData = ConvertKeysToCamelCase<
  z.infer<typeof pupilProgrammeListingSchema>
>;
