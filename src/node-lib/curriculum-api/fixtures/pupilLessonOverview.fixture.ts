import { PupilLessonOverviewData } from "..";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const pupilLessonOverviewFixture = (
  partial?: Partial<PupilLessonOverviewData>,
): PupilLessonOverviewData => {
  return {
    starterQuiz: quizQuestions,
    lessonSlug: "lesson-slug",
    lessonTitle: "lesson-title",
    ...partial,
  };
};

export default pupilLessonOverviewFixture;
