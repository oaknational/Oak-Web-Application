import { lessonContentFixture as lessonContentFixtureSnake } from "@oaknational/oak-curriculum-schema";

import keysToCamelCase from "@/utils/snakeCaseConverter";
import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { convertQuestionMathIdentity } from "@/pages-helpers/shared/lesson-pages/quizMathjax";

export const lessonContentFixture = (
  overrides: Partial<LessonContent>,
): LessonContent => {
  const snake = lessonContentFixtureSnake();
  const camel = keysToCamelCase(snake) as LessonContent;
  const content = {
    ...camel,
    ...overrides,
  };

  return {
    ...content,
    starterQuiz: convertQuestionMathIdentity(content.starterQuiz),
    exitQuiz: convertQuestionMathIdentity(content.exitQuiz),
  };
};
