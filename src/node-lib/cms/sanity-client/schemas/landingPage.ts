import * as z from "zod";

import { slugSchema, documentSchema, seoSchema, quoteSchema } from "./base";
import { textAndMediaSchema } from "./blocks";
import { portableTextSchema } from "./portableText";

export const landingPageSchema = z
  .object({
    slug: slugSchema,
    landingPageHeader: z.object({
      headerCta: z.string(),
      headerTitle: z.string(),
    }),

    title: z.string(),
    heading: z.string(),
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

        z.object({ type: z.literal("Quote") }).merge(quoteSchema),
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
