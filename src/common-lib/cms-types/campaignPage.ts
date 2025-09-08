import z from "zod";

import {
  documentSchema,
  imageSchema,
  seoSchema,
  slugSchema,
  videoSchema,
} from "./base";
import { portableTextSchema } from "./portableText";

const campaignHeaderSchema = z.object({
  heading: z.string(),
  subheading: z.string().nullish(),
  image: imageSchema,
});

export type CampaignHeader = z.infer<typeof campaignHeaderSchema>;

export type NewsletterSignUp = z.infer<typeof newsletterSignUpSchema>;

const newsletterSignUpSchema = z.object({
  type: z.literal("NewsletterSignUp"),
  heading: z.string(),
  bodyPortableText: portableTextSchema,
  buttonCta: z.string(),
  formId: z.string(),
});

export const campaignContentTypeSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("CampaignIntro"),
    headingPortableTextWithPromo: portableTextSchema,
    bodyPortableTextWithPromo: portableTextSchema,
  }),
  z.object({
    type: z.literal("NewsletterSignUp"),
    heading: z.string(),
    bodyPortableText: portableTextSchema,
    buttonCta: z.string(),
    formId: z.string(),
  }),
  z.object({
    type: z.literal("CampaignPromoBanner"),
    headingPortableTextWithPromo: portableTextSchema,
    bodyPortableTextWithPromo: portableTextSchema.nullish(),
    subheadingPortableTextWithPromo: portableTextSchema.nullish(),
    media: z.array(imageSchema.nullish(), videoSchema.nullish()),
  }),
  z.object({
    type: z.literal("CampaignVideoBanner"),
    headingPortableTextWithPromo: portableTextSchema,
    subheadingPortableTextWithPromo: portableTextSchema,
    video: videoSchema,
  }),
]);

export type CampaignContentType = z.infer<typeof campaignContentTypeSchema>;
export const campaignPageSchema = z
  .object({
    title: z.string(),
    slug: slugSchema,
    header: campaignHeaderSchema,
    content: z.array(campaignContentTypeSchema),
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type CampaignPage = z.infer<typeof campaignPageSchema>;
