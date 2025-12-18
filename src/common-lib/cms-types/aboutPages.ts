import * as z from "zod";

import {
  attachmentSchema,
  documentSchema,
  imageSchema,
  seoSchema,
} from "./base";
import { cardSchema, textAndMediaSchema, textBlockSchema } from "./blocks";
import { CTASchema } from "./cta";
import { portableTextSchema } from "./portableText";
import { teamMemberSchema } from "./teamMember";

const aboutPageBaseSchema = z
  .object({
    title: z.string(),
    summaryPortableText: portableTextSchema,
    summaryCardImage: imageSchema.nullish(),
    contactSection: z.object({
      infoPortableText: portableTextSchema,
    }),
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type AboutPageBase = z.infer<typeof aboutPageBaseSchema>;

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

export const newAboutWhoWeArePageSchema = z.object({
  header: z.object({
    title: z.string(),
    subTitle: z.string(),
  }),
  breakout: z.object({
    text: z.string(),
    image: imageSchema,
  }),
  timeline: z.array(
    z.object({
      title: z.string(),
      subTitle: z.string(),
      text: portableTextSchema,
    }),
  ),
  usp: z.array(
    z.object({
      title: z.string(),
      text: z.string(),
      image: imageSchema,
    }),
  ),
});

export type NewAboutWhoWeArePage = z.infer<typeof newAboutWhoWeArePageSchema>;

export type AboutWhoWeArePage = z.infer<typeof aboutWhoWeArePageSchema>;

export const aboutLeadershipPageSchema = aboutPageBaseSchema.extend({
  heading: z.string(),
  introPortableText: portableTextSchema,
  leadershipTeam: z.array(teamMemberSchema),
});

export type AboutLeadershipPage = z.infer<typeof aboutLeadershipPageSchema>;

export const aboutBoardPageSchema = aboutPageBaseSchema.extend({
  heading: z.string(),
  introPortableText: portableTextSchema,
  boardHeader: z.string(),
  documents: z.array(attachmentSchema),
  governancePortableText: portableTextSchema,
  boardMembers: z.array(teamMemberSchema),
});

export type AboutBoardPage = z.infer<typeof aboutBoardPageSchema>;

export const aboutPartnersPageSchema = aboutPageBaseSchema.extend({
  heading: z.string(),
  introPortableText: portableTextSchema,
  techPartners: z.array(
    imageSchema.extend({
      name: z.string(),
    }),
  ),
  curriculumPartners: z.array(
    imageSchema.extend({
      name: z.string(),
    }),
  ),
});

export type AboutPartnersPage = z.infer<typeof aboutPartnersPageSchema>;

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

export type AboutWorkWithUsPage = z.infer<typeof aboutWorkWithUsPageSchema>;
