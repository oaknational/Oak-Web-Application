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
    videoWithSignLanguageMuxPlaybackId: true,
  })
  .extend({
    subjectSlug: z.string(),
    subjectTitle: z.string(),
    yearTitle: z.string().nullable().optional(),
    pupilLessonOutcome: z.string().nullable().optional(),
    // TODO: `videoMuxPlaybackId` and `videoTitle` are marked as nullable in the GQL schema, but we'll expect
    // them to always be present and blow up if they're not. We should either update the GQL
    // schema to make them non-nullable, or update the UI to handle the case where there is no video or title.
    videoMuxPlaybackId: z.string(),
    videoTitle: z.string(),
    transcriptSentences: z.string().nullable(),
  });

export type PupilLessonOverviewPageData = z.infer<
  typeof pupilLessonOverviewSchema
>;
