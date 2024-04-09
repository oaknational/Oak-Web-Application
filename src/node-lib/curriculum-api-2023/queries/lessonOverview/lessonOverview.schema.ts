import { z } from "zod";

import { baseLessonOverviewSchema } from "../../shared.schema";

export const lessonOverviewDownloads = z.array(
  z.object({
    exists: z.boolean().nullable(),
    type: z.enum([
      "presentation",
      "intro-quiz-questions",
      "intro-quiz-answers",
      "exit-quiz-questions",
      "exit-quiz-answers",
      "worksheet-pdf",
      "worksheet-pptx",
      "supplementary-pdf",
      "supplementary-docx",
      "curriculum-pdf",
    ]),
  }),
);

export type LessonOverviewDownloads = z.infer<typeof lessonOverviewDownloads>;

export const lessonOverviewSchema = baseLessonOverviewSchema.extend({
  programmeSlug: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  yearTitle: z.string().nullable().optional(),
  examBoardTitle: z.string().nullable().optional(),
  downloads: lessonOverviewDownloads,
});

export type LessonOverviewPageData = z.infer<typeof lessonOverviewSchema>;

export default lessonOverviewSchema;

export const baseLessonOverviewData = baseLessonOverviewSchema;
