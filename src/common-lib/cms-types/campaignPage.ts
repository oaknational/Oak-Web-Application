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
  hideKsSelector: z.boolean().optional(),
});

export type CampaignHeader = z.infer<typeof campaignHeaderSchema>;

export type NewsletterSignUp = z.infer<typeof newsletterSignUpSchema>;

const newsletterSignUpSchema = z.object({
  type: z.literal("NewsletterSignUp"),
  heading: z.string(),
  bodyPortableText: portableTextSchema,
  buttonCta: z.string(),
  formId: z.string(),
  freeSchoolInput: z.boolean().optional(),
});

export type CampaignPromoBannerType = z.infer<typeof campaignPromoBannerSchema>;
export const campaignPromoBannerSchema = z.object({
  headingPortableTextWithPromo: portableTextSchema,
  subheadingPortableTextWithPromo: portableTextSchema.nullish(),
  bodyPortableTextWithPromo: portableTextSchema.nullish(),
  buttonCta: z.string().nullish(),
  buttonUrl: z.string().nullish(),
  media: z.array(imageSchema.nullish(), videoSchema.nullish()),
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
    freeSchoolInput: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("CampaignPromoBanner"),
    ...campaignPromoBannerSchema.shape,
  }),
  z.object({
    type: z.literal("CampaignVideoBanner"),
    headingPortableTextWithPromo: portableTextSchema,
    subheadingPortableTextWithPromo: portableTextSchema,
    video: videoSchema,
  }),
]);

export type CampaignContentType = z.infer<typeof campaignContentTypeSchema>;
const campaignVideoBannerSchema = z.object({
  type: z.literal("CampaignVideoBanner"),
  headingPortableTextWithPromo: portableTextSchema,
  subheadingPortableTextWithPromo: portableTextSchema,
  video: videoSchema,
});

export type CampaignVideoBannerType = z.infer<typeof campaignVideoBannerSchema>;

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
