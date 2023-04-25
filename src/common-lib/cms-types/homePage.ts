import * as z from "zod";

import { documentSchema, imageSchema, seoSchema } from "./base";
import { cardSchema } from "./blocks";
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

export const homePageSchema = z
  .object({
    heading: z.string(),
    summaryPortableText: portableTextSchema,
    pupilsImage: imageSchema.nullish(),
    teachersImage: imageSchema.nullish(),
    notification: notificationSchema,
    sidebarCard1: cardSchema,
    sidebarCard2: cardSchema,
    sidebarForm: z
      .object({
        title: z.string(),
        bodyPortableText: portableTextSchema,
      })
      .nullish(),
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type HomePage = z.infer<typeof homePageSchema>;
