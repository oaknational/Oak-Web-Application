import z from "zod";

import { portableTextSchema } from "./portableText";
import { imageSchema, quoteSchema, faqSchema, seoSchema } from "./base";
import { teamMemberSchema } from "./teamMember";

// Landing Page

const subjectPickerSchema = z.object({
  title: z.string(),
  tag: z.string(),
  bannerLabel: z.string(),
  buttonText: z.string(),
});

export const ncAlignmentCheckerLandingPageBlockTypeSchema = z.enum([
  "NcAlignmentCheckerLandingPageHeader",
  "NcAlignmentCheckerLandingPageTextAndMedia",
  "NcAlignmentCheckerLandingPageSubjectExperts",
  "NcAlignmentCheckerLandingPageQuotes",
  "NcAlignmentCheckerLandingPageFaqs",
  "NcAlignmentCheckerLandingPageSubjectPickerCallout",
]);

export type NcAlignmentCheckerLandingPageBlockType = z.infer<
  typeof ncAlignmentCheckerLandingPageBlockTypeSchema
>;

export const ncAlignmentCheckerLandingPageHeaderSchema = z.object({
  __typename: z.literal(
    ncAlignmentCheckerLandingPageBlockTypeSchema.enum
      .NcAlignmentCheckerLandingPageHeader,
  ),
  title: z.string(),
  bodyRaw: portableTextSchema,
  icon: imageSchema,
  subjectPicker: subjectPickerSchema,
});

export const ncAlignmentCheckerLandingPageTextAndMediaSchema = z.object({
  __typename: z.literal(
    ncAlignmentCheckerLandingPageBlockTypeSchema.enum
      .NcAlignmentCheckerLandingPageTextAndMedia,
  ),
  title: z.string(),
  bodyRaw: portableTextSchema,
  imagePosition: z.enum(["left", "right"]),
  image: imageSchema,
});

export const ncAlignmentCheckerLandingPageSubjectExpertsSchema = z.object({
  __typename: z.literal(
    ncAlignmentCheckerLandingPageBlockTypeSchema.enum
      .NcAlignmentCheckerLandingPageSubjectExperts,
  ),
  title: z.string(),
  bodyRaw: portableTextSchema,
  people: z.array(teamMemberSchema),
});

export const ncAlignmentCheckerLandingPageQuotesSchema = z.object({
  __typename: z.literal(
    ncAlignmentCheckerLandingPageBlockTypeSchema.enum
      .NcAlignmentCheckerLandingPageQuotes,
  ),
  quotes: z.array(quoteSchema),
});

export const ncAlignmentCheckerLandingPageFaqsSchema = z.object({
  __typename: z.literal(
    ncAlignmentCheckerLandingPageBlockTypeSchema.enum
      .NcAlignmentCheckerLandingPageFaqs,
  ),
  items: z.array(faqSchema),
});

export const ncAlignmentCheckerLandingPageSubjectPickerCalloutSchema = z.object(
  {
    __typename: z.literal(
      ncAlignmentCheckerLandingPageBlockTypeSchema.enum
        .NcAlignmentCheckerLandingPageSubjectPickerCallout,
    ),
    subjectPicker: subjectPickerSchema,
  },
);

export const ncAlignmentCheckerLandingPageBlockSchemas = z.discriminatedUnion(
  "__typename",
  [
    ncAlignmentCheckerLandingPageHeaderSchema,
    ncAlignmentCheckerLandingPageTextAndMediaSchema,
    ncAlignmentCheckerLandingPageSubjectExpertsSchema,
    ncAlignmentCheckerLandingPageQuotesSchema,
    ncAlignmentCheckerLandingPageFaqsSchema,
    ncAlignmentCheckerLandingPageSubjectPickerCalloutSchema,
  ],
);

export type NcAlignmentCheckerLandingPageBlock<
  T extends NcAlignmentCheckerLandingPageBlockType,
> = z.infer<typeof ncAlignmentCheckerLandingPageBlockSchemas> & {
  __typename: T;
};

export const ncAlignmentCheckerLandingPageSchema = z.object({
  blocks: z.array(ncAlignmentCheckerLandingPageBlockSchemas),
  seo: seoSchema,
});

export type NcAlignmentCheckerLandingPage = z.infer<
  typeof ncAlignmentCheckerLandingPageSchema
>;
