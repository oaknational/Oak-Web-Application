import * as z from "zod";

import {
  cardSchema,
  CTASchema,
  documentSchema,
  portableTextSchema,
  textAndMediaSchema,
} from "./base";

export const planningPageSchema = z
  .object({
    title: z.string(),
    heading: z.string(),
    summaryPortableText: portableTextSchema,
    lessonElements: z.object({
      introQuiz: cardSchema,
      video: cardSchema,
      slides: cardSchema,
      worksheet: cardSchema,
      exitQuiz: cardSchema,
    }),
    lessonElementsCTA: CTASchema,
    stepsHeading: z.string(),
    steps: z
      .object({
        step1: cardSchema,
        step2: cardSchema,
        step3: cardSchema,
        step4: cardSchema,
      })
      .transform(({ step1, step2, step3, step4 }) => {
        return [step1, step2, step3, step4];
      }),
    learnMoreHeading: z.string(),
    learnMoreBlock1: textAndMediaSchema,
    learnMoreBlock2: textAndMediaSchema,
  })
  .merge(documentSchema);

export type PlanningPage = z.infer<typeof planningPageSchema>;
