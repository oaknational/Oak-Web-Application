import { z } from "zod";
import {
  lessonContentSchema as lessonContentSchemaFull,
  syntheticUnitvariantLessonsByKsSchema,
  LessonContentCamel as LessonContentCamelFull,
  SyntheticUnitvariantLessonsByKsCamel,
  programmeFieldsSchema,
} from "@oaknational/oak-curriculum-schema";

import { baseLessonOverviewSchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { mediaClipsRecordCamelSchema } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

export const teachersLessonContentSchema = lessonContentSchemaFull.omit({
  _state: true,
  exit_quiz: true,
  starter_quiz: true,
  video_duration: true,
  is_legacy: true,
});

type TeachersLessonContentCamel = Omit<
  LessonContentCamelFull,
  "state" | "exitQuiz" | "starterQuiz" | "videoDuration"
>;

export type TeachersLessonOverviewContent = Omit<
  TeachersLessonContentCamel,
  "starterQuiz" | "exitQuiz" | "transcriptSentences"
> & {
  starterQuiz: QuizQuestion[];
  exitQuiz: QuizQuestion[];
  transcriptSentences: string | string[];
};

export const teachersLessonOverviewDownloads = z.array(
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

export type TeachersLessonOverviewDownloads = z.infer<
  typeof teachersLessonOverviewDownloads
>;

export const teachersLessonOverviewAdjacentLessonSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  lessonIndex: z
    .number()
    .describe("1-based index of the lesson in the unit lesson sequence"),
});

export type TeachersLessonOverviewAdjacentLesson = z.infer<
  typeof teachersLessonOverviewAdjacentLessonSchema
>;

const teachersLessonOverviewBaseSchema = baseLessonOverviewSchema.omit({
  isLegacy: true,
  legacyCopyrightContent: true,
});

export const teachersLessonOverviewSchema =
  teachersLessonOverviewBaseSchema.extend({
    programmeSlug: z.string(),
    unitSlug: z.string(),
    unitTitle: z.string(),
    keyStageSlug: z.string(),
    keyStageTitle: z.string(),
    subjectSlug: z.string(),
    subjectTitle: z.string(),
    subjectParent: programmeFieldsSchema.shape.subject_parent,
    phaseSlug: programmeFieldsSchema.shape.phase_slug,
    phaseTitle: programmeFieldsSchema.shape.phase_description,
    pathwaySlug: programmeFieldsSchema.shape.pathway_slug,
    yearGroupTitle: z.string(),
    year: z.string(),
    examBoardTitle: z.string().nullable(),
    examBoardSlug: z.string().nullable(),
    downloads: teachersLessonOverviewDownloads,
    updatedAt: z.string(),
    additionalFiles: z.array(z.string()).nullable(),
    lessonMediaClips: mediaClipsRecordCamelSchema.nullable(),
    lessonReleaseDate: z.string().nullable(),
    loginRequired: z.boolean(),
    geoRestricted: z.boolean(),
    excludedFromTeachingMaterials: z.boolean(),
    subjectCategories: z
      .array(z.union([z.string(), z.number(), z.null()]))
      .nullable(),
    previousLesson: teachersLessonOverviewAdjacentLessonSchema.nullable(),
    nextLesson: teachersLessonOverviewAdjacentLessonSchema.nullable(),
  });

export type TeachersLessonOverviewPageData = z.infer<
  typeof teachersLessonOverviewSchema
>;

export default teachersLessonOverviewSchema;

export const teachersLessonBrowseDataByKsSchema =
  syntheticUnitvariantLessonsByKsSchema.omit({
    null_unitvariant_id: true,
    is_legacy: true,
  });

export type TeachersLessonBrowseDataByKs = Omit<
  SyntheticUnitvariantLessonsByKsCamel,
  "nullUnitvariantId" | "isLegacy"
>;
