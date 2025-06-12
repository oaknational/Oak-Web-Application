import { z } from "zod";
import {
  lessonContentSchema as lessonContentSchemaFull,
  syntheticUnitvariantLessonsByKsSchema,
} from "@oaknational/oak-curriculum-schema";

import {
  baseLessonOverviewSchema,
  lessonPathwaySchema,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { mediaClipsRecordCamelSchema } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const lessonContentSchema = lessonContentSchemaFull.omit({
  _state: true,
  exit_quiz: true,
  starter_quiz: true,
  video_duration: true,
  geo_restricted: true,
  login_required: true,
});

export type LessonOverviewContent = Omit<
  ConvertKeysToCamelCase<z.infer<typeof lessonContentSchema>>,
  "starterQuiz" | "exitQuiz" | "transcriptSentences"
> & {
  starterQuiz: QuizQuestion[];
  exitQuiz: QuizQuestion[];
  transcriptSentences: string | string[];
};

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
      "lesson-guide-pdf",
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
  subjectParent: z.string().nullish(),
  yearTitle: z.string().nullish(),
  year: z.string().nullish(),
  examBoardTitle: z.string().nullish(),
  examBoardSlug: z.string().nullish(),
  downloads: lessonOverviewDownloads,
  updatedAt: z.string(),
  pathways: z.array(lessonPathwaySchema),
  additionalFiles: z.array(z.string()).nullable(),
  lessonMediaClips: mediaClipsRecordCamelSchema.nullable(),
  lessonReleaseDate: z.string().nullable(),
});

export type LessonOverviewPageData = z.infer<typeof lessonOverviewSchema>;

export default lessonOverviewSchema;

export const baseLessonOverviewData = baseLessonOverviewSchema;

export const lessonOverviewCanonicalSchema = baseLessonOverviewSchema.extend({
  pathways: z.array(lessonPathwaySchema),
  downloads: lessonOverviewDownloads,
});

export type LessonOverviewCanonical = z.infer<
  typeof lessonOverviewCanonicalSchema
>;

export const lessonBrowseDataByKsSchema =
  syntheticUnitvariantLessonsByKsSchema.omit({
    null_unitvariant_id: true,
  });

export type LessonBrowseDataByKs = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataByKsSchema>
>;
