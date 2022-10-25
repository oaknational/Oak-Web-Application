import * as z from "zod";

import { internalLinkEntrySchema } from "./base";

export const CTASchemaBase = z.object({
  label: z.string(),
});

export const CTASchema = z.discriminatedUnion("linkType", [
  CTASchemaBase.extend({
    linkType: z.literal("internal"),
    internal: internalLinkEntrySchema,
  }),
  CTASchemaBase.extend({
    linkType: z.literal("external"),
    external: z.string().url(),
  }),
  CTASchemaBase.extend({
    linkType: z.literal("anchor"),
    anchor: z.literal("formBlock"), // change to union of literals when there are more achors in cms
  }),
]);

export type CTA = z.infer<typeof CTASchema>;
