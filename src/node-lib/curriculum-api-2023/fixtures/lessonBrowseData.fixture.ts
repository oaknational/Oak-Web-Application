import { syntheticUnitvariantLessonsFixture } from "@oaknational/oak-curriculum-schema";

import keysToCamelCase from "@/utils/snakeCaseConverter";
import { LessonBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const lessonBrowseDataFixture = (
  overrides: Partial<LessonBrowseData>,
): LessonBrowseData => {
  const snake = syntheticUnitvariantLessonsFixture();
  const camel = keysToCamelCase(snake) as LessonBrowseData;
  return {
    ...camel,
    ...overrides,
  };
};
