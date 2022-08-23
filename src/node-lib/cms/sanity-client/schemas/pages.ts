import * as z from "zod";

import {
  cardSchema,
  CTASchema,
  documentSchema,
  imageSchema,
  portableTextSchema,
  textAndMediaSchema,
  textBlockSchema,
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
    stepsCTA: CTASchema,
    learnMoreHeading: z.string(),
    learnMoreBlock1: textAndMediaSchema,
    learnMoreBlock2: textAndMediaSchema,
  })
  .merge(documentSchema);

export type PlanningPage = z.infer<typeof planningPageSchema>;

const attachmentSchema = z.object({
  title: z.string(),
  file: z.object({
    asset: z.object({
      extension: z.string(),
      size: z.number(),
      url: z.string(),
    }),
  }),
});

export const aboutPageSchema = z
  .object({
    title: z.string(),
    whoWeAre: z.object({
      sectionHeading: z.string(),
      intro: textAndMediaSchema,
      timeline: z.object({
        from: textBlockSchema,
        to: textBlockSchema,
        beyond: textBlockSchema,
        cta: CTASchema,
      }),
      principles: z.array(textBlockSchema),
    }),
    leadership: z.object({
      sectionHeading: z.string(),
      introPortableText: portableTextSchema,
    }),
    board: z.object({
      sectionHeading: z.string(),
      introPortableText: portableTextSchema,
      documents: z.array(attachmentSchema),
      governancePortableText: portableTextSchema,
    }),
    partners: z.object({
      sectionHeading: z.string(),
      introPortableText: portableTextSchema,
      techPartners: z.array(
        imageSchema.extend({
          name: z.string(),
        })
      ),
      curriculumPartners: z.array(
        imageSchema.extend({
          name: z.string(),
        })
      ),
    }),
    workWithUs: z.object({
      sectionHeading: z.string(),
      introPortableText: portableTextSchema,
      cards: z.object({
        joinTheTeam: cardSchema,
        advisory: cardSchema,
        curriculumPartner: cardSchema,
        teacherResearch: cardSchema,
      }),
    }),
    contactSection: z.object({
      infoPortableText: portableTextSchema,
    }),
  })
  .merge(documentSchema);

export type AboutPage = z.infer<typeof aboutPageSchema>;

export const curriculumPageSchema = z
  .object({
    title: z.string(),
    heading: z.string(),
    summaryPortableText: portableTextSchema,
    info: textBlockSchema,
    gettingStarted: textBlockSchema,
    elements: z.object({
      title: z.string(),
      posts: z.array(
        z.object({
          post: z.object({
            title: z.string(),
            slug: z.object({ current: z.string() }),
          }),
        })
      ),
    }),
    ourApproach: textBlockSchema,
  })
  .merge(documentSchema);

export type CurriculumPage = z.infer<typeof curriculumPageSchema>;
