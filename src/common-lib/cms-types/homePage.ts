import * as z from "zod";

import { documentSchema, imageSchema, seoSchema } from "./base";
import { cardSchema, textAndMediaSchema } from "./blocks";
import { linkSchema } from "./cta";
import { portableTextSchema } from "./portableText";

const notificationSchema = z.discriminatedUnion("enabled", [
  z.object({ enabled: z.literal(false) }),
  z.object({
    enabled: z.literal(true),
    label: z.string(),
    heading: z.string(),
    subheading: z.string(),
    link: linkSchema,
  }),
]);

export type HomePageNotification = z.infer<typeof notificationSchema>;

export const testimonialSchema = z.object({
  quote: z.object({
    text: z.string(),
    attribution: z.string(),
    role: z.string(),
    organisation: z.string().nullable(),
  }),
  image: imageSchema.nullish(),
});

export const homePageSchema = z
  .object({
    heading: z.string(),
    summaryPortableText: portableTextSchema,
    pupilsImage: imageSchema.nullish(),
    teachersImage: imageSchema.nullish(),
    notification: notificationSchema.nullish(),
    sidebarCard1: cardSchema,
    sidebarCard2: cardSchema,
    sidebarForm: z
      .object({
        title: z.string(),
        bodyPortableText: portableTextSchema,
      })
      .nullish(),
    seo: seoSchema.nullish(),
    testimonials: z.array(testimonialSchema).nullable(),
    intro: textAndMediaSchema.optional().nullable(),
  })
  .merge(documentSchema);

export type HomePage = z.infer<typeof homePageSchema>;
