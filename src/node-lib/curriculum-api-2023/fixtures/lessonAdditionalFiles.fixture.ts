import { additionalFilesFixture } from "@oaknational/oak-curriculum-schema";

import keysToCamelCase from "@/utils/snakeCaseConverter";
import { AdditionalFiles } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const lessonAdditionalFilesFixture = (
  overrides: Partial<AdditionalFiles>,
): AdditionalFiles => {
  const snake = additionalFilesFixture();
  const camel = keysToCamelCase(snake);
  return {
    ...camel,
    ...overrides,
  };
};
