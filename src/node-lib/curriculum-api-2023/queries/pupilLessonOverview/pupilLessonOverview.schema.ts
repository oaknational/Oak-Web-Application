import { z } from "zod";

import { baseLessonOverviewSchema } from "@/node-lib/curriculum-api-2023/shared.schema";

export const pupilLessonOverviewSchema = baseLessonOverviewSchema
  .pick({
    lessonTitle: true,
    lessonSlug: true,
    starterQuiz: true,
    exitQuiz: true,
    supervisionLevel: true,
    contentGuidance: true,
    lessonEquipmentAndResources: true,
    worksheetUrl: true,
  })
  .extend({
    subjectSlug: z.string(),
    subjectTitle: z.string(),
    yearTitle: z.string().nullable().optional(),
    pupilLessonOutcome: z.string().nullable().optional(),
  });

export type PupilLessonOverviewPageData = z.infer<
  typeof pupilLessonOverviewSchema
>;
