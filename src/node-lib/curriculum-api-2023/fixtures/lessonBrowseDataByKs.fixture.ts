// NB. this will soon be replaced by syntheticUnitvariantLessonsByKsFixture
import { syntheticUnitvariantLessonsByKsFixture } from "@oaknational/oak-curriculum-schema";

import { LessonBrowseDataByKs } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const lessonBrowseDataByKsFixture = (
  overrides: Partial<LessonBrowseDataByKs>,
): LessonBrowseDataByKs => {
  const snake = syntheticUnitvariantLessonsByKsFixture();

  const camel = keysToCamelCase(snake) as LessonBrowseDataByKs;
  return {
    ...camel,
    ...overrides,
  };
};
