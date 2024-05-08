import * as z from "zod";

import { documentSchema, imageSchema, seoSchema } from "./base";
import { cardSchema, textAndMediaSchema } from "./blocks";
import { CTASchema } from "./cta";
import { portableTextSchema } from "./portableText";

export const planningPageSchema = z
  .object({
    title: z.string(),
    heading: z.string(),
    summaryPortableText: portableTextSchema,
    summaryCardImage: imageSchema.nullish(),
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
    stepsCTA: CTASchema,
    learnMoreHeading: z.string(),
    learnMoreBlock1: textAndMediaSchema,
    learnMoreBlock2: textAndMediaSchema,
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type PlanningPage = z.infer<typeof planningPageSchema>;
