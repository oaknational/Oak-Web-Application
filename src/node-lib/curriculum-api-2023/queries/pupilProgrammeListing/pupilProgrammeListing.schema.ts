import { z } from "zod";
import { syntheticProgrammesByYearSchema } from "@oaknational/oak-curriculum-schema";
import zodToCamelCase from "zod-to-camel-case";

export const pupilProgrammeListingSchema = syntheticProgrammesByYearSchema.pick(
  {
    programme_slug: true,
    programme_fields: true,
    year_slug: true,
  },
);

const pupilProgrammeListingCamel = zodToCamelCase(pupilProgrammeListingSchema);
export type PupilProgrammeListingData = z.infer<
  typeof pupilProgrammeListingCamel
>;
