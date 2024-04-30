import { syntheticProgrammesByYearFixture } from "@oaknational/oak-curriculum-schema";

import keysToCamelCase from "@/utils/snakeCaseConverter";
import { PupilSubjectListingData } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";

export const subjectBrowseDataFixture = (
  overrides: Partial<PupilSubjectListingData>,
): PupilSubjectListingData => {
  const snake = syntheticProgrammesByYearFixture();
  const camel = keysToCamelCase(snake) as PupilSubjectListingData;
  return {
    ...camel,
    ...overrides,
  };
};
