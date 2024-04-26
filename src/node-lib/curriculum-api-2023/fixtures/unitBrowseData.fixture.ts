import { syntheticUnitvariantsWithLessonIdsFixture } from "@oaknational/oak-curriculum-schema";

import keysToCamelCase from "@/utils/snakeCaseConverter";
import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";

export const unitBrowseDataFixture = (
  overrides: Partial<UnitListingBrowseData[number]>,
): UnitListingBrowseData[number] => {
  const snake = syntheticUnitvariantsWithLessonIdsFixture();
  const camel = keysToCamelCase(snake) as UnitListingBrowseData[number];
  return {
    ...camel,
    ...overrides,
  };
};
