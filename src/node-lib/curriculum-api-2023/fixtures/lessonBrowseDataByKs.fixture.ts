import { syntheticUnitvariantLessonsByKsFixture } from "@oaknational/oak-curriculum-schema";

import { LessonBrowseDataByKsOld } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const lessonBrowseDataByKsFixture = (
  overrides: Partial<LessonBrowseDataByKsOld>,
): LessonBrowseDataByKsOld => {
  const snake = syntheticUnitvariantLessonsByKsFixture();
  const camel = keysToCamelCase({
    ...snake,
    supplementaryData: { unit_order: 1, order_in_unit: 1 },
  });
  return {
    ...camel,
    ...overrides,
  };
};
