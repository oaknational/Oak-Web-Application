import { z } from "zod";
import {
  lessonContentSchema as lessonContentSchemaFull,
  syntheticUnitvariantLessonsSchema,
} from "@oaknational/oak-curriculum-schema";

import {
  baseLessonOverviewSchema,
  lessonPathwaySchema,
} from "../../shared.schema";
import { QuizQuestion } from "../pupilLesson/pupilLesson.schema";
import { mediaClipsRecordCamelSchema } from "../lessonMediaClips/lessonMediaClips.schema";

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
  updatedAt: z.string(),
  pathways: z.array(lessonPathwaySchema),
  additionalFiles: z.array(z.string()).nullable(),
  lessonMediaClips: mediaClipsRecordCamelSchema.nullable(),
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
  syntheticUnitvariantLessonsSchema.omit({
    supplementary_data: true,
    null_unitvariant_id: true,
  });

export type LessonBrowseDataByKs = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataByKsSchema>
>;
