import { z } from "zod";

import { lessonOverviewQuizData } from "../../shared.schema";

export const pupilLessonOverviewSchema = z.object({
  starterQuiz: lessonOverviewQuizData,
});

export type PupilLessonOverviewPageData = z.infer<
  typeof pupilLessonOverviewSchema
>;
