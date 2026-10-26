import * as z from "zod";
import type { OakUiRoleToken } from "@oaknational/oak-components";

import { documentSchema, imageSchema, seoSchema } from "./base";
import { cardSchema, textAndMediaSchema } from "./blocks";
import { linkSchema } from "./cta";
import { portableTextSchema } from "./portableText";
import { campaignPromoBannerSchema } from "./campaignPage";

const newCtaBaseSchema = z.object({
  label: z.string().trim().min(1),
});

export const newCtaSchema = z.discriminatedUnion("linkType", [
  newCtaBaseSchema.extend({
    linkType: z.literal("internal"),
    internal: z.string().startsWith("/").or(z.string().startsWith("#")),
    external: z.unknown().transform(() => null),
  }),
  newCtaBaseSchema.extend({
    linkType: z.literal("external"),
    external: z.url().startsWith("http://").or(z.url().startsWith("https://")),
    internal: z.unknown().transform(() => null),
  }),
]);

const topBannerBaseSchema = z.object({
  displayNewTag: z.boolean(),
  backgroundColour: z.string() as z.ZodType<OakUiRoleToken>,
});

export const topBannerSchema = z.discriminatedUnion("displayCta", [
  topBannerBaseSchema.extend({
    displayCta: z.literal(true),
    cta: newCtaSchema,
    messagePortableText: portableTextSchema.nullish(),
  }),
  topBannerBaseSchema.extend({
    displayCta: z.literal(false),
    messagePortableText: portableTextSchema,
    cta: z.unknown().transform(() => null),
  }),
]);

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

const homePageBaseSchema = z
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
    campaignPromoBanner: campaignPromoBannerSchema.nullable(),
  })
  .merge(documentSchema);

export const homePageSchema = z.discriminatedUnion("displayTopBanner", [
  homePageBaseSchema.extend({
    displayTopBanner: z.literal(true),
    topBanner: topBannerSchema,
  }),
  homePageBaseSchema.extend({
    displayTopBanner: z.literal(false),
    topBanner: z.unknown().transform(() => null),
  }),
]);

export type HomePage = z.infer<typeof homePageSchema>;
