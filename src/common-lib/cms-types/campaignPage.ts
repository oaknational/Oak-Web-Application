import z from "zod";

import {
  documentSchema,
  imageSchema,
  seoSchema,
  slugSchema,
  videoSchema,
} from "./base";
import { portableTextSchema } from "./portableText";

export const campaignPageSchema = z
  .object({
    title: z.string(),
    slug: slugSchema,
    header: z.object({
      heading: z.string(),
      subheading: z.string().nullish(),
      image: imageSchema,
    }),
    content: z.array(
      z.discriminatedUnion("type", [
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
          bodyPortableTextWithPromo: portableTextSchema,
          media: z.array(imageSchema.nullish(), videoSchema.nullish()),
        }),
        z.object({
          type: z.literal("CampaignVideoBanner"),
          headingPortableTextWithPromo: portableTextSchema,
          subheadingPortableTextWithPromo: portableTextSchema,
          video: videoSchema,
        }),
      ]),
    ),
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type CampaignPage = z.infer<typeof campaignPageSchema>;
