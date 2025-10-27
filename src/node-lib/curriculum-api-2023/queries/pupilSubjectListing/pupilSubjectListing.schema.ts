import { z } from "zod";
import {
  syntheticProgrammesByYearSchema,
  subjectSlugs,
} from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const pupilSubjectListingSchema = syntheticProgrammesByYearSchema.pick({
  programme_slug: true,
  programme_fields: true,
  year_slug: true,
  base_slug: true,
  is_legacy: true,
  features: true,
  actions: true,
});

export type PupilSubjectListingData = ConvertKeysToCamelCase<
  z.infer<typeof pupilSubjectListingSchema>
>;

export type SubjectSlugs = ConvertKeysToCamelCase<z.infer<typeof subjectSlugs>>;
