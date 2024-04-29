import { z } from "zod";
import {
  syntheticProgrammesByYearSchema,
  ProgrammeFields as ProgrammeFields_snake,
} from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const pupilProgrammeListingSchema = syntheticProgrammesByYearSchema.pick(
  {
    programme_slug: true,
    programme_fields: true,
  },
);

export type PupilProgrammeListingData = ConvertKeysToCamelCase<
  z.infer<typeof pupilProgrammeListingSchema>
>;

export type ProgrammeFields = ConvertKeysToCamelCase<ProgrammeFields_snake>;
