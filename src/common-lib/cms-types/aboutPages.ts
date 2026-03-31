import * as z from "zod";

import {
  attachmentSchema,
  imageSchema,
  seoSchema,
} from "./base";
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

// Meet The Team Page
export const meetTheTeamPageHeaderSchema = z.object({
  introText: z.string(),
  image: imageSchema,
});

export const meetTheTeamPageOurLeadershipSchema = z.object({
  textRaw: portableTextSchema,
  leadershipTeam: z.array(teamMemberSchema),
});

export const meetTheTeamPageOurBoardSchema = z.object({
  textRaw: portableTextSchema,
  boardMembers: z.array(teamMemberSchema),
});

export const meetTheTeamPageDocumentsSchema = z.object({
  files: z.array(attachmentSchema),
});

export const meetTheTeamPageGovernanceSchema = z.object({
  textRaw: portableTextSchema,
});

export const meetTheTeamPageSchema = z.object({
  header: meetTheTeamPageHeaderSchema,
  ourLeadership: meetTheTeamPageOurLeadershipSchema,
  ourBoard: meetTheTeamPageOurBoardSchema,
  documents2: meetTheTeamPageDocumentsSchema,
  governance2: meetTheTeamPageGovernanceSchema,
  seo: seoSchema.nullish(),
});

export type MeetTheTeamPage = z.infer<typeof meetTheTeamPageSchema>;

// Who We Are Page
export const whoWeArePageHeaderSchema = z.object({
  introText: z.string(),
  image: imageSchema,
});

export const whoWeArePageBreakoutSchema = z.object({
  image: imageSchema,
  text: z.string(),
});

export const whoWeArePageTimelineItemSchema = z.object({
  heading: z.string(),
  subHeading: z.string(),
  textRaw: portableTextSchema,
});

export const whoWeArePageTimelineSchema = z.object({
  timelineItems: z.array(whoWeArePageTimelineItemSchema),
});

export const whoWeArePageCardSchema = z.object({
  heading: z.string(),
  textRaw: portableTextSchema,
  image: imageSchema,
});

export const whoWeArePageCardsSchema = z.object({
  cards: z.array(whoWeArePageCardSchema),
});

export const whoWeArePageSchema = z.object({
  header2: whoWeArePageHeaderSchema,
  breakout2: whoWeArePageBreakoutSchema,
  timeline2: whoWeArePageTimelineSchema,
  weAreCards: whoWeArePageCardsSchema,
  seo: seoSchema.nullish(),
});

export type WhoWeArePage = z.infer<typeof whoWeArePageSchema>;

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
// Aliases for about pages (new naming convention)
export const newAboutWhoWeArePageSchema = whoWeArePageSchema;
export type NewAboutWhoWeArePage = WhoWeArePage;

export const newAboutGetInvolvedPageSchema = getInvolvedPageSchema;
export type NewAboutGetInvolvedPage = GetInvolvedPage;

// Aliases for about pages (old naming convention - mapping new queries to existing schemas)
export const aboutWhoWeArePageSchema = whoWeArePageSchema;
export type AboutWhoWeArePage = WhoWeArePage;

export const aboutLeadershipPageSchema = meetTheTeamPageOurLeadershipSchema;
export type AboutLeadershipPage = z.infer<typeof meetTheTeamPageOurLeadershipSchema>;

export const aboutBoardPageSchema = meetTheTeamPageOurBoardSchema;
export type AboutBoardPage = z.infer<typeof meetTheTeamPageOurBoardSchema>;

export const aboutPartnersPageSchema = oaksCurriculaPageCurriculumPartnersSchema;
export type AboutPartnersPage = z.infer<typeof oaksCurriculaPageCurriculumPartnersSchema>;

export const aboutWorkWithUsPageSchema = getInvolvedPageWorkWithUsSchema;
export type AboutWorkWithUsPage = z.infer<typeof getInvolvedPageWorkWithUsSchema>;