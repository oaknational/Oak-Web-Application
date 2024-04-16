import { contentFixture } from "./schema.new.fixture";

import keysToCamelCase from "@/utils/snakeCaseConverter";
import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const lessonContentFixture = (
  overrides: Partial<LessonContent>,
): LessonContent => {
  const snake = contentFixture();
  const camel = keysToCamelCase(snake) as LessonContent;
  return {
    ...camel,
    ...overrides,
  };
};
