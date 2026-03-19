import { syntheticUnitvariantLessonsFixtureCamel } from "@oaknational/oak-curriculum-schema";

import { keysToCamelCase } from "zod-to-camel-case";
import { LessonBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const lessonBrowseDataFixture = (
  overrides: Partial<LessonBrowseData>,
): LessonBrowseData => {
  const snake = syntheticUnitvariantLessonsFixtureCamel();
  const camel = keysToCamelCase(snake);
  return {
    ...camel,
    ...overrides,
  };
};
