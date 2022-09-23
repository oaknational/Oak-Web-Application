import * as z from "zod";

import { imageSchema, videoSchema } from "./base";
import { CTASchema } from "./cta";
import { portableTextSchema } from "./portableText";

export const cardSchema = z.object({
  title: z.string().min(1),
  bodyPortableText: portableTextSchema,
  image: imageSchema.nullable().optional(),
  cta: CTASchema.nullable().optional(),
});

export type Card = z.infer<typeof cardSchema>;

export const textBlockSchema = z.object({
  title: z.string().min(1),
  bodyPortableText: portableTextSchema,
  cta: CTASchema.nullable().optional(),
});

export type TextBlock = z.infer<typeof textBlockSchema>;

export const textAndMediaSchemaBase = z.object({
  title: z.string().min(1),
  bodyPortableText: portableTextSchema,
  cta: CTASchema.nullable().optional(),
  alignMedia: z.enum(["left", "right"]),
});

export const textAndMediaSchema = z.discriminatedUnion("mediaType", [
  textAndMediaSchemaBase.extend({
    mediaType: z.literal("image"),
    image: imageSchema,
  }),
  textAndMediaSchemaBase.extend({
    mediaType: z.literal("video"),
    video: videoSchema,
  }),
]);

export type TextAndMedia = z.infer<typeof textAndMediaSchema>;
