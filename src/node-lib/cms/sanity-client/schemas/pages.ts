import * as z from "zod";

import {
  attachmentSchema,
  documentSchema,
  imageSchema,
  seoSchema,
} from "./base";
import { cardSchema, textAndMediaSchema, textBlockSchema } from "./blocks";
import { blogPostPreviewSchema } from "./blog";
import { CTASchema } from "./cta";
import { portableTextSchema } from "./portableText";
import { teamMemberSchema } from "./teamMember";

export const homePageSchema = z
  .object({
    heading: z.string(),
    summaryPortableText: portableTextSchema,
    sidebarCard1: cardSchema,
    sidebarCard2: cardSchema,
    sidebarForm: z.object({
      title: z.string(),
      bodyPortableText: portableTextSchema,
    }),
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type HomePage = z.infer<typeof homePageSchema>;

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
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type PlanningPage = z.infer<typeof planningPageSchema>;

const aboutPageBaseSchema = z
  .object({
    title: z.string(),
    summaryPortableText: portableTextSchema,
    contactSection: z.object({
      infoPortableText: portableTextSchema,
    }),
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export const aboutPageSchema = aboutPageBaseSchema;

export const aboutWhoWeArePageSchema = aboutPageBaseSchema.extend({
  heading: z.string(),
  intro: textAndMediaSchema,
  timeline: z.object({
    from: textBlockSchema,
    to: textBlockSchema,
    beyond: textBlockSchema,
    cta: CTASchema,
  }),
  principles: z.array(textBlockSchema),
});

export const aboutLeadershipPageSchema = aboutPageBaseSchema.extend({
  heading: z.string(),
  introPortableText: portableTextSchema,
});

export const aboutBoardPageSchema = aboutPageBaseSchema.extend({
  heading: z.string(),
  introPortableText: portableTextSchema,
  documents: z.array(attachmentSchema),
  governancePortableText: portableTextSchema,
  boardMembers: z.array(teamMemberSchema),
});

export const aboutPartnersPageSchema = aboutPageBaseSchema.extend({
  heading: z.string(),
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
});

export const aboutWorkWithUsPageSchema = aboutPageBaseSchema.extend({
  heading: z.string(),
  introPortableText: portableTextSchema,
  cards: z.object({
    joinTheTeam: cardSchema,
    advisory: cardSchema,
    curriculumPartner: cardSchema,
    teacherResearch: cardSchema,
  }),
});

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
          title: z.string(),
          post: blogPostPreviewSchema.pick({
            title: true,
            slug: true,
          }),
        })
      ),
    }),
    ourApproach: textBlockSchema,
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type CurriculumPage = z.infer<typeof curriculumPageSchema>;
