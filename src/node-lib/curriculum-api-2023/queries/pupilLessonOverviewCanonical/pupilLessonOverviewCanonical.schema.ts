import { z } from "zod";
import { isString } from "lodash";

import {
  baseLessonOverviewSchema,
  lessonPathwaySchema,
} from "@/node-lib/curriculum-api-2023/shared.schema";

export const pupilLessonOverviewCanonicalSchema = baseLessonOverviewSchema
  .pick({
    lessonTitle: true,
    lessonSlug: true,
    starterQuiz: true,
    exitQuiz: true,
    supervisionLevel: true,
    contentGuidance: true,
    lessonEquipmentAndResources: true,
    videoWithSignLanguageMuxPlaybackId: true,
    videoMuxPlaybackId: true,
    videoTitle: true,
    transcriptSentences: true,
    pupilLessonOutcome: true,
  })
  .merge(
    lessonPathwaySchema.pick({
      subjectSlug: true,
      subjectTitle: true,
    }),
  )
  .extend({
    yearTitle: z.string().nullable().optional(),
    isLegacy: z.boolean(),
    transcriptSentences: z
      .union([z.array(z.string()), z.string()])
      .optional()
      .nullable(),
  })
  .transform((data) => {
    return {
      ...data,
      // The incoming GQL type for `transcriptSentences` is `string | null` but we're expecting an array of strings.
      // I expect this is a mistake in the schema which might be corrected later. For now i'll guard against it
      // and guarantee the incoming value transformed into an array of strings.
      transcriptSentences: [data.transcriptSentences].flat().filter(isString),
    };
  });

export type PupilLessonOverviewPageData = z.infer<
  typeof pupilLessonOverviewSchema
>;
