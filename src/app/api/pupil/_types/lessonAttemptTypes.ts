import { z } from "zod";
import { imageItemSchema } from "@oaknational/oak-curriculum-schema";

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

export const quizResultSchema = z
  .object({
    grade: z.number().optional(),
    num_questions: z.number().optional(),
    question_results: z
      .array(
        z.object({
          offer_hint: z.boolean(),
          grade: z.number(),
          mode: questionModeSchema,
          pupil_answer: pupilAnswerSchema.nullable().optional(),
          feedback: z
            .union([questionFeedbackSchema, z.array(questionFeedbackSchema)])
            .optional(),
          correct_answer: correctAnswerSchema.optional(),
          is_partially_correct: z.boolean().optional(),
        }),
      )
      .optional(),
  })
  .optional();

export const lessonAttemptSchema = z.object({
  attempt_id: z.string().nanoid({ message: "Invalid attempt_id" }),
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
    intro: z.object({
      worksheet_downloaded: z.boolean(),
      worksheet_available: z.boolean(),
      is_complete: z.boolean(),
    }),
    "starter-quiz": quizResultSchema,
    video: z.object({
      is_complete: z.boolean(),
      played: z.boolean(),
      duration: z.number(),
      time_elapsed: z.number(),
      muted: z.boolean(),
      signed_opened: z.boolean(),
      transcript_opened: z.boolean(),
    }),
    "exit-quiz": quizResultSchema,
  }),
});

export type LessonAttempt = z.infer<typeof lessonAttemptSchema>;

export const createLessonAttemptPayloadSchema = lessonAttemptSchema.pick({
  attempt_id: true,
  lesson_data: true,
  browse_data: true,
  section_results: true,
});
export type CreateLessonAttemptPayload = z.infer<
  typeof createLessonAttemptPayloadSchema
>;
