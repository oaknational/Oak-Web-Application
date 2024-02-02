import { z } from "zod";

import { lessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";

export const pupilLessonOverviewSchema = z.object({
  starterQuiz: lessonOverviewQuizData,
  exitQuiz: lessonOverviewQuizData,
  lessonSlug: z.string(),
  lessonTitle: z.string(),
});

export type PupilLessonOverviewPageData = z.infer<
  typeof pupilLessonOverviewSchema
>;
