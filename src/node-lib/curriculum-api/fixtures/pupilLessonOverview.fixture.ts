import { PupilLessonOverviewData } from "..";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const pupilLessonOverviewFixture = (
  partial?: Partial<PupilLessonOverviewData>,
): PupilLessonOverviewData => {
  return {
    lessonTitle: "Islamic Geometry",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    starterQuiz: quizQuestions,
    lessonSlug: "lesson-slug",
    ...partial,
  };
};

export default pupilLessonOverviewFixture;
