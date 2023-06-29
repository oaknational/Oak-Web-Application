import { z } from "zod";

// OLD SCHEMA

const lessonOverviewQuizData = z.array(
  z.object({
    keyStageSlug: z.string(),
    keyStageTitle: z.string(),
    subjectSlug: z.string(),
    subjectTitle: z.string(),
    unitSlug: z.string(),
    unitTitle: z.string(),
    order: z.number().nullable().optional(),
    title: z.string().nullable().optional(),
    points: z.number().nullable().optional(),
    required: z.boolean().nullable(),
    choices: z.array(
      z.object({
        choice: z.string(),
        image: z.string().nullable(),
      })
    ),
    active: z.boolean(),
    answer: z.union([z.array(z.string()), z.string()]),
    type: z.string(),
    quizType: z.string(),
    images: z
      .array(
        z.union([
          z.object({
            title: z.string().nullable(),
            images: z.array(z.string()),
          }),
          z.string(),
        ])
      )
      .nullable(),
    feedbackCorrect: z.string().nullable(),
    feedbackIncorrect: z.string().nullable(),
    displayNumber: z.string().nullable(),
  })
);

const lessonQuizInfoData = z
  .object({
    title: z.string(),
    questionCount: z.number(),
  })
  .nullable();
// OLD SCHEMA

const lessonOverviewSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  programmeSlug: z.string(),
  unitTitle: z.string(),
  unitSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  coreContent: z.array(z.string().nullable()),
  contentGuidance: z.string().nullable(),
  equipmentRequired: z.string().nullable(),
  presentationUrl: z.string().nullable(),
  supervisionLevel: z.string().nullable(),
  worksheetUrl: z.string().nullable(),
  isWorksheetLandscape: z.boolean(),
  hasCopyrightMaterial: z.boolean(),
  videoMuxPlaybackId: z.string().nullable(),
  videoWithSignLanguageMuxPlaybackId: z.string().nullable(),
  transcriptSentences: z.array(z.string()).nullable(),
  hasDownloadableResources: z.boolean().nullable(),
  introQuiz: lessonOverviewQuizData,
  exitQuiz: lessonOverviewQuizData,
  introQuizInfo: lessonQuizInfoData,
  exitQuizInfo: lessonQuizInfoData,
  expired: z.boolean(),
});

export type LessonOverviewPageData = z.infer<typeof lessonOverviewSchema>;

export default lessonOverviewSchema;
