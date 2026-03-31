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

// Oak's Curricula Page
export const oaksCurriculaPageHeaderSchema = z.object({
  introText: z.string(),
      image: imageSchema,
});

export const oaksCurriculaPageGuidingPrincipleSchema = z.object({
  heading: z.string(),
  text2Raw: portableTextSchema,
});

export const oaksCurriculaPageGuidingPrinciplesSchema = z.object({
    textRaw: portableTextSchema,
  image: imageSchema,
  principles: z.array(oaksCurriculaPageGuidingPrincipleSchema),
});

export const oaksCurriculaPageCurriculumPartnerSchema = z.object({
  logo: imageSchema,
});

export const oaksCurriculaPageCurriculumPartnersSchema = z.object({
  textRaw: portableTextSchema,
  partners: z.array(oaksCurriculaPageCurriculumPartnerSchema),
});

export const oaksCurriculaPageSchema = z.object({
  header: oaksCurriculaPageHeaderSchema,
  guidingPrinciples: oaksCurriculaPageGuidingPrinciplesSchema,
  currentPartners: oaksCurriculaPageCurriculumPartnersSchema,
  legacyPartners: oaksCurriculaPageCurriculumPartnersSchema,
  seo: seoSchema.nullish(),
});

export type OaksCurriculaPage = z.infer<typeof oaksCurriculaPageSchema>;

export const meetTheTeamPageSchema = z.object({
  id: z.string(),
  title: z.string(),
  introText: z.string(),
  leadershipText: z.string(),
  boardText: z.string(),
  leadershipTeam: z.array(teamMemberSchema),
  boardMembers: z.array(teamMemberSchema),
  documents: z.array(attachmentSchema).nullish(),
  governancePortableText: portableTextSchema,
  seo: seoSchema.nullish(),
});

export type MeetTheTeamPage = z.infer<typeof meetTheTeamPageSchema>;

// Get Involved Page
export const getInvolvedPageHeaderSchema = z.object({
  introText: z.string(),
});

export const getInvolvedPageCollabSchema = z.object({
  researchPanelTextRaw: portableTextSchema,
  feedbackTextRaw: portableTextSchema,
});

export const getInvolvedPageWorkWithUsSchema = z.object({
  textRaw: portableTextSchema,
  image: imageSchema,
});

export const getInvolvedPageSchema = z.object({
  header: getInvolvedPageHeaderSchema,
  collaborate: getInvolvedPageCollabSchema,
  workWithUs: getInvolvedPageWorkWithUsSchema,
  seo: seoSchema.nullish(),
});

export type GetInvolvedPage = z.infer<typeof getInvolvedPageSchema>;
export const newAboutGetInvolvedPageSchema = getInvolvedPageSchema;
export type NewAboutGetInvolvedPage = GetInvolvedPage;

export const aboutWorkWithUsPageSchema = getInvolvedPageWorkWithUsSchema;
export type AboutWorkWithUsPage = z.infer<typeof getInvolvedPageWorkWithUsSchema>;