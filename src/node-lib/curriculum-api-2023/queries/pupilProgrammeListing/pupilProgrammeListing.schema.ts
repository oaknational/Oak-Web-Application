import {
  SyntheticProgrammesByYearCamel,
  syntheticProgrammesByYearSchema,
} from "@oaknational/oak-curriculum-schema";

export const pupilProgrammeListingSchema = syntheticProgrammesByYearSchema.pick(
  {
    programme_slug: true,
    programme_fields: true,
    year_slug: true,
  },
);

export type PupilProgrammeListingData = Pick<
  SyntheticProgrammesByYearCamel,
  "programmeSlug" | "programmeFields" | "yearSlug"
>;
