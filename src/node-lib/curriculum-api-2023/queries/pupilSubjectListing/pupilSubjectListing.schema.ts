import { z } from "zod";
import {
  syntheticProgrammesByYearSchema,
  subjectSlugs,
} from "@oaknational/oak-curriculum-schema";
import zodToCamelCase from "zod-to-camel-case";

export const pupilSubjectListingSchema = syntheticProgrammesByYearSchema.pick({
  programme_slug: true,
  programme_fields: true,
  year_slug: true,
  base_slug: true,
  is_legacy: true,
  features: true,
  actions: true,
});

const pupilSubjectListingCamel = zodToCamelCase(pupilSubjectListingSchema);
export type PupilSubjectListingData = z.infer<typeof pupilSubjectListingCamel>;

export type SubjectSlugs = z.infer<typeof subjectSlugs>;
