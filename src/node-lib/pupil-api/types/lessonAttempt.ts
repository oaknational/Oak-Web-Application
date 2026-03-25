import { z } from "zod";
import {
  ImageItemCamel,
  imageItemSchema,
} from "@oaknational/oak-curriculum-schema";
import zodToCamelCase from "zod-to-camel-case";

import {
  PupilAnswer,
  QuestionFeedbackType,
  QuestionModeType,
} from "@/components/PupilComponents/QuizUtils/questionTypes";

const pupilAnswerMatchSchema = z.array(z.string());
const pupilAnswerOrderSchema = z.array(z.number());
const pupilAnswerShortSchema = z.string();
const pupilAnswerMCQSchema = z.union([z.number(), z.array(z.number())]);

const pupilAnswerSchema = z.union([
  pupilAnswerMatchSchema,
  pupilAnswerOrderSchema,
  pupilAnswerShortSchema,
  pupilAnswerMCQSchema,
]);

const questionFeedbackSchema = z.union([
  z.literal("correct"),
  z.literal("incorrect"),
]);
const correctAnswerSchema = z.union([
  z.string(),
  z.array(z.union([z.string(), imageItemSchema, z.undefined()])),
]);

const questionModeSchema = z.union([
  z.literal("init"),
  z.literal("incomplete"),
  z.literal("input"),
  z.literal("grading"),
  z.literal("feedback"),
]);

export const questionResultSchema = z.object({
  offer_hint: z.boolean().default(false),
  grade: z.number(),
  mode: questionModeSchema,
  pupil_answer: pupilAnswerSchema.nullable().optional(),
  feedback: z
    .union([questionFeedbackSchema, z.array(questionFeedbackSchema)])
    .optional(),
  correct_answer: correctAnswerSchema.optional(),
  is_partially_correct: z.boolean().optional(),
});

export type QuestionResult = z.infer<typeof questionResultSchema>;

export type QuestionResultCamelCase = {
  offerHint: boolean;
  grade: number;
  mode: QuestionModeType;
  pupilAnswer?: PupilAnswer | null;
  feedback?: QuestionFeedbackType | QuestionFeedbackType[];
  correctAnswer?: string | (string | ImageItemCamel | undefined)[];
  isPartiallyCorrect?: boolean;
};

export const quizResultSchema = z
  .object({
    grade: z.number().optional(),
    num_questions: z.number().optional(),
    question_results: z.array(questionResultSchema).optional(),
  })
  .optional();

export type QuizResult = z.infer<typeof quizResultSchema>;
export type QuizResultCamelCase = {
  grade?: number;
  numQuestions?: number;
  questionResults?: QuestionResultCamelCase[];
};

export const lessonAttemptSchema = z.object({
  attempt_id: z.nanoid({
    error: "Invalid attempt_id",
  }),
  created_at: z.string(),
  lesson_data: z.object({
    title: z.string(),
    slug: z.string(),
  }),
  browse_data: z.object({
    subject: z.string(),
    year_description: z.string(),
  }),
  section_results: z.object({
    intro: z
      .object({
        worksheet_downloaded: z.boolean(),
        worksheet_available: z.boolean(),
        is_complete: z.boolean(),
      })
      .partial()
      .optional(),
    "starter-quiz": quizResultSchema,
    video: z
      .object({
        is_complete: z.boolean(),
        played: z.boolean(),
        duration: z.number(),
        time_elapsed: z.number(),
        muted: z.boolean().default(false),
        signed_opened: z.boolean().default(false),
        transcript_opened: z.boolean().default(false),
      })
      .optional(),
    "exit-quiz": quizResultSchema,
  }),
});

export type LessonAttempt = z.infer<typeof lessonAttemptSchema>;

export type LessonAttemptCamelCase = {
  attemptId: string;
  createdAt: string;
  lessonData: {
    title: string;
    slug: string;
  };
  browseData: {
    subject: string;
    yearDescription: string;
  };
  sectionResults: {
    intro?: {
      worksheetDownloaded?: boolean;
      worksheetAvailable?: boolean;
      isComplete?: boolean;
    };
    "starter-quiz": QuizResultCamelCase;
    video?: {
      isComplete?: boolean;
      played?: boolean;
      duration?: number;
      timeElapsed?: number;
      muted?: boolean;
      signedOpened?: boolean;
      transcriptOpened?: boolean;
    };
    "exit-quiz": QuizResultCamelCase;
  };
};

export const createLessonAttemptPayloadSchema = lessonAttemptSchema.pick({
  attempt_id: true,
  lesson_data: true,
  browse_data: true,
  section_results: true,
});
export type CreateLessonAttemptPayload = z.infer<
  typeof createLessonAttemptPayloadSchema
>;

export type AttemptId = LessonAttempt["attempt_id"];

export const attemptDataSchema = lessonAttemptSchema.pick({
  lesson_data: true,
  browse_data: true,
  section_results: true,
});

export type AttemptDataSchema = z.infer<typeof attemptDataSchema>;

export const attemptDataCamelCaseSchema = zodToCamelCase(attemptDataSchema, {
  bidirectional: true,
});
export type AttemptDataCamelCase = z.infer<typeof attemptDataCamelCaseSchema>;
