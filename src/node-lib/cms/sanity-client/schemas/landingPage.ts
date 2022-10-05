import * as z from "zod";

import {
  slugSchema,
  documentSchema,
  seoSchema,
  quoteSchema,
  imageSchema,
} from "./base";
import { textAndMediaSchema } from "./blocks";
import { portableTextSchema } from "./portableText";
import { CTASchema } from "./cta";

export const landingPageSchema = z
  .object({
    slug: slugSchema,
    headerButton: z.object({
      label: z.string(),
      anchor: z.literal("formBlock"), // change to union of literals when there are more achors in cms
    }),
    hero: z.object({
      title: z.string(),
      heading: z.string(),
      image: imageSchema.nullish(),
      cta: CTASchema.nullish(),
    }),
    content: z.array(
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal("LandingPageTextBlock"),
          bodyPortableText: portableTextSchema,
        }),
        z.object({
          type: z.literal("LandingPageFormBlock"),
          formTitle: z.string(),
          title: z.string(),
          bodyPortableText: portableTextSchema,
        }),
        z.object({
          type: z.literal("LandingPageTextAndMediaBlock"),
          textAndMedia: textAndMediaSchema,
        }),
        z.object({
          type: z.literal("LandingPageQuoteBlock"),
          quote: quoteSchema,
        }),
      ])
    ),
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type LandingPage = z.infer<typeof landingPageSchema>;

export const landingPagePreviewSchema = landingPageSchema.pick({
  id: true,
  slug: true,
});

export type LandingPagePreview = z.infer<typeof landingPagePreviewSchema>;
