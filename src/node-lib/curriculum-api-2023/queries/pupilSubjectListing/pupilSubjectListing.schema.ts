import { z } from "zod";
import {
  syntheticProgrammesByYearSchema,
  subjectSlugs,
  SyntheticProgrammesByYearCamel,
} from "@oaknational/oak-curriculum-schema";

export const pupilSubjectListingSchema = syntheticProgrammesByYearSchema.pick({
  programme_slug: true,
  programme_fields: true,
  year_slug: true,
  base_slug: true,
  is_legacy: true,
  features: true,
  actions: true,
});

export type PupilSubjectListingData = SyntheticProgrammesByYearCamel;

export type SubjectSlugs = z.infer<typeof subjectSlugs>;
