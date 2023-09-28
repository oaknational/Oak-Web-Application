import * as z from "zod";

import { ShallowNullable } from "@/utils/util.types";

export const legacyQuizData = z.object({
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
    }),
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
      ]),
    )
    .nullable(),
  feedbackCorrect: z.string().nullable(),
  feedbackIncorrect: z.string().nullable(),
  displayNumber: z.string().nullable(),
});

export type LegacyQuizData = ShallowNullable<
  Partial<z.infer<typeof legacyQuizData>>
>;

export const legacyQuizInfo = z
  .object({
    title: z.string(),
    questionCount: z.number(),
  })
  .nullable();

export type LegacyQuizInfo = z.infer<typeof legacyQuizInfo>;
